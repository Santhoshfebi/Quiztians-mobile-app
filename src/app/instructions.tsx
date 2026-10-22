import {
    router,
    useLocalSearchParams,
} from 'expo-router';

import {
    useEffect,
    useRef,
    useState,
} from 'react';

import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';

/* ==========================================================
   COLORS
========================================================== */

const COLORS = {
    background: '#09090B',

    card: '#111114',
    cardSoft: '#141418',

    white: '#FFFFFF',

    zinc200: '#E4E4E7',
    zinc300: '#D4D4D8',
    zinc400: '#A1A1AA',
    zinc500: '#71717A',
    zinc600: '#52525B',
    zinc700: '#3F3F46',
    zinc800: '#27272A',

    violet: '#8B5CF6',
    violetLight: '#A78BFA',
    indigo: '#6366F1',

    border: 'rgba(255,255,255,0.08)',
    softBorder: 'rgba(255,255,255,0.06)',
};

/* ==========================================================
   TYPES
========================================================== */

type Language = 'en' | 'ta';

/* ==========================================================
   SCREEN
========================================================== */

export default function InstructionsScreen() {
    /* ========================================================
       ROUTE PARAMS
    ======================================================== */

    const params =
        useLocalSearchParams<{
            name?: string;
            phone?: string;
            place?: string;
            language?: string;
            chapter?: string;
            duration?: string;
        }>();

    const language: Language =
        getParam(params.language) === 'ta'
            ? 'ta'
            : 'en';

    const name =
        getParam(params.name);

    const phone =
        getParam(params.phone);

    const place =
        getParam(params.place);

    const chapter =
        getParam(params.chapter);

    const duration =
        getParam(params.duration) || '20';

    /* ========================================================
       STATE
    ======================================================== */

    const [activeTip, setActiveTip] =
        useState(0);

    const [
        acceptedRules,
        setAcceptedRules,
    ] = useState(false);

    const [
        readyCountdown,
        setReadyCountdown,
    ] = useState<number | null>(
        null
    );

    const [
        isStarting,
        setIsStarting,
    ] = useState(false);

    /* ========================================================
       NAVIGATION GUARD
  
       Prevents duplicate navigation caused by
       development Strict Mode / Fast Refresh.
    ======================================================== */

    const hasNavigatedRef =
        useRef(false);

    /* ========================================================
       TIPS
    ======================================================== */

    const tips = [
        language === 'en'
            ? 'Answer carefully — answers cannot be changed.'
            : 'கவனமாக பதிலளிக்கவும் — பதில்களை மாற்ற முடியாது.',

        language === 'en'
            ? 'Try to answer all questions.'
            : 'அனைத்து கேள்விகளுக்கும் பதில் சொல்ல முயலுங்கள்.',

        language === 'en'
            ? 'Follow the quiz rules throughout the attempt.'
            : 'வினாடி வினா முழுவதும் விதிகளை பின்பற்றவும்.',

        language === 'en'
            ? 'Correct answers increase your score.'
            : 'சரியான பதில்கள் உங்கள் மதிப்பெண்ணை அதிகரிக்கும்.',

        language === 'en'
            ? 'Review your responses at the end to see the correct answers.'
            : 'வினாடி வினா முடிவில் சரியான பதில்களைப் பார்க்க உங்கள் பதில்களைச் சரிபார்க்கவும்.',

        language === 'en'
            ? 'The leaderboard will be available at the end.'
            : 'முடிவில் முன்னணி பட்டியல் காண்பிக்கப்படும்.',
    ];

    /* ========================================================
       TRANSLATIONS
    ======================================================== */

    const text = {
        eyebrow:
            language === 'en'
                ? 'Ready Room'
                : 'தயார் அறை',

        title:
            language === 'en'
                ? 'Ready to start?'
                : 'தொடங்க தயாரா?',

        description:
            language === 'en'
                ? 'Check your details and read the tips before beginning. Your quiz starts after a 5-second countdown.'
                : 'தொடங்குவதற்கு முன் உங்கள் விவரங்களை சரிபார்த்து குறிப்புகளை படிக்கவும். 5 வினாடி கவுண்ட்டவுனுக்குப் பிறகு வினாடி வினா தொடங்கும்.',

        participant:
            language === 'en'
                ? 'Participant'
                : 'பங்கேற்பாளர்',

        phone:
            language === 'en'
                ? 'Phone'
                : 'தொலைபேசி',

        place:
            language === 'en'
                ? 'Place'
                : 'இடம்',

        chapter:
            language === 'en'
                ? 'Chapter'
                : 'அதிகாரம்',

        duration:
            language === 'en'
                ? 'Duration'
                : 'நேரம்',

        minutes:
            language === 'en'
                ? 'minutes'
                : 'நிமிடங்கள்',

        language:
            language === 'en'
                ? 'Language'
                : 'மொழி',

        quizTips:
            language === 'en'
                ? 'Before you begin'
                : 'தொடங்குவதற்கு முன்',

        tip:
            language === 'en'
                ? 'Quiz Tip'
                : 'வினா குறிப்பு',

        rules:
            language === 'en'
                ? 'Quiz Rules'
                : 'வினாடி வினா விதிகள்',

        confirmation:
            language === 'en'
                ? 'Confirmation required'
                : 'உறுதிப்படுத்தல் தேவை',

        accept:
            language === 'en'
                ? 'I have read the instructions and I agree to follow the quiz rules.'
                : 'வழிமுறைகளைப் படித்துள்ளேன் மற்றும் வினாடி வினா விதிகளைப் பின்பற்ற ஒப்புக்கொள்கிறேன்.',

        start:
            language === 'en'
                ? 'Start Quiz'
                : 'வினாடி வினாவை தொடங்கு',

        starting:
            language === 'en'
                ? 'Quiz starting...'
                : 'வினாடி வினா தொடங்குகிறது...',

        back:
            language === 'en'
                ? 'Go Back'
                : 'திரும்பிச் செல்லவும்',

        locked:
            language === 'en'
                ? 'Accept the rules above to continue'
                : 'தொடர மேலே உள்ள விதிகளை ஏற்றுக்கொள்ளவும்',

        countdownTitle:
            language === 'en'
                ? 'GET READY'
                : 'தயாராகுங்கள்',

        countdownDescription:
            language === 'en'
                ? 'Your quiz is about to begin.'
                : 'உங்கள் வினாடி வினா தொடங்க உள்ளது.',
    };

    /* ========================================================
       ROTATING TIPS
    ======================================================== */

    useEffect(() => {
        if (isStarting) {
            return;
        }

        const interval =
            setInterval(() => {
                setActiveTip(
                    (current) =>
                        (current + 1) %
                        tips.length
                );
            }, 3500);

        return () => {
            clearInterval(interval);
        };
    }, [
        isStarting,
        tips.length,
    ]);

    /* ========================================================
       START QUIZ
  
       Important:
       No navigation happens here.
  
       We only start the countdown.
    ======================================================== */

    function startQuizSequence() {
        if (
            !acceptedRules ||
            isStarting
        ) {
            return;
        }

        hasNavigatedRef.current =
            false;

        setIsStarting(true);

        setReadyCountdown(5);
    }

    /* ========================================================
       COUNTDOWN TIMER
  
       5 → 4 → 3 → 2 → 1 → 0
  
       This effect ONLY updates state.
       It does not navigate.
    ======================================================== */

    useEffect(() => {
        if (
            !isStarting ||
            readyCountdown === null ||
            readyCountdown <= 0
        ) {
            return;
        }

        const timeout =
            setTimeout(() => {
                setReadyCountdown(
                    readyCountdown - 1
                );
            }, 1000);

        return () => {
            clearTimeout(timeout);
        };
    }, [
        isStarting,
        readyCountdown,
    ]);

    /* ========================================================
       NAVIGATE TO QUIZ
  
       Navigation is deliberately kept in a
       separate effect.
  
       This fixes:
       "Cannot update RoutingQueueProvider
       while rendering InstructionsScreen"
    ======================================================== */

    useEffect(() => {
        if (
            !isStarting ||
            readyCountdown !== 0 ||
            hasNavigatedRef.current
        ) {
            return;
        }

        hasNavigatedRef.current =
            true;

        router.replace({
            pathname: '/quiz',

            params: {
                name,
                phone,
                place,
                chapter,
                language,
                duration,
            },
        });
    }, [
        isStarting,
        readyCountdown,
        name,
        phone,
        place,
        chapter,
        language,
        duration,
    ]);

    /* ========================================================
       NO SESSION DATA
    ======================================================== */

    if (
        !name ||
        !phone ||
        !chapter
    ) {
        return (
            <NoQuizData
                language={language}
            />
        );
    }

    /* ========================================================
       UI
    ======================================================== */

    return (
        <SafeAreaView
            style={styles.safeArea}
        >
            <StatusBar
                barStyle="light-content"
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
                    style={styles.bottomGlow}
                />
            </View>

            {/* ====================================================
          NAVBAR
      ==================================================== */}

            <View style={styles.navbar}>
                <Pressable
                    disabled={isStarting}
                    onPress={() =>
                        router.replace('/')
                    }
                    style={({ pressed }) => [
                        styles.brandButton,

                        pressed &&
                        !isStarting &&
                        styles.pressed,
                    ]}
                >
                    <View
                        style={styles.logoBox}
                    >
                        <Text
                            style={
                                styles.logoLetter
                            }
                        >
                            Q
                        </Text>
                    </View>

                    <View>
                        <Text
                            style={styles.brand}
                        >
                            QUIZTIANS
                        </Text>

                        <Text
                            style={styles.tagline}
                        >
                            LEARN • PLAY • COMPETE
                        </Text>
                    </View>
                </Pressable>

                <View
                    style={styles.readyBadge}
                >
                    <View
                        style={
                            styles.readyDotOuter
                        }
                    >
                        <View
                            style={
                                styles.readyDot
                            }
                        />
                    </View>

                    <Text
                        style={
                            styles.readyBadgeText
                        }
                    >
                        {text.eyebrow.toUpperCase()}
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
            INTRO
        ================================================== */}

                <View style={styles.intro}>
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
            QUIZ SUMMARY
        ================================================== */}

                <View
                    style={styles.summaryCard}
                >
                    <View
                        style={
                            styles.summaryGlow
                        }
                    />

                    <View
                        style={
                            styles.summaryHeader
                        }
                    >
                        <View
                            style={
                                styles.summaryChapter
                            }
                        >
                            <Text
                                style={
                                    styles.summaryLabel
                                }
                            >
                                {text.chapter.toUpperCase()}
                            </Text>

                            <Text
                                style={
                                    styles.chapterValue
                                }
                            >
                                {chapter}
                            </Text>
                        </View>

                        <View
                            style={
                                styles.durationBadge
                            }
                        >
                            <Text
                                style={
                                    styles.durationLabel
                                }
                            >
                                {text.duration.toUpperCase()}
                            </Text>

                            <Text
                                style={
                                    styles.durationValue
                                }
                            >
                                {duration} min
                            </Text>
                        </View>
                    </View>

                    <View
                        style={
                            styles.summaryGrid
                        }
                    >
                        <SummaryItem
                            label={
                                text.participant
                            }
                            value={name}
                        />

                        <SummaryItem
                            label={text.place}
                            value={place}
                        />

                        <SummaryItem
                            label={
                                text.language
                            }
                            value={
                                language === 'en'
                                    ? 'English'
                                    : 'தமிழ்'
                            }
                        />

                        <SummaryItem
                            label={text.phone}
                            value={phone}
                        />

                        <SummaryItem
                            label={
                                text.duration
                            }
                            value={`${duration} ${text.minutes}`}
                        />

                        <SummaryItem
                            label={
                                text.chapter
                            }
                            value={chapter}
                        />
                    </View>
                </View>

                {/* ==================================================
            TIPS
        ================================================== */}

                <View style={styles.card}>
                    <View
                        style={styles.tipHeader}
                    >
                        <View
                            style={styles.flex}
                        >
                            <Text
                                style={
                                    styles.sectionEyebrow
                                }
                            >
                                {text.tip.toUpperCase()}
                            </Text>

                            <Text
                                style={
                                    styles.sectionTitle
                                }
                            >
                                {text.quizTips}
                            </Text>
                        </View>

                        <View
                            style={
                                styles.tipNumber
                            }
                        >
                            <Text
                                style={
                                    styles.tipNumberText
                                }
                            >
                                {String(
                                    activeTip + 1
                                ).padStart(2, '0')}

                                <Text
                                    style={
                                        styles.tipSlash
                                    }
                                >
                                    {' / '}
                                </Text>

                                {String(
                                    tips.length
                                ).padStart(2, '0')}
                            </Text>
                        </View>
                    </View>

                    <View
                        style={
                            styles.tipContent
                        }
                    >
                        <View
                            style={
                                styles.bulbBox
                            }
                        >
                            <Text
                                style={styles.bulb}
                            >
                                ♢
                            </Text>
                        </View>

                        <Text
                            style={
                                styles.tipText
                            }
                        >
                            {tips[activeTip]}
                        </Text>
                    </View>

                    {/* TIP DOTS */}

                    <View
                        style={styles.tipDots}
                    >
                        {tips.map(
                            (_, index) => (
                                <Pressable
                                    key={index}
                                    disabled={
                                        isStarting
                                    }
                                    onPress={() =>
                                        setActiveTip(
                                            index
                                        )
                                    }
                                    style={[
                                        styles.tipDot,

                                        index ===
                                        activeTip &&
                                        styles.tipDotActive,
                                    ]}
                                />
                            )
                        )}
                    </View>
                </View>

                {/* ==================================================
            RULES
        ================================================== */}

                <View
                    style={[
                        styles.rulesCard,

                        acceptedRules &&
                        styles.rulesCardAccepted,
                    ]}
                >
                    <View
                        style={
                            styles.rulesHeader
                        }
                    >
                        <View
                            style={[
                                styles.rulesIcon,

                                acceptedRules &&
                                styles.rulesIconAccepted,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.rulesIconText,

                                    acceptedRules &&
                                    styles.rulesIconTextAccepted,
                                ]}
                            >
                                ✓
                            </Text>
                        </View>

                        <View>
                            <Text
                                style={
                                    styles.rulesLabel
                                }
                            >
                                {text.rules.toUpperCase()}
                            </Text>

                            <Text
                                style={
                                    styles.confirmationText
                                }
                            >
                                {text.confirmation}
                            </Text>
                        </View>
                    </View>

                    <Pressable
                        disabled={isStarting}
                        onPress={() =>
                            setAcceptedRules(
                                (current) =>
                                    !current
                            )
                        }
                        style={[
                            styles.acceptBox,

                            acceptedRules &&
                            styles.acceptBoxSelected,
                        ]}
                    >
                        <View
                            style={[
                                styles.checkbox,

                                acceptedRules &&
                                styles.checkboxSelected,
                            ]}
                        >
                            {acceptedRules && (
                                <Text
                                    style={
                                        styles.checkmark
                                    }
                                >
                                    ✓
                                </Text>
                            )}
                        </View>

                        <Text
                            style={
                                styles.acceptText
                            }
                        >
                            {text.accept}
                        </Text>
                    </Pressable>
                </View>

                {/* ==================================================
            ACTIONS
        ================================================== */}

                <View
                    style={styles.actions}
                >
                    <Pressable
                        disabled={
                            !acceptedRules ||
                            isStarting
                        }
                        onPress={
                            startQuizSequence
                        }
                        style={({ pressed }) => [
                            styles.startButton,

                            !acceptedRules &&
                            styles.startButtonDisabled,

                            pressed &&
                            acceptedRules &&
                            !isStarting &&
                            styles.pressed,
                        ]}
                    >
                        {isStarting ? (
                            <>
                                <View
                                    style={
                                        styles.loadingSpinner
                                    }
                                />

                                <Text
                                    style={
                                        styles.startButtonText
                                    }
                                >
                                    {text.starting}
                                </Text>
                            </>
                        ) : (
                            <>
                                <Text
                                    style={
                                        acceptedRules
                                            ? styles.startButtonText
                                            : styles.startButtonTextDisabled
                                    }
                                >
                                    {text.start}
                                </Text>

                                <Text
                                    style={[
                                        styles.startArrow,

                                        !acceptedRules &&
                                        styles.startArrowDisabled,
                                    ]}
                                >
                                    →
                                </Text>
                            </>
                        )}
                    </Pressable>

                    {!acceptedRules && (
                        <Text
                            style={
                                styles.lockedText
                            }
                        >
                            {text.locked}
                        </Text>
                    )}

                    <Pressable
                        disabled={isStarting}
                        onPress={() =>
                            router.back()
                        }
                        style={({ pressed }) => [
                            styles.backButton,

                            pressed &&
                            !isStarting &&
                            styles.pressed,
                        ]}
                    >
                        <Text
                            style={
                                styles.backArrow
                            }
                        >
                            ←
                        </Text>

                        <Text
                            style={
                                styles.backText
                            }
                        >
                            {text.back}
                        </Text>
                    </Pressable>
                </View>

                {/* ==================================================
            FOOTER
        ================================================== */}

                <View
                    style={styles.footer}
                >
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

            {/* ====================================================
          FULL SCREEN COUNTDOWN
      ==================================================== */}

            {readyCountdown !== null &&
                readyCountdown > 0 &&
                isStarting && (
                    <View
                        style={
                            styles.countdownOverlay
                        }
                    >
                        <View
                            style={
                                styles.countdownGlow
                            }
                        />

                        <View
                            style={
                                styles.countdownContent
                            }
                        >
                            <Text
                                style={
                                    styles.countdownEyebrow
                                }
                            >
                                {text.countdownTitle}
                            </Text>

                            <Text
                                style={
                                    styles.countdownNumber
                                }
                            >
                                {readyCountdown}
                            </Text>

                            <Text
                                style={
                                    styles.countdownDescription
                                }
                            >
                                {
                                    text.countdownDescription
                                }
                            </Text>

                            <View
                                style={
                                    styles.countdownDots
                                }
                            >
                                {[5, 4, 3, 2, 1].map(
                                    (number) => (
                                        <View
                                            key={number}
                                            style={[
                                                styles.countdownDot,

                                                number >=
                                                readyCountdown &&
                                                styles.countdownDotActive,
                                            ]}
                                        />
                                    )
                                )}
                            </View>
                        </View>
                    </View>
                )}
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
) {
    if (Array.isArray(value)) {
        return value[0] ?? '';
    }

    return value ?? '';
}

