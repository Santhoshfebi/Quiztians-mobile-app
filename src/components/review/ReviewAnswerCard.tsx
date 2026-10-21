import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type {
    ReviewItem,
} from '../../services/reviewService';

type Props = {
    answer: ReviewItem;
    index: number;
};

type Status =
    | 'correct'
    | 'incorrect'
    | 'skipped';

export default function ReviewAnswerCard({
    answer,
    index,
}: Props) {
    /* ==========================================================
       STATUS
    ========================================================== */

    const isNotAnswered =
        !answer.attempted ||
        !answer.user_answer ||
        answer.user_answer.trim() === '' ||
        answer.user_answer === 'Not Answered';

    const status: Status =
        isNotAnswered
            ? 'skipped'
            : answer.is_correct
                ? 'correct'
                : 'incorrect';

    const config =
        getStatusConfig(status);

    /* ==========================================================
       SAFE DISPLAY VALUES
    ========================================================== */

    const question =
        typeof answer.question === 'string' &&
        answer.question.trim().length > 0
            ? answer.question.trim()
            : 'Question unavailable';

    const userAnswer =
        isNotAnswered
            ? 'Not Answered'
            : typeof answer.user_answer === 'string'
                ? answer.user_answer.trim()
                : 'Not Answered';

    const correctAnswer =
        typeof answer.correct_answer === 'string' &&
        answer.correct_answer.trim().length > 0
            ? answer.correct_answer.trim()
            : 'N/A';

    /* ==========================================================
       EXPLANATION
    ========================================================== */

    const explanation =
        typeof answer.explanation === 'string'
            ? answer.explanation.trim()
            : '';

    const hasExplanation =
        explanation.length > 0 &&
        explanation !== 'N/A' &&
        explanation !== '.';

    /* ==========================================================
       UI
    ========================================================== */

    return (
        <View
            style={[
                styles.card,
                {
                    borderColor:
                        config.border,
                },
            ]}
        >
            {/* Background glow */}

            <View
                pointerEvents="none"
                style={[
                    styles.glow,
                    {
                        backgroundColor:
                            config.glow,
                    },
                ]}
            />

            <View style={styles.content}>
                {/* ==================================================
                    HEADER
                ================================================== */}

                <View style={styles.header}>
                    <View
                        style={[
                            styles.numberBox,
                            {
                                borderColor:
                                    config.border,

                                backgroundColor:
                                    config.softBackground,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.number,
                                {
                                    color:
                                        config.color,
                                },
                            ]}
                        >
                            {String(
                                index + 1
                            ).padStart(
                                2,
                                '0'
                            )}
                        </Text>
                    </View>

                    <View
                        style={[
                            styles.statusBadge,
                            {
                                borderColor:
                                    config.border,

                                backgroundColor:
                                    config.softBackground,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.statusIcon,
                                {
                                    color:
                                        config.color,
                                },
                            ]}
                        >
                            {config.icon}
                        </Text>

                        <Text
                            style={[
                                styles.statusText,
                                {
                                    color:
                                        config.color,
                                },
                            ]}
                        >
                            {config.label}
                        </Text>
                    </View>
                </View>

                {/* ==================================================
                    QUESTION
                ================================================== */}

                <View style={styles.questionArea}>
                    <Text style={styles.sectionLabel}>
                        QUESTION
                    </Text>

                    <Text style={styles.question}>
                        {question}
                    </Text>
                </View>

                {/* ==================================================
                    USER ANSWER
                ================================================== */}

                <View style={styles.answerSection}>
                    <Text style={styles.sectionLabel}>
                        YOUR ANSWER
                    </Text>

                    <View
                        style={[
                            styles.answerBox,

                            isNotAnswered
                                ? styles.skippedAnswer
                                : answer.is_correct
                                    ? styles.correctAnswer
                                    : styles.wrongAnswer,
                        ]}
                    >
                        <View
                            style={[
                                styles.answerIcon,

                                isNotAnswered
                                    ? styles.skippedIcon
                                    : answer.is_correct
                                        ? styles.correctIcon
                                        : styles.wrongIcon,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.answerIconText,

                                    isNotAnswered
                                        ? styles.skippedText
                                        : answer.is_correct
                                            ? styles.correctText
                                            : styles.wrongText,
                                ]}
                            >
                                {isNotAnswered
                                    ? '—'
                                    : answer.is_correct
                                        ? '✓'
                                        : '×'}
                            </Text>
                        </View>

                        <Text
                            style={[
                                styles.answerText,

                                isNotAnswered
                                    ? styles.skippedText
                                    : answer.is_correct
                                        ? styles.correctAnswerText
                                        : styles.wrongAnswerText,
                            ]}
                        >
                            {userAnswer}
                        </Text>
                    </View>
                </View>

                {/* ==================================================
                    CORRECT ANSWER
                ================================================== */}

                <View style={styles.answerSection}>
                    <Text style={styles.sectionLabel}>
                        CORRECT ANSWER
                    </Text>

                    <View
                        style={[
                            styles.answerBox,
                            styles.correctAnswer,
                        ]}
                    >
                        <View
                            style={[
                                styles.answerIcon,
                                styles.correctIcon,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.answerIconText,
                                    styles.correctText,
                                ]}
                            >
                                ✓
                            </Text>
                        </View>

                        <Text
                            style={[
                                styles.answerText,
                                styles.correctAnswerText,
                            ]}
                        >
                            {correctAnswer}
                        </Text>
                    </View>
                </View>

                {/* ==================================================
                    EXPLANATION
                ================================================== */}

                {hasExplanation ? (
                    <View style={styles.explanation}>
                        <View style={styles.infoIcon}>
                            <Text style={styles.infoIconText}>
                                i
                            </Text>
                        </View>

                        <View style={styles.flex}>
                            <Text
                                style={
                                    styles.explanationLabel
                                }
                            >
                                EXPLANATION
                            </Text>

                            <Text
                                style={
                                    styles.explanationText
                                }
                            >
                                {explanation}
                            </Text>
                        </View>
                    </View>
                ) : null}
            </View>
        </View>
    );
}

/* ==========================================================
   STATUS CONFIG
========================================================== */

function getStatusConfig(
    status: Status
) {
    switch (status) {
        case 'correct':
            return {
                label: 'CORRECT',
                icon: '✓',

                color: '#34D399',

                border:
                    'rgba(16,185,129,0.15)',

                softBackground:
                    'rgba(16,185,129,0.07)',

                glow:
                    'rgba(16,185,129,0.035)',
            };

        case 'incorrect':
            return {
                label: 'INCORRECT',
                icon: '×',

                color: '#F87171',

                border:
                    'rgba(239,68,68,0.15)',

                softBackground:
                    'rgba(239,68,68,0.07)',

                glow:
                    'rgba(239,68,68,0.03)',
            };

        default:
            return {
                label: 'NOT ANSWERED',
                icon: '—',

                color: '#71717A',

                border:
                    'rgba(255,255,255,0.07)',

                softBackground:
                    'rgba(255,255,255,0.03)',

                glow:
                    'rgba(255,255,255,0.015)',
            };
    }
}

/* ==========================================================
   STYLES
========================================================== */

const styles =
    StyleSheet.create({
        flex: {
            flex: 1,
        },

        card: {
            position: 'relative',
            overflow: 'hidden',

            borderRadius: 23,
            borderWidth: 1,

            backgroundColor:
                '#111114',
        },

        /* ======================================================
           BACKGROUND GLOW
        ====================================================== */

        glow: {
            position: 'absolute',

            width: 180,
            height: 180,

            borderRadius: 90,

            right: -90,
            top: -90,
        },

        content: {
            padding: 17,
        },

        /* ======================================================
           HEADER
        ====================================================== */

        header: {
            flexDirection: 'row',

            alignItems:
                'flex-start',

            justifyContent:
                'space-between',
        },

        numberBox: {
            minWidth: 38,
            height: 38,

            paddingHorizontal: 8,

            borderRadius: 12,
            borderWidth: 1,

            alignItems: 'center',
            justifyContent: 'center',
        },

        number: {
            fontSize: 10,
            fontWeight: '900',
        },

        statusBadge: {
            minHeight: 29,

            paddingHorizontal: 10,

            borderRadius: 20,
            borderWidth: 1,

            flexDirection: 'row',
            alignItems: 'center',
        },

        statusIcon: {
            fontSize: 10,
            fontWeight: '900',

            marginRight: 6,
        },

        statusText: {
            fontSize: 7,
            fontWeight: '900',

            letterSpacing: 0.8,
        },

        /* ======================================================
           QUESTION
        ====================================================== */

        questionArea: {
            marginTop: 17,
        },

        sectionLabel: {
            color: '#3F3F46',

            fontSize: 8,
            fontWeight: '900',

            letterSpacing: 1.2,
        },

        question: {
            color: '#E4E4E7',

            fontSize: 15,
            lineHeight: 24,

            fontWeight: '700',

            marginTop: 8,
        },

        /* ======================================================
           ANSWERS
        ====================================================== */

        answerSection: {
            marginTop: 17,
        },

        answerBox: {
            minHeight: 60,

            marginTop: 8,
            padding: 13,

            borderRadius: 16,
            borderWidth: 1,

            flexDirection: 'row',
            alignItems: 'flex-start',
        },

        correctAnswer: {
            borderColor:
                'rgba(16,185,129,0.15)',

            backgroundColor:
                'rgba(16,185,129,0.045)',
        },

        wrongAnswer: {
            borderColor:
                'rgba(239,68,68,0.15)',

            backgroundColor:
                'rgba(239,68,68,0.045)',
        },

        skippedAnswer: {
            borderColor:
                'rgba(255,255,255,0.06)',

            backgroundColor:
                'rgba(255,255,255,0.02)',
        },

        answerIcon: {
            width: 29,
            height: 29,

            borderRadius: 9,
            borderWidth: 1,

            alignItems: 'center',
            justifyContent: 'center',

            marginRight: 11,
        },

        correctIcon: {
            borderColor:
                'rgba(16,185,129,0.20)',

            backgroundColor:
                'rgba(16,185,129,0.08)',
        },

        wrongIcon: {
            borderColor:
                'rgba(239,68,68,0.20)',

            backgroundColor:
                'rgba(239,68,68,0.08)',
        },

        skippedIcon: {
            borderColor:
                'rgba(255,255,255,0.06)',

            backgroundColor:
                'rgba(255,255,255,0.03)',
        },

        answerIconText: {
            fontSize: 11,
            fontWeight: '900',
        },

        correctText: {
            color: '#34D399',
        },

        wrongText: {
            color: '#F87171',
        },

        skippedText: {
            color: '#52525B',
        },

        answerText: {
            flex: 1,

            fontSize: 12,
            lineHeight: 20,

            fontWeight: '600',

            paddingTop: 4,
        },

        correctAnswerText: {
            color: '#A7F3D0',
        },

        wrongAnswerText: {
            color: '#FECACA',
        },

        /* ======================================================
           EXPLANATION
        ====================================================== */

        explanation: {
            marginTop: 13,
            padding: 14,

            borderRadius: 16,
            borderWidth: 1,

            borderColor:
                'rgba(139,92,246,0.10)',

            backgroundColor:
                'rgba(139,92,246,0.035)',

            flexDirection: 'row',
            alignItems: 'flex-start',
        },

        infoIcon: {
            width: 29,
            height: 29,

            borderRadius: 9,
            borderWidth: 1,

            borderColor:
                'rgba(139,92,246,0.15)',

            backgroundColor:
                'rgba(139,92,246,0.07)',

            alignItems: 'center',
            justifyContent: 'center',

            marginRight: 11,
        },

        infoIconText: {
            color: '#A78BFA',

            fontSize: 12,
            fontWeight: '900',
        },

        explanationLabel: {
            color:
                'rgba(167,139,250,0.70)',

            fontSize: 8,
            fontWeight: '900',

            letterSpacing: 1,
        },

        explanationText: {
            color: '#71717A',

            fontSize: 11,
            lineHeight: 18,

            marginTop: 6,
        },
    });