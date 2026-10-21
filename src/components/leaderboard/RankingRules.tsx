import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function RankingRules() {
    return (
        <View style={styles.card}>
            <View style={styles.iconBox}>
                <Text style={styles.icon}>
                    i
                </Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.label}>
                    HOW RANKING WORKS
                </Text>

                <Text style={styles.description}>
                    Ties are resolved by highest score,
                    then fastest completion time, then
                    earliest submission.
                </Text>

                <View style={styles.flow}>
                    <Rule text="Score" />

                    <Text style={styles.arrow}>
                        →
                    </Text>

                    <Rule text="Time" />

                    <Text style={styles.arrow}>
                        →
                    </Text>

                    <Rule text="Submission" />
                </View>
            </View>
        </View>
    );
}

function Rule({
    text,
}: {
    text: string;
}) {
    return (
        <View style={styles.rule}>
            <Text style={styles.ruleText}>
                {text}
            </Text>
        </View>
    );
}

const styles =
    StyleSheet.create({
        card: {
            borderRadius: 20,
            borderWidth: 1,

            borderColor:
                'rgba(255,255,255,0.06)',

            backgroundColor:
                'rgba(255,255,255,0.02)',

            padding: 16,

            flexDirection: 'row',
            alignItems: 'flex-start',
        },

        iconBox: {
            width: 33,
            height: 33,

            borderRadius: 11,
            borderWidth: 1,

            borderColor:
                'rgba(139,92,246,0.15)',

            backgroundColor:
                'rgba(139,92,246,0.06)',

            alignItems: 'center',
            justifyContent: 'center',

            marginRight: 12,
        },

        icon: {
            color: '#A78BFA',

            fontSize: 13,
            fontWeight: '900',
        },

        content: {
            flex: 1,
        },

        label: {
            color: '#52525B',

            fontSize: 8,
            fontWeight: '900',

            letterSpacing: 1.3,
        },

        description: {
            color: '#52525B',

            fontSize: 10,
            lineHeight: 19,

            marginTop: 8,
        },

        flow: {
            flexDirection: 'row',
            flexWrap: 'wrap',

            alignItems: 'center',

            gap: 7,

            marginTop: 12,
        },

        rule: {
            borderRadius: 8,
            borderWidth: 1,

            borderColor:
                'rgba(255,255,255,0.06)',

            backgroundColor:
                'rgba(255,255,255,0.025)',

            paddingHorizontal: 9,
            paddingVertical: 6,
        },

        ruleText: {
            color: '#71717A',

            fontSize: 8,
            fontWeight: '900',
        },

        arrow: {
            color: '#27272A',
            fontSize: 11,
        },
    });