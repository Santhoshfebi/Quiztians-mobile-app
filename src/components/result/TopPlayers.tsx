import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type {
    LeaderboardPlayer,
} from '../../services/resultService';

type Props = {
    players: LeaderboardPlayer[];
    rank: number | null;
    chapter: string;
    onViewAll: () => void;
};

export default function TopPlayers({
    players,
    rank,
    chapter,
    onViewAll,
}: Props) {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.trophyBox}>
                        <Text style={styles.trophy}>
                            🏆
                        </Text>
                    </View>

                    <View style={styles.flex}>
                        <Text style={styles.title}>
                            Top Players
                        </Text>

                        <Text
                            style={styles.chapter}
                            numberOfLines={1}
                        >
                            {chapter || '—'}
                        </Text>
                    </View>
                </View>

                <View style={styles.badge}>
                    <Text
                        style={styles.badgeText}
                    >
                        TOP 5
                    </Text>
                </View>
            </View>

            <View style={styles.list}>
                {players.length === 0 ? (
                    <View style={styles.empty}>
                        <Text
                            style={styles.emptyTitle}
                        >
                            No players yet.
                        </Text>

                        <Text
                            style={
                                styles.emptyDescription
                            }
                        >
                            Be the first on the
                            leaderboard.
                        </Text>
                    </View>
                ) : (
                    players
                        .slice(0, 5)
                        .map(
                            (player, index) => {
                                const playerRank =
                                    index + 1;

                                const isYou =
                                    rank ===
                                    playerRank;

                                return (
                                    <View
                                        key={
                                            player.id ??
                                            `${player.name}-${index}`
                                        }
                                        style={[
                                            styles.player,

                                            isYou &&
                                            styles.playerYou,
                                        ]}
                                    >
                                        <View
                                            style={
                                                styles.playerLeft
                                            }
                                        >
                                            <View
                                                style={
                                                    styles.medalBox
                                                }
                                            >
                                                <Text
                                                    style={
                                                        styles.medal
                                                    }
                                                >
                                                    {getMedal(
                                                        index
                                                    )}
                                                </Text>
                                            </View>

                                            <View
                                                style={
                                                    styles.playerInfo
                                                }
                                            >
                                                <View
                                                    style={
                                                        styles.nameRow
                                                    }
                                                >
                                                    <Text
                                                        style={[
                                                            styles.name,

                                                            isYou &&
                                                            styles.nameYou,
                                                        ]}
                                                        numberOfLines={
                                                            1
                                                        }
                                                    >
                                                        {
                                                            player.name
                                                        }
                                                    </Text>

                                                    {isYou && (
                                                        <View
                                                            style={
                                                                styles.youBadge
                                                            }
                                                        >
                                                            <Text
                                                                style={
                                                                    styles.youText
                                                                }
                                                            >
                                                                YOU
                                                            </Text>
                                                        </View>
                                                    )}
                                                </View>

                                                <Text
                                                    style={
                                                        styles.place
                                                    }
                                                    numberOfLines={
                                                        1
                                                    }
                                                >
                                                    {player.place ||
                                                        '—'}
                                                </Text>
                                            </View>
                                        </View>

                                        <View
                                            style={
                                                styles.playerRight
                                            }
                                        >
                                            <Text
                                                style={[
                                                    styles.score,

                                                    index === 0 &&
                                                    styles.firstScore,

                                                    isYou &&
                                                    index !==
                                                    0 &&
                                                    styles.youScore,
                                                ]}
                                            >
                                                {
                                                    player.score
                                                }
                                            </Text>

                                            <Text
                                                style={
                                                    styles.time
                                                }
                                            >
                                                {formatTime(
                                                    player.time_taken
                                                )}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            }
                        )
                )}
            </View>

            <View style={styles.footer}>
                <Pressable
                    onPress={onViewAll}
                    style={({ pressed }) => [
                        styles.viewAll,
                        pressed &&
                        styles.pressed,
                    ]}
                >
                    <Text
                        style={
                            styles.viewAllText
                        }
                    >
                        View full leaderboard →
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

function getMedal(
    index: number
) {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';

    return '🏅';
}

function formatTime(
    seconds?: number | null
) {
    const safeSeconds =
        Number(seconds) || 0;

    const minutes = Math.floor(
        safeSeconds / 60
    );

    const remaining =
        safeSeconds % 60;

    return `${minutes}m ${String(
        remaining
    ).padStart(2, '0')}s`;
}

const styles =
    StyleSheet.create({
        flex: {
            flex: 1,
        },

        pressed: {
            opacity: 0.75,
        },

        card: {
            marginTop: 15,
            borderRadius: 23,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor:
                'rgba(255,255,255,0.08)',
            backgroundColor: '#111114',
        },

        header: {
            padding: 17,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent:
                'space-between',
            borderBottomWidth: 1,
            borderBottomColor:
                'rgba(255,255,255,0.06)',
        },

        headerLeft: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingRight: 10,
        },

        trophyBox: {
            width: 36,
            height: 36,
            borderRadius: 11,
            borderWidth: 1,
            borderColor:
                'rgba(245,158,11,0.15)',
            backgroundColor:
                'rgba(245,158,11,0.06)',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
        },

        trophy: {
            fontSize: 16,
        },

        title: {
            color: '#D4D4D8',
            fontSize: 13,
            fontWeight: '900',
        },

        chapter: {
            color: '#3F3F46',
            fontSize: 9,
            fontWeight: '500',
            marginTop: 3,
        },

        badge: {
            paddingHorizontal: 9,
            paddingVertical: 5,
            borderRadius: 20,
            borderWidth: 1,
            borderColor:
                'rgba(255,255,255,0.06)',
            backgroundColor:
                'rgba(255,255,255,0.025)',
        },

        badgeText: {
            color: '#52525B',
            fontSize: 7,
            fontWeight: '900',
            letterSpacing: 1,
        },

        list: {
            padding: 10,
        },

        empty: {
            alignItems: 'center',
            paddingVertical: 28,
        },

        emptyTitle: {
            color: '#52525B',
            fontSize: 11,
            fontWeight: '700',
        },

        emptyDescription: {
            color: '#27272A',
            fontSize: 9,
            marginTop: 5,
        },

        player: {
            minHeight: 63,
            paddingHorizontal: 10,
            paddingVertical: 9,
            borderRadius: 15,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent:
                'space-between',
            marginBottom: 4,
        },

        playerYou: {
            borderWidth: 1,
            borderColor:
                'rgba(139,92,246,0.20)',
            backgroundColor:
                'rgba(139,92,246,0.065)',
        },

        playerLeft: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingRight: 10,
        },

        medalBox: {
            width: 36,
            height: 36,
            borderRadius: 11,
            backgroundColor:
                'rgba(255,255,255,0.03)',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
        },

        medal: {
            fontSize: 16,
        },

        playerInfo: {
            flex: 1,
        },

        nameRow: {
            flexDirection: 'row',
            alignItems: 'center',
        },

        name: {
            flexShrink: 1,
            color: '#D4D4D8',
            fontSize: 11,
            fontWeight: '800',
        },

        nameYou: {
            color: '#DDD6FE',
        },

        youBadge: {
            marginLeft: 6,
            paddingHorizontal: 5,
            paddingVertical: 2,
            borderRadius: 8,
            backgroundColor:
                'rgba(139,92,246,0.10)',
        },

        youText: {
            color: '#A78BFA',
            fontSize: 6,
            fontWeight: '900',
            letterSpacing: 0.7,
        },

        place: {
            color: '#3F3F46',
            fontSize: 8,
            marginTop: 3,
        },

        playerRight: {
            alignItems: 'flex-end',
        },

        score: {
            color: '#A1A1AA',
            fontSize: 14,
            fontWeight: '900',
        },

        firstScore: {
            color: '#FCD34D',
        },

        youScore: {
            color: '#C4B5FD',
        },

        time: {
            color: '#3F3F46',
            fontSize: 7,
            marginTop: 3,
        },

        footer: {
            padding: 10,
            borderTopWidth: 1,
            borderTopColor:
                'rgba(255,255,255,0.05)',
        },

        viewAll: {
            minHeight: 42,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 12,
        },

        viewAllText: {
            color: '#52525B',
            fontSize: 10,
            fontWeight: '700',
        },
    });