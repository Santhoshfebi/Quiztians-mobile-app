import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';

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

type Language = 'en' | 'ta';

const COLORS = {
    background: '#09090B',
    card: '#111114',

    white: '#FFFFFF',
    zinc200: '#E4E4E7',
    zinc300: '#D4D4D8',
    zinc400: '#A1A1AA',
    zinc500: '#71717A',
    zinc600: '#52525B',
    zinc700: '#3F3F46',

    violet: '#8B5CF6',
    violetLight: '#A78BFA',
    indigo: '#6366F1',
    blue: '#60A5FA',

    emerald: '#34D399',

    border: 'rgba(255,255,255,0.08)',
    softBorder: 'rgba(255,255,255,0.06)',
};

/* ==========================================================
   SCREEN
========================================================== */

export default function PreviousResultScreen() {
    const params = useLocalSearchParams<{
        language?: string;
        name?: string;
        phone?: string;
        place?: string;
        chapter?: string;
        score?: string;
        total?: string;
        attemptedAt?: string;
        created_at?: string;
    }>();

    const language: Language =
        params.language === 'ta' ? 'ta' : 'en';

    const name = getParam(params.name);
    const place = getParam(params.place);
    const chapter = getParam(params.chapter);

    const score = getParam(params.score);
    const total = getParam(params.total);

    /*
     * Supports both navigation styles,
     * exactly like the website.
     */
    const attemptedAt =
        getParam(params.attemptedAt) ||
        getParam(params.created_at);

    /* ========================================================
       SCORE
    ======================================================== */

    const scoreData = useMemo(() => {
        if (!score || !total) {
            return {
                valid: false,
                score: 0,
                total: 0,
                percentage: null as number | null,
            };
        }

        const numericScore = Number(score);
        const numericTotal = Number(total);

        if (
            Number.isNaN(numericScore) ||
            Number.isNaN(numericTotal) ||
            numericTotal <= 0
        ) {
            return {
                valid: false,
                score: numericScore,
                total: numericTotal,
                percentage: null as number | null,
            };
        }

        return {
            valid: true,
            score: numericScore,
            total: numericTotal,
            percentage: Math.round(
                (numericScore / numericTotal) * 100
            ),
        };
    }, [score, total]);

    /* ========================================================
       TRANSLATIONS
    ======================================================== */

    const text = {
        previousAttempt:
            language === 'en'
                ? 'Previous Attempt'
                : 'முந்தைய முயற்சி',

        title:
            language === 'en'
                ? "You've already completed this quiz."
                : 'இந்த வினாடி வினாவை நீங்கள் ஏற்கனவே முடித்துவிட்டீர்கள்.',

        description:
            language === 'en'
                ? 'Your previous result is saved below. Each chapter can only be attempted once.'
                : 'உங்கள் முந்தைய முடிவு கீழே சேமிக்கப்பட்டுள்ளது. ஒவ்வொரு அதிகாரத்தையும் ஒருமுறை மட்டுமே முயற்சிக்க முடியும்.',

        chapter:
            language === 'en'
                ? 'Chapter'
                : 'அதிகாரம்',

        score:
            language === 'en'
                ? 'Your Score'
                : 'உங்கள் மதிப்பெண்',

        participant:
            language === 'en'
                ? 'Participant'
                : 'பங்கேற்பாளர்',

        place:
            language === 'en'
                ? 'Place'
                : 'இடம்',

        attempted:
            language === 'en'
                ? 'Attempted'
                : 'முயற்சித்த தேதி',

        completed:
            language === 'en'
                ? 'Completed'
                : 'முடிந்தது',

        backHome:
            language === 'en'
                ? 'Back to Home'
                : 'முகப்பிற்கு திரும்பு',

        helpTitle:
            language === 'en'
                ? 'Think something is wrong?'
                : 'ஏதேனும் தவறு இருப்பதாக நினைக்கிறீர்களா?',

        helpText:
            language === 'en'
                ? 'Contact the quiz administrator for assistance.'
                : 'உதவிக்கு வினாடி வினா நிர்வாகியை தொடர்பு கொள்ளவும்.',

        unavailable:
            language === 'en'
                ? 'Score unavailable'
                : 'மதிப்பெண் கிடைக்கவில்லை',
    };

    /* ========================================================
       DATE
    ======================================================== */

    function formatDate(date?: string) {
        if (!date) {
            return language === 'en'
                ? 'N/A'
                : 'தகவல் இல்லை';
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return language === 'en'
                ? 'N/A'
                : 'தகவல் இல்லை';
        }

        try {
            return parsedDate.toLocaleString(
                language === 'ta'
                    ? 'ta-IN'
                    : 'en-IN',
                {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                }
            );
        } catch {
            return parsedDate.toLocaleString();
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar
                barStyle="light-content"
            />

            {/* ====================================================
          BACKGROUND
      ==================================================== */}

            <View
                pointerEvents="none"
                style={StyleSheet.absoluteFill}
            >
                <View style={styles.topGlow} />
                <View style={styles.bottomGlow} />
            </View>

            {/* ====================================================
          NAVBAR
      ==================================================== */}

            <View style={styles.navbar}>
                <Pressable
                    onPress={() => router.replace('/')}
                    style={({ pressed }) => [
                        styles.brandButton,
                        pressed && styles.pressed,
                    ]}
                >
                    <Image
                        source={require('../../assets/images/quiztians-q.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    <View style={styles.brandContent}>
                        <Image
                            source={require('../../assets/images/quiztians-wordmark.png')}
                            style={styles.wordmark}
                            resizeMode="contain"
                        />

                        <Text style={styles.tagline}>
                            LEARN • PLAY • COMPETE
                        </Text>
                    </View>
                </Pressable>

                {/* COMPLETED */}

                <View style={styles.completedBadge}>
                    <View style={styles.completedDotOuter}>
                        <View style={styles.completedDot} />
                    </View>

                    <Text style={styles.completedText}>
                        {text.completed.toUpperCase()}
                    </Text>
                </View>
            </View>

            {/* ====================================================
          CONTENT
      ==================================================== */}

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                {/* ==================================================
            INTRO
        ================================================== */}

                <View style={styles.intro}>
                    <View style={styles.eyebrowRow}>
                        <View style={styles.eyebrowLine} />

                        <Text style={styles.eyebrow}>
                            {text.previousAttempt.toUpperCase()}
                        </Text>
                    </View>

                    <Text style={styles.title}>
                        {text.title}
                    </Text>

                    <Text style={styles.description}>
                        {text.description}
                    </Text>
                </View>

                {/* ==================================================
            RESULT TICKET
        ================================================== */}

                <View style={styles.ticket}>
                    {/* ================================================
              TOP
          ================================================ */}

                    <View style={styles.ticketTop}>
                        <View style={styles.ticketGlow} />

                        {/* CHAPTER */}

                        <View style={styles.chapterRow}>
                            <View style={styles.chapterContent}>
                                <Text style={styles.ticketLabel}>
                                    {text.chapter.toUpperCase()}
                                </Text>

                                <Text
                                    style={styles.chapter}
                                    numberOfLines={3}
                                >
                                    {chapter || 'N/A'}
                                </Text>
                            </View>

                            <View style={styles.checkContainer}>
                                <Text style={styles.check}>
                                    ✓
                                </Text>
                            </View>
                        </View>

                        {/* ==============================================
                SCORE
            ============================================== */}

                        {scoreData.valid ? (
                            <View style={styles.scoreSection}>
                                <Text style={styles.scoreLabel}>
                                    {text.score.toUpperCase()}
                                </Text>

                                <View style={styles.scoreRow}>
                                    <Text style={styles.scoreNumber}>
                                        {scoreData.score}
                                    </Text>

                                    <Text style={styles.scoreTotal}>
                                        / {scoreData.total}
                                    </Text>
                                </View>

                                {scoreData.percentage !== null && (
                                    <>
                                        <Text style={styles.percentage}>
                                            {scoreData.percentage}%
                                        </Text>

                                        <View
                                            style={
                                                styles.progressBackground
                                            }
                                        >
                                            <View
                                                style={[
                                                    styles.progressFill,
                                                    {
                                                        width: `${Math.min(
                                                            Math.max(
                                                                scoreData.percentage,
                                                                0
                                                            ),
                                                            100
                                                        )}%`,
                                                    },
                                                ]}
                                            />
                                        </View>
                                    </>
                                )}
                            </View>
                        ) : (
                            <View
                                style={styles.scoreUnavailable}
                            >
                                <Text
                                    style={
                                        styles.scoreUnavailableLabel
                                    }
                                >
                                    {text.score.toUpperCase()}
                                </Text>

                                <Text
                                    style={
                                        styles.scoreUnavailableText
                                    }
                                >
                                    {text.unavailable}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* ================================================
              PERFORATION
          ================================================ */}

                    <View style={styles.perforation}>
                        <View style={styles.leftCut} />

                        <View style={styles.perforationLine}>
                            {Array.from({
                                length: 18,
                            }).map((_, index) => (
                                <View
                                    key={index}
                                    style={styles.dash}
                                />
                            ))}
                        </View>

                        <View style={styles.rightCut} />
                    </View>

                    {/* ================================================
              BOTTOM
          ================================================ */}

                    <View style={styles.ticketBottom}>
                        {/* PARTICIPANT + PLACE */}

                        <View style={styles.detailsRow}>
                            <View style={styles.detailColumn}>
                                <Text style={styles.detailLabel}>
                                    {text.participant.toUpperCase()}
                                </Text>

                                <Text
                                    style={styles.detailValue}
                                    numberOfLines={3}
                                >
                                    {name || 'N/A'}
                                </Text>
                            </View>

                            <View style={styles.verticalDivider} />

                            <View style={styles.detailColumn}>
                                <Text style={styles.detailLabel}>
                                    {text.place.toUpperCase()}
                                </Text>

                                <Text
                                    style={styles.detailValue}
                                    numberOfLines={3}
                                >
                                    {place || 'N/A'}
                                </Text>
                            </View>
                        </View>

                        {/* ATTEMPT DATE */}

                        <View style={styles.attemptRow}>
                            <View style={styles.attemptContent}>
                                <Text style={styles.detailLabel}>
                                    {text.attempted.toUpperCase()}
                                </Text>

                                <Text style={styles.attemptDate}>
                                    {formatDate(attemptedAt)}
                                </Text>
                            </View>

                            <View style={styles.calendarBox}>
                                <Text style={styles.calendarIcon}>
                                    ◫
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* ==================================================
            BACK HOME
        ================================================== */}

                <Pressable
                    onPress={() => router.replace('/')}
                    style={({ pressed }) => [
                        styles.homeButton,
                        pressed && styles.pressed,
                    ]}
                >
                    <Text style={styles.homeArrow}>
                        ←
                    </Text>

                    <Text style={styles.homeText}>
                        {text.backHome}
                    </Text>
                </Pressable>

                {/* ==================================================
            HELP
        ================================================== */}

                <View style={styles.help}>
                    <Text style={styles.helpTitle}>
                        {text.helpTitle}
                    </Text>

                    <Text style={styles.helpText}>
                        {text.helpText}
                    </Text>
                </View>

                {/* ==================================================
            FOOTER
        ================================================== */}

                <View style={styles.footer}>
                    <Text style={styles.footerCopyright}>
                        © {new Date().getFullYear()} Quiztians
                    </Text>

                    <Text style={styles.footerTagline}>
                        {language === 'en'
                            ? 'Learn • Play • Compete'
                            : 'கற்றுக்கொள் • விளையாடு • போட்டியிடு'}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

/* ==========================================================
   PARAM HELPER
========================================================== */

function getParam(
    value: string | string[] | undefined
) {
    if (Array.isArray(value)) {
        return value[0] ?? '';
    }

    return value ?? '';
}

/* ==========================================================
   STYLES
========================================================== */

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    pressed: {
        opacity: 0.78,
        transform: [{ scale: 0.985 }],
    },

    /* BACKGROUND */

    topGlow: {
        position: 'absolute',

        width: 320,
        height: 320,

        borderRadius: 160,

        left: -160,
        top: -80,

        backgroundColor:
            'rgba(109,40,217,0.10)',
    },

    bottomGlow: {
        position: 'absolute',

        width: 380,
        height: 380,

        borderRadius: 190,

        right: -210,
        bottom: -100,

        backgroundColor:
            'rgba(67,56,202,0.09)',
    },

    /* NAVBAR */

    navbar: {
        minHeight: 68,

        paddingHorizontal: 16,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

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

        paddingRight: 10,
    },

    logo: {
        width: 35,
        height: 35,
    },

    brandContent: {
        flex: 1,
        marginLeft: 8,
    },

    wordmark: {
        width: 110,
        height: 24,
    },

    tagline: {
        color: COLORS.zinc700,

        fontSize: 6,
        fontWeight: '800',

        letterSpacing: 1,

        marginTop: 1,
    },

    completedBadge: {
        flexDirection: 'row',
        alignItems: 'center',

        paddingHorizontal: 9,
        paddingVertical: 7,

        borderRadius: 30,

        borderWidth: 1,
        borderColor:
            'rgba(52,211,153,0.15)',

        backgroundColor:
            'rgba(52,211,153,0.07)',
    },

    completedDotOuter: {
        width: 9,
        height: 9,

        borderRadius: 5,

        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor:
            'rgba(52,211,153,0.12)',

        marginRight: 6,
    },

    completedDot: {
        width: 5,
        height: 5,

        borderRadius: 3,

        backgroundColor: COLORS.emerald,
    },

    completedText: {
        color: COLORS.emerald,

        fontSize: 7.5,
        fontWeight: '900',

        letterSpacing: 0.8,
    },

    /* CONTENT */

    content: {
        paddingHorizontal: 18,
        paddingTop: 35,
        paddingBottom: 30,
    },

    intro: {
        paddingHorizontal: 2,
    },

    eyebrowRow: {
        flexDirection: 'row',
        alignItems: 'center',

        marginBottom: 14,
    },

    eyebrowLine: {
        width: 24,
        height: 1,

        backgroundColor: COLORS.violet,

        marginRight: 9,
    },

    eyebrow: {
        color: COLORS.violetLight,

        fontSize: 9,
        fontWeight: '800',

        letterSpacing: 1.8,
    },

    title: {
        maxWidth: 420,

        color: COLORS.white,

        fontSize: 31,
        lineHeight: 36,

        fontWeight: '900',

        letterSpacing: -1.3,
    },

    description: {
        maxWidth: 440,

        color: COLORS.zinc500,

        fontSize: 12,
        lineHeight: 21,

        marginTop: 13,
    },

    /* TICKET */

    ticket: {
        marginTop: 28,
    },

    ticketTop: {
        position: 'relative',

        overflow: 'hidden',

        paddingHorizontal: 19,
        paddingTop: 19,
        paddingBottom: 25,

        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,

        borderWidth: 1,
        borderBottomWidth: 0,

        borderColor: COLORS.border,

        backgroundColor: COLORS.card,
    },

    ticketGlow: {
        position: 'absolute',

        width: 190,
        height: 190,

        borderRadius: 95,

        right: -95,
        top: -95,

        backgroundColor:
            'rgba(124,58,237,0.08)',
    },

    chapterRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },

    chapterContent: {
        flex: 1,
        paddingRight: 16,
    },

    ticketLabel: {
        color: COLORS.zinc600,

        fontSize: 8,
        fontWeight: '800',

        letterSpacing: 1.7,
    },

    chapter: {
        color: COLORS.white,

        fontSize: 21,
        lineHeight: 27,

        fontWeight: '900',

        letterSpacing: -0.4,

        marginTop: 7,
    },

    checkContainer: {
        width: 42,
        height: 42,

        borderRadius: 15,

        alignItems: 'center',
        justifyContent: 'center',

        borderWidth: 1,
        borderColor:
            'rgba(52,211,153,0.15)',

        backgroundColor:
            'rgba(52,211,153,0.10)',
    },

    check: {
        color: COLORS.emerald,

        fontSize: 16,
        fontWeight: '900',
    },

    /* SCORE */

    scoreSection: {
        alignItems: 'center',

        paddingTop: 35,
        paddingBottom: 2,
    },

    scoreLabel: {
        color: COLORS.zinc600,

        fontSize: 8,
        fontWeight: '800',

        letterSpacing: 1.8,
    },

    scoreRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',

        marginTop: 9,
    },

    scoreNumber: {
        color: COLORS.violetLight,

        fontSize: 67,
        lineHeight: 72,

        fontWeight: '900',

        letterSpacing: -4,
    },

    scoreTotal: {
        color: COLORS.zinc700,

        fontSize: 21,
        fontWeight: '800',

        marginLeft: 8,
        marginBottom: 7,
    },

    percentage: {
        color: COLORS.zinc400,

        fontSize: 13,
        fontWeight: '800',

        marginTop: 4,
    },

    progressBackground: {
        width: '75%',
        maxWidth: 240,

        height: 6,

        borderRadius: 10,

        overflow: 'hidden',

        backgroundColor:
            'rgba(255,255,255,0.06)',

        marginTop: 14,
    },

    progressFill: {
        height: '100%',

        borderRadius: 10,

        backgroundColor: COLORS.violet,
    },

    scoreUnavailable: {
        alignItems: 'center',

        paddingTop: 35,
        paddingBottom: 12,
    },

    scoreUnavailableLabel: {
        color: COLORS.zinc600,

        fontSize: 8,
        fontWeight: '800',

        letterSpacing: 1.8,
    },

    scoreUnavailableText: {
        color: COLORS.zinc500,

        fontSize: 13,
        fontWeight: '700',

        marginTop: 11,
    },

    /* PERFORATION */

    perforation: {
        position: 'relative',

        height: 29,

        backgroundColor: COLORS.card,

        borderLeftWidth: 1,
        borderRightWidth: 1,

        borderColor: COLORS.border,

        alignItems: 'center',
        justifyContent: 'center',

        overflow: 'visible',
    },

    perforationLine: {
        width: '88%',

        flexDirection: 'row',
        justifyContent: 'space-between',

        overflow: 'hidden',
    },

    dash: {
        width: 7,
        height: 1,

        backgroundColor:
            'rgba(255,255,255,0.11)',
    },

    leftCut: {
        position: 'absolute',

        left: -14,

        width: 27,
        height: 27,

        borderRadius: 14,

        zIndex: 10,

        backgroundColor: COLORS.background,

        borderRightWidth: 1,
        borderRightColor: COLORS.border,
    },

    rightCut: {
        position: 'absolute',

        right: -14,

        width: 27,
        height: 27,

        borderRadius: 14,

        zIndex: 10,

        backgroundColor: COLORS.background,

        borderLeftWidth: 1,
        borderLeftColor: COLORS.border,
    },

    /* TICKET BOTTOM */

    ticketBottom: {
        paddingHorizontal: 19,
        paddingTop: 12,
        paddingBottom: 20,

        borderBottomLeftRadius: 26,
        borderBottomRightRadius: 26,

        borderWidth: 1,
        borderTopWidth: 0,

        borderColor: COLORS.border,

        backgroundColor: COLORS.card,
    },

    detailsRow: {
        flexDirection: 'row',

        paddingBottom: 19,
    },

    detailColumn: {
        flex: 1,

        paddingHorizontal: 3,
    },

    verticalDivider: {
        width: 1,

        backgroundColor:
            'rgba(255,255,255,0.06)',

        marginHorizontal: 14,
    },

    detailLabel: {
        color: COLORS.zinc600,

        fontSize: 8,
        fontWeight: '800',

        letterSpacing: 1.1,
    },

    detailValue: {
        color: COLORS.zinc200,

        fontSize: 13,
        lineHeight: 19,

        fontWeight: '800',

        marginTop: 7,
    },

    /* DATE */

    attemptRow: {
        minHeight: 76,

        paddingTop: 18,

        borderTopWidth: 1,
        borderTopColor:
            'rgba(255,255,255,0.06)',

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    attemptContent: {
        flex: 1,

        paddingRight: 15,
    },

    attemptDate: {
        color: COLORS.zinc300,

        fontSize: 11,
        lineHeight: 18,

        fontWeight: '600',

        marginTop: 7,
    },

    calendarBox: {
        width: 40,
        height: 40,

        borderRadius: 12,

        alignItems: 'center',
        justifyContent: 'center',

        borderWidth: 1,
        borderColor:
            'rgba(255,255,255,0.06)',

        backgroundColor:
            'rgba(255,255,255,0.025)',
    },

    calendarIcon: {
        color: COLORS.zinc500,

        fontSize: 18,
    },

    /* HOME */

    homeButton: {
        minHeight: 56,

        marginTop: 18,

        paddingHorizontal: 20,

        borderRadius: 17,

        borderWidth: 1,
        borderColor:
            'rgba(255,255,255,0.08)',

        backgroundColor:
            'rgba(255,255,255,0.025)',

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    homeArrow: {
        color: COLORS.zinc300,

        fontSize: 16,

        marginRight: 9,
    },

    homeText: {
        color: COLORS.zinc300,

        fontSize: 12,
        fontWeight: '800',
    },

    /* HELP */

    help: {
        alignItems: 'center',

        marginTop: 26,

        paddingHorizontal: 10,
    },

    helpTitle: {
        color: COLORS.zinc500,

        fontSize: 10,
        fontWeight: '700',

        textAlign: 'center',
    },

    helpText: {
        color: COLORS.zinc700,

        fontSize: 9,
        lineHeight: 17,

        textAlign: 'center',

        marginTop: 4,
    },

    /* FOOTER */

    footer: {
        marginTop: 35,

        paddingTop: 20,

        borderTopWidth: 1,
        borderTopColor:
            'rgba(255,255,255,0.05)',

        alignItems: 'center',
    },

    footerCopyright: {
        color: COLORS.zinc700,

        fontSize: 9,
    },

    footerTagline: {
        color: COLORS.zinc700,

        fontSize: 9,
        fontWeight: '600',

        marginTop: 6,
    },
});