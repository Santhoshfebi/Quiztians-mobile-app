import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    formatLeaderboardTime,
    getPlayerInitials,
    isFastestForScore,
    isHighScorePlayer,
    type LeaderboardPlayer,
} from '../../services/leaderboardService';

import {
    AchievementBadge,
} from './LeaderboardBadge';

type Props = {
    top3: LeaderboardPlayer[];

    highestScore:
    | number
    | null;

    fastestPerScore:
    Record<number, number>;

    currentPlayerId?:
    | string
    | number
    | null;
};

export default function LeaderboardPodium({
    top3,
    highestScore,
    fastestPerScore,
    currentPlayerId,
}: Props) {
    if (
        top3.length === 0
    ) {
        return (
            <View style={styles.container}>
                <Header />

                <View style={styles.empty}>
                    <View style={styles.emptyIcon}>
                        <Text style={styles.emptyEmoji}>
                            🏆
                        </Text>
                    </View>

                    <Text style={styles.emptyTitle}>
                        No rankings yet
                    </Text>

                    <Text style={styles.emptyText}>
                        Be the first player on this leaderboard.
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View
                pointerEvents="none"
                style={styles.glow}
            />

            <Header />

            <View style={styles.podium}>
                <PodiumPlayer
                    player={top3[1]}
                    rank={2}
                    medal="🥈"
                    highestScore={
                        highestScore
                    }
                    fastestPerScore={
                        fastestPerScore
                    }
                    isYou={
                        top3[1]?.id ===
                        currentPlayerId
                    }
                />

                <PodiumPlayer
                    player={top3[0]}
                    rank={1}
                    medal="🥇"
                    highestScore={
                        highestScore
                    }
                    fastestPerScore={
                        fastestPerScore
                    }
                    isYou={
                        top3[0]?.id ===
                        currentPlayerId
                    }
                    winner
                />

                <PodiumPlayer
                    player={top3[2]}
                    rank={3}
                    medal="🥉"
                    highestScore={
                        highestScore
                    }
                    fastestPerScore={
                        fastestPerScore
                    }
                    isYou={
                        top3[2]?.id ===
                        currentPlayerId
                    }
                />
            </View>
        </View>
    );
}

function Header() {
    return (
        <View style={styles.header}>
            <View>
                <Text style={styles.eyebrow}>
                    HALL OF FAME
                </Text>

                <Text style={styles.heading}>
                    Chapter Top 3
                </Text>
            </View>

            <View style={styles.trophyBox}>
                <Text style={styles.trophy}>
                    🏆
                </Text>
            </View>
        </View>
    );
}

type PodiumPlayerProps = {
    player?:
    LeaderboardPlayer;

    rank: 1 | 2 | 3;

    medal: string;

    highestScore:
    | number
    | null;

    fastestPerScore:
    Record<number, number>;

    isYou: boolean;

    winner?: boolean;
};

function PodiumPlayer({
    player,
    rank,
    medal,
    highestScore,
    fastestPerScore,
    isYou,
    winner = false,
}: PodiumPlayerProps) {
    const highScore =
        isHighScorePlayer(
            player,
            highestScore
        );

    const fastest =
        isFastestForScore(
            player,
            fastestPerScore
        );

    const rankLabel =
        rank === 1
            ? '1ST'
            : rank === 2
                ? '2ND'
                : '3RD';

    return (
        <View
            style={[
                styles.player,
                winner &&
                styles.winnerPlayer,
            ]}
        >
            <View style={styles.crownArea}>
                {winner ? (
                    <Text style={styles.crown}>
                        👑
                    </Text>
                ) : null}
            </View>

            <View
                style={[
                    styles.avatar,

                    winner
                        ? styles.winnerAvatar
                        : rank === 2
                            ? styles.secondAvatar
                            : styles.thirdAvatar,
                ]}
            >
                <Text
                    style={[
                        styles.initials,
                        winner
                            ? styles.winnerInitials
                            : null,
                    ]}
                >
                    {player
                        ? getPlayerInitials(
                            player.name
                        )
                        : '—'}
                </Text>

                {isYou ? (
                    <View style={styles.youBadge}>
                        <Text style={styles.youText}>
                            YOU
                        </Text>
                    </View>
                ) : null}
            </View>

            <Text
                style={[
                    styles.rank,
                    winner &&
                    styles.winnerRank,
                ]}
            >
                {rankLabel}
            </Text>

            <Text
                numberOfLines={1}
                style={[
                    styles.name,
                    winner &&
                    styles.winnerName,
                ]}
            >
                {player?.name || '—'}
            </Text>

            <Text
                style={[
                    styles.score,
                    winner &&
                    styles.winnerScore,
                ]}
            >
                {player?.score ?? '—'}
            </Text>

            <Text style={styles.time}>
                {formatLeaderboardTime(
                    player?.time_taken
                )}
            </Text>

            {player &&
                (highScore ||
                    fastest) ? (
                <View style={styles.badges}>
                    {highScore ? (
                        <AchievementBadge
                            type="high"
                        />
                    ) : null}

                    {fastest ? (
                        <AchievementBadge
                            type="fast"
                        />
                    ) : null}
                </View>
            ) : null}

            <View
                style={[
                    styles.base,

                    winner
                        ? styles.winnerBase
                        : rank === 2
                            ? styles.secondBase
                            : styles.thirdBase,
                ]}
            >
                <Text
                    style={
                        winner
                            ? styles.winnerMedal
                            : styles.medal
                    }
                >
                    {medal}
                </Text>
            </View>
        </View>
    );
}

const styles =
    StyleSheet.create({
        container: {
            position: 'relative',
            overflow: 'hidden',

            borderRadius: 28,
            borderWidth: 1,

            borderColor:
                'rgba(255,255,255,0.08)',

            backgroundColor:
                '#111114',

            padding: 20,
        },

        glow: {
            position: 'absolute',

            width: 260,
            height: 260,

            borderRadius: 130,

            top: -120,
            left: '20%',

            backgroundColor:
                'rgba(245,158,11,0.035)',
        },

        header: {
            flexDirection: 'row',

            alignItems: 'center',
            justifyContent:
                'space-between',

            marginBottom: 26,
        },

        eyebrow: {
            color: '#52525B',

            fontSize: 8,
            fontWeight: '900',

            letterSpacing: 1.5,
        },

        heading: {
            color: '#D4D4D8',

            fontSize: 14,
            fontWeight: '900',

            marginTop: 5,
        },

        trophyBox: {
            width: 38,
            height: 38,

            borderRadius: 12,
            borderWidth: 1,

            borderColor:
                'rgba(245,158,11,0.15)',

            backgroundColor:
                'rgba(245,158,11,0.06)',

            alignItems: 'center',
            justifyContent: 'center',
        },

        trophy: {
            fontSize: 17,
        },

        podium: {
            flexDirection: 'row',

            alignItems:
                'flex-end',

            justifyContent:
                'space-between',
        },

        player: {
            flex: 1,

            minWidth: 0,

            alignItems: 'center',

            paddingHorizontal: 2,
        },

        winnerPlayer: {
            paddingBottom: 14,
        },

        crownArea: {
            height: 25,

            justifyContent:
                'center',
        },

        crown: {
            fontSize: 17,
        },

        avatar: {
            position: 'relative',

            width: 58,
            height: 58,

            borderRadius: 29,
            borderWidth: 1,

            alignItems: 'center',
            justifyContent: 'center',
        },

        winnerAvatar: {
            width: 78,
            height: 78,

            borderRadius: 39,

            borderColor:
                'rgba(251,191,36,0.30)',

            backgroundColor:
                'rgba(245,158,11,0.08)',
        },

        secondAvatar: {
            borderColor:
                'rgba(161,161,170,0.15)',

            backgroundColor:
                'rgba(161,161,170,0.06)',
        },

        thirdAvatar: {
            borderColor:
                'rgba(249,115,22,0.15)',

            backgroundColor:
                'rgba(249,115,22,0.05)',
        },

        initials: {
            color: '#D4D4D8',

            fontSize: 14,
            fontWeight: '900',
        },

        winnerInitials: {
            color: '#FDE68A',
            fontSize: 18,
        },

        youBadge: {
            position: 'absolute',

            bottom: -7,

            borderRadius: 10,
            borderWidth: 1,

            borderColor:
                'rgba(139,92,246,0.20)',

            backgroundColor:
                '#17111F',

            paddingHorizontal: 6,
            paddingVertical: 3,
        },

        youText: {
            color: '#A78BFA',

            fontSize: 6,
            fontWeight: '900',

            letterSpacing: 0.6,
        },

        rank: {
            color: '#52525B',

            fontSize: 8,
            fontWeight: '900',

            letterSpacing: 1,

            marginTop: 13,
        },

        winnerRank: {
            color: '#FBBF24',
        },

        name: {
            width: '100%',

            color: '#A1A1AA',

            textAlign: 'center',

            fontSize: 10,
            fontWeight: '900',

            marginTop: 5,
        },

        winnerName: {
            color: '#FFFFFF',
            fontSize: 12,
        },

        score: {
            color: '#D4D4D8',

            fontSize: 15,
            fontWeight: '900',

            marginTop: 5,
        },

        winnerScore: {
            color: '#FCD34D',
            fontSize: 21,
        },

        time: {
            color: '#52525B',

            fontSize: 8,
            fontWeight: '600',

            marginTop: 3,
        },

        badges: {
            minHeight: 27,

            flexDirection: 'row',
            flexWrap: 'wrap',

            justifyContent:
                'center',

            gap: 4,

            marginTop: 8,
        },

        base: {
            marginTop: 12,

            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,

            borderWidth: 1,

            alignItems: 'center',
            justifyContent: 'center',
        },

        winnerBase: {
            width: 76,
            height: 50,

            borderColor:
                'rgba(245,158,11,0.15)',

            backgroundColor:
                'rgba(245,158,11,0.055)',
        },

        secondBase: {
            width: 59,
            height: 38,

            borderColor:
                'rgba(161,161,170,0.10)',

            backgroundColor:
                'rgba(161,161,170,0.035)',
        },

        thirdBase: {
            width: 52,
            height: 31,

            borderColor:
                'rgba(249,115,22,0.10)',

            backgroundColor:
                'rgba(249,115,22,0.03)',
        },

        winnerMedal: {
            fontSize: 20,
        },

        medal: {
            fontSize: 15,
        },

        empty: {
            paddingVertical: 38,

            alignItems: 'center',
        },

        emptyIcon: {
            width: 50,
            height: 50,

            borderRadius: 16,
            borderWidth: 1,

            borderColor:
                'rgba(255,255,255,0.06)',

            backgroundColor:
                'rgba(255,255,255,0.025)',

            alignItems: 'center',
            justifyContent: 'center',
        },

        emptyEmoji: {
            fontSize: 20,
        },

        emptyTitle: {
            color: '#71717A',

            fontSize: 13,
            fontWeight: '800',

            marginTop: 15,
        },

        emptyText: {
            color: '#3F3F46',

            fontSize: 10,

            textAlign: 'center',

            marginTop: 5,
        },
    });