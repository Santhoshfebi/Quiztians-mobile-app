import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    getSkillBadge,
    type SkillLevel,
} from '../../services/leaderboardService';

type AchievementBadgeProps = {
    type: 'high' | 'fast';
};

type SkillBadgeProps = {
    score: number;
    total: number;
};

export function AchievementBadge({
    type,
}: AchievementBadgeProps) {
    const isHigh =
        type === 'high';

    return (
        <View
            style={[
                styles.badge,
                isHigh
                    ? styles.highBadge
                    : styles.fastBadge,
            ]}
        >
            <Text
                style={[
                    styles.icon,
                    isHigh
                        ? styles.highText
                        : styles.fastText,
                ]}
            >
                {isHigh
                    ? '★'
                    : '⚡'}
            </Text>

            <Text
                style={[
                    styles.label,
                    isHigh
                        ? styles.highText
                        : styles.fastText,
                ]}
            >
                {isHigh
                    ? 'HIGH SCORE'
                    : 'FASTEST'}
            </Text>
        </View>
    );
}

export function SkillBadge({
    score,
    total,
}: SkillBadgeProps) {
    const skill =
        getSkillBadge(
            score,
            total
        );

    return (
        <View
            style={[
                styles.skillBadge,
                getSkillContainerStyle(
                    skill.level
                ),
            ]}
        >
            <Text style={styles.skillIcon}>
                {skill.icon}
            </Text>

            <Text
                style={[
                    styles.skillText,
                    getSkillTextStyle(
                        skill.level
                    ),
                ]}
            >
                {skill.label.toUpperCase()}
            </Text>
        </View>
    );
}

function getSkillContainerStyle(
    level: SkillLevel
) {
    switch (level) {
        case 'legend':
            return styles.legend;

        case 'champion':
            return styles.champion;

        case 'gold':
            return styles.gold;

        case 'silver':
            return styles.silver;

        default:
            return styles.bronze;
    }
}

function getSkillTextStyle(
    level: SkillLevel
) {
    switch (level) {
        case 'legend':
            return styles.legendText;

        case 'champion':
            return styles.championText;

        case 'gold':
            return styles.goldText;

        case 'silver':
            return styles.silverText;

        default:
            return styles.bronzeText;
    }
}

const styles =
    StyleSheet.create({
        badge: {
            minHeight: 24,
            paddingHorizontal: 8,

            borderRadius: 7,
            borderWidth: 1,

            flexDirection: 'row',
            alignItems: 'center',

            alignSelf: 'flex-start',
        },

        icon: {
            fontSize: 9,
            fontWeight: '900',

            marginRight: 4,
        },

        label: {
            fontSize: 7,
            fontWeight: '900',

            letterSpacing: 0.7,
        },

        highBadge: {
            borderColor:
                'rgba(245,158,11,0.15)',

            backgroundColor:
                'rgba(245,158,11,0.07)',
        },

        fastBadge: {
            borderColor:
                'rgba(16,185,129,0.15)',

            backgroundColor:
                'rgba(16,185,129,0.07)',
        },

        highText: {
            color: '#FBBF24',
        },

        fastText: {
            color: '#34D399',
        },

        skillBadge: {
            minHeight: 29,

            paddingHorizontal: 10,

            borderRadius: 9,
            borderWidth: 1,

            flexDirection: 'row',
            alignItems: 'center',

            alignSelf: 'flex-start',
        },

        skillIcon: {
            fontSize: 12,
            marginRight: 6,
        },

        skillText: {
            fontSize: 8,
            fontWeight: '900',
            letterSpacing: 0.7,
        },

        legend: {
            borderColor:
                'rgba(168,85,247,0.20)',

            backgroundColor:
                'rgba(168,85,247,0.08)',
        },

        legendText: {
            color: '#D8B4FE',
        },

        champion: {
            borderColor:
                'rgba(245,158,11,0.20)',

            backgroundColor:
                'rgba(245,158,11,0.08)',
        },

        championText: {
            color: '#FCD34D',
        },

        gold: {
            borderColor:
                'rgba(234,179,8,0.15)',

            backgroundColor:
                'rgba(234,179,8,0.07)',
        },

        goldText: {
            color: '#FDE047',
        },

        silver: {
            borderColor:
                'rgba(161,161,170,0.15)',

            backgroundColor:
                'rgba(161,161,170,0.07)',
        },

        silverText: {
            color: '#D4D4D8',
        },

        bronze: {
            borderColor:
                'rgba(249,115,22,0.15)',

            backgroundColor:
                'rgba(249,115,22,0.07)',
        },

        bronzeText: {
            color: '#FDBA74',
        },
    });