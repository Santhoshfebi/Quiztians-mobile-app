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
    player: LeaderboardPlayer;
    rank: number;

    totalQuestions: number;

    highestScore:
    | number
    | null;

    fastestPerScore:
    Record<number, number>;

    isCurrent: boolean;
};

export default function LeaderboardRow({
    player,
    rank,
    totalQuestions,
    highestScore,
    fastestPerScore,
    isCurrent,
}: Props) {
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

    return (
        <View
            style={[
                styles.row,
                isCurrent &&
                styles.currentRow,
            ]}
        >
            {isCurrent ? (
                <View
                    style={
                        styles.currentAccent
                    }
                />
            ) : null}

            <View style={styles.rank}>
                <Text
                    style={[
                        styles.rankText,
                        isCurrent &&
                        styles.currentRank,
                    ]}
                >
                    #{rank}
                </Text>
            </View>

            <View
                style={[
                    styles.avatar,

                    isCurrent &&
                    styles.currentAvatar,
                ]}
            >
                <Text
                    style={[
                        styles.avatarText,

                        isCurrent &&
                        styles.currentAvatarText,
                    ]}
                >
                    {getPlayerInitials(
                        player.name
                    )}
                </Text>
            </View>

            <View style={styles.info}>
                <View style={styles.nameRow}>
                    <Text
                        numberOfLines={1}
                        style={[
                            styles.name,

                            isCurrent &&
                            styles.currentName,
                        ]}
                    >
                        {player.name ||
                            'Unknown'}
                    </Text>

                    {isCurrent ? (
                        <View style={styles.you}>
                            <Text style={styles.youText}>
                                YOU
                            </Text>
                        </View>
                    ) : null}
                </View>

                <Text
                    numberOfLines={1}
                    style={styles.place}
                >
                    {player.place || '—'}
                </Text>

                {highScore ||
                    fastest ? (
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
            </View>

            <View style={styles.result}>
                <View style={styles.scoreRow}>
                    <Text
                        style={[
                            styles.score,

                            isCurrent &&
                            styles.currentScore,
                        ]}
                    >
                        {player.score}
                    </Text>

                    {totalQuestions >
                        0 ? (
                        <Text style={styles.total}>
                            /{totalQuestions}
                        </Text>
                    ) : null}
                </View>

                <Text style={styles.time}>
                    {formatLeaderboardTime(
                        player.time_taken
                    )}
                </Text>
            </View>
        </View>
    );
}

const styles =
    StyleSheet.create({
        row: {
            position: 'relative',

            minHeight: 72,

            borderRadius: 17,
            borderWidth: 1,

            borderColor:
                'transparent',

            flexDirection: 'row',
            alignItems: 'center',

            paddingVertical: 10,
            paddingHorizontal: 10,

            marginBottom: 4,
        },

        currentRow: {
            borderColor:
                'rgba(139,92,246,0.20)',

            backgroundColor:
                'rgba(139,92,246,0.07)',
        },

        currentAccent: {
            position: 'absolute',

            left: 0,
            top: 12,
            bottom: 12,

            width: 2,

            borderRadius: 2,

            backgroundColor:
                '#8B5CF6',
        },

        rank: {
            width: 34,

            alignItems: 'center',
        },

        rankText: {
            color: '#52525B',

            fontSize: 10,
            fontWeight: '900',
        },

        currentRank: {
            color: '#A78BFA',
        },

        avatar: {
            width: 40,
            height: 40,

            borderRadius: 12,
            borderWidth: 1,

            borderColor:
                'rgba(255,255,255,0.06)',

            backgroundColor:
                'rgba(255,255,255,0.03)',

            alignItems: 'center',
            justifyContent: 'center',

            marginRight: 10,
        },

        currentAvatar: {
            borderColor:
                'rgba(139,92,246,0.20)',

            backgroundColor:
                'rgba(139,92,246,0.10)',
        },

        avatarText: {
            color: '#71717A',

            fontSize: 10,
            fontWeight: '900',
        },

        currentAvatarText: {
            color: '#C4B5FD',
        },

        info: {
            flex: 1,
            minWidth: 0,
        },

        nameRow: {
            flexDirection: 'row',
            alignItems: 'center',
        },

        name: {
            flexShrink: 1,

            color: '#D4D4D8',

            fontSize: 12,
            fontWeight: '800',
        },

        currentName: {
            color: '#DDD6FE',
        },

        you: {
            borderRadius: 5,

            backgroundColor:
                'rgba(139,92,246,0.10)',

            paddingHorizontal: 5,
            paddingVertical: 2,

            marginLeft: 6,
        },

        youText: {
            color: '#A78BFA',

            fontSize: 6,
            fontWeight: '900',

            letterSpacing: 0.5,
        },

        place: {
            color: '#52525B',

            fontSize: 9,

            marginTop: 3,
        },

        badges: {
            flexDirection: 'row',
            flexWrap: 'wrap',

            gap: 4,

            marginTop: 6,
        },

        result: {
            alignItems: 'flex-end',

            marginLeft: 8,
        },

        scoreRow: {
            flexDirection: 'row',
            alignItems: 'baseline',
        },

        score: {
            color: '#D4D4D8',

            fontSize: 16,
            fontWeight: '900',
        },

        currentScore: {
            color: '#C4B5FD',
        },

        total: {
            color: '#52525B',

            fontSize: 8,
            fontWeight: '700',
        },

        time: {
            color: '#52525B',

            fontSize: 8,
            fontWeight: '600',

            marginTop: 3,
        },
    });