import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export type ReviewFilter =
    | 'all'
    | 'correct'
    | 'incorrect'
    | 'not_attempted';

type Props = {
    active: ReviewFilter;

    onChange: (
        filter: ReviewFilter
    ) => void;

    total: number;
    correct: number;
    incorrect: number;
    skipped: number;
};

export default function ReviewFilters({
    active,
    onChange,
    total,
    correct,
    incorrect,
    skipped,
}: Props) {
    const filters: {
        id: ReviewFilter;
        label: string;
        count: number;
    }[] = [
            {
                id: 'all',
                label: 'All',
                count: total,
            },
            {
                id: 'correct',
                label: 'Correct',
                count: correct,
            },
            {
                id: 'incorrect',
                label: 'Incorrect',
                count: incorrect,
            },
            {
                id: 'not_attempted',
                label: 'Skipped',
                count: skipped,
            },
        ];

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
                false
            }
            contentContainerStyle={
                styles.content
            }
        >
            {filters.map((item) => {
                const selected =
                    active === item.id;

                return (
                    <Pressable
                        key={item.id}
                        onPress={() =>
                            onChange(item.id)
                        }
                        style={({ pressed }) => [
                            styles.button,

                            selected &&
                            styles.buttonActive,

                            pressed &&
                            styles.pressed,
                        ]}
                    >
                        <Text
                            style={[
                                styles.label,

                                selected &&
                                styles.labelActive,
                            ]}
                        >
                            {item.label}
                        </Text>

                        <View
                            style={[
                                styles.count,

                                selected &&
                                styles.countActive,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.countText,

                                    selected &&
                                    styles.countTextActive,
                                ]}
                            >
                                {item.count}
                            </Text>
                        </View>
                    </Pressable>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    content: {
        gap: 8,
        paddingRight: 16,
    },

    pressed: {
        opacity: 0.8,
    },

    button: {
        minHeight: 42,
        paddingHorizontal: 14,
        borderRadius: 13,
        borderWidth: 1,
        borderColor:
            'rgba(255,255,255,0.06)',
        backgroundColor:
            'rgba(255,255,255,0.025)',
        flexDirection: 'row',
        alignItems: 'center',
    },

    buttonActive: {
        borderColor:
            'rgba(139,92,246,0.20)',
        backgroundColor:
            'rgba(139,92,246,0.10)',
    },

    label: {
        color: '#52525B',
        fontSize: 10,
        fontWeight: '900',
    },

    labelActive: {
        color: '#C4B5FD',
    },

    count: {
        minWidth: 22,
        height: 20,
        paddingHorizontal: 5,
        marginLeft: 8,
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:
            'rgba(255,255,255,0.04)',
    },

    countActive: {
        backgroundColor:
            'rgba(139,92,246,0.12)',
    },

    countText: {
        color: '#3F3F46',
        fontSize: 8,
        fontWeight: '900',
    },

    countTextActive: {
        color: '#A78BFA',
    },
});