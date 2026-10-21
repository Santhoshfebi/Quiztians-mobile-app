import { supabase } from './supabase';

export type QuizQuestion = {
    id?: string | number;
    chapter: string | number;

    question_en: string;
    question_ta: string;

    option_a_en: string;
    option_b_en: string;
    option_c_en: string;
    option_d_en: string;

    option_a_ta: string;
    option_b_ta: string;
    option_c_ta: string;
    option_d_ta: string;

    correct_answer: string;
    correct_answer_ta: string;
};

export type ExistingAttempt = {
    id?: string | number;

    name: string;
    phone: string;
    place: string;

    chapter: string | number;

    score: number;
    total?: number | null;

    language?: string | null;

    start_time?: string | null;
    end_time?: string | null;
    time_taken?: number | null;

    created_at?: string | null;
};

export type ResultPayload = {
    name: string;
    phone: string;
    place: string;

    chapter: string;

    score: number;
    total: number;

    language: string;

    start_time: string;
    end_time: string;

    time_taken: number;
};

export type AnswerHistoryPayload = {
    result_id: string | number;

    phone: string;
    chapter: string;

    question: string;
    correct_answer: string;
    user_answer: string;

    lang: 'en' | 'ta';
};

/* ==========================================================
   GET QUESTIONS
========================================================== */

export async function getQuizQuestions(
    chapter: string
): Promise<QuizQuestion[]> {
    const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('chapter', chapter);

    if (error) {
        throw error;
    }

    if (!data) {
        return [];
    }

    /*
     * Same behavior as the website:
     * randomize question order.
     */
    return shuffleArray(
        data as QuizQuestion[]
    );
}

/* ==========================================================
   CHECK EXISTING ATTEMPT
========================================================== */

export async function getExistingAttempt(
    phone: string,
    chapter: string
): Promise<ExistingAttempt | null> {
    const { data, error } = await supabase
        .from('results')
        .select('*')
        .eq('phone', phone)
        .eq('chapter', chapter)
        .order('created_at', {
            ascending: false,
        })
        .limit(1);

    if (error) {
        throw error;
    }

    return (data?.[0] as ExistingAttempt) ?? null;
}

/* ==========================================================
   SAVE RESULT
========================================================== */

export async function saveQuizResult(
    result: ResultPayload
) {
    const { data, error } = await supabase
        .from('results')
        .insert([result])
        .select('id')
        .single();

    if (error) {
        throw error;
    }

    return data;
}

/* ==========================================================
   SAVE ANSWER HISTORY
========================================================== */

export async function saveAnswerHistory(
    answers: AnswerHistoryPayload[]
) {
    if (answers.length === 0) {
        return;
    }

    const { error } = await supabase
        .from('answers_history')
        .insert(answers);

    if (error) {
        throw error;
    }
}

/* ==========================================================
   SHUFFLE
========================================================== */

function shuffleArray<T>(
    array: T[]
): T[] {
    const shuffled = [...array];

    for (
        let i = shuffled.length - 1;
        i > 0;
        i--
    ) {
        const j = Math.floor(
            Math.random() * (i + 1)
        );

        [
            shuffled[i],
            shuffled[j],
        ] = [
                shuffled[j],
                shuffled[i],
            ];
    }

    return shuffled;
}