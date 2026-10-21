import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    router,
    useLocalSearchParams,
} from 'expo-router';

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import {
    Alert,
    AppState,
    AppStateStatus,
    Pressable,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';

/* ==========================================================
   QUIZ COMPONENTS
========================================================== */

import AnswerOption from '../components/quiz/AnswerOption';
import NoQuestions from '../components/quiz/NoQuestions';
import QuestionCard from '../components/quiz/QuestionCard';
import QuizHeader from '../components/quiz/QuizHeader';
import QuizLoading from '../components/quiz/QuizLoading';
import QuizProgress from '../components/quiz/QuizProgress';
import WarningBanner from '../components/quiz/WarningBanner';

/* ==========================================================
   SERVICES
========================================================== */

import {
    AnswerHistoryPayload,
    getExistingAttempt,
    getQuizQuestions,
    QuizQuestion,
    saveAnswerHistory,
    saveQuizResult,
} from '../services/quizAttemptService';

/* ==========================================================
   TYPES
========================================================== */

type Language = 'en' | 'ta';

type TrackedAnswer = {
    question: string;
    correct_answer: string;
    user_answer: string;
    chapter: string;
    lang: Language;
};

/* ==========================================================
   QUIZ SCREEN
========================================================== */

export default function QuizScreen() {
    /* ========================================================
       ROUTE PARAMS
    ======================================================== */

    const params = useLocalSearchParams<{
        name?: string;
        phone?: string;
        place?: string;
        chapter?: string;
        language?: string;
        duration?: string;
    }>();

    const name = getParam(params.name);
    const phone = getParam(params.phone);
    const place = getParam(params.place);
    const chapter = getParam(params.chapter);

    const language: Language =
        getParam(params.language) === 'ta'
            ? 'ta'
            : 'en';

    const parsedDuration = Number(
        getParam(params.duration)
    );

    const duration =
        Number.isFinite(parsedDuration) &&
            parsedDuration > 0
            ? parsedDuration
            : 20;

    const totalSeconds = duration * 60;

    /* ========================================================
       STATE
    ======================================================== */

    const [questions, setQuestions] =
        useState<QuizQuestion[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [loadError, setLoadError] =
        useState<string | null>(null);

    const [current, setCurrent] =
        useState(0);

    const [score, setScore] =
        useState(0);

    const [selected, setSelected] =
        useState<string | null>(null);

    const [showAnswer, setShowAnswer] =
        useState(false);

    const [hasSubmitted, setHasSubmitted] =
        useState(false);

    const [timeLeft, setTimeLeft] =
        useState(totalSeconds);

    const [warningCount, setWarningCount] =
        useState(0);

    /* ========================================================
       REFS
    ======================================================== */

    const scoreRef = useRef(0);

    const submittedRef =
        useRef(false);

    const answersRef =
        useRef<TrackedAnswer[]>([]);

    const startTimeRef =
        useRef<string>(
            new Date().toISOString()
        );

    const appStateRef =
        useRef<AppStateStatus>(
            AppState.currentState
        );

    const hasLeftActiveRef =
        useRef(false);

    /*
     * Website allows 4 warnings.
     * The 5th leave event submits the quiz.
     */
    const maxWarnings = 5;

    const attemptKey =
        `quiz_${phone || 'guest'}_${chapter || 'unknown'}`;

    /* ========================================================
       TRANSLATIONS
    ======================================================== */

    const text = useMemo(
        () => ({
            question:
                language === 'en'
                    ? 'Question'
                    : 'கேள்வி',

            chapter:
                language === 'en'
                    ? 'Chapter'
                    : 'அதிகாரம்',

            choose:
                language === 'en'
                    ? 'Choose one answer'
                    : 'ஒரு பதிலைத் தேர்ந்தெடுக்கவும்',

            submit:
                language === 'en'
                    ? 'Submit Quiz'
                    : 'வினாவை சமர்ப்பிக்கவும்',

            progress:
                language === 'en'
                    ? 'Progress'
                    : 'முன்னேற்றம்',

            loading:
                language === 'en'
                    ? 'Preparing your quiz'
                    : 'உங்கள் வினாடி வினா தயாராகிறது',

            loadingDescription:
                language === 'en'
                    ? 'Loading questions...'
                    : 'கேள்விகள் ஏற்றப்படுகின்றன...',

            noQuestions:
                language === 'en'
                    ? 'No questions found'
                    : 'கேள்விகள் கிடைக்கவில்லை',

            noQuestionsDescription:
                language === 'en'
                    ? 'There are no questions available for this chapter.'
                    : 'இந்த அதிகாரத்திற்கு கேள்விகள் எதுவும் இல்லை.',

            unableToLoad:
                language === 'en'
                    ? 'Unable to load quiz'
                    : 'வினாடி வினாவை ஏற்ற முடியவில்லை',

            backHome:
                language === 'en'
                    ? 'Back to Home'
                    : 'முகப்பிற்கு திரும்பு',

            submissionFailed:
                language === 'en'
                    ? 'Submission failed'
                    : 'சமர்ப்பிக்க முடியவில்லை',

            submissionFailedDescription:
                language === 'en'
                    ? 'Your result could not be saved. Please check your connection and try again.'
                    : 'உங்கள் முடிவை சேமிக்க முடியவில்லை. இணைய இணைப்பை சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',
        }),
        [language]
    );

    /* ========================================================
       SUBMIT QUIZ
    ======================================================== */

    const handleSubmit = useCallback(
        async (isAuto = false) => {
            /*
             * Prevent duplicate submissions.
             */
            if (submittedRef.current) {
                return;
            }

            /*
             * We should not submit before
             * questions are available.
             */
            if (questions.length === 0) {
                return;
            }

            submittedRef.current = true;

            setHasSubmitted(true);

            const endTime =
                new Date().toISOString();

            const startMilliseconds =
                new Date(
                    startTimeRef.current
                ).getTime();

            const endMilliseconds =
                new Date(endTime).getTime();

            const timeTaken =
                Math.max(
                    0,
                    Math.floor(
                        (
                            endMilliseconds -
                            startMilliseconds
                        ) / 1000
                    )
                );

            try {
                /* ================================================
                   SAVE RESULT
                ================================================ */

                const result =
                    await saveQuizResult({
                        name,
                        phone,
                        place,

                        chapter,

                        score:
                            scoreRef.current,

                        total:
                            questions.length,

                        language,

                        start_time:
                            startTimeRef.current,

                        end_time:
                            endTime,

                        time_taken:
                            timeTaken,
                    });

                /* ================================================
                   SAVE ANSWER HISTORY
                ================================================ */

                if (result?.id) {
                    const answers:
                        AnswerHistoryPayload[] =
                        answersRef.current.map(
                            (answer) => ({
                                result_id:
                                    result.id,

                                phone,
                                chapter,

                                question:
                                    answer.question,

                                correct_answer:
                                    answer.correct_answer,

                                user_answer:
                                    answer.user_answer,

                                lang:
                                    answer.lang,
                            })
                        );

                    try {
                        await saveAnswerHistory(
                            answers
                        );
                    } catch (
                    historyError
                    ) {
                        /*
                         * Result is already saved.
                         * Do not block the participant
                         * because answer history failed.
                         */
                        console.error(
                            'ANSWER HISTORY ERROR:',
                            historyError
                        );
                    }
                }

                /* ================================================
                   CLEAN LOCAL QUIZ DATA
                ================================================ */

                await Promise.all([
                    AsyncStorage.removeItem(
                        `${attemptKey}_warnings`
                    ),

                    AsyncStorage.removeItem(
                        `${attemptKey}_start`
                    ),
                ]);

                /* ================================================
                   RESULT SCREEN
                ================================================ */

                router.replace({
                    pathname: '/result',

                    params: {
                        name,
                        phone,
                        place,
                        chapter,
                        language,

                        score: String(
                            scoreRef.current
                        ),

                        total: String(
                            questions.length
                        ),

                        time_taken: String(
                            timeTaken
                        ),

                        attemptedAt:
                            endTime,

                        autoSubmitted:
                            isAuto
                                ? 'true'
                                : 'false',
                    },
                });
            } catch (error) {
                console.error(
                    'QUIZ SUBMIT ERROR:',
                    error
                );

                /*
                 * Database save failed.
                 * Unlock submission so the
                 * participant can retry.
                 */

                submittedRef.current =
                    false;

                setHasSubmitted(false);

                Alert.alert(
                    text.submissionFailed,
                    text.submissionFailedDescription
                );
            }
        },
        [
            attemptKey,
            chapter,
            language,
            name,
            phone,
            place,
            questions.length,
            text.submissionFailed,
            text.submissionFailedDescription,
        ]
    );

    /* ========================================================
       LOAD QUIZ
    ======================================================== */

    useEffect(() => {
        let mounted = true;

        async function loadQuiz() {
            try {
                setLoading(true);
                setLoadError(null);

                /* ================================================
                   VALIDATE PARTICIPANT DATA
                ================================================ */

                if (
                    !name ||
                    !phone ||
                    !chapter
                ) {
                    throw new Error(
                        language === 'en'
                            ? 'Missing quiz participant information.'
                            : 'வினாடி வினா பங்கேற்பாளர் தகவல் இல்லை.'
                    );
                }

                /* ================================================
                   CHECK EXISTING ATTEMPT
                ================================================ */

                const existing =
                    await getExistingAttempt(
                        phone,
                        chapter
                    );

                if (!mounted) {
                    return;
                }

                /*
                 * Join already checks this,
                 * but we protect the actual
                 * quiz route as well.
                 */

                if (existing) {
                    router.replace({
                        pathname:
                            '/previous-result',

                        params: {
                            language,

                            name:
                                existing.name ??
                                name,

                            phone:
                                existing.phone ??
                                phone,

                            place:
                                existing.place ??
                                place,

                            chapter: String(
                                existing.chapter ??
                                chapter
                            ),

                            score:
                                existing.score != null
                                    ? String(
                                        existing.score
                                    )
                                    : '',

                            total:
                                existing.total != null
                                    ? String(
                                        existing.total
                                    )
                                    : '',

                            attemptedAt:
                                existing.created_at ??
                                '',
                        },
                    });

                    return;
                }

                /* ================================================
                   LOAD QUESTIONS
                ================================================ */

                const data =
                    await getQuizQuestions(
                        chapter
                    );

                if (!mounted) {
                    return;
                }

                setQuestions(data);

                /*
                 * Start timer only once the
                 * quiz questions have loaded.
                 */

                const startTime =
                    new Date().toISOString();

                startTimeRef.current =
                    startTime;

                setTimeLeft(totalSeconds);

                await AsyncStorage.setItem(
                    `${attemptKey}_start`,
                    startTime
                );
            } catch (error) {
                console.error(
                    'LOAD QUIZ ERROR:',
                    error
                );

                if (mounted) {
                    setLoadError(
                        error instanceof Error
                            ? error.message
                            : language === 'en'
                                ? 'Unable to load quiz.'
                                : 'வினாடி வினாவை ஏற்ற முடியவில்லை.'
                    );
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        loadQuiz();

        return () => {
            mounted = false;
        };
    }, [
        attemptKey,
        chapter,
        language,
        name,
        phone,
        place,
        totalSeconds,
    ]);

    /* ========================================================
       LOAD WARNING COUNT
    ======================================================== */

    useEffect(() => {
        let mounted = true;

        async function loadWarnings() {
            try {
                const stored =
                    await AsyncStorage.getItem(
                        `${attemptKey}_warnings`
                    );

                if (!mounted) {
                    return;
                }

                const parsed =
                    Number(stored ?? 0);

                if (
                    Number.isFinite(parsed) &&
                    parsed >= 0
                ) {
                    setWarningCount(parsed);
                }
            } catch (error) {
                console.warn(
                    'WARNING LOAD ERROR:',
                    error
                );
            }
        }

        loadWarnings();

        return () => {
            mounted = false;
        };
    }, [attemptKey]);

    /* ========================================================
       TIMER
    ======================================================== */

    useEffect(() => {
        if (
            loading ||
            questions.length === 0 ||
            hasSubmitted
        ) {
            return;
        }

        const timer =
            setInterval(() => {
                setTimeLeft(
                    (previous) => {
                        if (
                            previous <= 1
                        ) {
                            clearInterval(
                                timer
                            );

                            /*
                             * Queue submission outside
                             * the state updater.
                             */

                            setTimeout(() => {
                                handleSubmit(true);
                            }, 0);

                            return 0;
                        }

                        return previous - 1;
                    }
                );
            }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [
        handleSubmit,
        hasSubmitted,
        loading,
        questions.length,
    ]);

    /* ========================================================
       APP LEAVE / BACKGROUND PROTECTION
    ======================================================== */

    useEffect(() => {
        const subscription =
            AppState.addEventListener(
                'change',
                async (
                    nextState
                ) => {
                    const previousState =
                        appStateRef.current;

                    appStateRef.current =
                        nextState;

                    /*
                     * Ignore state changes while
                     * loading or after submission.
                     */

                    if (
                        submittedRef.current ||
                        loading ||
                        questions.length === 0
                    ) {
                        return;
                    }

                    /* ==============================================
                       USER LEAVES ACTIVE APP
                    ============================================== */

                    if (
                        previousState ===
                        'active' &&
                        nextState !== 'active'
                    ) {
                        /*
                         * Some devices can emit more
                         * than one background event.
                         */

                        if (
                            hasLeftActiveRef.current
                        ) {
                            return;
                        }

                        hasLeftActiveRef.current =
                            true;

                        const nextCount =
                            warningCount + 1;

                        setWarningCount(
                            nextCount
                        );

                        try {
                            await AsyncStorage.setItem(
                                `${attemptKey}_warnings`,
                                String(nextCount)
                            );
                        } catch (error) {
                            console.warn(
                                'WARNING SAVE ERROR:',
                                error
                            );
                        }

                        /*
                         * Fifth leave event =
                         * automatic submission.
                         */

                        if (
                            nextCount >=
                            maxWarnings
                        ) {
                            handleSubmit(true);
                        }
                    }

                    /* ==============================================
                       USER RETURNS
                    ============================================== */

                    if (
                        nextState === 'active'
                    ) {
                        hasLeftActiveRef.current =
                            false;
                    }
                }
            );

        return () => {
            subscription.remove();
        };
    }, [
        attemptKey,
        handleSubmit,
        loading,
        questions.length,
        warningCount,
    ]);

    /* ========================================================
       CURRENT QUESTION
    ======================================================== */

    const question =
        questions[current];

    /* ========================================================
       OPTIONS
    ======================================================== */

    const options = useMemo(() => {
        if (!question) {
            return [];
        }

        if (language === 'ta') {
            return [
                question.option_a_ta,
                question.option_b_ta,
                question.option_c_ta,
                question.option_d_ta,
            ];
        }

        return [
            question.option_a_en,
            question.option_b_en,
            question.option_c_en,
            question.option_d_en,
        ];
    }, [
        language,
        question,
    ]);

    /* ========================================================
       CORRECT ANSWER
    ======================================================== */

    const correctAnswer =
        useMemo(() => {
            if (!question) {
                return '';
            }

            return language === 'ta'
                ? question.correct_answer_ta
                : question.correct_answer;
        }, [
            language,
            question,
        ]);

    /* ========================================================
       SELECT ANSWER
    ======================================================== */

    function handleSelect(
        option: string
    ) {
        /*
         * Prevent multiple taps while
         * answer feedback is visible.
         */

        if (
            showAnswer ||
            hasSubmitted ||
            submittedRef.current ||
            !question
        ) {
            return;
        }

        const displayedQuestion =
            language === 'en'
                ? question.question_en
                : question.question_ta;

        /* ================================================
           SAVE ANSWER LOCALLY
        ================================================ */

        answersRef.current.push({
            question:
                displayedQuestion,

            correct_answer:
                correctAnswer,

            user_answer:
                option,

            chapter,

            lang:
                language,
        });

        setSelected(option);

        setShowAnswer(true);

        /* ================================================
           SCORE
        ================================================ */

        if (
            option === correctAnswer
        ) {
            scoreRef.current += 1;

            setScore(
                scoreRef.current
            );
        }

        /* ================================================
           AUTO NEXT
    
           Same behavior as website:
           show feedback for 800ms.
        ================================================ */

        if (
            current <
            questions.length - 1
        ) {
            setTimeout(() => {
                /*
                 * Do not advance if quiz was
                 * submitted while waiting.
                 */

                if (
                    submittedRef.current
                ) {
                    return;
                }

                setSelected(null);

                setShowAnswer(false);

                setCurrent(
                    (previous) =>
                        previous + 1
                );
            }, 800);
        }
    }

    /* ========================================================
       DERIVED VALUES
    ======================================================== */

    const questionProgress =
        questions.length > 0
            ? (
                (current + 1) /
                questions.length
            ) * 100
            : 0;

    /*
     * Red timer during final
     * 5 minutes.
     */
    const warningTime =
        timeLeft <= 5 * 60;

    const optionLabels = [
        'A',
        'B',
        'C',
        'D',
    ];

    /* ========================================================
       LOADING SCREEN
    ======================================================== */

    if (loading) {
        return (
            <QuizLoading
                title={text.loading}
                description={
                    text.loadingDescription
                }
            />
        );
    }

    /* ========================================================
       ERROR / NO QUESTIONS
    ======================================================== */

    if (
        loadError ||
        questions.length === 0
    ) {
        return (
            <NoQuestions
                title={
                    loadError
                        ? text.unableToLoad
                        : text.noQuestions
                }
                description={
                    loadError ??
                    text.noQuestionsDescription
                }
                buttonText={
                    text.backHome
                }
            />
        );
    }

    /*
     * Extra defensive guard.
     */
    if (!question) {
        return (
            <NoQuestions
                title={text.noQuestions}
                description={
                    text.noQuestionsDescription
                }
                buttonText={
                    text.backHome
                }
            />
        );
    }

    /* ========================================================
       QUIZ UI
    ======================================================== */

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="#09090B"
            />

            {/* ====================================================
          BACKGROUND GLOWS
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
          HEADER
      ==================================================== */}

            <QuizHeader
                timeLeft={timeLeft}
                totalTime={totalSeconds}
                warning={warningTime}
            />

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
            WARNING
        ================================================== */}

                <WarningBanner
                    count={warningCount}
                    maxWarnings={
                        maxWarnings
                    }
                />

                {/* ==================================================
            QUIZ META
        ================================================== */}

                <View style={styles.meta}>
                    {/* CHAPTER */}

                    <View
                        style={
                            styles.chapterArea
                        }
                    >
                        <View
                            style={
                                styles.chapterLabelRow
                            }
                        >
                            <View
                                style={
                                    styles.chapterLine
                                }
                            />

                            <Text
                                style={
                                    styles.chapterLabel
                                }
                            >
                                {text.chapter.toUpperCase()}
                            </Text>
                        </View>

                        <Text
                            style={styles.chapter}
                            numberOfLines={2}
                        >
                            {chapter}
                        </Text>
                    </View>

                    {/* QUESTION COUNT */}

                    <View
                        style={
                            styles.questionCount
                        }
                    >
                        <Text
                            style={
                                styles.questionCountLabel
                            }
                        >
                            {text.question.toUpperCase()}
                        </Text>

                        <View
                            style={
                                styles.questionCountRow
                            }
                        >
                            <Text
                                style={
                                    styles.questionCurrent
                                }
                            >
                                {String(
                                    current + 1
                                ).padStart(
                                    2,
                                    '0'
                                )}
                            </Text>

                            <Text
                                style={
                                    styles.questionSlash
                                }
                            >
                                /
                            </Text>

                            <Text
                                style={
                                    styles.questionTotal
                                }
                            >
                                {String(
                                    questions.length
                                ).padStart(
                                    2,
                                    '0'
                                )}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* ==================================================
            TOP QUESTION PROGRESS
        ================================================== */}

                <View
                    style={
                        styles.questionProgress
                    }
                >
                    <View
                        style={[
                            styles.questionProgressFill,

                            {
                                width:
                                    `${questionProgress}%`,
                            },
                        ]}
                    />
                </View>

                {/* ==================================================
            QUESTION SECTION
        ================================================== */}

                <View
                    style={
                        styles.questionSection
                    }
                >
                    <QuestionCard
                        number={
                            current + 1
                        }
                        question={
                            language === 'en'
                                ? question.question_en
                                : question.question_ta
                        }
                        chooseText={
                            text.choose
                        }
                    />

                    {/* ================================================
              ANSWERS
          ================================================ */}

                    <View
                        style={styles.answers}
                    >
                        {options.map(
                            (
                                option,
                                index
                            ) => (
                                <AnswerOption
                                    key={`${current}-${index}`}
                                    label={
                                        optionLabels[
                                        index
                                        ]
                                    }
                                    option={
                                        option
                                    }
                                    selected={
                                        selected ===
                                        option
                                    }
                                    correct={
                                        option ===
                                        correctAnswer
                                    }
                                    revealed={
                                        showAnswer
                                    }
                                    disabled={
                                        showAnswer ||
                                        hasSubmitted
                                    }
                                    onPress={() =>
                                        handleSelect(
                                            option
                                        )
                                    }
                                />
                            )
                        )}
                    </View>

                    {/* ================================================
              FINAL QUESTION SUBMIT
          ================================================ */}

                    {current ===
                        questions.length -
                        1 && (
                            <Pressable
                                disabled={
                                    hasSubmitted
                                }
                                onPress={() =>
                                    handleSubmit(
                                        false
                                    )
                                }
                                style={({
                                    pressed,
                                }) => [
                                        styles.submitButton,

                                        hasSubmitted &&
                                        styles.submitDisabled,

                                        pressed &&
                                        !hasSubmitted &&
                                        styles.buttonPressed,
                                    ]}
                            >
                                <Text
                                    style={
                                        styles.submitText
                                    }
                                >
                                    {text.submit}
                                </Text>

                                <Text
                                    style={
                                        styles.submitCheck
                                    }
                                >
                                    ✓
                                </Text>
                            </Pressable>
                        )}
                </View>

                {/* ==================================================
            BOTTOM QUIZ PROGRESS
        ================================================== */}

                <QuizProgress
                    current={current}
                    total={
                        questions.length
                    }
                    label={
                        text.progress
                    }
                />

                {/* ==================================================
            FOOTER
        ================================================== */}

                <Text
                    style={styles.footer}
                >
                    QUIZTIANS · Learn • Play •
                    Compete
                </Text>

                {/* ==================================================
            DEBUG-SAFE SCORE

            score state is intentionally
            retained so React also knows
            when the score changes.
        ================================================== */}

                <Text
                    style={
                        styles.hiddenScore
                    }
                >
                    {score}
                </Text>
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
    /* ========================================================
       SCREEN
    ======================================================== */

    safeArea: {
        flex: 1,

        backgroundColor: '#09090B',
    },

    content: {
        paddingHorizontal: 18,
        paddingTop: 23,
        paddingBottom: 35,
    },

    /* ========================================================
       BACKGROUND
    ======================================================== */

    topGlow: {
        position: 'absolute',

        width: 320,
        height: 320,

        borderRadius: 160,

        left: -180,
        top: 80,

        backgroundColor:
            'rgba(109,40,217,0.08)',
    },

    bottomGlow: {
        position: 'absolute',

        width: 380,
        height: 380,

        borderRadius: 190,

        right: -220,
        bottom: 0,

        backgroundColor:
            'rgba(67,56,202,0.07)',
    },

    /* ========================================================
       QUIZ META
    ======================================================== */

    meta: {
        flexDirection: 'row',

        alignItems: 'flex-end',

        justifyContent:
            'space-between',
    },

    chapterArea: {
        flex: 1,

        paddingRight: 20,
    },

    chapterLabelRow: {
        flexDirection: 'row',

        alignItems: 'center',

        marginBottom: 7,
    },

    chapterLine: {
        width: 20,
        height: 1,

        backgroundColor:
            '#8B5CF6',

        marginRight: 8,
    },

    chapterLabel: {
        color: '#A78BFA',

        fontSize: 8,

        fontWeight: '900',

        letterSpacing: 1.7,
    },

    chapter: {
        color: '#FFFFFF',

        fontSize: 19,

        lineHeight: 24,

        fontWeight: '900',
    },

    /* ========================================================
       QUESTION COUNT
    ======================================================== */

    questionCount: {
        alignItems:
            'flex-end',
    },

    questionCountLabel: {
        color: '#3F3F46',

        fontSize: 8,

        fontWeight: '800',

        letterSpacing: 1.2,
    },

    questionCountRow: {
        flexDirection: 'row',

        alignItems: 'center',

        marginTop: 5,
    },

    questionCurrent: {
        color: '#FFFFFF',

        fontSize: 12,

        fontWeight: '900',

        fontVariant: [
            'tabular-nums',
        ],
    },

    questionSlash: {
        color: '#3F3F46',

        fontSize: 11,

        marginHorizontal: 5,
    },

    questionTotal: {
        color: '#A1A1AA',

        fontSize: 12,

        fontWeight: '900',

        fontVariant: [
            'tabular-nums',
        ],
    },

    /* ========================================================
       QUESTION PROGRESS BAR
    ======================================================== */

    questionProgress: {
        height: 4,

        overflow: 'hidden',

        borderRadius: 5,

        backgroundColor:
            'rgba(255,255,255,0.05)',

        marginTop: 19,
    },

    questionProgressFill: {
        height: '100%',

        borderRadius: 5,

        backgroundColor:
            '#8B5CF6',
    },

    /* ========================================================
       QUESTION
    ======================================================== */

    questionSection: {
        marginTop: 22,
    },

    answers: {
        marginTop: 14,
    },

    /* ========================================================
       SUBMIT
    ======================================================== */

    submitButton: {
        minHeight: 58,

        marginTop: 13,

        borderRadius: 17,

        paddingHorizontal: 20,

        backgroundColor:
            '#7C3AED',

        flexDirection: 'row',

        alignItems: 'center',

        justifyContent:
            'center',
    },

    submitDisabled: {
        opacity: 0.5,
    },

    buttonPressed: {
        transform: [
            {
                scale: 0.985,
            },
        ],

        opacity: 0.9,
    },

    submitText: {
        color: '#FFFFFF',

        fontSize: 14,

        fontWeight: '900',
    },

    submitCheck: {
        color: '#FFFFFF',

        fontSize: 15,

        fontWeight: '900',

        marginLeft: 10,
    },

    /* ========================================================
       FOOTER
    ======================================================== */

    footer: {
        color: '#27272A',

        fontSize: 8,

        fontWeight: '600',

        letterSpacing: 0.5,

        textAlign: 'center',

        marginTop: 30,
    },

    /* ========================================================
       INTERNAL SCORE STATE
    ======================================================== */

    hiddenScore: {
        position: 'absolute',

        width: 0,
        height: 0,

        opacity: 0,
    },
});