import {
    ActivityIndicator,
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';

type Props = {
    title: string;
    description: string;
};

export default function QuizLoading({
    title,
    description,
}: Props) {
    return (
        <SafeAreaView style={styles.screen}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="#09090B"
            />

            {/* BACKGROUND */}

            <View
                pointerEvents="none"
                style={styles.glow}
            />

            <View style={styles.content}>
                {/* LOGO */}

                <Image
                    source={require('../../../assets/images/quiztians-q.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                {/* LOADER */}

                <View style={styles.loaderContainer}>
                    <View style={styles.loaderGlow}>
                        <ActivityIndicator
                            size="large"
                            color="#8B5CF6"
                        />
                    </View>
                </View>

                {/* TEXT */}

                <Text style={styles.title}>
                    {title}
                </Text>

                <Text style={styles.description}>
                    {description}
                </Text>

                {/* LOADING BAR */}

                <View style={styles.loadingBar}>
                    <View style={styles.loadingBarFill} />
                </View>

                <Text style={styles.brand}>
                    QUIZTIANS · Learn • Play • Compete
                </Text>
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

        paddingHorizontal: 22,
    },

    glow: {
        position: 'absolute',

        width: 340,
        height: 340,

        borderRadius: 170,

        backgroundColor:
            'rgba(109,40,217,0.10)',
    },

    content: {
        width: '100%',
        maxWidth: 380,

        alignItems: 'center',
    },

    logo: {
        width: 46,
        height: 46,
    },

    loaderContainer: {
        width: 135,
        height: 135,

        alignItems: 'center',
        justifyContent: 'center',

        marginTop: 15,
    },

    loaderGlow: {
        width: 82,
        height: 82,

        borderRadius: 41,

        alignItems: 'center',
        justifyContent: 'center',

        borderWidth: 1,
        borderColor:
            'rgba(139,92,246,0.08)',

        backgroundColor:
            'rgba(139,92,246,0.035)',
    },

    title: {
        color: '#FFFFFF',

        fontSize: 20,
        fontWeight: '900',

        letterSpacing: -0.5,

        textAlign: 'center',

        marginTop: 4,
    },

    description: {
        color: '#52525B',

        fontSize: 11,
        fontWeight: '500',

        textAlign: 'center',

        marginTop: 8,
    },

    loadingBar: {
        width: 130,
        height: 4,

        overflow: 'hidden',

        borderRadius: 5,

        backgroundColor:
            'rgba(255,255,255,0.05)',

        marginTop: 25,
    },

    loadingBarFill: {
        width: '55%',
        height: '100%',

        borderRadius: 5,

        backgroundColor: '#8B5CF6',
    },

    brand: {
        color: '#27272A',

        fontSize: 8,
        fontWeight: '600',

        letterSpacing: 0.5,

        marginTop: 28,
    },
});