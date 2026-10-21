import { supabase } from './supabase';

/* ==========================================================
   TYPES
========================================================== */

export type LeaderboardPlayer = {
    id: string | number;
    name: string;
    place: string | null;
    phone: string | null;
    score: number;
    time_taken: number | null;
    created_at: string | null;
};

export type CurrentPlayerIdentity = {
    name?: string;
    phone?: string;
    place?: string;
    score?: number;
};

export type BestPerformance = {
    bestScore: number | null;
    bestTime: number | null;
    attempts: number;
};

export type LeaderboardData = {
    players: LeaderboardPlayer[];

    top3: LeaderboardPlayer[];

    nextPlayers: LeaderboardPlayer[];

    totalQuestions: number;

    highestScore: number | null;

    fastestTime: number | null;

    fastestPerScore: Record<
        number,
        number
    >;

    userRank: number | null;

    userScore: number | null;

    userTime: number | null;

    currentPlayer:
    | LeaderboardPlayer
    | null;

    bestStats: BestPerformance;
};

/* ==========================================================
   MAIN LEADERBOARD FETCH
========================================================== */

export async function getLeaderboardData(
    chapter: string,
    currentUser?: CurrentPlayerIdentity
): Promise<LeaderboardData> {
    if (!chapter) {
        return createEmptyLeaderboard();
    }

    const [
        playersResponse,
        questionsResponse,
    ] = await Promise.all([
        supabase
            .from('results')
            .select(
                `
                id,
                name,
                place,
                phone,
                score,
                time_taken,
                created_at
                `
            )
            .eq(
                'chapter',
                chapter
            ),

        supabase
            .from('questions')
            .select(
                '*',
                {
                    head: true,
                    count: 'exact',
                }
            )
            .eq(
                'chapter',
                chapter
            ),
    ]);

    /* ======================================================
       ERROR HANDLING
    ====================================================== */

    if (playersResponse.error) {
        throw playersResponse.error;
    }

    if (questionsResponse.error) {
        throw questionsResponse.error;
    }

    /* ======================================================
       NORMALIZE PLAYERS
    ====================================================== */

    const rawPlayers =
        (playersResponse.data ??
            []) as LeaderboardPlayer[];

    const players =
        sortLeaderboardPlayers(
            rawPlayers
        );

    const totalQuestions =
        questionsResponse.count ?? 0;

    /* ======================================================
       TOP PLAYERS
    ====================================================== */

    const top3 =
        players.slice(
            0,
            3
        );

    // Same as website:
    // Positions 4 through 20.
    const nextPlayers =
        players.slice(
            3,
            20
        );

    /* ======================================================
       LEADERBOARD STATS
    ====================================================== */

    const highestScore =
        players.length > 0
            ? Number(
                players[0].score ??
                0
            )
            : null;

    const validTimes =
        players
            .map(
                (player) =>
                    player.time_taken
            )
            .filter(
                (
                    time
                ): time is number =>
                    typeof time ===
                    'number' &&
                    Number.isFinite(
                        time
                    )
            );

    const fastestTime =
        validTimes.length > 0
            ? Math.min(
                ...validTimes
            )
            : null;

    const fastestPerScore =
        getFastestPerScore(
            players
        );

    /* ======================================================
       CURRENT USER
    ====================================================== */

    const currentPlayerIndex =
        findCurrentPlayerIndex(
            players,
            currentUser
        );

    const currentPlayer =
        currentPlayerIndex >= 0
            ? players[
            currentPlayerIndex
            ]
            : null;

    const userRank =
        currentPlayerIndex >= 0
            ? currentPlayerIndex +
            1
            : null;

    const userScore =
        currentPlayer?.score ??
        null;

    const userTime =
        currentPlayer?.time_taken ??
        null;

    /* ======================================================
       USER BEST PERFORMANCE
    ====================================================== */

    const bestStats =
        getBestPerformanceFromPlayers(
            players,
            currentUser
        );

    return {
        players,

        top3,

        nextPlayers,

        totalQuestions,

        highestScore,

        fastestTime,

        fastestPerScore,

        userRank,

        userScore,

        userTime,

        currentPlayer,

        bestStats,
    };
}

/* ==========================================================
   SORT LEADERBOARD

   RULE:
   1. Highest score
   2. Fastest completion
   3. Earliest submission
========================================================== */

