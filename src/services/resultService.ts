import { supabase } from './supabase';

export type LeaderboardPlayer = {
    id?: string | number;
    name: string;
    place?: string | null;
    phone?: string | null;
    score: number;
    time_taken?: number | null;
    created_at?: string | null;
};

export async function getChapterLeaderboard(
    chapter: string
): Promise<LeaderboardPlayer[]> {
    const { data, error } = await supabase
        .from('results')
        .select(
            'id, name, place, phone, score, time_taken, created_at'
        )
        .eq('chapter', chapter)
        .order('score', {
            ascending: false,
        })
        .order('time_taken', {
            ascending: true,
        })
        .order('created_at', {
            ascending: true,
        });

    if (error) {
        throw error;
    }

    return (data ??
        []) as LeaderboardPlayer[];
}

export function findPlayerRank(
    players: LeaderboardPlayer[],
    {
        phone,
        name,
        place,
        score,
    }: {
        phone: string;
        name: string;
        place: string;
        score: number;
    }
) {
    const index = players.findIndex(
        (player) =>
            (phone &&
                player.phone &&
                player.phone === phone) ||
            (player.name === name &&
                player.place === place &&
                Number(player.score) ===
                Number(score))
    );

    return index >= 0
        ? index + 1
        : null;
}