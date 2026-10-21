
import { router } from 'expo-router';
import { useState } from 'react';

import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import AnnouncementPopup from '../components/announcements/AnnouncementPopup';
import CountdownTimer from '../components/CountdownTimer';

import { useAnnouncements } from '../hooks/useAnnouncements';
import { useCountdown } from '../hooks/useCountdown';
import { useQuizConfig } from '../hooks/useQuizConfig';

/* ==========================================================
   TYPES
========================================================== */

type PageLanguage = 'en' | 'ta';

/* ==========================================================
   COLORS
========================================================== */

const COLORS = {
  background: '#09090B',
  surface: '#111114',
  surfaceDark: '#0D0D10',

  text: '#FFFFFF',
  textSoft: '#E4E4E7',
  textSecondary: '#71717A',
  textMuted: '#52525B',
  textDim: '#3F3F46',

  border: 'rgba(255,255,255,0.065)',
  borderSoft: 'rgba(255,255,255,0.05)',

  violet: '#8B5CF6',
  violetLight: '#C4B5FD',
  violetSoft: '#A78BFA',
  indigo: '#6366F1',

  emerald: '#34D399',
  amber: '#FBBF24',
};

/* ==========================================================
   HOME SCREEN
========================================================== */

export default function HomeScreen() {
  /* ========================================================
     PAGE LANGUAGE
  ======================================================== */

  const [pageLanguage, setPageLanguage] =
    useState<PageLanguage>('en');

  /* ========================================================
     QUIZ CONFIG
  ======================================================== */

  const {
    config,
    loading,
    error,
    refresh,
  } = useQuizConfig();

  const countdown = useCountdown(
    config?.start_time
  );

  const isQuizAvailable =
    countdown.isLive;

  const chapters =
    config?.active_chapters?.map(String) ??
    [];

  /* ========================================================
     ANNOUNCEMENTS
  ======================================================== */

  const {
    activeAnnouncement,
    dismissAnnouncement,
  } = useAnnouncements();

  /* ========================================================
     ANNOUNCEMENT DISMISS
  ======================================================== */

  const handleDismissAnnouncement =
    () => {
      if (!activeAnnouncement) {
        return;
      }

      void dismissAnnouncement(
        activeAnnouncement.id
      );
    };

  /* ========================================================
     LOADING
  ======================================================== */

  if (loading) {
    return (
      <SafeAreaView
        style={styles.loadingScreen}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor={
            COLORS.background
          }
        />

        <View
          style={
            styles.loadingLogoWrapper
          }
        >
          <Image
            source={require(
              '../../assets/images/quiztians-q.png'
            )}
            style={styles.loadingLogo}
            resizeMode="contain"
          />
        </View>

        <ActivityIndicator
          size="small"
          color={COLORS.violet}
          style={styles.loader}
        />

        <Text
          style={styles.loadingText}
        >
          {pageLanguage === 'en'
            ? 'Loading quiz setup...'
            : 'வினாடி வினா தயாராகிறது...'}
        </Text>
      </SafeAreaView>
    );
  }

  /* ========================================================
     ERROR
  ======================================================== */

  if (error || !config) {
    return (
      <SafeAreaView
        style={styles.errorScreen}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor={
            COLORS.background
          }
        />

        <Image
          source={require(
            '../../assets/images/quiztians-q.png'
          )}
          style={styles.errorLogo}
          resizeMode="contain"
        />

        <Text
          style={styles.errorTitle}
        >
          {pageLanguage === 'en'
            ? 'Unable to load QUIZTIANS'
            : 'QUIZTIANS-ஐ ஏற்ற முடியவில்லை'}
        </Text>

        <Text
          style={
            styles.errorDescription
          }
        >
          {error ||
            (pageLanguage === 'en'
              ? 'Quiz configuration is currently unavailable.'
              : 'வினாடி வினா அமைப்பு தற்போது கிடைக்கவில்லை.')}
        </Text>

        <Pressable
          onPress={refresh}
          style={({ pressed }) => [
            styles.retryButton,

            pressed &&
              styles.buttonPressed,
          ]}
        >
          <Text
            style={styles.retryText}
          >
            {pageLanguage === 'en'
              ? 'TRY AGAIN'
              : 'மீண்டும் முயற்சி'}
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  /* ========================================================
     HOME UI
  ======================================================== */

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={
          COLORS.background
        }
      />

      {/* ====================================================
          BACKGROUND DECORATION
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
          style={styles.leftGlow}
        />

        <View
          style={styles.rightGlow}
        />
      </View>

      {/* ====================================================
          NAVBAR
      ==================================================== */}

      <View style={styles.navbar}>
        {/* BRAND */}

        <View
          style={
            styles.brandContainer
          }
        >
          <Image
            source={require(
              '../../assets/images/quiztians-q.png'
            )}
            style={styles.brandQ}
            resizeMode="contain"
          />

          <View
            style={
              styles.brandTextContainer
            }
          >
            <Image
              source={require(
                '../../assets/images/quiztians-wordmark.png'
              )}
              style={styles.wordmark}
              resizeMode="contain"
            />

            <Text
              style={
                styles.brandTagline
              }
            >
              LEARN • PLAY • COMPETE
            </Text>
          </View>
        </View>

        {/* LANGUAGE TOGGLE */}

        <View
          style={
            styles.languageToggle
          }
        >
          <Pressable
            onPress={() =>
              setPageLanguage('en')
            }
            style={[
              styles.languageButton,

              pageLanguage === 'en' &&
                styles.languageButtonActive,
            ]}
          >
            <Text
              style={[
                styles.languageText,

                pageLanguage === 'en' &&
                  styles.languageTextActive,
              ]}
            >
              EN
            </Text>
          </Pressable>

          <Pressable
            onPress={() =>
              setPageLanguage('ta')
            }
            style={[
              styles.languageButton,

              pageLanguage === 'ta' &&
                styles.languageButtonActive,
            ]}
          >
            <Text
              style={[
                styles.languageText,

                pageLanguage === 'ta' &&
                  styles.languageTextActive,
              ]}
            >
              தமிழ்
            </Text>
          </Pressable>
        </View>
      </View>

      {/* ====================================================
          SCROLL CONTENT
      ==================================================== */}

      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={
          false
        }
        bounces
      >
        {/* ==================================================
            HERO
        ================================================== */}

        <View
          style={styles.heroSection}
        >
          {/* WATERMARK */}

          <Text
            pointerEvents="none"
            style={styles.watermark}
          >
            QUIZTIANS
          </Text>

          {/* EYEBROW */}

          <View
            style={styles.eyebrow}
          >
            <Text
              style={styles.sparkle}
            >
              ✦
            </Text>

            <Text
              style={
                styles.eyebrowText
              }
            >
              {pageLanguage === 'en'
                ? 'BIBLE QUIZ CHALLENGE'
                : 'வேதாகம வினாடி வினா சவால்'}
            </Text>
          </View>

          {/* HERO TITLE */}

          {pageLanguage === 'en' ? (
            <>
              <Text
                style={styles.heroTitle}
              >
                Know the Word.
              </Text>

              <Text
                style={
                  styles.heroAccentTitle
                }
              >
                Take the challenge.
              </Text>
            </>
          ) : (
            <>
              <Text
                style={
                  styles.heroTitleTamil
                }
              >
                வார்த்தையை அறிந்துகொள்.
              </Text>

              <Text
                style={
                  styles.heroAccentTitleTamil
                }
              >
                சவாலை ஏற்றுக்கொள்.
              </Text>
            </>
          )}

          {/* DESCRIPTION */}

          <Text
            style={
              styles.heroDescription
            }
          >
            {pageLanguage === 'en'
              ? 'Learn scripture. Test your knowledge. Challenge yourself and discover how much you really know.'
              : 'வேதாகமத்தை கற்றுக்கொள்ளுங்கள். உங்கள் அறிவை சோதியுங்கள். உங்களை சவாலுக்கு உட்படுத்தி உங்கள் அறிவை கண்டறியுங்கள்.'}
          </Text>

          {/* ================================================
              QUIZ LIVE
          ================================================ */}

          {isQuizAvailable ? (
            <View
              style={
                styles.quizStateContainer
              }
            >
              <View
                style={styles.liveBadge}
              >
                <StatusDot active />

                <Text
                  style={
                    styles.liveBadgeText
                  }
                >
                  {pageLanguage === 'en'
                    ? 'QUIZ IS LIVE'
                    : 'வினாடி வினா நேரலை'}
                </Text>
              </View>

              <Text
                style={
                  styles.liveDescription
                }
              >
                {pageLanguage === 'en'
                  ? "The challenge is open. Join whenever you're ready."
                  : 'சவால் தொடங்கியுள்ளது. நீங்கள் தயாரானதும் சேருங்கள்.'}
              </Text>

              <Pressable
                onPress={() =>
                  router.push('/join')
                }
                style={({ pressed }) => [
                  styles.joinButton,

                  pressed &&
                    styles.buttonPressed,
                ]}
              >
                <Text
                  style={
                    styles.joinBolt
                  }
                >
                  ⚡
                </Text>

                <Text
                  style={
                    styles.joinButtonText
                  }
                >
                  {pageLanguage === 'en'
                    ? 'Join Quiz'
                    : 'வினாடி வினாவில் சேர'}
                </Text>

                <Text
                  style={
                    styles.joinArrow
                  }
                >
                  →
                </Text>
              </Pressable>
            </View>
          ) : (
            /* ==============================================
               QUIZ WAITING
            ============================================== */

            <View
              style={
                styles.quizStateContainer
              }
            >
              <View
                style={
                  styles.waitingHeader
                }
              >
                <StatusDot
                  active={false}
                />

                <Text
                  style={
                    styles.waitingText
                  }
                >
                  {pageLanguage === 'en'
                    ? 'NEXT CHALLENGE STARTS IN'
                    : 'அடுத்த சவால் தொடங்க'}
                </Text>
              </View>

              {countdown.total > 0 && (
                <View
                  style={
                    styles.countdownWrapper
                  }
                >
                  <CountdownTimer
                    countdown={
                      countdown
                    }
                    language={
                      pageLanguage
                    }
                  />
                </View>
              )}

              <View
                style={
                  styles.registrationInfo
                }
              >
                <Text
                  style={
                    styles.clockIcon
                  }
                >
                  ◷
                </Text>

                <Text
                  style={
                    styles.registrationText
                  }
                >
                  {pageLanguage === 'en'
                    ? 'Registration opens automatically'
                    : 'பதிவு தானாக திறக்கும்'}
                </Text>
              </View>
            </View>
          )}

          {/* ================================================
              TRUST ITEMS
          ================================================ */}

          <View
            style={
              styles.trustContainer
            }
          >
            <TrustItem
              text={
                pageLanguage === 'en'
                  ? 'English & Tamil'
                  : 'ஆங்கிலம் & தமிழ்'
              }
            />

            <TrustItem
              text={
                pageLanguage === 'en'
                  ? 'Quick to join'
                  : 'விரைவான பதிவு'
              }
            />

            <TrustItem
              text={
                pageLanguage === 'en'
                  ? 'Instant results'
                  : 'உடனடி முடிவுகள்'
              }
            />
          </View>
        </View>

        {/* ==================================================
            CURRENT CHALLENGE
        ================================================== */}

        <View
          style={
            styles.challengeCard
          }
        >
          <View
            style={[
              styles.challengeAccent,

              {
                backgroundColor:
                  isQuizAvailable
                    ? COLORS.emerald
                    : COLORS.violet,
              },
            ]}
          />

          <Text
            style={
              styles.sectionEyebrow
            }
          >
            {pageLanguage === 'en'
              ? 'CURRENT CHALLENGE'
              : 'தற்போதைய சவால்'}
          </Text>

          <View
            style={
              styles.challengeTitleRow
            }
          >
            <StatusDot
              active={
                isQuizAvailable
              }
            />

            <Text
              style={
                styles.challengeTitle
              }
            >
              {isQuizAvailable
                ? pageLanguage === 'en'
                  ? 'Ready to test your knowledge?'
                  : 'உங்கள் அறிவை சோதிக்க தயாரா?'
                : pageLanguage === 'en'
                  ? 'Challenge opens soon'
                  : 'சவால் விரைவில் தொடங்கும்'}
            </Text>
          </View>

          <Text
            style={
              styles.challengeDescription
            }
          >
            {pageLanguage === 'en'
              ? 'Choose from the available chapters and complete the quiz within the configured time.'
              : 'கிடைக்கும் அதிகாரங்களில் ஒன்றைத் தேர்ந்தெடுத்து குறிப்பிட்ட நேரத்தில் வினாடி வினாவை முடிக்கவும்.'}
          </Text>

          {/* STATS */}

          <View
            style={
              styles.statsContainer
            }
          >
            <ChallengeStat
              icon="▤"
              label={
                pageLanguage === 'en'
                  ? 'CHAPTERS'
                  : 'அதிகாரங்கள்'
              }
              value={
                chapters.length
                  ? String(
                      chapters.length
                    )
                  : '—'
              }
            />

            <View
              style={
                styles.statDivider
              }
            />

            <ChallengeStat
              icon="◷"
              label={
                pageLanguage === 'en'
                  ? 'DURATION'
                  : 'நேரம்'
              }
              value={
                config.duration
                  ? `${config.duration}m`
                  : '—'
              }
            />
          </View>
        </View>

        {/* ==================================================
            HOW IT WORKS
        ================================================== */}

        <View
          style={styles.howSection}
        >
          <Text
            style={
              styles.howEyebrow
            }
          >
            {pageLanguage === 'en'
              ? 'THREE SIMPLE STEPS'
              : 'மூன்று எளிய படிகள்'}
          </Text>

          <Text
            style={styles.howTitle}
          >
            {pageLanguage === 'en'
              ? 'Choose. Play. Discover.'
              : 'தேர்வு. விளையாடு. அறிந்துகொள்.'}
          </Text>

          {/* STEPS */}

          <View style={styles.steps}>
            <StepCard
              number="01"
              icon="▤"
              title={
                pageLanguage === 'en'
                  ? 'Choose'
                  : 'தேர்வு'
              }
              description={
                pageLanguage === 'en'
                  ? 'Pick your quiz language and an available chapter.'
                  : 'உங்கள் வினாடி வினா மொழியையும் கிடைக்கும் அதிகாரத்தையும் தேர்ந்தெடுக்கவும்.'
              }
            />

            <StepCard
              number="02"
              icon="◆"
              title={
                pageLanguage === 'en'
                  ? 'Play'
                  : 'விளையாடு'
              }
              description={
                pageLanguage === 'en'
                  ? 'Answer the questions and put your knowledge to the test.'
                  : 'கேள்விகளுக்கு பதிலளித்து உங்கள் அறிவை சோதியுங்கள்.'
              }
            />

            <StepCard
              number="03"
              icon="★"
              title={
                pageLanguage === 'en'
                  ? 'Result'
                  : 'முடிவு'
              }
              description={
                pageLanguage === 'en'
                  ? 'Complete the challenge and see your result instantly.'
                  : 'சவாலை முடித்து உங்கள் முடிவை உடனடியாக பாருங்கள்.'
              }
            />
          </View>

          {/* ==================================================
              LEADERBOARD
          ================================================== */}

          <Pressable
            onPress={() =>
              router.push(
                '/leaderboard'
              )
            }
            style={({ pressed }) => [
              styles.leaderboardButton,

              pressed &&
                styles.buttonPressed,
            ]}
          >
            <View
              style={
                styles.leaderboardLeft
              }
            >
              <View
                style={
                  styles.trophyContainer
                }
              >
                <Text
                  style={styles.trophy}
                >
                  ★
                </Text>
              </View>

              <View
                style={
                  styles.leaderboardTextContainer
                }
              >
                <Text
                  style={
                    styles.leaderboardTitle
                  }
                >
                  {pageLanguage === 'en'
                    ? 'Leaderboard'
                    : 'தரவரிசை'}
                </Text>

                <Text
                  style={
                    styles.leaderboardSubtitle
                  }
                >
                  {pageLanguage === 'en'
                    ? 'Rankings & top scores'
                    : 'தரவரிசை மற்றும் சிறந்த மதிப்பெண்கள்'}
                </Text>
              </View>
            </View>

            <Text
              style={
                styles.leaderboardArrow
              }
            >
              →
            </Text>
          </Pressable>
        </View>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <View style={styles.footer}>
          <View
            style={
              styles.footerBrand
            }
          >
            <Image
              source={require(
                '../../assets/images/quiztians-q.png'
              )}
              style={
                styles.footerLogo
              }
              resizeMode="contain"
            />

            <Text
              style={
                styles.footerCopyright
              }
            >
              ©{' '}
              {new Date().getFullYear()}{' '}
              QUIZTIANS
            </Text>
          </View>

          <Text
            style={styles.churchName}
          >
            NEW GRACE JESUS WITH US
            CHURCH - HOSUR
          </Text>

          <Text
            style={
              styles.footerTagline
            }
          >
            LEARN • PLAY • COMPETE
          </Text>
        </View>
      </ScrollView>

      {/* ====================================================
          ANNOUNCEMENT POPUP

          This remains outside ScrollView so it overlays
          the complete Home screen.
      ==================================================== */}

      <AnnouncementPopup
        visible={Boolean(
          activeAnnouncement
        )}
        announcement={
          activeAnnouncement
        }
        pageLanguage={
          pageLanguage
        }
        onDismiss={
          handleDismissAnnouncement
        }
      />
    </SafeAreaView>
  );
}

/* ==========================================================
   STATUS DOT
========================================================== */

function StatusDot({
  active,
}: {
  active: boolean;
}) {
  return (
    <View
      style={[
        styles.statusDotOuter,

        {
          backgroundColor:
            active
              ? 'rgba(52,211,153,0.12)'
              : 'rgba(251,191,36,0.12)',
        },
      ]}
    >
      <View
        style={[
          styles.statusDotInner,

          {
            backgroundColor:
              active
                ? COLORS.emerald
                : COLORS.amber,
          },
        ]}
      />
    </View>
  );
}

/* ==========================================================
   TRUST ITEM
========================================================== */

function TrustItem({
  text,
}: {
  text: string;
}) {
  return (
    <View
      style={styles.trustItem}
    >
      <Text
        style={styles.trustCheck}
      >
        ✓
      </Text>

      <Text
        style={styles.trustText}
      >
        {text}
      </Text>
    </View>
  );
}

/* ==========================================================
   CHALLENGE STAT
========================================================== */

type ChallengeStatProps = {
  icon: string;
  label: string;
  value: string;
};

function ChallengeStat({
  icon,
  label,
  value,
}: ChallengeStatProps) {
  return (
    <View style={styles.stat}>
      <Text
        style={styles.statIcon}
      >
        {icon}
      </Text>

      <Text
        style={styles.statValue}
      >
        {value}
      </Text>

      <Text
        style={styles.statLabel}
      >
        {label}
      </Text>
    </View>
  );
}

/* ==========================================================
   STEP CARD
========================================================== */

type StepCardProps = {
  number: string;
  icon: string;
  title: string;
  description: string;
};

function StepCard({
  number,
  icon,
  title,
  description,
}: StepCardProps) {
  return (
    <View
      style={styles.stepCard}
    >
      <View
        style={styles.stepTop}
      >
        <View
          style={
            styles.stepIconContainer
          }
        >
          <Text
            style={styles.stepIcon}
          >
            {icon}
          </Text>
        </View>

        <Text
          style={styles.stepNumber}
        >
          {number}
        </Text>
      </View>

      <Text
        style={styles.stepTitle}
      >
        {title}
      </Text>

      <Text
        style={
          styles.stepDescription
        }
      >
        {description}
      </Text>
    </View>
  );
}

/* ==========================================================
   STYLES
========================================================== */

const styles =
  StyleSheet.create({
    /* ======================================================
       SCREEN
    ====================================================== */

    safeArea: {
      flex: 1,

      backgroundColor:
        COLORS.background,
    },

    scrollContent: {
      paddingBottom: 0,
    },

    /* ======================================================
       BACKGROUND
    ====================================================== */

    topGlow: {
      position: 'absolute',

      width: 420,
      height: 420,

      borderRadius: 210,

      backgroundColor:
        'rgba(124,58,237,0.055)',

      top: -250,

      alignSelf: 'center',
    },

    leftGlow: {
      position: 'absolute',

      width: 300,
      height: 300,

      borderRadius: 150,

      backgroundColor:
        'rgba(79,70,229,0.025)',

      left: -210,

      top: 600,
    },

    rightGlow: {
      position: 'absolute',

      width: 300,
      height: 300,

      borderRadius: 150,

      backgroundColor:
        'rgba(124,58,237,0.025)',

      right: -210,

      top: 320,
    },

    /* ======================================================
       NAVBAR
    ====================================================== */

    navbar: {
      minHeight: 68,

      paddingHorizontal: 14,

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent:
        'space-between',

      borderBottomWidth: 1,

      borderBottomColor:
        'rgba(255,255,255,0.055)',

      backgroundColor:
        'rgba(9,9,11,0.98)',

      zIndex: 20,
    },

    brandContainer: {
      flexDirection: 'row',

      alignItems: 'center',

      flexShrink: 1,
    },

    brandQ: {
      width: 34,
      height: 34,
    },

    brandTextContainer: {
      marginLeft: 8,

      flexShrink: 1,
    },

    wordmark: {
      width: 112,
      height: 25,
    },

    brandTagline: {
      color: '#3F3F46',

      fontSize: 6.5,

      fontWeight: '800',

      letterSpacing: 1.2,

      marginTop: 1,
    },

    /* ======================================================
       LANGUAGE
    ====================================================== */

    languageToggle: {
      flexDirection: 'row',

      alignItems: 'center',

      padding: 3,

      borderRadius: 11,

      borderWidth: 1,

      borderColor:
        'rgba(255,255,255,0.07)',

      backgroundColor:
        'rgba(255,255,255,0.025)',
    },

    languageButton: {
      minHeight: 30,

      minWidth: 38,

      paddingHorizontal: 7,

      borderRadius: 8,

      alignItems: 'center',

      justifyContent:
        'center',
    },

    languageButtonActive: {
      backgroundColor:
        COLORS.violet,
    },

    languageText: {
      color: '#52525B',

      fontSize: 9,

      fontWeight: '900',
    },

    languageTextActive: {
      color: '#FFFFFF',
    },

    /* ======================================================
       HERO
    ====================================================== */

    heroSection: {
      minHeight: 570,

      paddingHorizontal: 20,

      paddingTop: 50,

      paddingBottom: 38,

      alignItems: 'center',

      overflow: 'hidden',
    },

    watermark: {
      position: 'absolute',

      top: 125,

      fontSize: 60,

      fontWeight: '900',

      letterSpacing: -5,

      color:
        'rgba(255,255,255,0.018)',
    },

    eyebrow: {
      flexDirection: 'row',

      alignItems: 'center',

      paddingHorizontal: 12,

      paddingVertical: 8,

      borderRadius: 100,

      borderWidth: 1,

      borderColor:
        'rgba(139,92,246,0.15)',

      backgroundColor:
        'rgba(139,92,246,0.06)',
    },

    sparkle: {
      color:
        COLORS.violetSoft,

      fontSize: 11,

      marginRight: 7,
    },

    eyebrowText: {
      color:
        COLORS.violetLight,

      fontSize: 9,

      fontWeight: '900',

      letterSpacing: 1.5,
    },

    heroTitle: {
      color: COLORS.text,

      fontSize: 40,

      lineHeight: 44,

      fontWeight: '900',

      letterSpacing: -2,

      textAlign: 'center',

      marginTop: 25,
    },

    heroAccentTitle: {
      color:
        COLORS.violetSoft,

      fontSize: 40,

      lineHeight: 44,

      fontWeight: '900',

      letterSpacing: -2,

      textAlign: 'center',
    },

    heroTitleTamil: {
      color: COLORS.text,

      fontSize: 29,

      lineHeight: 40,

      fontWeight: '900',

      textAlign: 'center',

      marginTop: 25,
    },

    heroAccentTitleTamil: {
      color:
        COLORS.violetSoft,

      fontSize: 29,

      lineHeight: 40,

      fontWeight: '900',

      textAlign: 'center',
    },

    heroDescription: {
      maxWidth: 350,

      color:
        COLORS.textSecondary,

      fontSize: 12.5,

      lineHeight: 21,

      textAlign: 'center',

      marginTop: 18,
    },

    /* ======================================================
       QUIZ STATE
    ====================================================== */

    quizStateContainer: {
      width: '100%',

      alignItems: 'center',

      marginTop: 30,
    },

    liveBadge: {
      flexDirection: 'row',

      alignItems: 'center',

      borderWidth: 1,

      borderColor:
        'rgba(52,211,153,0.15)',

      backgroundColor:
        'rgba(52,211,153,0.06)',

      paddingHorizontal: 12,

      paddingVertical: 8,

      borderRadius: 100,
    },

    liveBadgeText: {
      color:
        COLORS.emerald,

      fontSize: 9,

      fontWeight: '900',

      letterSpacing: 1.3,

      marginLeft: 7,
    },

    liveDescription: {
      color:
        COLORS.textMuted,

      fontSize: 11,

      textAlign: 'center',

      marginTop: 14,
    },

    joinButton: {
      width: '100%',

      maxWidth: 310,

      minHeight: 58,

      borderRadius: 18,

      backgroundColor:
        COLORS.violet,

      marginTop: 22,

      paddingHorizontal: 20,

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent:
        'center',
    },

    joinBolt: {
      color: COLORS.text,

      fontSize: 16,

      marginRight: 10,
    },

    joinButtonText: {
      color: COLORS.text,

      fontSize: 13,

      fontWeight: '900',

      flexShrink: 1,
    },

    joinArrow: {
      color: COLORS.text,

      fontSize: 18,

      marginLeft: 10,
    },

    waitingHeader: {
      flexDirection: 'row',

      alignItems: 'center',
    },

    waitingText: {
      color: COLORS.amber,

      fontSize: 9,

      fontWeight: '900',

      letterSpacing: 1.4,

      marginLeft: 7,
    },

    countdownWrapper: {
      width: '100%',

      maxWidth: 560,

      marginTop: 18,
    },

    registrationInfo: {
      flexDirection: 'row',

      alignItems: 'center',

      marginTop: 14,

      paddingHorizontal: 12,

      paddingVertical: 8,

      borderWidth: 1,

      borderColor:
        'rgba(255,255,255,0.05)',

      backgroundColor:
        'rgba(255,255,255,0.02)',

      borderRadius: 100,
    },

    clockIcon: {
      color:
        COLORS.textMuted,

      fontSize: 12,

      marginRight: 7,
    },

    registrationText: {
      color:
        COLORS.textMuted,

      fontSize: 9,

      fontWeight: '700',
    },

    /* ======================================================
       STATUS DOT
    ====================================================== */

    statusDotOuter: {
      width: 10,

      height: 10,

      borderRadius: 5,

      alignItems: 'center',

      justifyContent:
        'center',
    },

    statusDotInner: {
      width: 5,

      height: 5,

      borderRadius: 3,
    },

    /* ======================================================
       TRUST
    ====================================================== */

    trustContainer: {
      marginTop: 27,

      flexDirection: 'row',

      flexWrap: 'wrap',

      justifyContent:
        'center',

      columnGap: 16,

      rowGap: 8,
    },

    trustItem: {
      flexDirection: 'row',

      alignItems: 'center',
    },

    trustCheck: {
      color:
        COLORS.emerald,

      fontSize: 9,

      fontWeight: '900',

      marginRight: 5,
    },

    trustText: {
      color:
        COLORS.textMuted,

      fontSize: 9.5,

      fontWeight: '600',
    },

    /* ======================================================
       CHALLENGE
    ====================================================== */

    challengeCard: {
      marginHorizontal: 18,

      marginBottom: 42,

      padding: 20,

      backgroundColor:
        'rgba(17,17,20,0.92)',

      borderRadius: 24,

      borderWidth: 1,

      borderColor:
        COLORS.border,

      overflow: 'hidden',
    },

    challengeAccent: {
      position: 'absolute',

      left: '25%',

      right: '25%',

      top: 0,

      height: 1,

      opacity: 0.5,
    },

    sectionEyebrow: {
      color:
        COLORS.textMuted,

      fontSize: 9,

      fontWeight: '900',

      letterSpacing: 1.5,
    },

    challengeTitleRow: {
      flexDirection: 'row',

      alignItems: 'center',

      marginTop: 12,
    },

    challengeTitle: {
      color:
        COLORS.textSoft,

      fontSize: 15,

      fontWeight: '900',

      marginLeft: 8,

      flex: 1,
    },

    challengeDescription: {
      color:
        COLORS.textMuted,

      fontSize: 11,

      lineHeight: 19,

      marginTop: 10,
    },

    statsContainer: {
      minHeight: 95,

      marginTop: 20,

      flexDirection: 'row',

      borderWidth: 1,

      borderColor:
        'rgba(255,255,255,0.055)',

      borderRadius: 17,

      backgroundColor:
        COLORS.surfaceDark,

      overflow: 'hidden',
    },

    stat: {
      flex: 1,

      alignItems: 'center',

      justifyContent:
        'center',

      paddingVertical: 15,
    },

    statDivider: {
      width: 1,

      backgroundColor:
        'rgba(255,255,255,0.055)',
    },

    statIcon: {
      color:
        COLORS.violetSoft,

      fontSize: 14,

      marginBottom: 5,
    },

    statValue: {
      color: COLORS.text,

      fontSize: 19,

      fontWeight: '900',
    },

    statLabel: {
      color:
        COLORS.textMuted,

      fontSize: 7.5,

      fontWeight: '900',

      letterSpacing: 1,

      marginTop: 4,
    },

    /* ======================================================
       HOW IT WORKS
    ====================================================== */

    howSection: {
      paddingHorizontal: 18,

      paddingTop: 40,

      paddingBottom: 44,

      borderTopWidth: 1,

      borderBottomWidth: 1,

      borderColor:
        'rgba(255,255,255,0.05)',

      backgroundColor:
        'rgba(255,255,255,0.012)',
    },

    howEyebrow: {
      color:
        COLORS.violetSoft,

      fontSize: 9,

      fontWeight: '900',

      letterSpacing: 1.6,

      textAlign: 'center',
    },

    howTitle: {
      color: COLORS.text,

      fontSize: 24,

      fontWeight: '900',

      letterSpacing: -0.7,

      textAlign: 'center',

      marginTop: 8,
    },

    steps: {
      marginTop: 28,

      gap: 11,
    },

    stepCard: {
      padding: 18,

      borderRadius: 19,

      borderWidth: 1,

      borderColor:
        'rgba(255,255,255,0.055)',

      backgroundColor:
        'rgba(255,255,255,0.018)',
    },

    stepTop: {
      flexDirection: 'row',

      alignItems: 'center',

      justifyContent:
        'space-between',
    },

    stepIconContainer: {
      width: 36,

      height: 36,

      borderRadius: 12,

      alignItems: 'center',

      justifyContent:
        'center',

      backgroundColor:
        'rgba(139,92,246,0.07)',

      borderWidth: 1,

      borderColor:
        'rgba(139,92,246,0.10)',
    },

    stepIcon: {
      color:
        COLORS.violetSoft,

      fontSize: 14,
    },

    stepNumber: {
      color:
        COLORS.textDim,

      fontSize: 11,

      fontWeight: '900',

      letterSpacing: 1,
    },

    stepTitle: {
      color:
        COLORS.textSoft,

      fontSize: 15,

      fontWeight: '900',

      marginTop: 14,
    },

    stepDescription: {
      color:
        COLORS.textMuted,

      fontSize: 11,

      lineHeight: 18,

      marginTop: 6,
    },

    /* ======================================================
       LEADERBOARD
    ====================================================== */

    leaderboardButton: {
      minHeight: 62,

      marginTop: 20,

      paddingHorizontal: 13,

      borderRadius: 17,

      borderWidth: 1,

      borderColor:
        'rgba(255,255,255,0.055)',

      backgroundColor:
        'rgba(255,255,255,0.018)',

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent:
        'space-between',
    },

    leaderboardLeft: {
      flexDirection: 'row',

      alignItems: 'center',

      flex: 1,
    },

    trophyContainer: {
      width: 36,

      height: 36,

      borderRadius: 12,

      alignItems: 'center',

      justifyContent:
        'center',

      backgroundColor:
        'rgba(245,158,11,0.05)',

      borderWidth: 1,

      borderColor:
        'rgba(245,158,11,0.10)',
    },

    trophy: {
      color: '#FBBF24',

      fontSize: 14,
    },

    leaderboardTextContainer: {
      marginLeft: 11,

      flex: 1,
    },

    leaderboardTitle: {
      color: '#A1A1AA',

      fontSize: 11,

      fontWeight: '900',
    },

    leaderboardSubtitle: {
      color:
        COLORS.textDim,

      fontSize: 9,

      marginTop: 3,
    },

    leaderboardArrow: {
      color:
        COLORS.textMuted,

      fontSize: 17,

      marginLeft: 8,
    },

    /* ======================================================
       FOOTER
    ====================================================== */

    footer: {
      alignItems: 'center',

      paddingHorizontal: 20,

      paddingVertical: 28,
    },

    footerBrand: {
      flexDirection: 'row',

      alignItems: 'center',
    },

    footerLogo: {
      width: 24,

      height: 24,

      opacity: 0.6,
    },

    footerCopyright: {
      color:
        COLORS.textDim,

      fontSize: 9,

      fontWeight: '700',

      marginLeft: 7,
    },

    churchName: {
      color:
        COLORS.textDim,

      fontSize: 8,

      fontWeight: '700',

      textAlign: 'center',

      marginTop: 13,
    },

    footerTagline: {
      color:
        COLORS.textDim,

      fontSize: 8,

      fontWeight: '900',

      letterSpacing: 1.2,

      marginTop: 9,
    },

    /* ======================================================
       LOADING
    ====================================================== */

    loadingScreen: {
      flex: 1,

      backgroundColor:
        COLORS.background,

      alignItems: 'center',

      justifyContent:
        'center',

      paddingHorizontal: 24,
    },

    loadingLogoWrapper: {
      width: 75,

      height: 75,

      alignItems: 'center',

      justifyContent:
        'center',
    },

    loadingLogo: {
      width: 65,

      height: 65,
    },

    loader: {
      marginTop: 24,
    },

    loadingText: {
      color:
        COLORS.textMuted,

      fontSize: 12,

      fontWeight: '600',

      marginTop: 13,
    },

    /* ======================================================
       ERROR
    ====================================================== */

    errorScreen: {
      flex: 1,

      backgroundColor:
        COLORS.background,

      alignItems: 'center',

      justifyContent:
        'center',

      paddingHorizontal: 28,
    },

    errorLogo: {
      width: 55,

      height: 55,

      marginBottom: 25,
    },

    errorTitle: {
      color: COLORS.text,

      fontSize: 20,

      fontWeight: '900',

      textAlign: 'center',
    },

    errorDescription: {
      color:
        COLORS.textMuted,

      fontSize: 12,

      lineHeight: 19,

      textAlign: 'center',

      marginTop: 9,
    },

    retryButton: {
      minHeight: 48,

      paddingHorizontal: 25,

      borderRadius: 14,

      backgroundColor:
        COLORS.violet,

      alignItems: 'center',

      justifyContent:
        'center',

      marginTop: 24,
    },

    retryText: {
      color: COLORS.text,

      fontSize: 11,

      fontWeight: '900',

      letterSpacing: 1,
    },

    /* ======================================================
       PRESS
    ====================================================== */

    buttonPressed: {
      opacity: 0.75,

      transform: [
        {
          scale: 0.985,
        },
      ],
    },
  });