export function sortLeaderboardPlayers(
    players: LeaderboardPlayer[]
): LeaderboardPlayer[] {
    return [
        ...players,
    ].sort(
        (a, b) => {
            /* ----------------------------------------------
               SCORE
            ---------------------------------------------- */

            const scoreA =
                Number(
                    a.score ?? 0
                );

            const scoreB =
                Number(
                    b.score ?? 0
                );

            if (
                scoreB !==
                scoreA
            ) {
                return (
                    scoreB -
                    scoreA
                );
            }

            /* ----------------------------------------------
               TIME
            ---------------------------------------------- */

            const timeA =
                a.time_taken ??
                Infinity;

            const timeB =
                b.time_taken ??
                Infinity;

            if (
                timeA !==
                timeB
            ) {
                return (
                    timeA -
                    timeB
                );
            }

            /* ----------------------------------------------
               SUBMISSION TIME
            ---------------------------------------------- */

            const createdA =
                getTimestamp(
                    a.created_at
                );

            const createdB =
                getTimestamp(
                    b.created_at
                );

            return (
                createdA -
                createdB
            );
        }
    );
}

/* ==========================================================
   CURRENT PLAYER
========================================================== */

export function findCurrentPlayerIndex(
    players: LeaderboardPlayer[],
    currentUser?: CurrentPlayerIdentity
): number {
    if (
        !currentUser ||
        players.length === 0
    ) {
        return -1;
    }

    const cleanPhone =
        currentUser.phone?.trim();

    /* ======================================================
       PRIMARY MATCH: PHONE
    ====================================================== */

    if (cleanPhone) {
        const phoneIndex =
            players.findIndex(
                (player) =>
                    player.phone ===
                    cleanPhone
            );

        if (
            phoneIndex >= 0
        ) {
            return phoneIndex;
        }
    }

    /* ======================================================
       FALLBACK:
       NAME + PLACE + SCORE
    ====================================================== */

    const cleanName =
        currentUser.name?.trim();

    if (!cleanName) {
        return -1;
    }

    return players.findIndex(
        (player) =>
            player.name ===
            cleanName &&
            (player.place ??
                '') ===
            (currentUser.place ??
                '') &&
            Number(
                player.score
            ) ===
            Number(
                currentUser.score
            )
    );
}

/* ==========================================================
   CHECK CURRENT USER
========================================================== */

export function isCurrentPlayer(
    player:
        | LeaderboardPlayer
        | undefined
        | null,
    currentUser?: CurrentPlayerIdentity
): boolean {
    if (
        !player ||
        !currentUser
    ) {
        return false;
    }

    const phone =
        currentUser.phone?.trim();

    if (
        phone &&
        player.phone === phone
    ) {
        return true;
    }

    const name =
        currentUser.name?.trim();

    if (!name) {
        return false;
    }

    return (
        player.name === name &&
        (player.place ?? '') ===
        (currentUser.place ??
            '') &&
        Number(
            player.score
        ) ===
        Number(
            currentUser.score
        )
    );
}

/* ==========================================================
   FASTEST PLAYER FOR EACH SCORE
========================================================== */

export function getFastestPerScore(
    players: LeaderboardPlayer[]
): Record<number, number> {
    const fastest:
        Record<
            number,
            number
        > = {};

    players.forEach(
        (player) => {
            const score =
                Number(
                    player.score ??
                    0
                );

            const time =
                player.time_taken;

            if (
                score <= 0 ||
                time === null ||
                time === undefined ||
                !Number.isFinite(
                    time
                )
            ) {
                return;
            }

            if (
                fastest[
                score
                ] ===
                undefined ||
                time <
                fastest[
                score
                ]
            ) {
                fastest[
                    score
                ] =
                    time;
            }
        }
    );

    return fastest;
}

/* ==========================================================
   HIGH SCORE CHECK
========================================================== */

export function isHighScorePlayer(
    player:
        | LeaderboardPlayer
        | null
        | undefined,
    highestScore:
        | number
        | null
): boolean {
    if (
        !player ||
        highestScore === null
    ) {
        return false;
    }

    return (
        Number(
            player.score
        ) ===
        Number(
            highestScore
        )
    );
}

/* ==========================================================
   FASTEST-FOR-SCORE CHECK
========================================================== */

export function isFastestForScore(
    player:
        | LeaderboardPlayer
        | null
        | undefined,
    fastestPerScore: Record<
        number,
        number
    >
): boolean {
    if (!player) {
        return false;
    }

    const score =
        Number(
            player.score ??
            0
        );

    const time =
        player.time_taken;

    if (
        score <= 0 ||
        time === null ||
        time === undefined
    ) {
        return false;
    }

    return (
        fastestPerScore[
        score
        ] === time
    );
}

/* ==========================================================
   USER BEST PERFORMANCE

   Website behavior preserved:
   - Best score
   - Fastest time
   - Attempts
========================================================== */

