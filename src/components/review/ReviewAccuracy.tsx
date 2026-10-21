import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

type Props = {
    correct: number;
    total: number;
};

export default function ReviewAccuracy({
    correct,
    total,
}: Props) {
    const accuracy =
        total > 0
            ? Math.round(
                (correct / total) * 100
            )
            : 0;

    const color =
        accuracy >= 80
            ? '#34D399'
            : accuracy >= 50
                ? '#A78BFA'
                : '#A1A1AA';

    return (
        <View style={styles.card}>
            <View style={styles.row}>
                <View style={styles.flex}>
                    <Text style={styles.label}>
                        OVERALL ACCURACY
                    </Text>

                    <Text style={styles.subtitle}>
                        {correct} correct out of{' '}
                        {total}
                    </Text>
                </View>

                <Text
                    style={[
                        styles.percentage,
                        { color },
                    ]}
                >
                    {accuracy}%
                </Text>
            </View>

            <View style={styles.track}>
                <View
                    style={[
                        styles.progress,
                        {
                            width: `${Math.max(
                                0,
                                Math.min(
                                    100,
                                    accuracy
                                )
                            )}%`,

                            backgroundColor:
                                accuracy >= 80
                                    ? '#10B981'
                                    : '#8B5CF6',
                        },
                    ]}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        marginTop: 11,
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor:
            'rgba(255,255,255,0.06)',
        backgroundColor: '#111114',
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:
            'space-between',
    },

    flex: {
        flex: 1,
        paddingRight: 12,
    },

    label: {
        color: '#3F3F46',
        fontSize: 8,
        fontWeight: '900',
        letterSpacing: 1.2,
    },

    subtitle: {
        color: '#52525B',
        fontSize: 10,
        fontWeight: '600',
        marginTop: 5,
    },

    percentage: {
        fontSize: 22,
        fontWeight: '900',
    },

    track: {
        height: 6,
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 14,
        backgroundColor:
            'rgba(255,255,255,0.05)',
    },

    progress: {
        height: '100%',
        borderRadius: 10,
    },
});