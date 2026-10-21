import {
    router,
    useLocalSearchParams,
} from 'expo-router';

import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import {
    Alert,
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    Share,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import RankCard from '../components/result/RankCard';
import ResultLoading from '../components/result/ResultLoading';
import ResultTips from '../components/result/ResultTips';
import ScoreCard from '../components/result/ScoreCard';
import TopPlayers from '../components/result/TopPlayers';

import {
    findPlayerRank,
    getChapterLeaderboard,
    LeaderboardPlayer,
} from '../services/resultService';

/* ==========================================================
   TYPES
========================================================== */

type Language = 'en' | 'ta';

/* ==========================================================
   SCREEN
========================================================== */

export default function ResultScreen() {
    /* ========================================================
       ROUTE PARAMS
    ======================================================== */

    const params =
        useLocalSearchParams<{
            name?: string;
            phone?: string;
            place?: string;
            chapter?: string;
            language?: string;

            score?: string;
            total?: string;

            time_taken?: string;

            attemptedAt?: string;

            autoSubmitted?: string;
        }>();

    const name =
        getParam(params.name);

    const phone =
        getParam(params.phone);

    const place =
        getParam(params.place);

    const chapter =
        getParam(params.chapter);

    const language: Language =
        getParam(params.language) ===
            'ta'
            ? 'ta'
            : 'en';

    const score =
        safeNumber(
            getParam(params.score)
        );

    const total =
        safeNumber(
            getParam(params.total)
        );

    const timeTaken =
        safeNumber(
            getParam(
                params.time_taken
            )
        );

    const autoSubmitted =
        getParam(
            params.autoSubmitted
        ) === 'true';

    /* ========================================================
       STATE
    ======================================================== */

    const [
        topPlayers,
        setTopPlayers,
    ] = useState<
        LeaderboardPlayer[]
    >([]);

    const [
        rank,
        setRank,
    ] = useState<
        number | null
    >(null);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        loadError,
        setLoadError,
    ] = useState<
        string | null
    >(null);

    /*
     * Prevent stale async requests from
     * updating an unmounted screen.
     */
    const mountedRef =
        useRef(true);

    /* ========================================================
       DERIVED VALUES
    ======================================================== */

    const percentage =
        useMemo(() => {
            if (total <= 0) {
                return 0;
            }

            return Math.round(
                (score / total) * 100
            );
        }, [
            score,
            total,
        ]);

    /*
     * Website behavior:
     * score 0 + total 0 represents
     * the special ended/rule failure
     * result state.
     */
    const isRuleFailure =
        score === 0 &&
        total === 0;

    const perfectScore =
        total > 0 &&
        score === total;

    const isTopFive =
        rank !== null &&
        rank <= 5;

    /* ========================================================
       TRANSLATIONS
    ======================================================== */

    const text =
        language === 'ta'
            ? {
                eyebrow:
                    'வினாடி வினா முடிவு',

                completed:
                    'வினாடி வினா முடிந்தது!',

                ended:
                    'முயற்சி முடிந்தது.',

                completedDescription:
                    'பங்கேற்றதற்கு நன்றி — தொடர்ந்து கற்றுக்கொண்டு முன்னேறுங்கள்.',

                endedDescription:
                    'விதிமுறைகள் காரணமாக உங்கள் முயற்சி தானாக சமர்ப்பிக்கப்பட்டது.',

                result:
                    'உங்கள் முடிவு',

                perfect:
                    'முழு மதிப்பெண்',

                outstanding:
                    'அருமையான செயல்திறன்!',

                contactAdmin:
                    'நிர்வாகியை தொடர்பு கொள்ளவும்',

                perfectDescription:
                    'வாழ்த்துகள்! அனைத்து கேள்விகளுக்கும் சரியாக பதிலளித்துள்ளீர்கள்.',

                topFiveDescription:
                    'இந்த அதிகாரத்தின் Top 5 பட்டியலில் இடம் பெற்றுள்ளீர்கள்!',

                normalDescription:
                    'தொடர்ந்து கற்றுக்கொண்டு உங்கள் வேகத்தையும் மதிப்பெண்ணையும் மேம்படுத்துங்கள்.',

                ruleDescription:
                    'மீண்டும் முயற்சிக்க வேண்டுமெனில் நிர்வாகியை தொடர்பு கொள்ளவும்.',

                review:
                    'பதில்களை பார்க்க',

                leaderboard:
                    'முன்னணி பட்டியல்',

                share:
                    'முடிவை பகிர்',

                home:
                    'முகப்பு',

                recorded:
                    'உங்கள் முடிவு வெற்றிகரமாக பதிவு செய்யப்பட்டது.',

                topChampion:
                    'Top 5 Champion',
            }
            : {
                eyebrow:
                    'Quiz Result',

                completed:
                    'Quiz completed!',

                ended:
                    'Attempt ended.',

                completedDescription:
                    'Thanks for participating — may knowledge bless your journey.',

                endedDescription:
                    'Your attempt was automatically submitted due to repeated rule violations.',

                result:
                    'Your Result',

                perfect:
                    'Perfect Score',

                outstanding:
                    'Outstanding performance!',

                contactAdmin:
                    'Please contact the admin',

                perfectDescription:
                    'Congratulations! You answered every question correctly.',

                topFiveDescription:
                    "You made it into the chapter's Top 5. Keep that position!",

                normalDescription:
                    'Keep learning, improve your speed and climb the leaderboard.',

                ruleDescription:
                    'Try to follow the rules next time. Contact the admin if you need permission to reattempt.',

                review:
                    'Review Answers',

                leaderboard:
                    'View Leaderboard',

                share:
                    'Share Result',

                home:
                    'Back Home',

                recorded:
                    'Your result has been recorded successfully.',

                topChampion:
                    'Top 5 Champion',
            };

    /* ========================================================
       FETCH LEADERBOARD
    ======================================================== */

    useEffect(() => {
        mountedRef.current =
            true;

        async function loadResult() {
            if (!chapter) {
                if (
                    mountedRef.current
                ) {
                    setLoading(false);

                    setLoadError(
                        'Missing chapter information.'
                    );
                }

                return;
            }

            try {
                setLoading(true);

                setLoadError(null);

                const players =
                    await getChapterLeaderboard(
                        chapter
                    );

                if (
                    !mountedRef.current
                ) {
                    return;
                }

                const playerRank =
                    findPlayerRank(
                        players,
                        {
                            phone,
                            name,
                            place,
                            score,
                        }
                    );

                setRank(playerRank);

                setTopPlayers(
                    players.slice(0, 5)
                );
            } catch (error) {
                console.error(
                    'RESULT LEADERBOARD ERROR:',
                    error
                );

                if (
                    mountedRef.current
                ) {
                    setLoadError(
                        error instanceof Error
                            ? error.message
                            : 'Unable to load leaderboard.'
                    );
                }
            } finally {
                if (
                    mountedRef.current
                ) {
                    setLoading(false);
                }
            }
        }

        loadResult();

        return () => {
            mountedRef.current =
                false;
        };
    }, [
        chapter,
        phone,
        name,
        place,
        score,
    ]);

    /* ========================================================
       SHARE
    ======================================================== */

    async function handleShare() {
        let message =
            `🎉 Quiz Result 🎉\n\n` +
            `Name: ${name || 'Unknown'}\n` +
            `Place: ${place || '—'}\n` +
            `Chapter: ${chapter || '—'}\n` +
            `Score: ${score} / ${total}\n` +
            `Rank: ${rank
                ? `#${rank}`
                : 'Unranked'
            }\n` +
            `⏱ Time Taken: ${formatTime(
                timeTaken
            )}\n\n`;

        if (isRuleFailure) {
            message +=
                'Try to follow the rules next time :)';
        } else if (
            isTopFive
        ) {
            message +=
                '🏆 Congratulations! You are among the top 5! For now';
        } else {
            message +=
                'Keep trying to reach the top!';
        }

        try {
            await Share.share({
                title:
                    'My Quiz Result',

                message,
            });
        } catch (error) {
            console.error(
                'SHARE ERROR:',
                error
            );

            Alert.alert(
                'Unable to share',
                'Please try again.'
            );
        }
    }

    /* ========================================================
       NAVIGATION
    ======================================================== */

    function openLeaderboard() {
        router.push({
            pathname:
                '/leaderboard',

            params: {
                phone,
                chapter,
                name,
                score: String(score),
                total: String(total),
                place,
            },
        });
    }

    function openReview() {
        /*
         * We'll build /review in the
         * next step.
         */

        router.push({
            pathname: '/review',

            params: {
                phone,
                chapter,
                language,
                time_taken: String(timeTaken),
            },
        });
    }

    /* ========================================================
       LOADING
    ======================================================== */

    if (loading) {
        return <ResultLoading />;
    }

    /* ========================================================
       UI
    ======================================================== */

    return (
        <SafeAreaView
            style={styles.screen}
        >
            <StatusBar
                barStyle="light-content"
                backgroundColor="#09090B"
            />

            {/* BACKGROUND */}

            <View
                pointerEvents="none"
                style={
                    StyleSheet.absoluteFill
                }
            >
                <View
                    style={styles.topGlow}
                />

                <View
                    style={
                        styles.bottomGlow
                    }
                />

                {isTopFive &&
                    !isRuleFailure && (
                        <View
                            style={
                                styles.championGlow
                            }
                        />
                    )}
            </View>

            {/* ====================================================
          NAVBAR
      ==================================================== */}

            <View style={styles.navbar}>
                <Pressable
                    onPress={() =>
                        router.replace('/')
                    }
                    style={({ pressed }) => [
                        styles.brandButton,

                        pressed &&
                        styles.pressed,
                    ]}
                >
                    <Image
                        source={require(
                            '../../assets/images/quiztians-q.png'
                        )}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    <Image
                        source={require(
                            '../../assets/images/quiztians-wordmark.png'
                        )}
                        style={
                            styles.wordmark
                        }
                        resizeMode="contain"
                    />
                </Pressable>

                <View
                    style={[
                        styles.statusBadge,

                        isRuleFailure &&
                        styles.statusBadgeError,
                    ]}
                >
                    <View
                        style={[
                            styles.statusDot,

                            isRuleFailure &&
                            styles.statusDotError,
                        ]}
                    />

                    <Text
                        style={[
                            styles.statusText,

                            isRuleFailure &&
                            styles.statusTextError,
                        ]}
                    >
                        {isRuleFailure
                            ? 'ATTEMPT ENDED'
                            : 'COMPLETED'}
                    </Text>
                </View>
            </View>

            {/* ====================================================
          CONTENT
      ==================================================== */}

            <ScrollView
                showsVerticalScrollIndicator={
                    false
                }
                contentContainerStyle={
                    styles.content
                }
            >
                {/* PAGE HEADING */}

                <View style={styles.heading}>
                    <View
                        style={
                            styles.eyebrowRow
                        }
                    >
                        <View
                            style={[
                                styles.eyebrowLine,

                                isRuleFailure &&
                                styles.eyebrowLineError,
                            ]}
                        />

                        <Text
                            style={[
                                styles.eyebrow,

                                isRuleFailure &&
                                styles.eyebrowError,
                            ]}
                        >
                            {text.eyebrow.toUpperCase()}
                        </Text>
                    </View>

                    <Text style={styles.title}>
                        {isRuleFailure
                            ? text.ended
                            : text.completed}
                    </Text>

                    <Text
                        style={
                            styles.description
                        }
                    >
                        {isRuleFailure
                            ? text.endedDescription
                            : text.completedDescription}
                    </Text>
                </View>

                {/* ==================================================
            MAIN RESULT CARD
        ================================================== */}

                <View style={styles.resultCard}>
                    <View
                        pointerEvents="none"
                        style={[
                            styles.cardGlow,

                            isRuleFailure &&
                            styles.cardGlowError,

                            isTopFive &&
                            !isRuleFailure &&
                            styles.cardGlowChampion,
                        ]}
                    />

                    <View
                        style={
                            styles.resultContent
                        }
                    >
                        {/* CELEBRATION */}

                        {!isRuleFailure && (
                            <View
                                style={
                                    styles.celebration
                                }
                            >
                                <View
                                    style={[
                                        styles.celebrationIcon,

                                        perfectScore &&
                                        styles.perfectIcon,
                                    ]}
                                >
                                    <Text
                                        style={
                                            styles.celebrationEmoji
                                        }
                                    >
                                        {perfectScore
                                            ? '🏆'
                                            : isTopFive
                                                ? '🏅'
                                                : '✓'}
                                    </Text>
                                </View>
                            </View>
                        )}

                        {/* MESSAGE */}

                        <View
                            style={
                                styles.messageArea
                            }
                        >
                            <Text
                                style={
                                    styles.resultLabel
                                }
                            >
                                {isRuleFailure
                                    ? 'ATTEMPT SUMMARY'
                                    : perfectScore
                                        ? text.perfect.toUpperCase()
                                        : text.result.toUpperCase()}
                            </Text>

                            <Text
                                style={
                                    styles.resultTitle
                                }
                            >
                                {isRuleFailure
                                    ? text.contactAdmin
                                    : perfectScore
                                        ? text.outstanding
                                        : `Great work${name
                                            ? `, ${name}`
                                            : ''
                                        }!`}
                            </Text>

                            <Text
                                style={[
                                    styles.resultDescription,

                                    isRuleFailure &&
                                    styles.resultDescriptionError,
                                ]}
                            >
                                {isRuleFailure
                                    ? text.ruleDescription
                                    : perfectScore
                                        ? text.perfectDescription
                                        : isTopFive
                                            ? text.topFiveDescription
                                            : text.normalDescription}
                            </Text>
                        </View>

                        {/* SCORE */}

                        {!isRuleFailure && (
                            <ScoreCard
                                score={score}
                                total={total}
                            />
                        )}

                        {/* RANK + TIME */}

                        <RankCard
                            rank={rank}
                            timeTaken={
                                timeTaken
                            }
                        />

                        {/* TOP 5 */}

                        {isTopFive &&
                            !isRuleFailure && (
                                <View
                                    style={
                                        styles.championCard
                                    }
                                >
                                    <View
                                        style={
                                            styles.championIcon
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.championEmoji
                                            }
                                        >
                                            🏅
                                        </Text>
                                    </View>

                                    <View
                                        style={styles.flex}
                                    >
                                        <Text
                                            style={
                                                styles.championTitle
                                            }
                                        >
                                            {
                                                text.topChampion
                                            }
                                        </Text>

                                        <Text
                                            style={
                                                styles.championDescription
                                            }
                                        >
                                            You're currently
                                            ranked #{rank} in{' '}
                                            {chapter}.
                                        </Text>
                                    </View>
                                </View>
                            )}

                        {/* PARTICIPANT */}

                        <View
                            style={
                                styles.participant
                            }
                        >
                            <View
                                style={
                                    styles.avatar
                                }
                            >
                                <Text
                                    style={
                                        styles.avatarText
                                    }
                                >
                                    {name
                                        ? name
                                            .charAt(0)
                                            .toUpperCase()
                                        : 'U'}
                                </Text>
                            </View>

                            <View
                                style={
                                    styles.participantInfo
                                }
                            >
                                <Text
                                    style={
                                        styles.participantName
                                    }
                                    numberOfLines={1}
                                >
                                    {name ||
                                        'Unknown'}
                                </Text>

                                <Text
                                    style={
                                        styles.participantPlace
                                    }
                                    numberOfLines={1}
                                >
                                    {place || '—'}
                                </Text>
                            </View>

                            <View
                                style={
                                    styles.chapterInfo
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
                                    style={
                                        styles.chapterValue
                                    }
                                    numberOfLines={1}
                                >
                                    {chapter || '—'}
                                </Text>
                            </View>
                        </View>

                        {/* LOAD ERROR */}

                        {loadError && (
                            <View
                                style={
                                    styles.warningBox
                                }
                            >
                                <Text
                                    style={
                                        styles.warningText
                                    }
                                >
                                    Leaderboard data
                                    could not be fully
                                    loaded. Your quiz
                                    result is still
                                    recorded.
                                </Text>
                            </View>
                        )}

                        {/* PRIMARY ACTIONS */}

                        <View
                            style={
                                styles.primaryActions
                            }
                        >
                            <Pressable
                                onPress={openReview}
                                style={({
                                    pressed,
                                }) => [
                                        styles.primaryButton,

                                        pressed &&
                                        styles.pressed,
                                    ]}
                            >
                                <Text
                                    style={
                                        styles.primaryIcon
                                    }
                                >
                                    ◫
                                </Text>

                                <Text
                                    style={
                                        styles.primaryButtonText
                                    }
                                >
                                    {text.review}
                                </Text>
                            </Pressable>

                            <Pressable
                                onPress={
                                    openLeaderboard
                                }
                                style={({
                                    pressed,
                                }) => [
                                        styles.secondaryButton,

                                        pressed &&
                                        styles.pressed,
                                    ]}
                            >
                                <Text
                                    style={
                                        styles.secondaryIcon
                                    }
                                >
                                    🏆
                                </Text>

                                <Text
                                    style={
                                        styles.secondaryButtonText
                                    }
                                >
                                    {
                                        text.leaderboard
                                    }
                                </Text>
                            </Pressable>
                        </View>

                        {/* SECONDARY ACTIONS */}

                        <View
                            style={
                                styles.secondaryActions
                            }
                        >
                            <Pressable
                                onPress={
                                    handleShare
                                }
                                style={({
                                    pressed,
                                }) => [
                                        styles.smallButton,

                                        pressed &&
                                        styles.pressed,
                                    ]}
                            >
                                <Text
                                    style={
                                        styles.smallIcon
                                    }
                                >
                                    ↗
                                </Text>

                                <Text
                                    style={
                                        styles.smallButtonText
                                    }
                                >
                                    {text.share}
                                </Text>
                            </Pressable>

                            <Pressable
                                onPress={() =>
                                    router.replace(
                                        '/'
                                    )
                                }
                                style={({
                                    pressed,
                                }) => [
                                        styles.smallButton,

                                        pressed &&
                                        styles.pressed,
                                    ]}
                            >
                                <Text
                                    style={
                                        styles.smallIcon
                                    }
                                >
                                    ⌂
                                </Text>

                                <Text
                                    style={
                                        styles.smallButtonText
                                    }
                                >
                                    {text.home}
                                </Text>
                            </Pressable>
                        </View>

                        {/* RECORDED */}

                        <View
                            style={
                                styles.recorded
                            }
                        >
                            <View
                                style={
                                    styles.recordedDot
                                }
                            />

                            <Text
                                style={
                                    styles.recordedText
                                }
                            >
                                {text.recorded}
                            </Text>
                        </View>

                        {autoSubmitted && (
                            <Text
                                style={
                                    styles.autoSubmitted
                                }
                            >
                                This attempt was
                                automatically
                                submitted.
                            </Text>
                        )}
                    </View>
                </View>

                {/* ==================================================
            TOP PLAYERS
        ================================================== */}

                <TopPlayers
                    players={topPlayers}
                    rank={rank}
                    chapter={chapter}
                    onViewAll={
                        openLeaderboard
                    }
                />

                {/* ==================================================
            TIPS
        ================================================== */}

                {!isRuleFailure && (
                    <ResultTips />
                )}

                {/* FOOTER */}

                <View style={styles.footer}>
                    <Text
                        style={
                            styles.footerText
                        }
                    >
                        QUIZTIANS · Learn • Play •
                        Compete
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

/* ==========================================================
   HELPERS
========================================================== */

function getParam(
    value:
        | string
        | string[]
        | undefined
) {
    if (Array.isArray(value)) {
        return value[0] ?? '';
    }

    return value ?? '';
}

function safeNumber(
    value: string
) {
    const number =
        Number(value);

    return Number.isFinite(number)
        ? number
        : 0;
}

function formatTime(
    seconds: number
) {
    const safeSeconds =
        Number(seconds) || 0;

    const minutes = Math.floor(
        safeSeconds / 60
    );

    const remaining =
        safeSeconds % 60;

    return `${minutes}m ${String(
        remaining
    ).padStart(2, '0')}s`;
}

/* ==========================================================
   STYLES
========================================================== */

const styles =
    StyleSheet.create({
        flex: {
            flex: 1,
        },

        screen: {
            flex: 1,
            backgroundColor: '#09090B',
        },

        pressed: {
            opacity: 0.82,
            transform: [
                {
                    scale: 0.985,
                },
            ],
        },

        /* BACKGROUND */

        topGlow: {
            position: 'absolute',
            width: 330,
            height: 330,
            borderRadius: 165,
            left: -180,
            top: 60,
            backgroundColor:
                'rgba(109,40,217,0.08)',
        },

        bottomGlow: {
            position: 'absolute',
            width: 380,
            height: 380,
            borderRadius: 190,
            right: -210,
            bottom: -80,
            backgroundColor:
                'rgba(67,56,202,0.08)',
        },

        championGlow: {
            position: 'absolute',
            width: 280,
            height: 280,
            borderRadius: 140,
            alignSelf: 'center',
            top: 150,
            backgroundColor:
                'rgba(245,158,11,0.035)',
        },

        /* NAV */

        navbar: {
            height: 68,
            paddingHorizontal: 17,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent:
                'space-between',
            borderBottomWidth: 1,
            borderBottomColor:
                'rgba(255,255,255,0.06)',
            backgroundColor:
                'rgba(9,9,11,0.98)',
            zIndex: 20,
        },

        brandButton: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            paddingRight: 8,
        },

        logo: {
            width: 36,
            height: 36,
        },

        wordmark: {
            width: 125,
            height: 35,
            marginLeft: 5,
        },

        statusBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 9,
            paddingVertical: 7,
            borderRadius: 30,
            borderWidth: 1,
            borderColor:
                'rgba(16,185,129,0.15)',
            backgroundColor:
                'rgba(16,185,129,0.06)',
        },

        statusBadgeError: {
            borderColor:
                'rgba(239,68,68,0.15)',
            backgroundColor:
                'rgba(239,68,68,0.06)',
        },

        statusDot: {
            width: 5,
            height: 5,
            borderRadius: 3,
            backgroundColor: '#34D399',
            marginRight: 6,
        },

        statusDotError: {
            backgroundColor: '#F87171',
        },

        statusText: {
            color: '#34D399',
            fontSize: 7,
            fontWeight: '900',
            letterSpacing: 0.8,
        },

        statusTextError: {
            color: '#F87171',
        },

        /* CONTENT */

        content: {
            paddingHorizontal: 17,
            paddingTop: 28,
            paddingBottom: 45,
        },

        heading: {
            marginBottom: 20,
        },

        eyebrowRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
        },

        eyebrowLine: {
            width: 24,
            height: 1,
            backgroundColor: '#8B5CF6',
            marginRight: 8,
        },

        eyebrowLineError: {
            backgroundColor: '#EF4444',
        },

        eyebrow: {
            color: '#A78BFA',
            fontSize: 8,
            fontWeight: '900',
            letterSpacing: 1.8,
        },

        eyebrowError: {
            color: '#F87171',
        },

        title: {
            color: '#FFFFFF',
            fontSize: 27,
            fontWeight: '900',
            letterSpacing: -1,
        },

        description: {
            color: '#52525B',
            fontSize: 11,
            lineHeight: 19,
            marginTop: 7,
            maxWidth: 500,
        },

        /* RESULT */

        resultCard: {
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 27,
            borderWidth: 1,
            borderColor:
                'rgba(255,255,255,0.08)',
            backgroundColor: '#111114',
        },

        cardGlow: {
            position: 'absolute',
            width: 270,
            height: 270,
            borderRadius: 135,
            top: -180,
            alignSelf: 'center',
            backgroundColor:
                'rgba(124,58,237,0.06)',
        },

        cardGlowError: {
            backgroundColor:
                'rgba(239,68,68,0.04)',
        },

        cardGlowChampion: {
            backgroundColor:
                'rgba(245,158,11,0.055)',
        },

        resultContent: {
            padding: 20,
        },

        celebration: {
            alignItems: 'center',
            marginBottom: 16,
        },

        celebrationIcon: {
            width: 58,
            height: 58,
            borderRadius: 29,
            borderWidth: 1,
            borderColor:
                'rgba(16,185,129,0.20)',
            backgroundColor:
                'rgba(16,185,129,0.08)',
            alignItems: 'center',
            justifyContent: 'center',
        },

        perfectIcon: {
            borderColor:
                'rgba(245,158,11,0.20)',
            backgroundColor:
                'rgba(245,158,11,0.08)',
        },

        celebrationEmoji: {
            fontSize: 25,
        },

        messageArea: {
            alignItems: 'center',
        },

        resultLabel: {
            color: '#52525B',
            fontSize: 8,
            fontWeight: '900',
            letterSpacing: 1.6,
        },

        resultTitle: {
            color: '#FFFFFF',
            fontSize: 21,
            fontWeight: '900',
            textAlign: 'center',
            marginTop: 7,
            letterSpacing: -0.5,
        },

        resultDescription: {
            maxWidth: 350,
            color: '#52525B',
            fontSize: 10,
            lineHeight: 18,
            textAlign: 'center',
            marginTop: 7,
        },

        resultDescriptionError: {
            color:
                'rgba(248,113,113,0.8)',
        },

        /* CHAMPION */

        championCard: {
            marginTop: 13,
            padding: 13,
            borderRadius: 17,
            borderWidth: 1,
            borderColor:
                'rgba(245,158,11,0.15)',
            backgroundColor:
                'rgba(245,158,11,0.055)',
            flexDirection: 'row',
            alignItems: 'center',
        },

        championIcon: {
            width: 40,
            height: 40,
            borderRadius: 12,
            borderWidth: 1,
            borderColor:
                'rgba(245,158,11,0.15)',
            backgroundColor:
                'rgba(245,158,11,0.08)',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
        },

        championEmoji: {
            fontSize: 18,
        },

        championTitle: {
            color: '#FCD34D',
            fontSize: 11,
            fontWeight: '900',
        },

        championDescription: {
            color:
                'rgba(253,230,138,0.45)',
            fontSize: 8,
            lineHeight: 14,
            marginTop: 3,
        },

        /* PARTICIPANT */

        participant: {
            marginTop: 18,
            paddingTop: 18,
            borderTopWidth: 1,
            borderTopColor:
                'rgba(255,255,255,0.06)',
            flexDirection: 'row',
            alignItems: 'center',
        },

        avatar: {
            width: 43,
            height: 43,
            borderRadius: 14,
            borderWidth: 1,
            borderColor:
                'rgba(255,255,255,0.07)',
            backgroundColor:
                'rgba(255,255,255,0.04)',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
        },

        avatarText: {
            color: '#D4D4D8',
            fontSize: 13,
            fontWeight: '900',
        },

        participantInfo: {
            flex: 1,
            minWidth: 0,
        },

        participantName: {
            color: '#E4E4E7',
            fontSize: 12,
            fontWeight: '800',
        },

        participantPlace: {
            color: '#52525B',
            fontSize: 9,
            marginTop: 3,
        },

        chapterInfo: {
            maxWidth: '40%',
            alignItems: 'flex-end',
            paddingLeft: 8,
        },

        chapterLabel: {
            color: '#3F3F46',
            fontSize: 7,
            fontWeight: '900',
            letterSpacing: 1,
        },

        chapterValue: {
            color: '#71717A',
            fontSize: 9,
            fontWeight: '700',
            marginTop: 4,
        },

        /* WARNING */

        warningBox: {
            marginTop: 14,
            padding: 11,
            borderRadius: 13,
            borderWidth: 1,
            borderColor:
                'rgba(245,158,11,0.12)',
            backgroundColor:
                'rgba(245,158,11,0.04)',
        },

        warningText: {
            color: '#A16207',
            fontSize: 9,
            lineHeight: 15,
            textAlign: 'center',
        },

        /* ACTIONS */

        primaryActions: {
            gap: 9,
            marginTop: 20,
        },

        primaryButton: {
            minHeight: 52,
            borderRadius: 16,
            backgroundColor: '#7C3AED',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },

        primaryIcon: {
            color: '#FFFFFF',
            fontSize: 15,
            marginRight: 8,
        },

        primaryButtonText: {
            color: '#FFFFFF',
            fontSize: 11,
            fontWeight: '900',
        },

        secondaryButton: {
            minHeight: 52,
            borderRadius: 16,
            borderWidth: 1,
            borderColor:
                'rgba(255,255,255,0.08)',
            backgroundColor:
                'rgba(255,255,255,0.035)',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },

        secondaryIcon: {
            fontSize: 13,
            marginRight: 8,
        },

        secondaryButtonText: {
            color: '#D4D4D8',
            fontSize: 11,
            fontWeight: '900',
        },

        secondaryActions: {
            flexDirection: 'row',
            gap: 9,
            marginTop: 9,
        },

        smallButton: {
            flex: 1,
            minHeight: 47,
            borderRadius: 15,
            borderWidth: 1,
            borderColor:
                'rgba(255,255,255,0.07)',
            backgroundColor:
                'rgba(255,255,255,0.025)',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 8,
        },

        smallIcon: {
            color: '#71717A',
            fontSize: 14,
            marginRight: 6,
        },

        smallButtonText: {
            color: '#71717A',
            fontSize: 9,
            fontWeight: '800',
        },

        /* RECORDED */

        recorded: {
            marginTop: 19,
            paddingTop: 17,
            borderTopWidth: 1,
            borderTopColor:
                'rgba(255,255,255,0.05)',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },

        recordedDot: {
            width: 5,
            height: 5,
            borderRadius: 3,
            backgroundColor:
                'rgba(16,185,129,0.65)',
            marginRight: 7,
        },

        recordedText: {
            color: '#3F3F46',
            fontSize: 8,
            fontWeight: '500',
            textAlign: 'center',
        },

        autoSubmitted: {
            color: '#F87171',
            fontSize: 8,
            fontWeight: '600',
            textAlign: 'center',
            marginTop: 8,
        },

        /* FOOTER */

        footer: {
            marginTop: 30,
            paddingTop: 20,
            borderTopWidth: 1,
            borderTopColor:
                'rgba(255,255,255,0.05)',
            alignItems: 'center',
        },

        footerText: {
            color: '#27272A',
            fontSize: 8,
            fontWeight: '600',
            letterSpacing: 0.5,
        },
    });