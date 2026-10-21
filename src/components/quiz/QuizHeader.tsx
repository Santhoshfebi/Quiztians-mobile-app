import {
    Image,
    StyleSheet,
    Text,
    View,
} from 'react-native';

type Props = {
    timeLeft: number;
    totalTime: number;
    warning?: boolean;
};

export default function QuizHeader({
    timeLeft,
    totalTime,
    warning = false,
}: Props) {
    const percentage =
        totalTime > 0
            ? Math.max(
                0,
                Math.min(
                    (timeLeft / totalTime) * 100,
                    100
                )
            )
            : 0;

    return (
        <View style={styles.wrapper}>
            <View style={styles.header}>
                <View style={styles.brand}>
                    <Image
                        source={require('../../../assets/images/quiztians-q.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    <View style={styles.brandContent}>
                        <Image
                            source={require('../../../assets/images/quiztians-wordmark.png')}
                            style={styles.wordmark}
                            resizeMode="contain"
                        />

                        <Text style={styles.tagline}>
                            LEARN • PLAY • COMPETE
                        </Text>
                    </View>
                </View>

                <View
                    style={[
                        styles.timer,
                        warning && styles.timerWarning,
                    ]}
                >
                    <Text
                        style={[
                            styles.clock,
                            warning &&
                            styles.warningText,
                        ]}
                    >
                        ◷
                    </Text>

                    <Text
                        style={[
                            styles.time,
                            warning &&
                            styles.warningText,
                        ]}
                    >
                        {formatTime(timeLeft)}
                    </Text>
                </View>
            </View>

            <View style={styles.timerProgress}>
                <View
                    style={[
                        styles.timerProgressFill,

                        warning &&
                        styles.timerProgressWarning,

                        {
                            width: `${percentage}%`,
                        },
                    ]}
                />
            </View>
        </View>
    );
}

function formatTime(seconds: number) {
    const safeSeconds = Math.max(
        0,
        seconds
    );

    const minutes = Math.floor(
        safeSeconds / 60
    );

    const remainingSeconds =
        safeSeconds % 60;

    return `${minutes}:${String(
        remainingSeconds
    ).padStart(2, '0')}`;
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor:
            'rgba(9,9,11,0.98)',

        borderBottomWidth: 1,
        borderBottomColor:
            'rgba(255,255,255,0.06)',
    },

    header: {
        minHeight: 67,

        paddingHorizontal: 16,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    brand: {
        flex: 1,

        flexDirection: 'row',
        alignItems: 'center',
    },

    logo: {
        width: 35,
        height: 35,
    },

    brandContent: {
        flex: 1,

        marginLeft: 8,
    },

    wordmark: {
        width: 105,
        height: 27,
    },

    tagline: {
        color: '#3F3F46',

        fontSize: 6,
        fontWeight: '900',

        letterSpacing: 1,

        marginTop: -1,
    },

    timer: {
        minWidth: 88,

        minHeight: 39,

        paddingHorizontal: 12,

        borderRadius: 12,

        borderWidth: 1,
        borderColor:
            'rgba(255,255,255,0.07)',

        backgroundColor:
            'rgba(255,255,255,0.03)',

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    timerWarning: {
        borderColor:
            'rgba(239,68,68,0.20)',

        backgroundColor:
            'rgba(239,68,68,0.08)',
    },

    clock: {
        color: '#71717A',

        fontSize: 16,

        marginRight: 7,
    },

    time: {
        color: '#E4E4E7',

        fontSize: 14,
        fontWeight: '900',

        fontVariant: ['tabular-nums'],
    },

    warningText: {
        color: '#F87171',
    },

    timerProgress: {
        height: 3,

        backgroundColor:
            'rgba(255,255,255,0.035)',
    },

    timerProgressFill: {
        height: '100%',

        backgroundColor: '#8B5CF6',
    },

    timerProgressWarning: {
        backgroundColor: '#EF4444',
    },
});