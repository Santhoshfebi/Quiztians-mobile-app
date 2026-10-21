import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function ResultTips() {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.iconBox}>
                    <Text style={styles.icon}>
                        ♢
                    </Text>
                </View>

                <View>
                    <Text style={styles.title}>
                        Tips to improve
                    </Text>

                    <Text style={styles.subtitle}>
                        KEEP CLIMBING
                    </Text>
                </View>
            </View>

            <View style={styles.tips}>
                <Tip
                    number="01"
                    text="Review incorrect answers right away."
                />

                <Tip
                    number="02"
                    text="Revisit chapter notes and try scoring more in the next chapters."
                />

                <Tip
                    number="03"
                    text="Practice with friends to improve speed and accuracy."
                />
            </View>
        </View>
    );
}

function Tip({
    number,
    text,
}: {
    number: string;
    text: string;
}) {
    return (
        <View style={styles.tip}>
            <Text style={styles.number}>
                {number}
            </Text>

            <Text style={styles.text}>
                {text}
            </Text>
        </View>
    );
}

const styles =
    StyleSheet.create({
        card: {
            marginTop: 15,
            padding: 18,
            borderRadius: 23,
            borderWidth: 1,
            borderColor:
                'rgba(255,255,255,0.07)',
            backgroundColor: '#111114',
        },

        header: {
            flexDirection: 'row',
            alignItems: 'center',
        },

        iconBox: {
            width: 35,
            height: 35,
            borderRadius: 11,
            borderWidth: 1,
            borderColor:
                'rgba(139,92,246,0.15)',
            backgroundColor:
                'rgba(139,92,246,0.06)',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
        },

        icon: {
            color: '#A78BFA',
            fontSize: 16,
            fontWeight: '900',
        },

        title: {
            color: '#D4D4D8',
            fontSize: 12,
            fontWeight: '900',
        },

        subtitle: {
            color: '#3F3F46',
            fontSize: 7,
            fontWeight: '800',
            letterSpacing: 1,
            marginTop: 3,
        },

        tips: {
            marginTop: 17,
            gap: 13,
        },

        tip: {
            flexDirection: 'row',
            alignItems: 'flex-start',
        },

        number: {
            width: 28,
            color:
                'rgba(139,92,246,0.60)',
            fontSize: 8,
            fontWeight: '900',
        },

        text: {
            flex: 1,
            color: '#52525B',
            fontSize: 10,
            lineHeight: 17,
        },
    });