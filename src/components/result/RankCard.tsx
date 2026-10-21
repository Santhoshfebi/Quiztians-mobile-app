import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

type Props = {
    rank: number | null;
    timeTaken: number;
};

export default function RankCard({
    rank,
    timeTaken,
}: Props) {
    return (
        <View style={styles.row}>
            <View style={styles.card}>
                <View style={styles.iconBox}>
                    <Text style={styles.icon}>
                        🏆
                    </Text>
                </View>

                <Text style={styles.label}>
                    RANK
                </Text>

                <Text style={styles.value}>
                    {rank ? `#${rank}` : '—'}
                </Text>
            </View>

            <View style={styles.card}>
                <View
                    style={[
                        styles.iconBox,
                        styles.timeIconBox,
                    ]}
                >
                    <Text style={styles.icon}>
                        ⏱
                    </Text>
                </View>

                <Text style={styles.label}>
                    TIME TAKEN
                </Text>

                <Text
                    style={styles.timeValue}
                >
                    {formatTime(timeTaken)}
                </Text>
            </View>
        </View>
    );
}

function formatTime(
    seconds: number
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
        row: {
            flexDirection: 'row',
            gap: 10,
            marginTop: 12,
        },

        card: {
            flex: 1,
            minHeight: 135,
            padding: 15,
            borderRadius: 18,
            borderWidth: 1,
            borderColor:
                'rgba(255,255,255,0.07)',
            backgroundColor:
                'rgba(255,255,255,0.025)',
        },

        iconBox: {
            width: 34,
            height: 34,
            borderRadius: 11,
            backgroundColor:
                'rgba(139,92,246,0.08)',
            borderWidth: 1,
            borderColor:
                'rgba(139,92,246,0.15)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 13,
        },

        timeIconBox: {
            backgroundColor:
                'rgba(99,102,241,0.08)',
            borderColor:
                'rgba(99,102,241,0.15)',
        },

        icon: {
            fontSize: 14,
        },

        label: {
            color: '#52525B',
            fontSize: 8,
            fontWeight: '900',
            letterSpacing: 1.2,
        },

        value: {
            color: '#FFFFFF',
            fontSize: 27,
            fontWeight: '900',
            marginTop: 5,
            letterSpacing: -0.7,
        },

        timeValue: {
            color: '#FFFFFF',
            fontSize: 19,
            fontWeight: '900',
            marginTop: 7,
        },
    });