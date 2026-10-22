import { Platform } from "react-native";

import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

/* ==========================================================
   FOREGROUND NOTIFICATION BEHAVIOUR
========================================================== */

/*
 * expo-notifications notification handling is intended for
 * the native QUIZTIANS app.
 *
 * Do not register the handler on web because Expo currently
 * warns that notification handling is not fully supported
 * there.
 */
if (Platform.OS !== "web") {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowBanner: true,
            shouldShowList: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
        }),
    });
}

/* ==========================================================
   REGISTER FOR PUSH NOTIFICATIONS
========================================================== */

export async function registerForPushNotificationsAsync(): Promise<
    string | null
> {
    try {
        /* ------------------------------------------------------
           WEB
        ------------------------------------------------------ */

        /*
         * QUIZTIANS push notifications are currently intended
         * for the native mobile app.
         */
        if (Platform.OS === "web") {
            console.log(
                "Push notification registration skipped on web."
            );

            return null;
        }

        /* ------------------------------------------------------
           ANDROID NOTIFICATION CHANNEL
        ------------------------------------------------------ */

        if (Platform.OS === "android") {
            await Notifications.setNotificationChannelAsync(
                "default",
                {
                    name: "QUIZTIANS Notifications",

                    importance:
                        Notifications.AndroidImportance.MAX,

                    vibrationPattern: [
                        0,
                        250,
                        250,
                        250,
                    ],

                    lightColor: "#7C5CFC",

                    sound: "default",
                }
            );
        }

        /* ------------------------------------------------------
           PHYSICAL DEVICE CHECK
        ------------------------------------------------------ */

        if (!Device.isDevice) {
            console.log(
                "Push notifications require a physical device."
            );

            return null;
        }

        /* ------------------------------------------------------
           NOTIFICATION PERMISSION
        ------------------------------------------------------ */

        const existingPermission =
            await Notifications.getPermissionsAsync();

        let finalStatus =
            existingPermission.status;

        if (finalStatus !== "granted") {
            const requestedPermission =
                await Notifications.requestPermissionsAsync();

            finalStatus =
                requestedPermission.status;
        }

        if (finalStatus !== "granted") {
            console.log(
                "Notification permission was not granted."
            );

            return null;
        }

        /* ------------------------------------------------------
           EAS PROJECT ID
        ------------------------------------------------------ */

        const projectId =
            Constants.expoConfig?.extra?.eas?.projectId ??
            Constants.easConfig?.projectId;

        if (!projectId) {
            console.error(
                "EAS project ID could not be found."
            );

            return null;
        }

        /* ------------------------------------------------------
           EXPO PUSH TOKEN
        ------------------------------------------------------ */

        const tokenData =
            await Notifications.getExpoPushTokenAsync({
                projectId,
            });

        const token =
            tokenData.data;

        console.log(
            "QUIZTIANS Expo Push Token:",
            token
        );

        return token;
    } catch (error) {
        console.error(
            "Failed to register for push notifications:",
            error
        );

        return null;
    }
}

/* ==========================================================
   LAST NOTIFICATION RESPONSE
========================================================== */

export async function getLastNotificationResponse() {
    if (Platform.OS === "web") {
        return null;
    }

    try {
        return await Notifications.getLastNotificationResponseAsync();
    } catch (error) {
        console.error(
            "Failed to get last notification response:",
            error
        );

        return null;
    }
}

/* ==========================================================
   CLEAR NOTIFICATION BADGE
========================================================== */

export async function clearNotificationBadge() {
    if (Platform.OS === "web") {
        return;
    }

    try {
        await Notifications.setBadgeCountAsync(
            0
        );
    } catch (error) {
        console.error(
            "Failed to clear notification badge:",
            error
        );
    }
}