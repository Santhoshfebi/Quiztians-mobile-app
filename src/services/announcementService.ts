import AsyncStorage from '@react-native-async-storage/async-storage';

import { supabase } from './supabase';

/* ==========================================================
   TYPES
========================================================== */

export type AnnouncementType =
    | 'info'
    | 'success'
    | 'warning'
    | 'important'
    | string;

export type Announcement = {
    id: string | number;

    title: string | null;
    message: string | null;

    type: AnnouncementType | null;

    is_active: boolean;

    start_at: string | null;
    end_at: string | null;

    created_at: string | null;
    updated_at: string | null;
};

/* ==========================================================
   STORAGE
========================================================== */

const DISMISSED_ANNOUNCEMENTS_KEY =
    'quiztians-dismissed-announcements';

/* ==========================================================
   FETCH ANNOUNCEMENTS
========================================================== */

export async function getAnnouncements(): Promise<
    Announcement[]
> {
    const {
        data,
        error,
    } = await supabase
        .from('announcements')
        .select(
            `
            id,
            title,
            message,
            type,
            is_active,
            start_at,
            end_at,
            created_at,
            updated_at
            `
        )
        .order(
            'created_at',
            {
                ascending: false,
            }
        );

    if (error) {
        throw error;
    }

    return (
        (data ?? []) as Announcement[]
    );
}

/* ==========================================================
   CHECK WHETHER ANNOUNCEMENT IS CURRENTLY VISIBLE
========================================================== */

export function isAnnouncementVisible(
    announcement: Announcement,
    dismissedIds: Array<
        string | number
    >,
    now = Date.now()
): boolean {
    /* ------------------------------------------------------
       ACTIVE
    ------------------------------------------------------ */

    if (
        !announcement.is_active
    ) {
        return false;
    }

    /* ------------------------------------------------------
       DISMISSED
    ------------------------------------------------------ */

    if (
        dismissedIds.some(
            (id) =>
                String(id) ===
                String(
                    announcement.id
                )
        )
    ) {
        return false;
    }

    /* ------------------------------------------------------
       START DATE
    ------------------------------------------------------ */

    if (
        announcement.start_at
    ) {
        const start =
            new Date(
                announcement.start_at
            ).getTime();

        if (
            Number.isFinite(
                start
            ) &&
            start > now
        ) {
            return false;
        }
    }

    /* ------------------------------------------------------
       END DATE
    ------------------------------------------------------ */

    if (
        announcement.end_at
    ) {
        const end =
            new Date(
                announcement.end_at
            ).getTime();

        if (
            Number.isFinite(
                end
            ) &&
            end <= now
        ) {
            return false;
        }
    }

    return true;
}

/* ==========================================================
   FILTER VISIBLE ANNOUNCEMENTS
========================================================== */

export function getVisibleAnnouncements(
    announcements: Announcement[],
    dismissedIds: Array<
        string | number
    >,
    now = Date.now()
): Announcement[] {
    return announcements.filter(
        (announcement) =>
            isAnnouncementVisible(
                announcement,
                dismissedIds,
                now
            )
    );
}

/* ==========================================================
   LOAD DISMISSED IDS
========================================================== */

export async function getDismissedAnnouncementIds(): Promise<
    Array<string | number>
> {
    try {
        const stored =
            await AsyncStorage.getItem(
                DISMISSED_ANNOUNCEMENTS_KEY
            );

        if (!stored) {
            return [];
        }

        const parsed =
            JSON.parse(stored);

        if (
            !Array.isArray(
                parsed
            )
        ) {
            return [];
        }

        return parsed;
    } catch (error) {
        console.warn(
            'Unable to load dismissed announcements:',
            error
        );

        return [];
    }
}

/* ==========================================================
   DISMISS ANNOUNCEMENT
========================================================== */

export async function saveDismissedAnnouncement(
    announcementId:
        | string
        | number
): Promise<
    Array<string | number>
> {
    try {
        const current =
            await getDismissedAnnouncementIds();

        const alreadyDismissed =
            current.some(
                (id) =>
                    String(id) ===
                    String(
                        announcementId
                    )
            );

        if (
            alreadyDismissed
        ) {
            return current;
        }

        const next = [
            ...current,
            announcementId,
        ];

        await AsyncStorage.setItem(
            DISMISSED_ANNOUNCEMENTS_KEY,
            JSON.stringify(
                next
            )
        );

        return next;
    } catch (error) {
        console.warn(
            'Unable to save dismissed announcement:',
            error
        );

        /*
         * Storage failure should not stop
         * the popup from closing locally.
         */
        return [
            announcementId,
        ];
    }
}

/* ==========================================================
   OPTIONAL RESET

   Useful during development/testing.
========================================================== */

export async function clearDismissedAnnouncements() {
    try {
        await AsyncStorage.removeItem(
            DISMISSED_ANNOUNCEMENTS_KEY
        );
    } catch (error) {
        console.warn(
            'Unable to clear dismissed announcements:',
            error
        );
    }
}