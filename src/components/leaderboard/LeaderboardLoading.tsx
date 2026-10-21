import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function LeaderboardLoading() {
    return (
        <View style={styles.screen}>
            <View
                pointerEvents="none"
                style={styles.glow}
            />

            <Image
                source={require(
                    '../../../assets/images/quiztians-q.png'
                )}
                resizeMode="contain"
                style={styles.logo}
            />

            <View style={styles.loader}>
                <ActivityIndicator
                    size="large"
                    color="#8B5CF6"
                />
            </View>

            <Text style={styles.title}>
                Loading leaderboard
            </Text>

            <Text style={styles.subtitle}>
                Finding the top players...
            </Text>
        </View>
    );
}

const styles =
    StyleSheet.create({
        screen: {
            flex: 1,

            backgroundColor:
                '#09090B',

            alignItems: 'center',
            justifyContent: 'center',

            paddingHorizontal: 24,
        },

        glow: {
            position: 'absolute',

            width: 300,
            height: 300,

            borderRadius: 150,

            backgroundColor:
                'rgba(109,40,217,0.08)',
        },

        logo: {
            width: 48,
            height: 48,
        },

        loader: {
            marginTop: 30,
        },

        title: {
            color: '#D4D4D8',

            fontSize: 14,
            fontWeight: '900',

            marginTop: 22,
        },

        subtitle: {
            color: '#52525B',

            fontSize: 10,
            fontWeight: '600',

            marginTop: 6,
        },
    });