import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

type Props = {
    number: number;
    question: string;
    chooseText: string;
};

export default function QuestionCard({
    number,
    question,
    chooseText,
}: Props) {
    return (
        <View style={styles.card}>
            <View style={styles.glow} />

            <View style={styles.numberBox}>
                <Text style={styles.number}>
                    {String(number).padStart(
                        2,
                        '0'
                    )}
                </Text>
            </View>

            <Text style={styles.question}>
                {question}
            </Text>

            <View style={styles.helper}>
                <View style={styles.dot} />

                <Text style={styles.helperText}>
                    {chooseText.toUpperCase()}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        position: 'relative',

        overflow: 'hidden',

        borderRadius: 26,

        borderWidth: 1,
        borderColor:
            'rgba(255,255,255,0.08)',

        backgroundColor: '#111114',

        padding: 20,
    },

    glow: {
        position: 'absolute',

        width: 180,
        height: 180,

        borderRadius: 90,

        right: -90,
        top: -90,

        backgroundColor:
            'rgba(124,58,237,0.06)',
    },

    numberBox: {
        alignSelf: 'flex-start',

        minWidth: 38,
        height: 38,

        paddingHorizontal: 8,

        borderRadius: 12,

        borderWidth: 1,
        borderColor:
            'rgba(139,92,246,0.15)',

        backgroundColor:
            'rgba(139,92,246,0.08)',

        alignItems: 'center',
        justifyContent: 'center',
    },

    number: {
        color: '#A78BFA',

        fontSize: 12,
        fontWeight: '900',
    },

    question: {
        color: '#F4F4F5',

        fontSize: 18,
        lineHeight: 28,

        fontWeight: '700',

        marginTop: 20,
    },

    helper: {
        flexDirection: 'row',
        alignItems: 'center',

        marginTop: 20,
    },

    dot: {
        width: 4,
        height: 4,

        borderRadius: 2,

        backgroundColor: '#3F3F46',

        marginRight: 8,
    },

    helperText: {
        color: '#3F3F46',

        fontSize: 8,
        fontWeight: '800',

        letterSpacing: 1.2,
    },
});