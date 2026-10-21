import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

type Props = {
    current: number;
    total: number;
    label?: string;
};

export default function QuizProgress({
    current,
    total,
    label = 'Progress',
}: Props) {
    const safeTotal =
        Math.max(total, 1);

    const safeCurrent =
        Math.max(
            0,
            Math.min(current, safeTotal - 1)
        );

    const percentage =
        ((safeCurrent + 1) / safeTotal) *
        100;

    return (
        <View style={styles.container}>
            {/* TEXT */}

            <View>
                <Text style={styles.label}>
                    {label.toUpperCase()}
                </Text>

                <Text style={styles.value}>
                    {safeCurrent + 1} of {total}
                </Text>
            </View>

            {/* INDICATOR */}

            {total <= 12 ? (
                <View style={styles.dots}>
                    {Array.from({
                        length: total,
                    }).map((_, index) => {
                        const isCurrent =
                            index === safeCurrent;

                        const isComplete =
                            index < safeCurrent;

                        return (
                            <View
                                key={index}
                                style={[
                                    styles.dot,

                                    isComplete &&
                                    styles.dotComplete,

                                    isCurrent &&
                                    styles.dotCurrent,
                                ]}
                            />
                        );
                    })}
                </View>
            ) : (
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            {
                                width: `${percentage}%`,
                            },
                        ]}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 29,

        paddingTop: 18,

        borderTopWidth: 1,
        borderTopColor:
            'rgba(255,255,255,0.05)',

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    label: {
        color: '#3F3F46',

        fontSize: 7.5,
        fontWeight: '900',

        letterSpacing: 1.2,
    },

    value: {
        color: '#52525B',

        fontSize: 10,
        fontWeight: '600',

        marginTop: 5,
    },

    dots: {
        maxWidth: '58%',

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',

        gap: 4,
    },

    dot: {
        width: 6,
        height: 6,

        borderRadius: 4,

        backgroundColor: '#27272A',
    },

    dotComplete: {
        backgroundColor:
            'rgba(139,92,246,0.40)',
    },

    dotCurrent: {
        width: 20,

        backgroundColor: '#8B5CF6',
    },

    progressBar: {
        width: 150,
        maxWidth: '55%',

        height: 6,

        overflow: 'hidden',

        borderRadius: 5,

        backgroundColor: '#18181B',
    },

    progressFill: {
        height: '100%',

        borderRadius: 5,

        backgroundColor: '#8B5CF6',
    },
});