export function getBestPerformanceFromPlayers(
    players: LeaderboardPlayer[],
    currentUser?: CurrentPlayerIdentity
): BestPerformance {
    if (!currentUser) {
        return {
            bestScore: null,
            bestTime: null,
            attempts: 0,
        };
    }

    const phone =
        currentUser.phone?.trim();

    const name =
        currentUser.name?.trim();

    const place =
        currentUser.place ??
        '';

    const attempts =
        players.filter(
            (player) => {
                if (phone) {
                    return (
                        player.phone ===
                        phone
                    );
                }

                if (name) {
                    return (
                        player.name ===
                        name &&
                        (player.place ??
                            '') ===
                        place
                    );
                }

                return false;
            }
        );

    if (
        attempts.length === 0
    ) {
        return {
            bestScore: null,
            bestTime: null,
            attempts: 0,
        };
    }

    const bestScore =
        Math.max(
            ...attempts.map(
                (player) =>
                    Number(
                        player.score ??
                        0
                    )
            )
        );

    const validTimes =
        attempts
            .map(
                (player) =>
                    player.time_taken
            )
            .filter(
                (
                    time
                ): time is number =>
                    typeof time ===
                    'number' &&
                    Number.isFinite(
                        time
                    )
            );

    const bestTime =
        validTimes.length > 0
            ? Math.min(
                ...validTimes
            )
            : null;

    return {
        bestScore,
        bestTime,
        attempts:
            attempts.length,
    };
}

/* ==========================================================
   SKILL BADGE
========================================================== */

export type SkillLevel =
    | 'legend'
    | 'champion'
    | 'gold'
    | 'silver'
    | 'bronze';

export type SkillBadgeData = {
    level: SkillLevel;
    label: string;
    icon: string;
    percentage: number;
};

export function getSkillBadge(
    score: number,
    total: number
): SkillBadgeData {
    const safeTotal =
        Number(total) > 0
            ? Number(total)
            : 1;

    const safeScore =
        Number(score) || 0;

    const percentage =
        (safeScore /
            safeTotal) *
        100;

    if (
        percentage >= 90
    ) {
        return {
            level:
                'legend',
            label:
                'Legend',
            icon: '🏆',
            percentage,
        };
    }

    if (
        percentage >= 75
    ) {
        return {
            level:
                'champion',
            label:
                'Champion',
            icon: '🥇',
            percentage,
        };
    }

    if (
        percentage >= 55
    ) {
        return {
            level:
                'gold',
            label:
                'Gold',
            icon: '🥇',
            percentage,
        };
    }

    if (
        percentage >= 35
    ) {
        return {
            level:
                'silver',
            label:
                'Silver',
            icon: '🥈',
            percentage,
        };
    }

    return {
        level:
            'bronze',
        label:
            'Bronze',
        icon: '🥉',
        percentage,
    };
}

/* ==========================================================
   FORMAT TIME
========================================================== */

export function formatLeaderboardTime(
    seconds:
        | number
        | null
        | undefined
): string {
    if (
        seconds === null ||
        seconds === undefined ||
        !Number.isFinite(
            Number(seconds)
        )
    ) {
        return '—';
    }

    const safeSeconds =
        Math.max(
            0,
            Math.floor(
                Number(seconds)
            )
        );

    const minutes =
        Math.floor(
            safeSeconds / 60
        );

    const remainingSeconds =
        safeSeconds % 60;

    if (
        minutes > 0
    ) {
        return `${minutes}m ${String(
            remainingSeconds
        ).padStart(
            2,
            '0'
        )}s`;
    }

    return `${remainingSeconds}s`;
}

/* ==========================================================
   INITIALS
========================================================== */

export function getPlayerInitials(
    fullName?: string | null
): string {
    const cleanName =
        fullName?.trim();

    if (!cleanName) {
        return 'A';
    }

    const parts =
        cleanName.split(
            /\s+/
        );

    if (
        parts.length === 1
    ) {
        return parts[0]
            .slice(
                0,
                2
            )
            .toUpperCase();
    }

    return (
        parts[0][0] +
        parts[
        parts.length -
        1
        ][0]
    ).toUpperCase();
}

/* ==========================================================
   PRIVATE HELPERS
========================================================== */

function getTimestamp(
    value:
        | string
        | null
        | undefined
): number {
    if (!value) {
        return Infinity;
    }

    const timestamp =
        new Date(
            value
        ).getTime();

    return Number.isFinite(
        timestamp
    )
        ? timestamp
        : Infinity;
}

function createEmptyLeaderboard(): LeaderboardData {
    return {
        players: [],

        top3: [],

        nextPlayers: [],

        totalQuestions: 0,

        highestScore: null,

        fastestTime: null,

        fastestPerScore: {},

        userRank: null,

        userScore: null,

        userTime: null,

        currentPlayer: null,

        bestStats: {
            bestScore: null,
            bestTime: null,
            attempts: 0,
        },
    };
}