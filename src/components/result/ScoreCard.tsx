import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

type Props = {
    score: number;
    total: number;
};

export default function ScoreCard({
    score,
    total,
}: Props) {
    const percentage =
        total > 0
            ? Math.round(
                (score / total) * 100
            )
            : 0;

    return (
        <View style={styles.card}>
            <View style={styles.row}>
                <View>
                    <Text style={styles.label}>
                        SCORE
                    </Text>

                    <View style={styles.scoreRow}>
                        <Text style={styles.score}>
                            {score}
                        </Text>

                        <Text style={styles.total}>
                            / {total}
                        </Text>
                    </View>
                </View>

                <View style={styles.accuracy}>
                    <Text style={styles.label}>
                        ACCURACY
                    </Text>

                    <Text
                        style={[
                            styles.percentage,

                            percentage === 100 &&
                            styles.perfect,
                        ]}
                    >
                        {percentage}%
                    </Text>
                </View>
            </View>

            <View style={styles.progressTrack}>
                <View
                    style={[
                        styles.progress,

                        percentage === 100 &&
                        styles.progressPerfect,

                        {
                            width: `${Math.min(
                                100,
                                Math.max(
                                    0,
                                    percentage
                                )
                            )}%`,
                        },
                    ]}
                />
            </View>
        </View>
    );
}

const styles =
    StyleSheet.create({
        card: {
            marginTop: 26,
            padding: 20,
            borderRadius: 23,
            borderWidth: 1,
            borderColor:
                'rgba(255,255,255,0.07)',
            backgroundColor:
                'rgba(255,255,255,0.025)',
        },

        row: {
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent:
                'space-between',
        },

        label: {
            color: '#52525B',
            fontSize: 8,
            fontWeight: '900',
            letterSpacing: 1.4,
        },

        scoreRow: {
            flexDirection: 'row',
            alignItems: 'baseline',
            marginTop: 4,
        },

        score: {
            color: '#FFFFFF',
            fontSize: 52,
            fontWeight: '900',
            letterSpacing: -3,
        },

        total: {
            color: '#3F3F46',
            fontSize: 18,
            fontWeight: '900',
            marginLeft: 5,
        },

        accuracy: {
            alignItems: 'flex-end',
        },

        percentage: {
            color: '#A78BFA',
            fontSize: 25,
            fontWeight: '900',
            marginTop: 6,
        },

        perfect: {
            color: '#34D399',
        },

        progressTrack: {
            height: 6,
            borderRadius: 10,
            overflow: 'hidden',
            marginTop: 18,
            backgroundColor:
                'rgba(255,255,255,0.05)',
        },

        progress: {
            height: '100%',
            borderRadius: 10,
            backgroundColor: '#8B5CF6',
        },

        progressPerfect: {
            backgroundColor: '#10B981',
        },
    });