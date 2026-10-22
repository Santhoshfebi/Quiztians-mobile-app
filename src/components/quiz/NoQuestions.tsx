import { router } from 'expo-router';

import {
    Pressable,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';

type Props = {
    title: string;
    description: string;
    buttonText: string;
    onBack?: () => void;
};

export default function NoQuestions({
    title,
    description,
    buttonText,
    onBack,
}: Props) {
    function handleBack() {
        if (onBack) {
            onBack();
            return;
        }

        router.replace('/');
    }

    return (
        <SafeAreaView style={styles.screen}>
            <StatusBar
                barStyle="light-content"               
            />

            {/* BACKGROUND GLOW */}

            <View
                pointerEvents="none"
                style={styles.glow}
            />

            {/* CARD */}

            <View style={styles.card}>
                <View style={styles.iconBox}>
                    <Text style={styles.icon}>!</Text>
                </View>

                <Text style={styles.title}>
                    {title}
                </Text>

                <Text style={styles.description}>
                    {description}
                </Text>

                <Pressable
                    onPress={handleBack}
                    style={({ pressed }) => [
                        styles.button,
                        pressed && styles.buttonPressed,
                    ]}
                >
                    <Text style={styles.buttonText}>
                        {buttonText}
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,

        backgroundColor: '#09090B',

        alignItems: 'center',
        justifyContent: 'center',

        paddingHorizontal: 20,
    },

    glow: {
        position: 'absolute',

        width: 330,
        height: 330,

        borderRadius: 165,

        backgroundColor:
            'rgba(185,28,28,0.06)',
    },

    card: {
        width: '100%',
        maxWidth: 390,

        padding: 24,

        borderRadius: 26,

        borderWidth: 1,
        borderColor:
            'rgba(255,255,255,0.08)',

        backgroundColor: '#111114',

        alignItems: 'center',
    },

    iconBox: {
        width: 50,
        height: 50,

        borderRadius: 16,

        borderWidth: 1,
        borderColor:
            'rgba(239,68,68,0.15)',

        backgroundColor:
            'rgba(239,68,68,0.07)',

        alignItems: 'center',
        justifyContent: 'center',
    },

    icon: {
        color: '#F87171',

        fontSize: 18,
        fontWeight: '900',
    },

    title: {
        color: '#FFFFFF',

        fontSize: 20,
        fontWeight: '900',

        textAlign: 'center',

        letterSpacing: -0.4,

        marginTop: 20,
    },

    description: {
        color: '#71717A',

        fontSize: 11,
        lineHeight: 19,

        textAlign: 'center',

        marginTop: 8,
    },

    button: {
        width: '100%',
        minHeight: 53,

        borderRadius: 17,

        backgroundColor: '#7C3AED',

        alignItems: 'center',
        justifyContent: 'center',

        marginTop: 24,
    },

    buttonPressed: {
        opacity: 0.85,

        transform: [
            {
                scale: 0.985,
            },
        ],
    },

    buttonText: {
        color: '#FFFFFF',

        fontSize: 13,
        fontWeight: '900',
    },
});