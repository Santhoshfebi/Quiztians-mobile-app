import {
    ActivityIndicator,
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function ReviewLoading() {
    return (
        <SafeAreaView style={styles.screen}>
            <StatusBar
                barStyle="light-content"
            />

            <View
                pointerEvents="none"
                style={styles.glow}
            />

            <View style={styles.content}>
                <Image
                    source={require(
                        '../../../assets/images/quiztians-q.png'
                    )}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <View style={styles.loader}>
                    <ActivityIndicator
                        size="large"
                        color="#8B5CF6"
                    />
                </View>

                <Text style={styles.title}>
                    Loading your answers
                </Text>

                <Text style={styles.description}>
                    Preparing your review...
                </Text>

                <View style={styles.track}>
                    <View style={styles.bar} />
                </View>
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
            'rgba(109,40,217,0.10)',
    },

    content: {
        width: '100%',
        alignItems: 'center',
    },

    logo: {
        width: 42,
        height: 42,
    },

    loader: {
        width: 125,
        height: 125,
        borderRadius: 63,
        marginTop: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor:
            'rgba(139,92,246,0.10)',
        backgroundColor:
            'rgba(139,92,246,0.035)',
    },

    title: {
        color: '#D4D4D8',
        fontSize: 15,
        fontWeight: '900',
        marginTop: 18,
    },

    description: {
        color: '#3F3F46',
        fontSize: 10,
        fontWeight: '500',
        marginTop: 6,
    },

    track: {
        width: 112,
        height: 4,
        marginTop: 20,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor:
            'rgba(255,255,255,0.05)',
    },

    bar: {
        width: '55%',
        height: '100%',
        borderRadius: 10,
        backgroundColor: '#8B5CF6',
    },
});