/* ==========================================================
   SUMMARY ITEM
========================================================== */

function SummaryItem({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <View
            style={styles.summaryItem}
        >
            <Text
                style={
                    styles.summaryItemLabel
                }
            >
                {label.toUpperCase()}
            </Text>

            <Text
                style={
                    styles.summaryItemValue
                }
                numberOfLines={2}
            >
                {value || 'N/A'}
            </Text>
        </View>
    );
}

/* ==========================================================
   NO DATA
========================================================== */

function NoQuizData({
    language,
}: {
    language: Language;
}) {
    return (
        <SafeAreaView
            style={
                styles.noDataScreen
            }
        >
            <StatusBar
                barStyle="light-content"
            />

            <View
                style={
                    styles.noDataGlow
                }
            />

            <View
                style={
                    styles.noDataCard
                }
            >
                <View
                    style={
                        styles.noDataIcon
                    }
                >
                    <Text
                        style={
                            styles.noDataIconText
                        }
                    >
                        !
                    </Text>
                </View>

                <Text
                    style={
                        styles.noDataTitle
                    }
                >
                    {language === 'en'
                        ? 'No quiz data found'
                        : 'வினாடி வினா தகவல் இல்லை'}
                </Text>

                <Text
                    style={
                        styles.noDataDescription
                    }
                >
                    {language === 'en'
                        ? 'Please return to the home page and join the quiz again.'
                        : 'முகப்பு பக்கத்திற்கு திரும்பி மீண்டும் வினாடி வினாவில் இணையவும்.'}
                </Text>

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
                            styles.homeButtonText
                        }
                    >
                        {language === 'en'
                            ? 'Back to Home'
                            : 'முகப்பிற்கு திரும்பு'}
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

/* ==========================================================
   STYLES
========================================================== */

const styles =
    StyleSheet.create({
        flex: {
            flex: 1,
        },

        safeArea: {
            flex: 1,
            backgroundColor:
                COLORS.background,
        },

        pressed: {
            opacity: 0.8,

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

            width: 320,
            height: 320,

            borderRadius: 160,

            top: -130,
            left: -160,

            backgroundColor:
                'rgba(109,40,217,0.08)',
        },

        bottomGlow: {
            position: 'absolute',

            width: 380,
            height: 380,

            borderRadius: 190,

            right: -200,
            bottom: -120,

            backgroundColor:
                'rgba(67,56,202,0.07)',
        },

        /* ======================================================
           NAVBAR
        ====================================================== */

        navbar: {
            height: 68,

            paddingHorizontal: 18,

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
        },

        logoBox: {
            width: 36,
            height: 36,

            borderRadius: 11,

            backgroundColor:
                'rgba(139,92,246,0.09)',

            alignItems: 'center',

            justifyContent:
                'center',

            marginRight: 9,
        },

        logoLetter: {
            color:
                COLORS.violetLight,

            fontSize: 18,

            fontWeight: '900',
        },

        brand: {
            color: COLORS.white,

            fontSize: 11,

            fontWeight: '900',

            letterSpacing: 1.2,
        },

        tagline: {
            color: COLORS.zinc700,

            fontSize: 6,

            fontWeight: '800',

            letterSpacing: 1,

            marginTop: 3,
        },

        readyBadge: {
            flexDirection: 'row',

            alignItems: 'center',

            paddingHorizontal: 10,

            paddingVertical: 7,

            borderRadius: 30,

            borderWidth: 1,

            borderColor:
                'rgba(139,92,246,0.15)',

            backgroundColor:
                'rgba(139,92,246,0.07)',
        },

        readyDotOuter: {
            width: 9,
            height: 9,

            borderRadius: 5,

            backgroundColor:
                'rgba(167,139,250,0.12)',

            alignItems: 'center',

            justifyContent:
                'center',

            marginRight: 6,
        },

        readyDot: {
            width: 5,
            height: 5,

            borderRadius: 3,

            backgroundColor:
                COLORS.violetLight,
        },

        readyBadgeText: {
            color:
                COLORS.violetLight,

            fontSize: 7.5,

            fontWeight: '900',

            letterSpacing: 0.8,
        },

        /* ======================================================
           CONTENT
        ====================================================== */

        content: {
            paddingHorizontal: 18,

            paddingTop: 34,

            paddingBottom: 50,
        },

        intro: {
            paddingHorizontal: 2,
        },

        eyebrowRow: {
            flexDirection: 'row',

            alignItems: 'center',

            marginBottom: 13,
        },

        eyebrowLine: {
            width: 24,
            height: 1,

            backgroundColor:
                COLORS.violet,

            marginRight: 9,
        },

        eyebrow: {
            color:
                COLORS.violetLight,

            fontSize: 9,

            fontWeight: '800',

            letterSpacing: 2,
        },

        title: {
            maxWidth: 430,

            color: COLORS.white,

            fontSize: 34,

            lineHeight: 38,

            fontWeight: '900',

            letterSpacing: -1.4,
        },

        description: {
            maxWidth: 500,

            color: COLORS.zinc500,

            fontSize: 12,

            lineHeight: 21,

            marginTop: 13,
        },

        /* ======================================================
           SUMMARY
        ====================================================== */

        summaryCard: {
            position: 'relative',

            overflow: 'hidden',

            marginTop: 28,

            borderRadius: 25,

            borderWidth: 1,

            borderColor:
                COLORS.border,

            backgroundColor:
                COLORS.card,
        },

        summaryGlow: {
            position: 'absolute',

            width: 180,
            height: 180,

            borderRadius: 90,

            right: -90,
            top: -90,

            backgroundColor:
                'rgba(124,58,237,0.05)',
        },

        summaryHeader: {
            minHeight: 96,

            paddingHorizontal: 18,

            paddingVertical: 17,

            flexDirection: 'row',

            alignItems: 'center',

            justifyContent:
                'space-between',

            borderBottomWidth: 1,

            borderBottomColor:
                COLORS.softBorder,
        },

        summaryChapter: {
            flex: 1,

            paddingRight: 15,
        },

        summaryLabel: {
            color: COLORS.zinc600,

            fontSize: 8,

            fontWeight: '800',

            letterSpacing: 1.5,
        },

        chapterValue: {
            color: COLORS.white,

            fontSize: 20,

            lineHeight: 25,

            fontWeight: '900',

            marginTop: 7,
        },

        durationBadge: {
            minWidth: 78,

            paddingHorizontal: 11,

            paddingVertical: 9,

            borderRadius: 14,

            borderWidth: 1,

            borderColor:
                'rgba(139,92,246,0.15)',

            backgroundColor:
                'rgba(139,92,246,0.07)',

            alignItems: 'flex-end',
        },

        durationLabel: {
            color:
                'rgba(167,139,250,0.7)',

            fontSize: 7,

            fontWeight: '800',

            letterSpacing: 1,
        },

        durationValue: {
            color: '#C4B5FD',

            fontSize: 13,

            fontWeight: '900',

            marginTop: 3,
        },

        summaryGrid: {
            flexDirection: 'row',

            flexWrap: 'wrap',

            backgroundColor:
                'rgba(255,255,255,0.05)',
        },

        summaryItem: {
            width: '50%',

            minHeight: 75,

            paddingHorizontal: 14,

            paddingVertical: 13,

            backgroundColor:
                COLORS.card,

            borderRightWidth: 1,

            borderBottomWidth: 1,

            borderColor:
                'rgba(255,255,255,0.05)',
        },

        summaryItemLabel: {
            color: COLORS.zinc600,

            fontSize: 7,

            fontWeight: '800',

            letterSpacing: 1,
        },

        summaryItemValue: {
            color: COLORS.zinc300,

            fontSize: 11,

            lineHeight: 17,

            fontWeight: '700',

            marginTop: 6,
        },

        /* ======================================================
           GENERAL CARD
        ====================================================== */

        card: {
            marginTop: 14,

            padding: 18,

            borderRadius: 25,

            borderWidth: 1,

            borderColor:
                COLORS.border,

            backgroundColor:
                COLORS.card,
        },

        /* ======================================================
           TIPS
        ====================================================== */

        tipHeader: {
            flexDirection: 'row',

            alignItems: 'center',

            justifyContent:
                'space-between',
        },

        sectionEyebrow: {
            color:
                COLORS.violetLight,

            fontSize: 8,

            fontWeight: '800',

            letterSpacing: 1.4,
        },

        sectionTitle: {
            color: COLORS.white,

            fontSize: 16,

            fontWeight: '900',

            marginTop: 5,
        },

        tipNumber: {
            minWidth: 45,

            height: 39,

            paddingHorizontal: 9,

            borderRadius: 11,

            borderWidth: 1,

            borderColor:
                COLORS.softBorder,

            backgroundColor:
                'rgba(255,255,255,0.025)',

            alignItems: 'center',

            justifyContent:
                'center',
        },

        tipNumberText: {
            color: COLORS.zinc500,

            fontSize: 9,

            fontWeight: '700',
        },

        tipSlash: {
            color: COLORS.zinc700,
        },

        tipContent: {
            minHeight: 96,

            marginTop: 18,

            padding: 14,

            borderRadius: 16,

            borderWidth: 1,

            borderColor:
                COLORS.softBorder,

            backgroundColor:
                'rgba(255,255,255,0.025)',

            flexDirection: 'row',

            alignItems: 'center',
        },

        bulbBox: {
            width: 34,
            height: 34,

            borderRadius: 11,

            backgroundColor:
                'rgba(139,92,246,0.10)',

            alignItems: 'center',

            justifyContent:
                'center',

            marginRight: 12,
        },

        bulb: {
            color:
                COLORS.violetLight,

            fontSize: 17,

            fontWeight: '900',
        },

        tipText: {
            flex: 1,

            color: COLORS.zinc300,

            fontSize: 12,

            lineHeight: 20,

            fontWeight: '500',
        },

        tipDots: {
            flexDirection: 'row',

            alignItems: 'center',

            gap: 6,

            marginTop: 14,
        },

        tipDot: {
            width: 6,
            height: 6,

            borderRadius: 4,

            backgroundColor:
                COLORS.zinc800,
        },

        tipDotActive: {
            width: 24,

            backgroundColor:
                COLORS.violet,
        },

        /* ======================================================
           RULES
        ====================================================== */

        rulesCard: {
            marginTop: 14,

            padding: 18,

            borderRadius: 25,

            borderWidth: 1,

            borderColor:
                COLORS.border,

            backgroundColor:
                COLORS.card,
        },

        rulesCardAccepted: {
            borderColor:
                'rgba(139,92,246,0.20)',

            backgroundColor:
                'rgba(139,92,246,0.045)',
        },

        rulesHeader: {
            flexDirection: 'row',

            alignItems: 'center',

            marginBottom: 15,
        },

        rulesIcon: {
            width: 37,
            height: 37,

            borderRadius: 11,

            alignItems: 'center',

            justifyContent:
                'center',

            backgroundColor:
                'rgba(255,255,255,0.03)',

            marginRight: 11,
        },

        rulesIconAccepted: {
            backgroundColor:
                'rgba(139,92,246,0.10)',
        },

        rulesIconText: {
            color: COLORS.zinc600,

            fontSize: 14,

            fontWeight: '900',
        },

        rulesIconTextAccepted: {
            color:
                COLORS.violetLight,
        },

        rulesLabel: {
            color: COLORS.zinc600,

            fontSize: 8,

            fontWeight: '800',

            letterSpacing: 1.3,
        },

        confirmationText: {
            color: COLORS.zinc400,

            fontSize: 11,

            fontWeight: '600',

            marginTop: 4,
        },

        acceptBox: {
            padding: 14,

            borderRadius: 16,

            borderWidth: 1,

            borderColor:
                COLORS.softBorder,

            backgroundColor:
                'rgba(255,255,255,0.02)',

            flexDirection: 'row',

            alignItems:
                'flex-start',
        },

        acceptBoxSelected: {
            borderColor:
                'rgba(139,92,246,0.20)',

            backgroundColor:
                'rgba(139,92,246,0.06)',
        },

        checkbox: {
            width: 20,
            height: 20,

            borderRadius: 6,

            borderWidth: 1,

            borderColor:
                COLORS.zinc700,

            backgroundColor:
                COLORS.background,

            alignItems: 'center',

            justifyContent:
                'center',

            marginTop: 1,
        },

        checkboxSelected: {
            borderColor:
                COLORS.violet,

            backgroundColor:
                COLORS.violet,
        },

        checkmark: {
            color: COLORS.white,

            fontSize: 12,

            fontWeight: '900',
        },

        acceptText: {
            flex: 1,

            color: COLORS.zinc400,

            fontSize: 11,

            lineHeight: 19,

            fontWeight: '500',

            marginLeft: 11,
        },

        /* ======================================================
           ACTIONS
        ====================================================== */

        actions: {
            marginTop: 18,
        },

        startButton: {
            minHeight: 58,

            borderRadius: 17,

            paddingHorizontal: 18,

            backgroundColor:
                COLORS.violet,

            flexDirection: 'row',

            alignItems: 'center',

            justifyContent:
                'center',
        },

        startButtonDisabled: {
            borderWidth: 1,

            borderColor:
                'rgba(255,255,255,0.05)',

            backgroundColor:
                'rgba(255,255,255,0.035)',
        },

        startButtonText: {
            color: COLORS.white,

            fontSize: 13,

            fontWeight: '900',
        },

        startButtonTextDisabled: {
            color: COLORS.zinc700,

            fontSize: 13,

            fontWeight: '900',
        },

        startArrow: {
            color: COLORS.white,

            fontSize: 17,

            marginLeft: 9,
        },

        startArrowDisabled: {
            color: COLORS.zinc700,
        },

        loadingSpinner: {
            width: 16,
            height: 16,

            borderRadius: 8,

            borderWidth: 2,

            borderColor:
                'rgba(255,255,255,0.25)',

            borderTopColor:
                COLORS.white,

            marginRight: 9,
        },

        lockedText: {
            color: COLORS.zinc700,

            fontSize: 9,

            fontWeight: '500',

            textAlign: 'center',

            marginTop: 9,
        },

        backButton: {
            minHeight: 52,

            marginTop: 12,

            borderRadius: 17,

            borderWidth: 1,

            borderColor:
                'rgba(255,255,255,0.07)',

            backgroundColor:
                'rgba(255,255,255,0.02)',

            flexDirection: 'row',

            alignItems: 'center',

            justifyContent:
                'center',
        },

        backArrow: {
            color: COLORS.zinc500,

            fontSize: 15,

            marginRight: 8,
        },

        backText: {
            color: COLORS.zinc500,

            fontSize: 11,

            fontWeight: '700',
        },

        /* ======================================================
           FOOTER
        ====================================================== */

        footer: {
            marginTop: 34,

            paddingTop: 22,

            borderTopWidth: 1,

            borderTopColor:
                'rgba(255,255,255,0.05)',

            alignItems: 'center',
        },

        footerText: {
            color: COLORS.zinc700,

            fontSize: 9,

            fontWeight: '500',

            letterSpacing: 0.3,
        },

        /* ======================================================
           COUNTDOWN
        ====================================================== */

        countdownOverlay: {
            ...StyleSheet.absoluteFill,
            zIndex: 100,

            backgroundColor:
                'rgba(9,9,11,0.98)',

            alignItems: 'center',

            justifyContent:
                'center',

            paddingHorizontal: 25,
        },

        countdownGlow: {
            position: 'absolute',

            width: 300,
            height: 300,

            borderRadius: 150,

            backgroundColor:
                'rgba(109,40,217,0.12)',
        },

        countdownContent: {
            alignItems: 'center',
        },

        countdownEyebrow: {
            color:
                COLORS.violetLight,

            fontSize: 10,

            fontWeight: '900',

            letterSpacing: 3,
        },

        countdownNumber: {
            color: COLORS.white,

            fontSize: 130,

            lineHeight: 150,

            fontWeight: '900',

            letterSpacing: -8,

            marginVertical: 16,

            textShadowColor:
                'rgba(139,92,246,0.35)',

            textShadowRadius: 35,
        },

        countdownDescription: {
            color: COLORS.zinc500,

            fontSize: 13,

            fontWeight: '500',

            textAlign: 'center',
        },

        countdownDots: {
            flexDirection: 'row',

            gap: 7,

            marginTop: 30,
        },

        countdownDot: {
            width: 6,
            height: 6,

            borderRadius: 4,

            backgroundColor:
                COLORS.zinc800,
        },

        countdownDotActive: {
            width: 24,

            backgroundColor:
                COLORS.violet,
        },

        /* ======================================================
           NO DATA
        ====================================================== */

        noDataScreen: {
            flex: 1,

            backgroundColor:
                COLORS.background,

            alignItems: 'center',

            justifyContent:
                'center',

            paddingHorizontal: 20,
        },

        noDataGlow: {
            position: 'absolute',

            width: 320,
            height: 320,

            borderRadius: 160,

            backgroundColor:
                'rgba(109,40,217,0.08)',
        },

        noDataCard: {
            width: '100%',

            maxWidth: 380,

            padding: 24,

            borderRadius: 25,

            borderWidth: 1,

            borderColor:
                COLORS.border,

            backgroundColor:
                COLORS.card,

            alignItems: 'center',
        },

        noDataIcon: {
            width: 50,
            height: 50,

            borderRadius: 16,

            backgroundColor:
                'rgba(239,68,68,0.07)',

            borderWidth: 1,

            borderColor:
                'rgba(239,68,68,0.15)',

            alignItems: 'center',

            justifyContent:
                'center',
        },

        noDataIconText: {
            color: '#F87171',

            fontSize: 20,

            fontWeight: '900',
        },

        noDataTitle: {
            color: COLORS.white,

            fontSize: 20,

            fontWeight: '900',

            marginTop: 18,

            textAlign: 'center',
        },

        noDataDescription: {
            color: COLORS.zinc500,

            fontSize: 11,

            lineHeight: 19,

            marginTop: 8,

            textAlign: 'center',
        },

        homeButton: {
            width: '100%',

            minHeight: 52,

            marginTop: 22,

            borderRadius: 16,

            backgroundColor:
                COLORS.violet,

            alignItems: 'center',

            justifyContent:
                'center',
        },

        homeButtonText: {
            color: COLORS.white,

            fontSize: 12,

            fontWeight: '800',
        },
    });