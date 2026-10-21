import {
    ActivityIndicator,
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function ResultLoading() {
    return (
        <SafeAreaView style={styles.screen}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="#09090B"
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

                <View style={styles.loaderBox}>
                    <ActivityIndicator
                        size="large"
                        color="#8B5CF6"
                    />
                </View>

                <Text style={styles.title}>
                    Calculating your result
                </Text>

                <Text style={styles.description}>
                    Updating the leaderboard...
                </Text>

                <View style={styles.loadingTrack}>
                    <View style={styles.loadingBar} />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles =
    StyleSheet.create({
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
            maxWidth: 390,
            alignItems: 'center',
        },

        logo: {
            width: 48,
            height: 48,
        },

        loaderBox: {
            width: 130,
            height: 130,
            marginTop: 22,
            borderRadius: 65,
            borderWidth: 1,
            borderColor:
                'rgba(139,92,246,0.10)',
            backgroundColor:
                'rgba(139,92,246,0.035)',
            alignItems: 'center',
            justifyContent: 'center',
        },

        title: {
            color: '#FFFFFF',
            fontSize: 20,
            fontWeight: '900',
            marginTop: 22,
            letterSpacing: -0.5,
        },

        description: {
            color: '#52525B',
            fontSize: 11,
            fontWeight: '500',
            marginTop: 8,
        },

        loadingTrack: {
            width: 130,
            height: 4,
            marginTop: 25,
            borderRadius: 10,
            overflow: 'hidden',
            backgroundColor:
                'rgba(255,255,255,0.05)',
        },

        loadingBar: {
            width: '60%',
            height: '100%',
            borderRadius: 10,
            backgroundColor: '#8B5CF6',
        },
    });