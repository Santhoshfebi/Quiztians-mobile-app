import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

type Props = {
    count: number;
    maxWarnings: number;
};

export default function WarningBanner({
    count,
    maxWarnings,
}: Props) {
    if (
        count <= 0 ||
        count >= maxWarnings
    ) {
        return null;
    }

    const finalWarning =
        count === maxWarnings - 1;

    return (
        <View
            style={[
                styles.container,

                finalWarning &&
                styles.finalContainer,
            ]}
        >
            <View
                style={[
                    styles.icon,

                    finalWarning &&
                    styles.finalIcon,
                ]}
            >
                <Text
                    style={[
                        styles.iconText,

                        finalWarning &&
                        styles.finalText,
                    ]}
                >
                    !
                </Text>
            </View>

            <View style={styles.content}>
                <Text
                    style={[
                        styles.title,

                        finalWarning &&
                        styles.finalText,
                    ]}
                >
                    {finalWarning
                        ? 'Final warning'
                        : `Warning ${count}/${maxWarnings - 1}`}
                </Text>

                <Text style={styles.description}>
                    Leaving the quiz repeatedly
                    will automatically submit your
                    attempt on the {maxWarnings}th
                    time.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 17,

        borderWidth: 1,
        borderColor:
            'rgba(249,115,22,0.20)',

        backgroundColor:
            'rgba(249,115,22,0.06)',

        padding: 14,

        flexDirection: 'row',

        marginBottom: 20,
    },

    finalContainer: {
        borderColor:
            'rgba(239,68,68,0.30)',

        backgroundColor:
            'rgba(239,68,68,0.09)',
    },

    icon: {
        width: 33,
        height: 33,

        borderRadius: 11,

        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor:
            'rgba(249,115,22,0.10)',

        marginRight: 11,
    },

    finalIcon: {
        backgroundColor:
            'rgba(239,68,68,0.10)',
    },

    iconText: {
        color: '#FB923C',

        fontWeight: '900',
    },

    content: {
        flex: 1,
    },

    title: {
        color: '#FB923C',

        fontSize: 11,
        fontWeight: '900',
    },

    finalText: {
        color: '#F87171',
    },

    description: {
        color: '#71717A',

        fontSize: 10,
        lineHeight: 17,

        marginTop: 4,
    },
});