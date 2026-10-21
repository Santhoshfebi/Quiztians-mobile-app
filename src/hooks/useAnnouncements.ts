import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import {
    getAnnouncements,
    getDismissedAnnouncementIds,
    getVisibleAnnouncements,
    saveDismissedAnnouncement,
    type Announcement,
} from '../services/announcementService';

import { supabase } from '../services/supabase';

/* ==========================================================
   RETURN TYPE
========================================================== */

type UseAnnouncementsReturn = {
    announcements: Announcement[];

    visibleAnnouncements: Announcement[];

    activeAnnouncement:
    | Announcement
    | null;

    loading: boolean;

    error:
    | string
    | null;

    dismissAnnouncement: (
        announcementId:
            | string
            | number
    ) => Promise<void>;

    refreshAnnouncements:
    () => Promise<void>;
};

/* ==========================================================
   HOOK
========================================================== */

export function useAnnouncements(): UseAnnouncementsReturn {
    /* ======================================================
       STATE
    ====================================================== */

    const [
        announcements,
        setAnnouncements,
    ] =
        useState<
            Announcement[]
        >([]);

    const [
        dismissedIds,
        setDismissedIds,
    ] =
        useState<
            Array<
                string | number
            >
        >([]);

    const [
        loading,
        setLoading,
    ] =
        useState(true);

    const [
        error,
        setError,
    ] =
        useState<
            string | null
        >(null);

    /*
     * Website updates its scheduling clock every
     * 30 seconds. We preserve that behavior.
     */
    const [
        announcementClock,
        setAnnouncementClock,
    ] =
        useState(
            Date.now()
        );

    const mountedRef =
        useRef(true);

    /* ======================================================
       FETCH
    ====================================================== */

    const refreshAnnouncements =
        useCallback(
            async () => {
                try {
                    const data =
                        await getAnnouncements();

                    if (
                        !mountedRef.current
                    ) {
                        return;
                    }

                    setAnnouncements(
                        data
                    );

                    setAnnouncementClock(
                        Date.now()
                    );

                    setError(
                        null
                    );
                } catch (
                fetchError
                ) {
                    console.error(
                        'Error fetching announcements:',
                        fetchError
                    );

                    if (
                        mountedRef.current
                    ) {
                        setError(
                            getErrorMessage(
                                fetchError
                            )
                        );
                    }
                }
            },
            []
        );

    /* ======================================================
       INITIAL LOAD + REALTIME
    ====================================================== */

    useEffect(() => {
        mountedRef.current =
            true;

        const initialize =
            async () => {
                try {
                    setLoading(
                        true
                    );

                    /*
                     * Load dismissed IDs and announcements
                     * together.
                     */
                    const [
                        storedDismissedIds,
                        announcementData,
                    ] =
                        await Promise.all([
                            getDismissedAnnouncementIds(),
                            getAnnouncements(),
                        ]);

                    if (
                        !mountedRef.current
                    ) {
                        return;
                    }

                    setDismissedIds(
                        storedDismissedIds
                    );

                    setAnnouncements(
                        announcementData
                    );

                    setAnnouncementClock(
                        Date.now()
                    );

                    setError(
                        null
                    );
                } catch (
                initializeError
                ) {
                    console.error(
                        'Announcement initialization error:',
                        initializeError
                    );

                    if (
                        mountedRef.current
                    ) {
                        setError(
                            getErrorMessage(
                                initializeError
                            )
                        );
                    }
                } finally {
                    if (
                        mountedRef.current
                    ) {
                        setLoading(
                            false
                        );
                    }
                }
            };

        void initialize();

        /* --------------------------------------------------
           UNIQUE CHANNEL NAME

           Important because we already fixed the same
           duplicate-channel issue in quiz config.
        -------------------------------------------------- */

        const channelName =
            `mobile-announcements-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2)}`;

        const channel =
            supabase
                .channel(
                    channelName
                )
                .on(
                    'postgres_changes',
                    {
                        event: '*',

                        schema:
                            'public',

                        table:
                            'announcements',
                    },
                    () => {
                        void refreshAnnouncements();
                    }
                )
                .subscribe();

        return () => {
            mountedRef.current =
                false;

            void supabase.removeChannel(
                channel
            );
        };
    }, [
        refreshAnnouncements,
    ]);

    /* ======================================================
       SCHEDULE CLOCK

       Re-check start_at / end_at every 30 seconds.
    ====================================================== */

    useEffect(() => {
        const interval =
            setInterval(
                () => {
                    setAnnouncementClock(
                        Date.now()
                    );
                },
                30_000
            );

        return () => {
            clearInterval(
                interval
            );
        };
    }, []);

    /* ======================================================
       VISIBLE ANNOUNCEMENTS
    ====================================================== */

    const visibleAnnouncements =
        useMemo(
            () =>
                getVisibleAnnouncements(
                    announcements,
                    dismissedIds,
                    announcementClock
                ),
            [
                announcements,
                dismissedIds,
                announcementClock,
            ]
        );

    /* ======================================================
       ACTIVE ANNOUNCEMENT

       Website displays one announcement at a time.
    ====================================================== */

    const activeAnnouncement =
        visibleAnnouncements.length >
            0
            ? visibleAnnouncements[0]
            : null;

    /* ======================================================
       DISMISS
    ====================================================== */

    const dismissAnnouncement =
        useCallback(
            async (
                announcementId:
                    | string
                    | number
            ) => {
                /*
                 * Update UI immediately.
                 *
                 * This means the next available announcement
                 * can appear without waiting for AsyncStorage.
                 */
                setDismissedIds(
                    (
                        current
                    ) => {
                        const exists =
                            current.some(
                                (
                                    id
                                ) =>
                                    String(
                                        id
                                    ) ===
                                    String(
                                        announcementId
                                    )
                            );

                        if (
                            exists
                        ) {
                            return current;
                        }

                        return [
                            ...current,
                            announcementId,
                        ];
                    }
                );

                try {
                    await saveDismissedAnnouncement(
                        announcementId
                    );
                } catch (
                dismissError
                ) {
                    /*
                     * The popup is still dismissed for
                     * this mounted app session even if
                     * persistence fails.
                     */
                    console.warn(
                        'Announcement dismissal storage error:',
                        dismissError
                    );
                }
            },
            []
        );

    return {
        announcements,

        visibleAnnouncements,

        activeAnnouncement,

        loading,

        error,

        dismissAnnouncement,

        refreshAnnouncements,
    };
}

/* ==========================================================
   ERROR HELPER
========================================================== */

function getErrorMessage(
    error: unknown
): string {
    if (
        error instanceof Error
    ) {
        return error.message;
    }

    if (
        typeof error ===
        'object' &&
        error !== null &&
        'message' in error
    ) {
        const message =
            (
                error as {
                    message?: unknown;
                }
            ).message;

        if (
            typeof message ===
            'string'
        ) {
            return message;
        }
    }

    return 'Unable to load announcements.';
}