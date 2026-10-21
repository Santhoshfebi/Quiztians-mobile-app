import { useCallback, useEffect, useRef, useState } from 'react';

import {
    getQuizConfig,
    QuizConfig,
} from '../services/quizService';

import { supabase } from '../services/supabase';

export function useQuizConfig() {
    const [config, setConfig] =
        useState<QuizConfig | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const mountedRef = useRef(true);

    const loadConfig = useCallback(
        async (showLoading = false) => {
            try {
                if (showLoading && mountedRef.current) {
                    setLoading(true);
                }

                if (mountedRef.current) {
                    setError(null);
                }

                const data = await getQuizConfig();

                if (mountedRef.current) {
                    setConfig(data);
                }
            } catch (err) {
                console.error(
                    'QUIZ CONFIG ERROR:',
                    err
                );

                if (mountedRef.current) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : 'Unable to load quiz configuration.'
                    );
                }
            } finally {
                if (mountedRef.current) {
                    setLoading(false);
                }
            }
        },
        []
    );

    useEffect(() => {
        mountedRef.current = true;

        loadConfig(true);

        /*
         * Use a unique channel name for this hook instance.
         *
         * This prevents Expo Fast Refresh / development
         * remounts from colliding with an already
         * subscribed Supabase channel.
         */
        const channelName =
            `mobile-quiz-config-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2)}`;

        const channel = supabase
            .channel(channelName)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'quiz_config',
                },
                (payload) => {
                    console.log(
                        'QUIZ CONFIG UPDATED:',
                        payload.new
                    );

                    if (mountedRef.current) {
                        setConfig(
                            payload.new as QuizConfig
                        );
                    }
                }
            );

        /*
         * IMPORTANT:
         * Add all .on(...) listeners BEFORE subscribe().
         */
        channel.subscribe((status) => {
            console.log(
                'QUIZ CONFIG REALTIME:',
                status
            );
        });

        return () => {
            mountedRef.current = false;

            supabase
                .removeChannel(channel)
                .catch((removeError) => {
                    console.warn(
                        'CHANNEL CLEANUP ERROR:',
                        removeError
                    );
                });
        };
    }, [loadConfig]);

    const refresh = useCallback(() => {
        return loadConfig(true);
    }, [loadConfig]);

    return {
        config,
        loading,
        error,
        refresh,
    };
}