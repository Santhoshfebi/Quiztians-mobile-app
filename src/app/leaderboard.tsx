import {
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    router,
    useLocalSearchParams,
} from 'expo-router';

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';

import LeaderboardLoading from '../components/leaderboard/LeaderboardLoading';

import LeaderboardPodium from '../components/leaderboard/LeaderboardPodium';

import LeaderboardRow from '../components/leaderboard/LeaderboardRow';

import CurrentPlayerCard from '../components/leaderboard/CurrentPlayerCard';

import BestPerformanceCard from '../components/leaderboard/BestPerformanceCard';

import RankingRules from '../components/leaderboard/RankingRules';

import {
    getLeaderboardData,
    isCurrentPlayer,
    type CurrentPlayerIdentity,
    type LeaderboardData,
} from '../services/leaderboardService';

/* ==========================================================
   ROUTE PARAMS
========================================================== */

type LeaderboardParams = {
    name?: string | string[];
    phone?: string | string[];
    place?: string | string[];
    chapter?: string | string[];
    score?: string | string[];
    language?: string | string[];
};

/* ==========================================================
   SCREEN
========================================================== */

export default function LeaderboardScreen() {
    const params =
        useLocalSearchParams<LeaderboardParams>();

    /* ======================================================
       NORMALIZE ROUTE PARAMS
    ====================================================== */

    const name =
        getParam(params.name);

    const phone =
        getParam(params.phone);

    const place =
        getParam(params.place);

    const chapter =
        getParam(params.chapter);

    const scoreParam =
        getParam(params.score);

    const language =
        getParam(params.language) ||
        'en';

    const score =
        scoreParam !== ''
            ? Number(scoreParam)
            : undefined;

    /* ======================================================
       STATE
    ====================================================== */

    const [
        leaderboard,
        setLeaderboard,
    ] =
        useState<LeaderboardData | null>(
            null
        );

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        refreshing,
        setRefreshing,
    ] = useState(false);

    const [
        loadError,
        setLoadError,
    ] =
        useState<string | null>(
            null
        );

    /* ======================================================
       CURRENT USER
    ====================================================== */

    const currentUser =
        useMemo<CurrentPlayerIdentity>(
            () => ({
                name:
                    name || undefined,

                phone:
                    phone || undefined,

                place:
                    place || undefined,

                score:
                    Number.isFinite(
                        score
                    )
                        ? score
                        : undefined,
            }),
            [
                name,
                phone,
                place,
                score,
            ]
        );

    /* ======================================================
       LOAD LEADERBOARD
    ====================================================== */

    const loadLeaderboard =
        useCallback(
            async (
                isRefresh = false
            ) => {
                if (!chapter) {
                    setLoadError(
                        'Chapter information is missing.'
                    );

                    setLoading(
                        false
                    );

                    setRefreshing(
                        false
                    );

                    return;
                }

                try {
                    if (
                        isRefresh
                    ) {
                        setRefreshing(
                            true
                        );
                    } else {
                        setLoading(
                            true
                        );
                    }

                    setLoadError(
                        null
                    );

                    const data =
                        await getLeaderboardData(
                            chapter,
                            currentUser
                        );

                    setLeaderboard(
                        data
                    );
                } catch (
                error
                ) {
                    console.error(
                        'Leaderboard load error:',
                        error
                    );

                    setLoadError(
                        getErrorMessage(
                            error
                        )
                    );
                } finally {
                    setLoading(
                        false
                    );

                    setRefreshing(
                        false
                    );
                }
            },
            [
                chapter,
                currentUser,
            ]
        );

    /* ======================================================
       INITIAL LOAD
    ====================================================== */

    useEffect(() => {
        void loadLeaderboard();
    }, [loadLeaderboard]);

    /* ======================================================
       NAVIGATION
    ====================================================== */

    const goBack =
        useCallback(() => {
            if (
                router.canGoBack()
            ) {
                router.back();
                return;
            }

            router.replace('/');
        }, []);

    const goHome =
        useCallback(() => {
            router.replace('/');
        }, []);

    /* ======================================================
       LOADING
    ====================================================== */

    if (
        loading &&
        !leaderboard
    ) {
        return (
            <LeaderboardLoading />
        );
    }

    /* ======================================================
       ERROR
    ====================================================== */

    if (
        loadError &&
        !leaderboard
    ) {
        return (
            <SafeAreaView
                style={
                    styles.safeArea
                }
            >
                <StatusBar
                    barStyle="light-content"
                />

                <View
                    style={
                        styles.errorScreen
                    }
                >
                    <View
                        style={
                            styles.errorIcon
                        }
                    >
                        <Text
                            style={
                                styles.errorIconText
                            }
                        >
                            !
                        </Text>
                    </View>

                    <Text
                        style={
                            styles.errorTitle
                        }
                    >
                        Couldn't load leaderboard
                    </Text>

                    <Text
                        style={
                            styles.errorDescription
                        }
                    >
                        {loadError}
                    </Text>

                    <Pressable
                        onPress={() =>
                            void loadLeaderboard()
                        }
                        style={({ pressed }) => [
                            styles.retryButton,
                            pressed &&
                            styles.buttonPressed,
                        ]}
                    >
                        <Text
                            style={
                                styles.retryText
                            }
                        >
                            TRY AGAIN
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={
                            goBack
                        }
                        style={({ pressed }) => [
                            styles.errorBackButton,
                            pressed &&
                            styles.buttonPressed,
                        ]}
                    >
                        <Text
                            style={
                                styles.errorBackText
                            }
                        >
                            GO BACK
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    /* ======================================================
       SAFE DATA
    ====================================================== */

    const data =
        leaderboard ??
        createFallbackData();

    const currentPlayerId =
        data.currentPlayer?.id ??
        null;

    /* ======================================================
       UI
    ====================================================== */

    return (
        <SafeAreaView
            style={
                styles.safeArea
            }
        >
            <StatusBar
                barStyle="light-content"
            />

            {/* ==================================================
                BACKGROUND
            ================================================== */}

            <View
                pointerEvents="none"
                style={
                    StyleSheet.absoluteFill
                }
            >
                <View
                    style={
                        styles.topGlow
                    }
                />

                <View
                    style={
                        styles.bottomGlow
                    }
                />

                <View
                    style={
                        styles.centerGlow
                    }
                />
            </View>

            {/* ==================================================
                NAVBAR
            ================================================== */}

            <View
                style={
                    styles.navbar
                }
            >
                <Pressable
                    onPress={
                        goHome
                    }
                    style={({ pressed }) => [
                        styles.brand,
                        pressed &&
                        styles.buttonPressed,
                    ]}
                >
                    <Image
                        source={require(
                            '../../assets/images/quiztians-q.png'
                        )}
                        resizeMode="contain"
                        style={
                            styles.logo
                        }
                    />

                    <View
                        style={
                            styles.brandText
                        }
                    >
                        <Image
                            source={require(
                                '../../assets/images/quiztians-wordmark.png'
                            )}
                            resizeMode="contain"
                            style={
                                styles.wordmark
                            }
                        />

                        <Text
                            style={
                                styles.tagline
                            }
                        >
                            LEARN • PLAY • COMPETE
                        </Text>
                    </View>
                </Pressable>

                <Pressable
                    onPress={
                        goBack
                    }
                    style={({ pressed }) => [
                        styles.backButton,
                        pressed &&
                        styles.buttonPressed,
                    ]}
                >
                    <Text
                        style={
                            styles.backArrow
                        }
                    >
                        ‹
                    </Text>

                    <Text
                        style={
                            styles.backText
                        }
                    >
                        Back
                    </Text>
                </Pressable>
            </View>

            {/* ==================================================
                CONTENT
            ================================================== */}

            <ScrollView
                showsVerticalScrollIndicator={
                    false
                }
                contentContainerStyle={
                    styles.scrollContent
                }
            >
                {/* ==============================================
                    HEADING
                ============================================== */}

                <View
                    style={
                        styles.headingSection
                    }
                >
                    <View
                        style={
                            styles.eyebrowRow
                        }
                    >
                        <View
                            style={
                                styles.eyebrowLine
                            }
                        />

                        <Text
                            style={
                                styles.eyebrow
                            }
                        >
                            RANKINGS
                        </Text>
                    </View>

                    <View
                        style={
                            styles.headingRow
                        }
                    >
                        <View
                            style={
                                styles.headingCopy
                            }
                        >
                            <Text
                                style={
                                    styles.title
                                }
                            >
                                Leaderboard
                            </Text>

                            <Text
                                style={
                                    styles.subtitle
                                }
                            >
                                Compete. Learn. Climb.
                            </Text>
                        </View>

                        <View
                            style={
                                styles.chapterArea
                            }
                        >
                            <Text
                                style={
                                    styles.chapterLabel
                                }
                            >
                                CHAPTER
                            </Text>

                            <Text
                                numberOfLines={
                                    2
                                }
                                style={
                                    styles.chapter
                                }
                            >
                                {chapter ||
                                    '—'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* ==============================================
                    REFRESH / ERROR NOTICE
                ============================================== */}

                {loadError &&
                    leaderboard ? (
                    <View
                        style={
                            styles.warning
                        }
                    >
                        <View
                            style={
                                styles.warningContent
                            }
                        >
                            <Text
                                style={
                                    styles.warningTitle
                                }
                            >
                                Couldn't refresh rankings
                            </Text>

                            <Text
                                style={
                                    styles.warningText
                                }
                            >
                                Showing the last loaded leaderboard.
                            </Text>
                        </View>

                        <Pressable
                            onPress={() =>
                                void loadLeaderboard(
                                    true
                                )
                            }
                            style={({ pressed }) => [
                                styles.warningRetry,
                                pressed &&
                                styles.buttonPressed,
                            ]}
                        >
                            <Text
                                style={
                                    styles.warningRetryText
                                }
                            >
                                RETRY
                            </Text>
                        </Pressable>
                    </View>
                ) : null}

                {/* ==============================================
                    TOP 3
                ============================================== */}

                <LeaderboardPodium
                    top3={
                        data.top3
                    }
                    highestScore={
                        data.highestScore
                    }
                    fastestPerScore={
                        data.fastestPerScore
                    }
                    currentPlayerId={
                        currentPlayerId
                    }
                />

                {/* ==============================================
                    CURRENT PLAYER
                ============================================== */}

                <View
                    style={
                        styles.sectionGap
                    }
                >
                    <CurrentPlayerCard
                        name={
                            name
                        }
                        place={
                            place
                        }
                        userRank={
                            data.userRank
                        }
                        userScore={
                            data.userScore
                        }
                        userTime={
                            data.userTime
                        }
                        totalQuestions={
                            data.totalQuestions
                        }
                        highestScore={
                            data.highestScore
                        }
                        fastestPerScore={
                            data.fastestPerScore
                        }
                    />
                </View>

                {/* ==============================================
                    POSITIONS 4 - 20
                ============================================== */}

                <View
                    style={[
                        styles.rankingsCard,
                        styles.sectionGap,
                    ]}
                >
                    <View
                        style={
                            styles.rankingsHeader
                        }
                    >
                        <View>
                            <Text
                                style={
                                    styles.rankingsEyebrow
                                }
                            >
                                RANKINGS
                            </Text>

                            <Text
                                style={
                                    styles.rankingsTitle
                                }
                            >
                                Positions 4–20
                            </Text>
                        </View>

                        <View
                            style={
                                styles.playerCount
                            }
                        >
                            <Text
                                style={
                                    styles.playerCountText
                                }
                            >
                                {
                                    data
                                        .players
                                        .length
                                }{' '}
                                {data
                                    .players
                                    .length ===
                                    1
                                    ? 'PLAYER'
                                    : 'PLAYERS'}
                            </Text>
                        </View>
                    </View>

                    <View
                        style={
                            styles.rankingsList
                        }
                    >
                        {data
                            .nextPlayers
                            .length ===
                            0 ? (
                            <View
                                style={
                                    styles.emptyRankings
                                }
                            >
                                <Text
                                    style={
                                        styles.emptyRankingsText
                                    }
                                >
                                    No other players yet.
                                </Text>
                            </View>
                        ) : (
                            data.nextPlayers.map(
                                (
                                    player,
                                    index
                                ) => (
                                    <LeaderboardRow
                                        key={String(
                                            player.id
                                        )}
                                        player={
                                            player
                                        }
                                        rank={
                                            index +
                                            4
                                        }
                                        totalQuestions={
                                            data.totalQuestions
                                        }
                                        highestScore={
                                            data.highestScore
                                        }
                                        fastestPerScore={
                                            data.fastestPerScore
                                        }
                                        isCurrent={isCurrentPlayer(
                                            player,
                                            currentUser
                                        )}
                                    />
                                )
                            )
                        )}
                    </View>
                </View>

                {/* ==============================================
                    BEST PERFORMANCE
                ============================================== */}

                <View
                    style={
                        styles.sectionGap
                    }
                >
                    <BestPerformanceCard
                        bestStats={
                            data.bestStats
                        }
                        totalQuestions={
                            data.totalQuestions
                        }
                    />
                </View>

                {/* ==============================================
                    RANKING RULE
                ============================================== */}

                <View
                    style={
                        styles.sectionGap
                    }
                >
                    <RankingRules />
                </View>

                {/* ==============================================
                    REFRESH BUTTON
                ============================================== */}

                <Pressable
                    disabled={
                        refreshing
                    }
                    onPress={() =>
                        void loadLeaderboard(
                            true
                        )
                    }
                    style={({ pressed }) => [
                        styles.refreshButton,

                        pressed &&
                        !refreshing &&
                        styles.buttonPressed,

                        refreshing &&
                        styles.refreshDisabled,
                    ]}
                >
                    <Text
                        style={
                            styles.refreshIcon
                        }
                    >
                        ↻
                    </Text>

                    <Text
                        style={
                            styles.refreshText
                        }
                    >
                        {refreshing
                            ? 'REFRESHING...'
                            : 'REFRESH RANKINGS'}
                    </Text>
                </Pressable>

                {/* ==============================================
                    FOOTER
                ============================================== */}

                <View
                    style={
                        styles.footer
                    }
                >
                    <Text
                        style={
                            styles.footerText
                        }
                    >
                        QUIZTIANS · Learn • Play • Compete
                    </Text>

                    {language ===
                        'ta' ? (
                        <Text
                            style={
                                styles.footerSecondary
                            }
                        >
                            கற்று • விளையாடு • போட்டியிடு
                        </Text>
                    ) : null}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

/* ==========================================================
   PARAM HELPER
========================================================== */

function getParam(
    value:
        | string
        | string[]
        | undefined
): string {
    if (
        Array.isArray(
            value
        )
    ) {
        return (
            value[0] ?? ''
        );
    }

    return value ?? '';
}

/* ==========================================================
   ERROR HELPER
========================================================== */

function getErrorMessage(
    error: unknown
): string {
    if (
        error instanceof Error
    ) {
        return error.message;
    }

    if (
        typeof error ===
        'object' &&
        error !== null &&
        'message' in error
    ) {
        const message =
            (
                error as {
                    message?: unknown;
                }
            ).message;

        if (
            typeof message ===
            'string'
        ) {
            return message;
        }
    }

    return 'Something went wrong while loading the rankings.';
}

/* ==========================================================
   FALLBACK
========================================================== */

function createFallbackData(): LeaderboardData {
    return {
        players: [],

        top3: [],

        nextPlayers: [],

        totalQuestions: 0,

        highestScore: null,

        fastestTime: null,

        fastestPerScore: {},

        userRank: null,

        userScore: null,

        userTime: null,

        currentPlayer: null,

        bestStats: {
            bestScore: null,
            bestTime: null,
            attempts: 0,
        },
    };
}

/* ==========================================================
   STYLES
========================================================== */

const styles =
    StyleSheet.create({
        safeArea: {
            flex: 1,

            backgroundColor:
                '#09090B',
        },

        /* ======================================================
           BACKGROUND
        ====================================================== */

        topGlow: {
            position: 'absolute',

            width: 360,
            height: 360,

            borderRadius: 180,

            left: -210,
            top: 50,

            backgroundColor:
                'rgba(109,40,217,0.055)',
        },

        bottomGlow: {
            position: 'absolute',

            width: 360,
            height: 360,

            borderRadius: 180,

            right: -220,
            bottom: 40,

            backgroundColor:
                'rgba(67,56,202,0.045)',
        },

        centerGlow: {
            position: 'absolute',

            width: 260,
            height: 260,

            borderRadius: 130,

            left: '20%',
            top: 210,

            backgroundColor:
                'rgba(245,158,11,0.015)',
        },

        /* ======================================================
           NAVBAR
        ====================================================== */

        navbar: {
            minHeight: 68,

            borderBottomWidth: 1,

            borderBottomColor:
                'rgba(255,255,255,0.06)',

            backgroundColor:
                'rgba(9,9,11,0.97)',

            paddingHorizontal: 18,

            flexDirection: 'row',
            alignItems: 'center',

            justifyContent:
                'space-between',

            zIndex: 20,
        },

        brand: {
            flex: 1,

            flexDirection: 'row',
            alignItems: 'center',

            minWidth: 0,
        },

        logo: {
            width: 38,
            height: 38,

            marginRight: 8,
        },

        brandText: {
            flex: 1,
            minWidth: 0,
        },

        wordmark: {
            width: 145,
            height: 27,
        },

        tagline: {
            color: '#3F3F46',

            fontSize: 6,
            fontWeight: '800',

            letterSpacing: 1.2,

            marginTop: -2,
            marginLeft: 2,
        },

        backButton: {
            minHeight: 38,

            borderRadius: 12,
            borderWidth: 1,

            borderColor:
                'rgba(255,255,255,0.07)',

            backgroundColor:
                'rgba(255,255,255,0.025)',

            flexDirection: 'row',
            alignItems: 'center',

            paddingHorizontal: 11,

            marginLeft: 10,
        },

        backArrow: {
            color: '#71717A',

            fontSize: 21,
            lineHeight: 21,

            marginRight: 5,
        },

        backText: {
            color: '#71717A',

            fontSize: 10,
            fontWeight: '800',
        },

        buttonPressed: {
            opacity: 0.65,
        },

        /* ======================================================
           CONTENT
        ====================================================== */

        scrollContent: {
            paddingHorizontal: 18,

            paddingTop: 28,
            paddingBottom: 40,
        },

        headingSection: {
            marginBottom: 26,
        },

        eyebrowRow: {
            flexDirection: 'row',
            alignItems: 'center',
        },

        eyebrowLine: {
            width: 24,
            height: 1,

            backgroundColor:
                '#8B5CF6',

            marginRight: 8,
        },

        eyebrow: {
            color: '#A78BFA',

            fontSize: 8,
            fontWeight: '900',

            letterSpacing: 1.8,
        },

        headingRow: {
            flexDirection: 'row',

            alignItems:
                'flex-end',

            justifyContent:
                'space-between',

            marginTop: 12,
        },

        headingCopy: {
            flex: 1,
            minWidth: 0,
        },

        title: {
            color: '#FFFFFF',

            fontSize: 27,
            fontWeight: '900',

            letterSpacing: -1,
        },

        subtitle: {
            color: '#52525B',

            fontSize: 11,
            lineHeight: 18,

            marginTop: 7,
        },

        chapterArea: {
            maxWidth: '42%',

            alignItems: 'flex-end',

            marginLeft: 12,
        },

        chapterLabel: {
            color: '#3F3F46',

            fontSize: 7,
            fontWeight: '900',

            letterSpacing: 1.2,
        },

        chapter: {
            color: '#A1A1AA',

            fontSize: 10,
            lineHeight: 15,

            fontWeight: '800',

            textAlign: 'right',

            marginTop: 5,
        },

        sectionGap: {
            marginTop: 18,
        },

        /* ======================================================
           RANKINGS
        ====================================================== */

        rankingsCard: {
            overflow: 'hidden',

            borderRadius: 24,
            borderWidth: 1,

            borderColor:
                'rgba(255,255,255,0.08)',

            backgroundColor:
                '#111114',
        },

        rankingsHeader: {
            minHeight: 76,

            borderBottomWidth: 1,

            borderBottomColor:
                'rgba(255,255,255,0.06)',

            paddingHorizontal: 17,
            paddingVertical: 16,

            flexDirection: 'row',

            alignItems: 'center',

            justifyContent:
                'space-between',
        },

        rankingsEyebrow: {
            color: '#52525B',

            fontSize: 8,
            fontWeight: '900',

            letterSpacing: 1.4,
        },

        rankingsTitle: {
            color: '#D4D4D8',

            fontSize: 13,
            fontWeight: '900',

            marginTop: 5,
        },

        playerCount: {
            borderRadius: 20,
            borderWidth: 1,

            borderColor:
                'rgba(255,255,255,0.06)',

            backgroundColor:
                'rgba(255,255,255,0.025)',

            paddingHorizontal: 9,
            paddingVertical: 6,
        },

        playerCountText: {
            color: '#52525B',

            fontSize: 6,
            fontWeight: '900',

            letterSpacing: 0.7,
        },

        rankingsList: {
            padding: 8,
        },

        emptyRankings: {
            paddingVertical: 36,

            alignItems: 'center',
            justifyContent: 'center',
        },

        emptyRankingsText: {
            color: '#52525B',

            fontSize: 11,
            fontWeight: '800',
        },

        /* ======================================================
           REFRESH
        ====================================================== */

        refreshButton: {
            minHeight: 48,

            borderRadius: 15,
            borderWidth: 1,

            borderColor:
                'rgba(139,92,246,0.15)',

            backgroundColor:
                'rgba(139,92,246,0.055)',

            flexDirection: 'row',

            alignItems: 'center',
            justifyContent: 'center',

            marginTop: 18,
        },

        refreshDisabled: {
            opacity: 0.55,
        },

        refreshIcon: {
            color: '#A78BFA',

            fontSize: 17,
            fontWeight: '900',

            marginRight: 8,
        },

        refreshText: {
            color: '#A78BFA',

            fontSize: 8,
            fontWeight: '900',

            letterSpacing: 1.1,
        },

        /* ======================================================
           WARNING
        ====================================================== */

        warning: {
            borderRadius: 16,
            borderWidth: 1,

            borderColor:
                'rgba(245,158,11,0.12)',

            backgroundColor:
                'rgba(245,158,11,0.04)',

            padding: 13,

            flexDirection: 'row',
            alignItems: 'center',

            marginBottom: 16,
        },

        warningContent: {
            flex: 1,
        },

        warningTitle: {
            color: '#FBBF24',

            fontSize: 10,
            fontWeight: '900',
        },

        warningText: {
            color: '#71717A',

            fontSize: 8,
            lineHeight: 14,

            marginTop: 3,
        },

        warningRetry: {
            paddingHorizontal: 9,
            paddingVertical: 7,

            marginLeft: 10,
        },

        warningRetryText: {
            color: '#FBBF24',

            fontSize: 7,
            fontWeight: '900',
        },

        /* ======================================================
           ERROR
        ====================================================== */

        errorScreen: {
            flex: 1,

            alignItems: 'center',
            justifyContent: 'center',

            paddingHorizontal: 28,
        },

        errorIcon: {
            width: 52,
            height: 52,

            borderRadius: 17,
            borderWidth: 1,

            borderColor:
                'rgba(239,68,68,0.16)',

            backgroundColor:
                'rgba(239,68,68,0.06)',

            alignItems: 'center',
            justifyContent: 'center',
        },

        errorIconText: {
            color: '#F87171',

            fontSize: 20,
            fontWeight: '900',
        },

        errorTitle: {
            color: '#E4E4E7',

            fontSize: 17,
            fontWeight: '900',

            textAlign: 'center',

            marginTop: 18,
        },

        errorDescription: {
            maxWidth: 320,

            color: '#71717A',

            fontSize: 11,
            lineHeight: 18,

            textAlign: 'center',

            marginTop: 8,
        },

        retryButton: {
            minWidth: 180,
            minHeight: 46,

            borderRadius: 14,

            backgroundColor:
                '#7C3AED',

            alignItems: 'center',
            justifyContent: 'center',

            marginTop: 22,
        },

        retryText: {
            color: '#FFFFFF',

            fontSize: 9,
            fontWeight: '900',

            letterSpacing: 1,
        },

        errorBackButton: {
            minWidth: 180,
            minHeight: 44,

            borderRadius: 14,
            borderWidth: 1,

            borderColor:
                'rgba(255,255,255,0.07)',

            alignItems: 'center',
            justifyContent: 'center',

            marginTop: 9,
        },

        errorBackText: {
            color: '#71717A',

            fontSize: 8,
            fontWeight: '900',

            letterSpacing: 1,
        },

        /* ======================================================
           FOOTER
        ====================================================== */

        footer: {
            borderTopWidth: 1,

            borderTopColor:
                'rgba(255,255,255,0.05)',

            alignItems: 'center',

            marginTop: 32,
            paddingTop: 22,
        },

        footerText: {
            color: '#27272A',

            fontSize: 8,
            fontWeight: '700',

            letterSpacing: 0.6,
        },

        footerSecondary: {
            color: '#27272A',

            fontSize: 8,

            marginTop: 5,
        },
    });