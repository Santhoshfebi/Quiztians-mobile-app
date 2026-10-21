import { supabase } from './supabase';

export type ReviewLanguage = 'en' | 'ta';

export type ReviewQuestion = {
    id: string | number;
    chapter: string | number;

    question?: string | null;
    question_en?: string | null;
    question_ta?: string | null;

    correct_answer?: string | null;
    correct_answer_en?: string | null;
    correct_answer_ta?: string | null;

    explanation?: string | null;
    explanation_en?: string | null;
    explanation_ta?: string | null;
};

export type ReviewHistory = {
    id?: string | number;
    result_id?: string | number | null;

    phone: string;
    chapter: string | number;

    question: string;
    correct_answer: string;
    user_answer: string;

    lang?: string | null;
    is_correct?: boolean | null;
};

export type ReviewItem = {
    id: string | number;

    question: string;

    user_answer: string;

    correct_answer: string;

    explanation: string;

    attempted: boolean;

    is_correct: boolean;
};

export type ReviewData = {
    questions: ReviewQuestion[];
    answers: ReviewHistory[];
    totalTime: number;
};

/* ==========================================================
   LOAD REVIEW DATA
========================================================== */

export async function getReviewData(
    phone: string,
    chapter: string
): Promise<ReviewData> {
    /*
     * Use limit(1) instead of single().
     *
     * This is safer if historical duplicate
     * result rows exist for the same
     * phone + chapter.
     */

    const [
        resultResponse,
        questionsResponse,
        answersResponse,
    ] = await Promise.all([
        supabase
            .from('results')
            .select('time_taken')
            .eq('phone', phone)
            .eq('chapter', chapter)
            .order('created_at', {
                ascending: false,
            })
            .limit(1),

        supabase
            .from('questions')
            .select('*')
            .eq('chapter', chapter)
            .order('id', {
                ascending: true,
            }),

        supabase
            .from('answers_history')
            .select('*')
            .eq('phone', phone)
            .eq('chapter', chapter),
    ]);

    if (resultResponse.error) {
        throw resultResponse.error;
    }

    if (questionsResponse.error) {
        throw questionsResponse.error;
    }

    if (answersResponse.error) {
        throw answersResponse.error;
    }

    const resultRow =
        resultResponse.data?.[0];

    return {
        totalTime:
            Number(resultRow?.time_taken) || 0,

        questions:
            (questionsResponse.data ??
                []) as ReviewQuestion[],

        answers:
            (answersResponse.data ??
                []) as ReviewHistory[],
    };
}

/* ==========================================================
   BUILD DISPLAY DATA
========================================================== */

export function buildReviewItems(
    questions: ReviewQuestion[],
    answers: ReviewHistory[],
    language: ReviewLanguage
): ReviewItem[] {
    return questions.map((question) => {
        const displayedQuestion =
            getLocalizedField(
                question,
                'question',
                language
            );

        const displayedCorrectAnswer =
            getLocalizedField(
                question,
                'correct_answer',
                language
            );

        const explanation =
            getLocalizedField(
                question,
                'explanation',
                language,
                ''
            );

        /*
         * answers_history stores the question
         * in the language used while taking
         * the quiz.
         *
         * Therefore match against both
         * English and Tamil question text.
         */

        const englishQuestion =
            cleanText(
                question.question_en ??
                question.question
            );

        const tamilQuestion =
            cleanText(
                question.question_ta ??
                question.question
            );

        const answer = answers.find(
            (history) => {
                const storedQuestion =
                    cleanText(history.question);

                return (
                    storedQuestion ===
                    cleanText(
                        displayedQuestion
                    ) ||
                    storedQuestion ===
                    englishQuestion ||
                    storedQuestion ===
                    tamilQuestion
                );
            }
        );

        const attempted = Boolean(answer);

        const userAnswer =
            answer?.user_answer?.trim() ||
            'Not Answered';

        /*
         * Prefer is_correct if the database
         * has it.
         *
         * Otherwise calculate using the
         * values stored in answers_history.
         */

        let isCorrect = false;

        if (attempted) {
            if (
                typeof answer?.is_correct ===
                'boolean'
            ) {
                isCorrect =
                    answer.is_correct;
            } else {
                const storedCorrect =
                    answer?.correct_answer ||
                    displayedCorrectAnswer;

                isCorrect =
                    normalizeAnswer(
                        userAnswer
                    ) ===
                    normalizeAnswer(
                        storedCorrect
                    );
            }
        }

        return {
            id: question.id,

            question:
                displayedQuestion,

            correct_answer:
                displayedCorrectAnswer,

            explanation,

            user_answer:
                attempted
                    ? userAnswer
                    : 'Not Answered',

            attempted,

            is_correct:
                attempted && isCorrect,
        };
    });
}

/* ==========================================================
   LOCALIZED FIELD
========================================================== */

function getLocalizedField(
    item: ReviewQuestion,
    field:
        | 'question'
        | 'correct_answer'
        | 'explanation',
    language: ReviewLanguage,
    fallback = 'N/A'
) {
    const localizedKey =
        `${field}_${language}` as keyof ReviewQuestion;

    const localized =
        item[localizedKey];

    const base =
        item[
        field as keyof ReviewQuestion
        ];

    const value =
        localized ?? base;

    if (
        typeof value === 'string' &&
        value.trim()
    ) {
        return value.trim();
    }

    return fallback;
}

function normalizeAnswer(
    value?: string | null
) {
    return String(value ?? '')
        .trim()
        .toLowerCase();
}

function cleanText(
    value?: string | null
) {
    return String(value ?? '')
        .trim();
}