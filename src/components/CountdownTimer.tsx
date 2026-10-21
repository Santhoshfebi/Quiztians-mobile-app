import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Countdown } from '../hooks/useCountdown';

type Language = 'en' | 'ta';

type Props = {
  countdown: Countdown;
  language?: Language;
};

type TimeBoxProps = {
  value: number;
  label: string;
  borderRight?: boolean;
};

function TimeBox({
  value,
  label,
  borderRight = false,
}: TimeBoxProps) {
  return (
    <View
      style={[
        styles.timeItem,
        borderRight && styles.borderRight,
      ]}
    >
      <Text style={styles.number}>
        {String(value).padStart(2, '0')}
      </Text>

      <Text
        style={styles.label}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

export default function CountdownTimer({
  countdown,
  language = 'en',
}: Props) {
  const labels =
    language === 'en'
      ? {
          days: 'DAYS',
          hours: 'HOURS',
          minutes: 'MINUTES',
          seconds: 'SECONDS',
        }
      : {
          days: 'நாள்',
          hours: 'மணி',
          minutes: 'நிமி',
          seconds: 'வினா',
        };

  return (
    <View style={styles.container}>
      <TimeBox
        value={countdown.days}
        label={labels.days}
        borderRight
      />

      <TimeBox
        value={countdown.hours}
        label={labels.hours}
        borderRight
      />

      <TimeBox
        value={countdown.minutes}
        label={labels.minutes}
        borderRight
      />

      <TimeBox
        value={countdown.seconds}
        label={labels.seconds}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',

    flexDirection: 'row',

    overflow: 'hidden',

    borderRadius: 20,

    borderWidth: 1,
    borderColor:
      'rgba(255,255,255,0.065)',

    backgroundColor:
      'rgba(17,17,20,0.92)',
  },

  timeItem: {
    flex: 1,

    minWidth: 0,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 2,
    paddingVertical: 20,
  },

  borderRight: {
    borderRightWidth: 1,
    borderRightColor:
      'rgba(255,255,255,0.055)',
  },

  number: {
    color: '#FFFFFF',

    fontSize: 27,
    fontWeight: '900',

    letterSpacing: -1.3,

    fontVariant: ['tabular-nums'],
  },

  label: {
    color: '#52525B',

    fontSize: 7,
    fontWeight: '900',

    letterSpacing: 0.5,

    marginTop: 5,

    maxWidth: '100%',
  },
});