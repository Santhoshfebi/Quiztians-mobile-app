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
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import ReviewAccuracy from '../components/review/ReviewAccuracy';
import ReviewAnswerCard from '../components/review/ReviewAnswerCard';
import ReviewFilters, {
    ReviewFilter,
} from '../components/review/ReviewFilters';
import ReviewLoading from '../components/review/ReviewLoading';
import ReviewSummaryCard from '../components/review/ReviewSummaryCard';

import {
    buildReviewItems,
    getReviewData,
    ReviewHistory,
    ReviewItem,
    ReviewLanguage,
    ReviewQuestion,
} from '../services/reviewService';

/* ==========================================================
   SCREEN
========================================================== */

export default function ReviewScreen() {
    /* ========================================================
       ROUTE PARAMS
    ======================================================== */

    const params =
        useLocalSearchParams<{
            phone?: string;
            chapter?: string;
            language?: string;
            time_taken?: string;
        }>();

    const phone =
        getParam(params.phone);

    const chapter =
        getParam(params.chapter);

    const initialLanguage: ReviewLanguage =
        normalizeLanguage(
            getParam(params.language)
        );

    const routeTime =
        safeNumber(
            getParam(params.time_taken)
        );

    /* ========================================================
       STATE
    ======================================================== */

    const [
        questions,
        setQuestions,
    ] = useState<ReviewQuestion[]>([]);

    const [
        answers,
        setAnswers,
    ] = useState<ReviewHistory[]>([]);

    const [
        totalTime,
        setTotalTime,
    ] = useState(routeTime);

    const [
        language,
        setLanguage,
    ] =
        useState<ReviewLanguage>(
            initialLanguage
        );

    const [
        activeFilter,
        setActiveFilter,
    ] =
        useState<ReviewFilter>('all');

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        loadError,
        setLoadError,
    ] = useState<string | null>(
        null
    );

    const mountedRef =
        useRef(true);

    /* ========================================================
       LOAD DATA
  
       Important:
       Language is NOT a dependency here.
  
       Switching Tamil / English should not
       make another Supabase request.
    ======================================================== */

    useEffect(() => {
        mountedRef.current = true;

        async function loadReview() {
            if (!phone || !chapter) {
                if (
                    mountedRef.current
                ) {
                    setLoadError(
                        'Missing quiz information.'
                    );

                    setLoading(false);
                }

                return;
            }

            try {
                setLoading(true);
                setLoadError(null);

                const data =
                    await getReviewData(
                        phone,
                        chapter
                    );

                if (
                    !mountedRef.current
                ) {
                    return;
                }

                setQuestions(
                    data.questions
                );

                setAnswers(
                    data.answers
                );

                /*
                 * Prefer DB time.
                 *
                 * If unavailable, keep the time
                 * passed from Result screen.
                 */

                if (data.totalTime > 0) {
                    setTotalTime(
                        data.totalTime
                    );
                }
            } catch (error) {
                console.error(
                    'REVIEW LOAD ERROR:',
                    error
                );

                if (
                    mountedRef.current
                ) {
                    setLoadError(
                        error instanceof Error
                            ? error.message
                            : 'Unable to load your answers.'
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

        loadReview();

        return () => {
            mountedRef.current =
                false;
        };
    }, [
        phone,
        chapter,
    ]);

    /* ========================================================
       BUILD REVIEW
  
       This is local-only.
  
       Switching languages rebuilds the
       displayed questions without another
       Supabase request.
    ======================================================== */

    const reviewItems =
        useMemo<ReviewItem[]>(() => {
            return buildReviewItems(
                questions,
                answers,
                language
            );
        }, [
            questions,
            answers,
            language,
        ]);

    /* ========================================================
       STATS
    ======================================================== */

    const stats = useMemo(() => {
        const correct =
            reviewItems.filter(
                (item) =>
                    item.attempted &&
                    item.is_correct
            ).length;

        const incorrect =
            reviewItems.filter(
                (item) =>
                    item.attempted &&
                    !item.is_correct
            ).length;

        const skipped =
            reviewItems.filter(
                (item) =>
                    !item.attempted
            ).length;

        return {
            total:
                reviewItems.length,

            correct,

            incorrect,

            skipped,
        };
    }, [reviewItems]);

    /* ========================================================
       FILTER
    ======================================================== */

    const filteredItems =
        useMemo(() => {
            switch (activeFilter) {
                case 'correct':
                    return reviewItems.filter(
                        (item) =>
                            item.attempted &&
                            item.is_correct
                    );

                case 'incorrect':
                    return reviewItems.filter(
                        (item) =>
                            item.attempted &&
                            !item.is_correct
                    );

                case 'not_attempted':
                    return reviewItems.filter(
                        (item) =>
                            !item.attempted
                    );

                default:
                    return reviewItems;
            }
        }, [
            reviewItems,
            activeFilter,
        ]);

    /* ========================================================
       TRANSLATIONS
    ======================================================== */

    const text =
        language === 'ta'
            ? {
                eyebrow:
                    'பதில் பகுப்பாய்வு',

                title:
                    'உங்கள் பதில்களை சரிபார்க்கவும்',

                description:
                    'நீங்கள் சரியாக பதிலளித்தவை, தவறாக பதிலளித்தவை மற்றும் விடுபட்ட கேள்விகளை பார்க்கலாம்.',

                chapter:
                    'அதிகாரம்',

                questions:
                    'கேள்விகள்',

                time:
                    'நேரம்',

                correct:
                    'சரி',

                incorrect:
                    'தவறு',

                skipped:
                    'விடுபட்டது',

                questionLanguage:
                    'கேள்வி மொழி',

                filter:
                    'பதில்கள்',

                showing:
                    'காட்டப்படுகிறது',

                of:
                    '/',

                noAnswers:
                    'இந்த வடிகட்டலில் பதில்கள் இல்லை',

                noAnswersDescription:
                    'மற்றொரு வடிகட்டலை தேர்வு செய்து பார்க்கவும்.',

                errorTitle:
                    'பதில்களை ஏற்ற முடியவில்லை',

                retry:
                    'மீண்டும் முயற்சிக்க',

                result:
                    'முடிவிற்கு திரும்பு',

                home:
                    'முகப்பு',

                analysis:
                    'REVIEW MODE',
            }
            : {
                eyebrow:
                    'Answer Analysis',

                title:
                    'Review your answers',

                description:
                    'See what you got right, where you went wrong, and what you skipped.',

                chapter:
                    'Chapter',

                questions:
                    'Questions',

                time:
                    'Time',

                correct:
                    'Correct',

                incorrect:
                    'Incorrect',

                skipped:
                    'Skipped',

                questionLanguage:
                    'Question Language',

                filter:
                    'Answers',

                showing:
                    'Showing',

                of:
                    'of',

                noAnswers:
                    'No answers in this filter',

                noAnswersDescription:
                    'Try selecting another filter to continue reviewing.',

                errorTitle:
                    'Unable to load answers',

                retry:
                    'Try Again',

                result:
                    'Back to Result',

                home:
                    'Home',

                analysis:
                    'REVIEW MODE',
            };

    /* ========================================================
       LOADING
    ======================================================== */

    if (loading) {
        return <ReviewLoading />;
    }

    /* ========================================================
       ERROR / NO DATA
    ======================================================== */

    if (
        loadError &&
        reviewItems.length === 0
    ) {
        return (
            <ReviewError
                title={text.errorTitle}
                description={loadError}
                buttonText={text.home}
            />
        );
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

            {/* ====================================================
          BACKGROUND
      ==================================================== */}

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
                    style={
                        styles.reviewBadge
                    }
                >
                    <View
                        style={
                            styles.reviewDot
                        }
                    />

                    <Text
                        style={
                            styles.reviewBadgeText
                        }
                    >
                        {text.analysis}
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
                {/* ==================================================
            HEADING
        ================================================== */}

                <View style={styles.heading}>
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
                            {text.eyebrow.toUpperCase()}
                        </Text>
                    </View>

                    <Text style={styles.title}>
                        {text.title}
                    </Text>

                    <Text
                        style={
                            styles.description
                        }
                    >
                        {text.description}
                    </Text>
                </View>

                {/* ==================================================
            QUIZ INFO
        ================================================== */}

                <View
                    style={styles.infoCard}
                >
                    <InfoItem
                        label={text.chapter}
                        value={chapter || '—'}
                    />

                    <View
                        style={
                            styles.infoDivider
                        }
                    />

                    <InfoItem
                        label={text.questions}
                        value={String(
                            stats.total
                        )}
                        centered
                    />

                    <View
                        style={
                            styles.infoDivider
                        }
                    />

                    <InfoItem
                        label={text.time}
                        value={formatTime(
                            totalTime
                        )}
                        right
                    />
                </View>

                {/* ==================================================
            SUMMARY CARDS
        ================================================== */}

                <View
                    style={
                        styles.summaryRow
                    }
                >
                    <ReviewSummaryCard
                        value={stats.correct}
                        label={text.correct}
                        type="correct"
                    />

                    <ReviewSummaryCard
                        value={
                            stats.incorrect
                        }
                        label={
                            text.incorrect
                        }
                        type="incorrect"
                    />

                    <ReviewSummaryCard
                        value={stats.skipped}
                        label={text.skipped}
                        type="skipped"
                    />
                </View>

                {/* ==================================================
            ACCURACY
        ================================================== */}

                <ReviewAccuracy
                    correct={stats.correct}
                    total={stats.total}
                />

                {/* ==================================================
            LANGUAGE
        ================================================== */}

                <View
                    style={
                        styles.languageCard
                    }
                >
                    <View
                        style={
                            styles.languageHeader
                        }
                    >
                        <View>
                            <Text
                                style={
                                    styles.languageLabel
                                }
                            >
                                {text.questionLanguage.toUpperCase()}
                            </Text>

                            <Text
                                style={
                                    styles.languageDescription
                                }
                            >
                                தமிழ் / English
                            </Text>
                        </View>

                        <View
                            style={
                                styles.languageIcon
                            }
                        >
                            <Text
                                style={
                                    styles.languageIconText
                                }
                            >
                                文
                            </Text>
                        </View>
                    </View>

                    <View
                        style={
                            styles.languageSwitcher
                        }
                    >
                        <Pressable
                            onPress={() =>
                                setLanguage('ta')
                            }
                            style={({ pressed }) => [
                                styles.languageButton,

                                language === 'ta' &&
                                styles.languageButtonActive,

                                pressed &&
                                styles.pressed,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.languageButtonText,

                                    language ===
                                    'ta' &&
                                    styles.languageButtonTextActive,
                                ]}
                            >
                                தமிழ்
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() =>
                                setLanguage('en')
                            }
                            style={({ pressed }) => [
                                styles.languageButton,

                                language === 'en' &&
                                styles.languageButtonActive,

                                pressed &&
                                styles.pressed,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.languageButtonText,

                                    language ===
                                    'en' &&
                                    styles.languageButtonTextActive,
                                ]}
                            >
                                English
                            </Text>
                        </Pressable>
                    </View>
                </View>

                {/* ==================================================
            FILTER SECTION
        ================================================== */}

                <View
                    style={
                        styles.filterSection
                    }
                >
                    <View
                        style={
                            styles.filterHeader
                        }
                    >
                        <View>
                            <Text
                                style={
                                    styles.filterLabel
                                }
                            >
                                {text.filter.toUpperCase()}
                            </Text>

                            <Text
                                style={
                                    styles.filterTitle
                                }
                            >
                                {text.showing}{' '}
                                {
                                    filteredItems.length
                                }{' '}
                                {text.of}{' '}
                                {stats.total}
                            </Text>
                        </View>

                        <Text
                            style={
                                styles.filterCounter
                            }
                        >
                            {String(
                                filteredItems.length
                            ).padStart(2, '0')}
                            {' / '}
                            {String(
                                stats.total
                            ).padStart(2, '0')}
                        </Text>
                    </View>

                    <ReviewFilters
                        active={
                            activeFilter
                        }
                        onChange={
                            setActiveFilter
                        }
                        total={stats.total}
                        correct={
                            stats.correct
                        }
                        incorrect={
                            stats.incorrect
                        }
                        skipped={
                            stats.skipped
                        }
                    />
                </View>

                {/* ==================================================
            LOAD WARNING
        ================================================== */}

                {loadError && (
                    <View
                        style={
                            styles.warningCard
                        }
                    >
                        <Text
                            style={
                                styles.warningIcon
                            }
                        >
                            !
                        </Text>

                        <Text
                            style={
                                styles.warningText
                            }
                        >
                            {loadError}
                        </Text>
                    </View>
                )}

                {/* ==================================================
            ANSWERS
        ================================================== */}

                <View
                    style={
                        styles.answers
                    }
                >
                    {filteredItems.length >
                        0 ? (
                        filteredItems.map(
                            (item) => {
                                /*
                                 * Preserve the real
                                 * question number from
                                 * the complete review,
                                 * even when filtered.
                                 */

                                const originalIndex =
                                    reviewItems.findIndex(
                                        (reviewItem) =>
                                            reviewItem.id ===
                                            item.id
                                    );

                                return (
                                    <ReviewAnswerCard
                                        key={String(
                                            item.id
                                        )}
                                        answer={item}
                                        index={
                                            originalIndex >=
                                                0
                                                ? originalIndex
                                                : 0
                                        }
                                    />
                                );
                            }
                        )
                    ) : (
                        <View
                            style={
                                styles.emptyCard
                            }
                        >
                            <View
                                style={
                                    styles.emptyIcon
                                }
                            >
                                <Text
                                    style={
                                        styles.emptyIconText
                                    }
                                >
                                    ✓
                                </Text>
                            </View>

                            <Text
                                style={
                                    styles.emptyTitle
                                }
                            >
                                {text.noAnswers}
                            </Text>

                            <Text
                                style={
                                    styles.emptyDescription
                                }
                            >
                                {
                                    text.noAnswersDescription
                                }
                            </Text>
                        </View>
                    )}
                </View>

                {/* ==================================================
            ACTIONS
        ================================================== */}

                <View
                    style={styles.actions}
                >
                    <Pressable
                        onPress={() =>
                            router.back()
                        }
                        style={({ pressed }) => [
                            styles.resultButton,

                            pressed &&
                            styles.pressed,
                        ]}
                    >
                        <Text
                            style={
                                styles.resultArrow
                            }
                        >
                            ←
                        </Text>

                        <Text
                            style={
                                styles.resultButtonText
                            }
                        >
                            {text.result}
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() =>
                            router.replace('/')
                        }
                        style={({ pressed }) => [
                            styles.homeButton,

                            pressed &&
                            styles.pressed,
                        ]}
                    >
                        <Text
                            style={
                                styles.homeIcon
                            }
                        >
                            ⌂
                        </Text>

                        <Text
                            style={
                                styles.homeButtonText
                            }
                        >
                            {text.home}
                        </Text>
                    </Pressable>
                </View>

                {/* ==================================================
            FOOTER
        ================================================== */}

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
   INFO ITEM
========================================================== */

function InfoItem({
    label,
    value,
    centered = false,
    right = false,
}: {
    label: string;
    value: string;
    centered?: boolean;
    right?: boolean;
}) {
    return (
        <View
            style={[
                styles.infoItem,

                centered &&
                styles.infoItemCentered,

                right &&
                styles.infoItemRight,
            ]}
        >
            <Text
                style={styles.infoLabel}
                numberOfLines={1}
            >
                {label.toUpperCase()}
            </Text>

            <Text
                style={styles.infoValue}
                numberOfLines={2}
            >
                {value}
            </Text>
        </View>
    );
}

/* ==========================================================
   ERROR SCREEN
========================================================== */

function ReviewError({
    title,
    description,
    buttonText,
}: {
    title: string;
    description: string;
    buttonText: string;
}) {
    return (
        <SafeAreaView
            style={
                styles.errorScreen
            }
        >
            <StatusBar
                barStyle="light-content"
                backgroundColor="#09090B"
            />

            <View
                pointerEvents="none"
                style={styles.errorGlow}
            />

            <View
                style={styles.errorCard}
            >
                <Image
                    source={require(
                        '../../assets/images/quiztians-q.png'
                    )}
                    style={
                        styles.errorLogo
                    }
                    resizeMode="contain"
                />

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
                    {title}
                </Text>

                <Text
                    style={
                        styles.errorDescription
                    }
                >
                    {description}
                </Text>

                <Pressable
                    onPress={() =>
                        router.replace('/')
                    }
                    style={({ pressed }) => [
                        styles.errorButton,

                        pressed &&
                        styles.pressed,
                    ]}
                >
                    <Text
                        style={
                            styles.errorButtonText
                        }
                    >
                        {buttonText}
                    </Text>
                </Pressable>
            </View>
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

function normalizeLanguage(
    value: string
): ReviewLanguage {
    const normalized =
        value
            .trim()
            .toLowerCase();

    if (
        normalized === 'ta' ||
        normalized === 'tamil'
    ) {
        return 'ta';
    }

    return 'en';
}

function formatTime(
    seconds: number
) {
    const safeSeconds =
        Math.max(
            0,
            Math.floor(
                Number(seconds) || 0
            )
        );

    const minutes =
        Math.floor(
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

        /* ======================================================
           BACKGROUND
        ====================================================== */

        topGlow: {
            position: 'absolute',

            width: 340,
            height: 340,

            borderRadius: 170,

            top: 40,
            left: -190,

            backgroundColor:
                'rgba(109,40,217,0.08)',
        },

        bottomGlow: {
            position: 'absolute',

            width: 400,
            height: 400,

            borderRadius: 200,

            right: -230,
            bottom: -100,

            backgroundColor:
                'rgba(67,56,202,0.07)',
        },

        /* ======================================================
           NAVBAR
        ====================================================== */

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
            flex: 1,

            flexDirection: 'row',

            alignItems: 'center',

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

        reviewBadge: {
            flexDirection: 'row',

            alignItems: 'center',

            paddingHorizontal: 9,

            paddingVertical: 7,

            borderRadius: 30,

            borderWidth: 1,

            borderColor:
                'rgba(139,92,246,0.15)',

            backgroundColor:
                'rgba(139,92,246,0.06)',
        },

        reviewDot: {
            width: 5,
            height: 5,

            borderRadius: 3,

            backgroundColor:
                '#A78BFA',

            marginRight: 6,
        },

        reviewBadgeText: {
            color: '#A78BFA',

            fontSize: 7,

            fontWeight: '900',

            letterSpacing: 0.8,
        },

        /* ======================================================
           CONTENT
        ====================================================== */

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

        title: {
            color: '#FFFFFF',

            fontSize: 27,

            lineHeight: 33,

            fontWeight: '900',

            letterSpacing: -1,
        },

        description: {
            maxWidth: 500,

            color: '#52525B',

            fontSize: 11,

            lineHeight: 19,

            marginTop: 7,
        },

        /* ======================================================
           INFO
        ====================================================== */

        infoCard: {
            minHeight: 90,

            borderRadius: 22,

            borderWidth: 1,

            borderColor:
                'rgba(255,255,255,0.07)',

            backgroundColor: '#111114',

            flexDirection: 'row',

            alignItems: 'stretch',

            paddingHorizontal: 15,

            paddingVertical: 16,
        },

        infoItem: {
            flex: 1,

            justifyContent: 'center',
        },

        infoItemCentered: {
            alignItems: 'center',
        },

        infoItemRight: {
            alignItems: 'flex-end',
        },

        infoDivider: {
            width: 1,

            marginHorizontal: 10,

            backgroundColor:
                'rgba(255,255,255,0.06)',
        },

        infoLabel: {
            color: '#3F3F46',

            fontSize: 7,

            fontWeight: '900',

            letterSpacing: 1,
        },

        infoValue: {
            color: '#D4D4D8',

            fontSize: 12,

            lineHeight: 17,

            fontWeight: '900',

            marginTop: 6,
        },

        /* ======================================================
           SUMMARY
        ====================================================== */

        summaryRow: {
            flexDirection: 'row',

            gap: 8,

            marginTop: 11,
        },

        /* ======================================================
           LANGUAGE
        ====================================================== */

        languageCard: {
            marginTop: 11,

            padding: 16,

            borderRadius: 20,

            borderWidth: 1,

            borderColor:
                'rgba(255,255,255,0.06)',

            backgroundColor: '#111114',
        },

        languageHeader: {
            flexDirection: 'row',

            alignItems: 'center',

            justifyContent:
                'space-between',
        },

        languageLabel: {
            color: '#3F3F46',

            fontSize: 8,

            fontWeight: '900',

            letterSpacing: 1.1,
        },

        languageDescription: {
            color: '#52525B',

            fontSize: 9,

            marginTop: 4,
        },

        languageIcon: {
            width: 31,
            height: 31,

            borderRadius: 9,

            borderWidth: 1,

            borderColor:
                'rgba(139,92,246,0.12)',

            backgroundColor:
                'rgba(139,92,246,0.05)',

            alignItems: 'center',

            justifyContent: 'center',
        },

        languageIconText: {
            color: '#A78BFA',

            fontSize: 11,

            fontWeight: '900',
        },

        languageSwitcher: {
            minHeight: 46,

            marginTop: 14,

            padding: 4,

            borderRadius: 14,

            borderWidth: 1,

            borderColor:
                'rgba(255,255,255,0.06)',

            backgroundColor:
                'rgba(255,255,255,0.02)',

            flexDirection: 'row',
        },

        languageButton: {
            flex: 1,

            borderRadius: 10,

            alignItems: 'center',

            justifyContent: 'center',
        },

        languageButtonActive: {
            borderWidth: 1,

            borderColor:
                'rgba(139,92,246,0.16)',

            backgroundColor:
                'rgba(139,92,246,0.10)',
        },

        languageButtonText: {
            color: '#52525B',

            fontSize: 10,

            fontWeight: '800',
        },

        languageButtonTextActive: {
            color: '#C4B5FD',
        },

        /* ======================================================
           FILTER
        ====================================================== */

        filterSection: {
            marginTop: 24,
        },

        filterHeader: {
            flexDirection: 'row',

            alignItems: 'flex-end',

            justifyContent:
                'space-between',

            marginBottom: 13,
        },

        filterLabel: {
            color: '#3F3F46',

            fontSize: 8,

            fontWeight: '900',

            letterSpacing: 1.3,
        },

        filterTitle: {
            color: '#71717A',

            fontSize: 10,

            fontWeight: '600',

            marginTop: 4,
        },

        filterCounter: {
            color: '#3F3F46',

            fontSize: 9,

            fontWeight: '800',
        },

        /* ======================================================
           WARNING
        ====================================================== */

        warningCard: {
            marginTop: 14,

            padding: 12,

            borderRadius: 14,

            borderWidth: 1,

            borderColor:
                'rgba(245,158,11,0.13)',

            backgroundColor:
                'rgba(245,158,11,0.045)',

            flexDirection: 'row',

            alignItems: 'center',
        },

        warningIcon: {
            color: '#FBBF24',

            fontSize: 11,

            fontWeight: '900',

            marginRight: 9,
        },

        warningText: {
            flex: 1,

            color:
                'rgba(251,191,36,0.65)',

            fontSize: 9,

            lineHeight: 15,
        },

        /* ======================================================
           ANSWERS
        ====================================================== */

        answers: {
            gap: 11,

            marginTop: 15,
        },

        emptyCard: {
            paddingVertical: 38,

            paddingHorizontal: 20,

            borderRadius: 22,

            borderWidth: 1,

            borderColor:
                'rgba(255,255,255,0.06)',

            backgroundColor: '#111114',

            alignItems: 'center',
        },

        emptyIcon: {
            width: 42,
            height: 42,

            borderRadius: 13,

            borderWidth: 1,

            borderColor:
                'rgba(139,92,246,0.12)',

            backgroundColor:
                'rgba(139,92,246,0.05)',

            alignItems: 'center',

            justifyContent: 'center',
        },

        emptyIconText: {
            color: '#A78BFA',

            fontSize: 15,

            fontWeight: '900',
        },

        emptyTitle: {
            color: '#A1A1AA',

            fontSize: 12,

            fontWeight: '900',

            marginTop: 14,

            textAlign: 'center',
        },

        emptyDescription: {
            maxWidth: 280,

            color: '#3F3F46',

            fontSize: 9,

            lineHeight: 16,

            marginTop: 6,

            textAlign: 'center',
        },

        /* ======================================================
           ACTIONS
        ====================================================== */

        actions: {
            marginTop: 24,

            gap: 9,
        },

        resultButton: {
            minHeight: 52,

            borderRadius: 16,

            backgroundColor:
                '#7C3AED',

            flexDirection: 'row',

            alignItems: 'center',

            justifyContent: 'center',
        },

        resultArrow: {
            color: '#FFFFFF',

            fontSize: 15,

            marginRight: 8,
        },

        resultButtonText: {
            color: '#FFFFFF',

            fontSize: 11,

            fontWeight: '900',
        },

        homeButton: {
            minHeight: 49,

            borderRadius: 16,

            borderWidth: 1,

            borderColor:
                'rgba(255,255,255,0.07)',

            backgroundColor:
                'rgba(255,255,255,0.025)',

            flexDirection: 'row',

            alignItems: 'center',

            justifyContent: 'center',
        },

        homeIcon: {
            color: '#52525B',

            fontSize: 14,

            marginRight: 7,
        },

        homeButtonText: {
            color: '#71717A',

            fontSize: 10,

            fontWeight: '800',
        },

        /* ======================================================
           FOOTER
        ====================================================== */

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

        /* ======================================================
           ERROR
        ====================================================== */

        errorScreen: {
            flex: 1,

            backgroundColor: '#09090B',

            alignItems: 'center',

            justifyContent: 'center',

            paddingHorizontal: 20,
        },

        errorGlow: {
            position: 'absolute',

            width: 330,
            height: 330,

            borderRadius: 165,

            backgroundColor:
                'rgba(109,40,217,0.08)',
        },

        errorCard: {
            width: '100%',

            maxWidth: 390,

            padding: 24,

            borderRadius: 25,

            borderWidth: 1,

            borderColor:
                'rgba(255,255,255,0.08)',

            backgroundColor: '#111114',

            alignItems: 'center',
        },

        errorLogo: {
            width: 38,
            height: 38,
        },

        errorIcon: {
            width: 48,
            height: 48,

            borderRadius: 15,

            marginTop: 22,

            borderWidth: 1,

            borderColor:
                'rgba(239,68,68,0.15)',

            backgroundColor:
                'rgba(239,68,68,0.07)',

            alignItems: 'center',

            justifyContent: 'center',
        },

        errorIconText: {
            color: '#F87171',

            fontSize: 18,

            fontWeight: '900',
        },

        errorTitle: {
            color: '#FFFFFF',

            fontSize: 19,

            fontWeight: '900',

            marginTop: 18,

            textAlign: 'center',
        },

        errorDescription: {
            color: '#52525B',

            fontSize: 10,

            lineHeight: 18,

            marginTop: 8,

            textAlign: 'center',
        },

        errorButton: {
            width: '100%',

            minHeight: 52,

            marginTop: 22,

            borderRadius: 16,

            backgroundColor:
                '#7C3AED',

            alignItems: 'center',

            justifyContent: 'center',
        },

        errorButtonText: {
            color: '#FFFFFF',

            fontSize: 11,

            fontWeight: '900',
        },
    });