import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

type SummaryType =
    | 'correct'
    | 'incorrect'
    | 'skipped';

type Props = {
    value: number;
    label: string;
    type: SummaryType;
};

export default function ReviewSummaryCard({
    value,
    label,
    type,
}: Props) {
    const config = getConfig(type);

    return (
        <View style={styles.card}>
            <View
                style={[
                    styles.iconBox,
                    {
                        borderColor:
                            config.border,

                        backgroundColor:
                            config.background,
                    },
                ]}
            >
                <Text
                    style={[
                        styles.icon,
                        {
                            color: config.color,
                        },
                    ]}
                >
                    {config.icon}
                </Text>
            </View>

            <Text
                style={[
                    styles.value,
                    {
                        color: config.color,
                    },
                ]}
            >
                {value}
            </Text>

            <Text
                style={styles.label}
                numberOfLines={1}
            >
                {label}
            </Text>
        </View>
    );
}

function getConfig(
    type: SummaryType
) {
    switch (type) {
        case 'correct':
            return {
                icon: '✓',
                color: '#34D399',
                border:
                    'rgba(16,185,129,0.20)',
                background:
                    'rgba(16,185,129,0.08)',
            };

        case 'incorrect':
            return {
                icon: '×',
                color: '#F87171',
                border:
                    'rgba(239,68,68,0.20)',
                background:
                    'rgba(239,68,68,0.08)',
            };

        default:
            return {
                icon: '—',
                color: '#A1A1AA',
                border:
                    'rgba(255,255,255,0.07)',
                background:
                    'rgba(255,255,255,0.03)',
            };
    }
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        minWidth: 0,
        minHeight: 112,
        padding: 13,
        borderRadius: 18,
        borderWidth: 1,
        borderColor:
            'rgba(255,255,255,0.07)',
        backgroundColor: '#111114',
    },

    iconBox: {
        width: 30,
        height: 30,
        borderRadius: 9,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    icon: {
        fontSize: 12,
        fontWeight: '900',
    },

    value: {
        marginTop: 12,
        fontSize: 23,
        fontWeight: '900',
        letterSpacing: -0.7,
    },

    label: {
        marginTop: 2,
        color: '#3F3F46',
        fontSize: 7,
        fontWeight: '900',
        letterSpacing: 0.8,
        textTransform: 'uppercase',
    },
});