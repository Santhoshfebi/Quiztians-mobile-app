import { supabase } from './supabase';

export type QuizConfig = {
  start_time: string | null;
  duration: number;
  active_chapters: string[] | number[] | null;
};

export async function getQuizConfig(): Promise<QuizConfig> {
  const { data, error } = await supabase
    .from('quiz_config')
    .select('start_time, duration, active_chapters')
    .limit(1)
    .single();

  if (error) {
    throw error;
  }

  return data as QuizConfig;
}