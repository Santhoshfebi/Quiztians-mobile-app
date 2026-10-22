import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    Platform,
} from "react-native";

import * as Notifications from "expo-notifications";

import {
    registerForPushNotificationsAsync,
} from "../services/notificationService";

import {
    savePushToken,
} from "../services/pushTokenService";

/* ==========================================================
   HOOK
========================================================== */

export function useNotifications() {
    /* ========================================================
       STATE
    ======================================================== */

    const [
        expoPushToken,
        setExpoPushToken,
    ] = useState<string | null>(
        null
    );

    const [
        notification,
        setNotification,
    ] =
        useState<Notifications.Notification | null>(
            null
        );

    const [
        registrationError,
        setRegistrationError,
    ] = useState<string | null>(
        null
    );

    /*
     * Prevent duplicate registration during the same
     * mounted app session.
     */
    const hasRegisteredRef =
        useRef(false);

    /* ========================================================
       REGISTER DEVICE FOR PUSH NOTIFICATIONS
    ======================================================== */

    useEffect(() => {
        /*
         * QUIZTIANS push notifications currently target
         * the native mobile application.
         *
         * Do not attempt Expo push registration on web.
         */
        if (Platform.OS === "web") {
            return;
        }

        /*
         * Prevent duplicate registration.
         */
        if (
            hasRegisteredRef.current
        ) {
            return;
        }

        hasRegisteredRef.current =
            true;

        let mounted = true;

        async function register() {
            try {
                /*
                 * Ask for permission and obtain the
                 * Expo Push Token.
                 */
                const token =
                    await registerForPushNotificationsAsync();

                /*
                 * Registration can legitimately return null:
                 *
                 * - permission denied
                 * - emulator / unsupported device
                 * - missing project ID
                 * - registration failure
                 */
                if (!token) {
                    return;
                }

                /*
                 * Only update React state while this
                 * hook is still mounted.
                 */
                if (mounted) {
                    setExpoPushToken(
                        token
                    );

                    setRegistrationError(
                        null
                    );
                }

                /*
                 * Save / reactivate the token in Supabase.
                 */
                await savePushToken(
                    token
                );

                console.log(
                    "QUIZTIANS notification registration complete."
                );
            } catch (error) {
                console.error(
                    "Notification registration failed:",
                    error
                );

                if (!mounted) {
                    return;
                }

                setRegistrationError(
                    error instanceof Error
                        ? error.message
                        : "Notification registration failed."
                );
            }
        }

        void register();

        return () => {
            mounted = false;
        };
    }, []);

    /* ========================================================
       FOREGROUND NOTIFICATION LISTENER
    ======================================================== */

    useEffect(() => {
        /*
         * Expo's native notification listener is not
         * required for our web version.
         */
        if (Platform.OS === "web") {
            return;
        }

        const subscription =
            Notifications.addNotificationReceivedListener(
                (
                    receivedNotification
                ) => {
                    console.log(
                        "Notification received:",
                        receivedNotification
                    );

                    setNotification(
                        receivedNotification
                    );
                }
            );

        return () => {
            subscription.remove();
        };
    }, []);

    /* ========================================================
       NOTIFICATION TAP LISTENER
    ======================================================== */

    useEffect(() => {
        /*
         * Notification tap handling will be used by
         * Android / iOS only.
         */
        if (Platform.OS === "web") {
            return;
        }

        const subscription =
            Notifications.addNotificationResponseReceivedListener(
                (response) => {
                    const data =
                        response.notification
                            .request.content
                            .data;

                    console.log(
                        "QUIZTIANS notification tapped:",
                        data
                    );

                    /*
                     * Navigation will be connected in the
                     * notification-routing step.
                     *
                     * Example payload:
                     *
                     * {
                     *   screen: "join"
                     * }
                     *
                     * Or:
                     *
                     * {
                     *   screen: "leaderboard",
                     *   chapter: "12"
                     * }
                     */
                }
            );

        return () => {
            subscription.remove();
        };
    }, []);

    /* ========================================================
       RETURN
    ======================================================== */

    return {
        expoPushToken,
        notification,
        registrationError,
    };
}