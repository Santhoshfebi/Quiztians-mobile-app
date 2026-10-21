import { useEffect, useMemo, useState } from 'react';

export type Countdown = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    total: number;
    isLive: boolean;
};

function calculateCountdown(startTime?: string | null): Countdown {
    if (!startTime) {
        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            total: 0,
            isLive: false,
        };
    }

    const start = new Date(startTime).getTime();
    const now = Date.now();

    const difference = start - now;

    if (difference <= 0) {
        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            total: 0,
            isLive: true,
        };
    }

    return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),

        hours: Math.floor(
            (difference / (1000 * 60 * 60)) % 24
        ),

        minutes: Math.floor(
            (difference / (1000 * 60)) % 60
        ),

        seconds: Math.floor(
            (difference / 1000) % 60
        ),

        total: difference,

        isLive: false,
    };
}

export function useCountdown(startTime?: string | null) {
    const initialCountdown = useMemo(
        () => calculateCountdown(startTime),
        [startTime]
    );

    const [countdown, setCountdown] =
        useState<Countdown>(initialCountdown);

    useEffect(() => {
        setCountdown(calculateCountdown(startTime));

        const timer = setInterval(() => {
            setCountdown(calculateCountdown(startTime));
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [startTime]);

    return countdown;
}