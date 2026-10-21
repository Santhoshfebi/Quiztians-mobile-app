import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    formatLeaderboardTime,
    getPlayerInitials,
} from '../../services/leaderboardService';

import {
    AchievementBadge,
    SkillBadge,
} from './LeaderboardBadge';

type Props = {
    name?: string;
    place?: string;

    userRank:
    | number
    | null;

    userScore:
    | number
    | null;

    userTime:
    | number
    | null;

    totalQuestions: number;

    highestScore:
    | number
    | null;

    fastestPerScore:
    Record<number, number>;
};

export default function CurrentPlayerCard({
    name,
    place,
    userRank,
    userScore,
    userTime,
    totalQuestions,
    highestScore,
    fastestPerScore,
}: Props) {
    const highScore =
        userScore !== null &&
        userScore > 0 &&
        userScore ===
        highestScore;

    const fastest =
        userScore !== null &&
        userScore > 0 &&
        userTime !== null &&
        fastestPerScore[
        userScore
        ] === userTime;

    return (
        <View style={styles.card}>
            <View
                pointerEvents="none"
                style={styles.glow}
            />

            <View style={styles.header}>
                <Text style={styles.label}>
                    YOUR POSITION
                </Text>

                {userRank ? (
                    <View style={styles.ranked}>
                        <Text style={styles.rankedText}>
                            RANKED
                        </Text>
                    </View>
                ) : null}
            </View>

            <View style={styles.userRow}>
                <View style={styles.avatar}>
                    <Text style={styles.initials}>
                        {getPlayerInitials(
                            name
                        )}
                    </Text>
                </View>

                <View style={styles.userInfo}>
                    <Text
                        numberOfLines={1}
                        style={styles.name}
                    >
                        {name || '—'}
                    </Text>

                    <Text
                        numberOfLines={1}
                        style={styles.place}
                    >
                        {place || '—'}
                    </Text>
                </View>

                <View style={styles.rankArea}>
                    <Text style={styles.rankLabel}>
                        RANK
                    </Text>

                    <Text style={styles.rankValue}>
                        {userRank
                            ? `#${userRank}`
                            : '—'}
                    </Text>
                </View>
            </View>

            <View style={styles.stats}>
                <View style={styles.stat}>
                    <Text style={styles.statLabel}>
                        SCORE
                    </Text>

                    <View style={styles.scoreRow}>
                        <Text style={styles.statValue}>
                            {userScore ?? '—'}
                        </Text>

                        {totalQuestions >
                            0 &&
                            userScore !==
                            null ? (
                            <Text style={styles.total}>
                                / {totalQuestions}
                            </Text>
                        ) : null}
                    </View>
                </View>

                <View style={styles.stat}>
                    <Text style={styles.statLabel}>
                        TIME
                    </Text>

                    <Text style={styles.timeValue}>
                        {formatLeaderboardTime(
                            userTime
                        )}
                    </Text>
                </View>
            </View>

            <View style={styles.badges}>
                <SkillBadge
                    score={
                        userScore ?? 0
                    }
                    total={
                        totalQuestions
                    }
                />

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
        </View>
    );
}

const styles =
    StyleSheet.create({
        card: {
            position: 'relative',
            overflow: 'hidden',

            borderRadius: 24,
            borderWidth: 1,

            borderColor:
                'rgba(139,92,246,0.15)',

            backgroundColor:
                '#111114',

            padding: 20,
        },

        glow: {
            position: 'absolute',

            width: 160,
            height: 160,

            borderRadius: 80,

            right: -70,
            top: -70,

            backgroundColor:
                'rgba(124,58,237,0.07)',
        },

        header: {
            flexDirection: 'row',
            alignItems: 'center',

            justifyContent:
                'space-between',
        },

        label: {
            color: '#A78BFA',

            fontSize: 8,
            fontWeight: '900',

            letterSpacing: 1.5,
        },

        ranked: {
            borderRadius: 20,
            borderWidth: 1,

            borderColor:
                'rgba(139,92,246,0.15)',

            backgroundColor:
                'rgba(139,92,246,0.07)',

            paddingHorizontal: 9,
            paddingVertical: 5,
        },

        rankedText: {
            color: '#A78BFA',

            fontSize: 7,
            fontWeight: '900',

            letterSpacing: 0.7,
        },

        userRow: {
            flexDirection: 'row',
            alignItems: 'center',

            marginTop: 16,
        },

        avatar: {
            width: 50,
            height: 50,

            borderRadius: 16,
            borderWidth: 1,

            borderColor:
                'rgba(139,92,246,0.20)',

            backgroundColor:
                'rgba(139,92,246,0.08)',

            alignItems: 'center',
            justifyContent: 'center',

            marginRight: 12,
        },

        initials: {
            color: '#C4B5FD',

            fontSize: 12,
            fontWeight: '900',
        },

        userInfo: {
            flex: 1,
            minWidth: 0,
        },

        name: {
            color: '#E4E4E7',

            fontSize: 14,
            fontWeight: '900',
        },

        place: {
            color: '#52525B',

            fontSize: 9,
            fontWeight: '600',

            marginTop: 4,
        },

        rankArea: {
            alignItems: 'flex-end',

            marginLeft: 8,
        },

        rankLabel: {
            color: '#52525B',

            fontSize: 7,
            fontWeight: '900',

            letterSpacing: 1,
        },

        rankValue: {
            color: '#C4B5FD',

            fontSize: 24,
            fontWeight: '900',

            marginTop: 2,
        },

        stats: {
            flexDirection: 'row',

            gap: 10,

            marginTop: 20,
        },

        stat: {
            flex: 1,

            minHeight: 74,

            borderRadius: 17,
            borderWidth: 1,

            borderColor:
                'rgba(255,255,255,0.06)',

            backgroundColor:
                'rgba(255,255,255,0.025)',

            padding: 13,
        },

        statLabel: {
            color: '#52525B',

            fontSize: 7,
            fontWeight: '900',

            letterSpacing: 1,
        },

        scoreRow: {
            flexDirection: 'row',
            alignItems: 'baseline',

            marginTop: 6,
        },

        statValue: {
            color: '#E4E4E7',

            fontSize: 21,
            fontWeight: '900',
        },

        total: {
            color: '#52525B',

            fontSize: 8,
            fontWeight: '700',

            marginLeft: 3,
        },

        timeValue: {
            color: '#E4E4E7',

            fontSize: 16,
            fontWeight: '900',

            marginTop: 8,
        },

        badges: {
            flexDirection: 'row',
            flexWrap: 'wrap',

            gap: 6,

            marginTop: 16,
        },
    });