import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    formatLeaderboardTime,
    type BestPerformance,
} from '../../services/leaderboardService';

type Props = {
    bestStats: BestPerformance;
    totalQuestions: number;
};

export default function BestPerformanceCard({
    bestStats,
    totalQuestions,
}: Props) {
    return (
        <View style={styles.card}>
            <Text style={styles.eyebrow}>
                YOUR BEST
            </Text>

            <Text style={styles.heading}>
                This chapter
            </Text>

            <View style={styles.stats}>
                <Stat
                    label="SCORE"
                    value={
                        bestStats.bestScore !==
                            null
                            ? totalQuestions >
                                0
                                ? `${bestStats.bestScore}/${totalQuestions}`
                                : String(
                                    bestStats.bestScore
                                )
                            : '—'
                    }
                />

                <Stat
                    label="TIME"
                    value={
                        formatLeaderboardTime(
                            bestStats.bestTime
                        )
                    }
                />

                <Stat
                    label="ATTEMPTS"
                    value={String(
                        bestStats.attempts
                    )}
                />
            </View>
        </View>
    );
}

function Stat({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <View style={styles.stat}>
            <Text style={styles.label}>
                {label}
            </Text>

            <Text
                numberOfLines={1}
                style={styles.value}
            >
                {value}
            </Text>
        </View>
    );
}

const styles =
    StyleSheet.create({
        card: {
            borderRadius: 24,
            borderWidth: 1,

            borderColor:
                'rgba(255,255,255,0.07)',

            backgroundColor:
                '#111114',

            padding: 20,
        },

        eyebrow: {
            color: '#52525B',

            fontSize: 8,
            fontWeight: '900',

            letterSpacing: 1.5,
        },

        heading: {
            color: '#D4D4D8',

            fontSize: 12,
            fontWeight: '900',

            marginTop: 5,
        },

        stats: {
            flexDirection: 'row',

            gap: 7,

            marginTop: 16,
        },

        stat: {
            flex: 1,

            minWidth: 0,

            borderRadius: 13,
            borderWidth: 1,

            borderColor:
                'rgba(255,255,255,0.05)',

            backgroundColor:
                'rgba(255,255,255,0.02)',

            paddingVertical: 12,
            paddingHorizontal: 9,
        },

        label: {
            color: '#52525B',

            fontSize: 6,
            fontWeight: '900',

            letterSpacing: 0.8,
        },

        value: {
            color: '#D4D4D8',

            fontSize: 13,
            fontWeight: '900',

            marginTop: 6,
        },
    });