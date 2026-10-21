import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

type Props = {
    label: string;
    option: string;

    selected: boolean;
    correct: boolean;

    revealed: boolean;
    disabled?: boolean;

    onPress: () => void;
};

export default function AnswerOption({
    label,
    option,

    selected,
    correct,

    revealed,
    disabled = false,

    onPress,
}: Props) {
    const wrong =
        revealed &&
        selected &&
        !correct;

    const right =
        revealed && correct;

    const faded =
        revealed &&
        !correct &&
        !selected;

    return (
        <Pressable
            disabled={disabled}
            onPress={onPress}
            style={({ pressed }) => [
                styles.option,

                right &&
                styles.correctOption,

                wrong &&
                styles.wrongOption,

                faded &&
                styles.fadedOption,

                pressed &&
                !disabled &&
                styles.pressed,
            ]}
        >
            <View
                style={[
                    styles.letter,

                    right &&
                    styles.correctLetter,

                    wrong &&
                    styles.wrongLetter,
                ]}
            >
                <Text
                    style={[
                        styles.letterText,

                        (right || wrong) &&
                        styles.activeLetterText,
                    ]}
                >
                    {right
                        ? '✓'
                        : wrong
                            ? '×'
                            : label}
                </Text>
            </View>

            <Text
                style={[
                    styles.optionText,

                    right &&
                    styles.correctText,

                    wrong &&
                    styles.wrongText,

                    faded &&
                    styles.fadedText,
                ]}
            >
                {option}
            </Text>

            {!revealed && (
                <View style={styles.selectCircle}>
                    <View
                        style={
                            styles.selectCircleInner
                        }
                    />
                </View>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    option: {
        minHeight: 65,

        borderRadius: 17,

        borderWidth: 1,
        borderColor:
            'rgba(255,255,255,0.07)',

        backgroundColor: '#111114',

        padding: 13,

        flexDirection: 'row',
        alignItems: 'center',

        marginBottom: 10,
    },

    pressed: {
        transform: [
            {
                scale: 0.985,
            },
        ],

        borderColor:
            'rgba(139,92,246,0.25)',

        backgroundColor:
            'rgba(139,92,246,0.035)',
    },

    letter: {
        width: 38,
        height: 38,

        borderRadius: 12,

        borderWidth: 1,
        borderColor:
            'rgba(255,255,255,0.07)',

        backgroundColor:
            'rgba(255,255,255,0.03)',

        alignItems: 'center',
        justifyContent: 'center',

        marginRight: 12,
    },

    letterText: {
        color: '#71717A',

        fontSize: 12,
        fontWeight: '900',
    },

    optionText: {
        flex: 1,

        color: '#D4D4D8',

        fontSize: 13,
        lineHeight: 20,

        fontWeight: '600',
    },

    selectCircle: {
        width: 20,
        height: 20,

        borderRadius: 10,

        borderWidth: 1,
        borderColor:
            'rgba(255,255,255,0.08)',

        alignItems: 'center',
        justifyContent: 'center',

        marginLeft: 8,
    },

    selectCircleInner: {
        width: 6,
        height: 6,

        borderRadius: 3,

        backgroundColor:
            'transparent',
    },

    correctOption: {
        borderColor:
            'rgba(16,185,129,0.30)',

        backgroundColor:
            'rgba(16,185,129,0.09)',
    },

    correctLetter: {
        borderColor:
            'rgba(16,185,129,0.30)',

        backgroundColor: '#10B981',
    },

    correctText: {
        color: '#D1FAE5',
    },

    wrongOption: {
        borderColor:
            'rgba(239,68,68,0.30)',

        backgroundColor:
            'rgba(239,68,68,0.09)',
    },

    wrongLetter: {
        borderColor:
            'rgba(239,68,68,0.30)',

        backgroundColor: '#EF4444',
    },

    wrongText: {
        color: '#FEE2E2',
    },

    activeLetterText: {
        color: '#FFFFFF',
    },

    fadedOption: {
        opacity: 0.45,
    },

    fadedText: {
        color: '#52525B',
    },
});