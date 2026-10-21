import { useEffect, useRef } from 'react';

import {
  Animated,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import type {
  Announcement,
} from '../../services/announcementService';

/* ==========================================================
   TYPES
========================================================== */

type Props = {
  visible: boolean;

  announcement:
    | Announcement
    | null;

  pageLanguage?: 'en' | 'ta';

  onDismiss: () => void;
};

type AnnouncementVisualType =
  | 'info'
  | 'success'
  | 'warning'
  | 'important';

type AnnouncementTheme = {
  label: string;
  eyebrow: string;
  symbol: string;

  accent: string;
  accentStrong: string;

  softAccent: string;
  glowAccent: string;

  border: string;
  button: string;
};

/* ==========================================================
   COMPONENT
========================================================== */

export default function AnnouncementPopup({
  visible,
  announcement,
  pageLanguage = 'en',
  onDismiss,
}: Props) {
  const {
    width: screenWidth,
    height: screenHeight,
  } = useWindowDimensions();

  /* ========================================================
     ANIMATION VALUES
  ======================================================== */

  const opacity =
    useRef(
      new Animated.Value(0)
    ).current;

  const scale =
    useRef(
      new Animated.Value(0.94)
    ).current;

  const translateY =
    useRef(
      new Animated.Value(24)
    ).current;

  /* ========================================================
     OPEN ANIMATION
  ======================================================== */

  useEffect(() => {
    if (!visible) {
      return;
    }

    opacity.setValue(0);
    scale.setValue(0.94);
    translateY.setValue(24);

    Animated.parallel([
      Animated.timing(
        opacity,
        {
          toValue: 1,
          duration: 240,
          useNativeDriver: true,
        }
      ),

      Animated.spring(
        scale,
        {
          toValue: 1,

          friction: 8,
          tension: 75,

          useNativeDriver: true,
        }
      ),

      Animated.spring(
        translateY,
        {
          toValue: 0,

          friction: 9,
          tension: 75,

          useNativeDriver: true,
        }
      ),
    ]).start();
  }, [
    visible,
    opacity,
    scale,
    translateY,
  ]);

  /* ========================================================
     NO ANNOUNCEMENT
  ======================================================== */

  if (!announcement) {
    return null;
  }

  /* ========================================================
     THEME
  ======================================================== */

  const type =
    normalizeType(
      announcement.type
    );

  const theme =
    getTheme(
      type,
      pageLanguage
    );

  /*
   * Give the modal real horizontal breathing room.
   *
   * On normal phones:
   *   screen width - 32
   *
   * On tablets / web preview:
   *   maximum 420
   */
  const cardWidth =
    Math.min(
      screenWidth - 32,
      420
    );

  /*
   * Prevent very long announcements from extending outside
   * the screen.
   */
  const maxCardHeight =
    Math.min(
      screenHeight - 70,
      620
    );

  /* ========================================================
     UI
  ======================================================== */

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={
        onDismiss
      }
    >
      <View
        style={
          styles.modalRoot
        }
      >
        {/* ==================================================
            BACKDROP
        ================================================== */}

        <Pressable
          style={
            StyleSheet.absoluteFill
          }
          onPress={
            onDismiss
          }
        >
          <View
            style={
              styles.backdrop
            }
          />
        </Pressable>

        {/* ==================================================
            BACKGROUND GLOW
        ================================================== */}

        <View
          pointerEvents="none"
          style={[
            styles.outerGlow,

            {
              backgroundColor:
                theme.glowAccent,
            },
          ]}
        />

        {/* ==================================================
            MODAL CARD
        ================================================== */}

        <Animated.View
          style={[
            styles.card,

            {
              width:
                cardWidth,

              maxHeight:
                maxCardHeight,

              borderColor:
                theme.border,

              opacity,

              transform: [
                {
                  translateY,
                },

                {
                  scale,
                },
              ],
            },
          ]}
        >
          {/* ==================================================
              TOP ACCENT
          ================================================== */}

          <View
            style={[
              styles.topAccent,

              {
                backgroundColor:
                  theme.accent,
              },
            ]}
          />

          {/* ==================================================
              DECORATIVE GLOW
          ================================================== */}

          <View
            pointerEvents="none"
            style={[
              styles.topDecoration,

              {
                backgroundColor:
                  theme.glowAccent,
              },
            ]}
          />

          <View
            pointerEvents="none"
            style={
              styles.bottomDecoration
            }
          />

          {/* ==================================================
              HEADER
          ================================================== */}

          <View
            style={
              styles.header
            }
          >
            {/* BRAND */}

            <View
              style={
                styles.brand
              }
            >
              <View
                style={
                  styles.logoContainer
                }
              >
                <Image
                  source={require(
                    '../../../assets/images/quiztians-q.png'
                  )}
                  resizeMode="contain"
                  style={
                    styles.logo
                  }
                />
              </View>

              <View
                style={
                  styles.brandContent
                }
              >
                <Text
                  style={
                    styles.brandName
                  }
                >
                  QUIZTIANS
                </Text>

                <Text
                  style={
                    styles.brandTagline
                  }
                >
                  LEARN • PLAY • COMPETE
                </Text>
              </View>
            </View>

            {/* CLOSE */}

            <Pressable
              onPress={
                onDismiss
              }
              hitSlop={10}
              style={({
                pressed,
              }) => [
                styles.closeButton,

                pressed &&
                  styles.closeButtonPressed,
              ]}
            >
              <Text
                style={
                  styles.closeText
                }
              >
                ×
              </Text>
            </Pressable>
          </View>

          {/* ==================================================
              SCROLLABLE CONTENT
          ================================================== */}

          <ScrollView
            style={
              styles.scrollView
            }
            contentContainerStyle={
              styles.content
            }
            showsVerticalScrollIndicator={
              false
            }
            bounces={false}
          >
            {/* ================================================
                ANNOUNCEMENT HEADING
            ================================================ */}

            <View
              style={
                styles.headingRow
              }
            >
              {/* ICON */}

              <View
                style={[
                  styles.typeIcon,

                  {
                    backgroundColor:
                      theme.softAccent,

                    borderColor:
                      theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.typeSymbol,

                    {
                      color:
                        theme.accent,
                    },
                  ]}
                >
                  {theme.symbol}
                </Text>
              </View>

              {/* TITLE AREA */}

              <View
                style={
                  styles.headingContent
                }
              >
                <View
                  style={
                    styles.badgeRow
                  }
                >
                  {/* TYPE BADGE */}

                  <View
                    style={[
                      styles.typeBadge,

                      {
                        backgroundColor:
                          theme.softAccent,

                        borderColor:
                          theme.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeBadgeText,

                        {
                          color:
                            theme.accent,
                        },
                      ]}
                    >
                      {theme.label}
                    </Text>
                  </View>

                  {/* EYEBROW */}

                  <Text
                    numberOfLines={1}
                    style={
                      styles.eyebrow
                    }
                  >
                    {theme.eyebrow}
                  </Text>
                </View>

                {/* TITLE */}

                <Text
                  style={
                    styles.title
                  }
                >
                  {announcement.title?.trim() ||
                    (pageLanguage ===
                    'ta'
                      ? 'அறிவிப்பு'
                      : 'Announcement')}
                </Text>
              </View>
            </View>

            {/* ================================================
                MESSAGE
            ================================================ */}

            <View
              style={
                styles.messageCard
              }
            >
              <Text
                style={
                  styles.message
                }
              >
                {announcement.message?.trim() ||
                  (pageLanguage ===
                  'ta'
                    ? 'புதிய அறிவிப்பு கிடைக்கிறது.'
                    : 'A new announcement is available.')}
              </Text>
            </View>

            {/* ================================================
                OFFICIAL UPDATE DIVIDER
            ================================================ */}

            <View
              style={
                styles.officialRow
              }
            >
              <View
                style={
                  styles.divider
                }
              />

              <View
                style={
                  styles.officialLabel
                }
              >
                <Text
                  style={[
                    styles.officialSparkle,

                    {
                      color:
                        theme.accent,
                    },
                  ]}
                >
                  ✦
                </Text>

                <Text
                  style={
                    styles.officialText
                  }
                >
                  {pageLanguage ===
                  'ta'
                    ? 'அதிகாரப்பூர்வ புதுப்பிப்பு'
                    : 'OFFICIAL UPDATE'}
                </Text>
              </View>

              <View
                style={
                  styles.divider
                }
              />
            </View>

            {/* ================================================
                ACTION BUTTON
            ================================================ */}

            <Pressable
              onPress={
                onDismiss
              }
              style={({
                pressed,
              }) => [
                styles.actionButton,

                {
                  backgroundColor:
                    theme.button,
                },

                pressed &&
                  styles.actionButtonPressed,
              ]}
            >
              <View
                style={
                  styles.actionButtonContent
                }
              >
                <Text
                  style={
                    styles.actionCheck
                  }
                >
                  ✓
                </Text>

                <Text
                  style={
                    styles.actionText
                  }
                >
                  {pageLanguage ===
                  'ta'
                    ? 'புரிந்தது, நன்றி'
                    : 'Got it, thanks'}
                </Text>
              </View>

              <Text
                style={
                  styles.actionArrow
                }
              >
                →
              </Text>
            </Pressable>

            {/* ================================================
                DISMISS INFO
            ================================================ */}

            <Text
              style={
                styles.dismissText
              }
            >
              {pageLanguage ===
              'ta'
                ? 'இந்த அறிவிப்பு மீண்டும் காட்டப்படாது.'
                : 'This announcement will stay dismissed.'}
            </Text>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

/* ==========================================================
   NORMALIZE TYPE
========================================================== */

function normalizeType(
  type?: string | null
): AnnouncementVisualType {
  switch (
    type
      ?.trim()
      .toLowerCase()
  ) {
    case 'success':
      return 'success';

    case 'warning':
      return 'warning';

    case 'important':
      return 'important';

    default:
      return 'info';
  }
}

/* ==========================================================
   THEME
========================================================== */

function getTheme(
  type: AnnouncementVisualType,
  language: 'en' | 'ta'
): AnnouncementTheme {
  const tamil =
    language === 'ta';

  /* ========================================================
     SUCCESS
  ======================================================== */

  if (type === 'success') {
    return {
      label: tamil
        ? 'நல்ல செய்தி'
        : 'GOOD NEWS',

      eyebrow: tamil
        ? 'QUIZTIANS புதுப்பிப்பு'
        : 'QUIZTIANS UPDATE',

      symbol: '✓',

      accent: '#34D399',

      accentStrong:
        '#10B981',

      softAccent:
        'rgba(52,211,153,0.09)',

      glowAccent:
        'rgba(16,185,129,0.16)',

      border:
        'rgba(52,211,153,0.20)',

      button:
        '#059669',
    };
  }

  /* ========================================================
     WARNING
  ======================================================== */

  if (type === 'warning') {
    return {
      label: tamil
        ? 'கவனம்'
        : 'ATTENTION',

      eyebrow: tamil
        ? 'தயவுசெய்து கவனிக்கவும்'
        : 'PLEASE TAKE NOTE',

      symbol: '!',

      accent: '#FBBF24',

      accentStrong:
        '#F59E0B',

      softAccent:
        'rgba(251,191,36,0.09)',

      glowAccent:
        'rgba(245,158,11,0.16)',

      border:
        'rgba(251,191,36,0.20)',

      button:
        '#D97706',
    };
  }

  /* ========================================================
     IMPORTANT
  ======================================================== */

  if (type === 'important') {
    return {
      label: tamil
        ? 'முக்கியம்'
        : 'IMPORTANT',

      eyebrow: tamil
        ? 'இதை தவறவிடாதீர்கள்'
        : "DON'T MISS THIS",

      symbol: '◆',

      accent: '#C4B5FD',

      accentStrong:
        '#8B5CF6',

      softAccent:
        'rgba(139,92,246,0.10)',

      glowAccent:
        'rgba(124,58,237,0.18)',

      border:
        'rgba(167,139,250,0.20)',

      button:
        '#7C3AED',
    };
  }

  /* ========================================================
     INFO
  ======================================================== */

  return {
    label: tamil
      ? 'தகவல்'
      : 'INFORMATION',

    eyebrow: tamil
      ? 'சமீபத்திய புதுப்பிப்பு'
      : 'LATEST UPDATE',

    symbol: 'i',

    accent: '#7DD3FC',

    accentStrong:
      '#0EA5E9',

    softAccent:
      'rgba(56,189,248,0.09)',

    glowAccent:
      'rgba(14,165,233,0.16)',

    border:
      'rgba(125,211,252,0.20)',

    button:
      '#0284C7',
  };
}

/* ==========================================================
   STYLES
========================================================== */

const styles =
  StyleSheet.create({
    /* ======================================================
       MODAL
    ====================================================== */

    modalRoot: {
      flex: 1,

      alignItems: 'center',

      justifyContent:
        'center',

      paddingHorizontal: 16,

      paddingVertical: 32,
    },

    backdrop: {
      flex: 1,

      backgroundColor:
        'rgba(0,0,0,0.82)',
    },

    /* ======================================================
       OUTER GLOW
    ====================================================== */

    outerGlow: {
      position: 'absolute',

      width: 300,
      height: 300,

      borderRadius: 150,

      opacity: 0.45,
    },

    /* ======================================================
       CARD
    ====================================================== */

    card: {
      position: 'relative',

      overflow: 'hidden',

      borderRadius: 28,

      borderWidth: 1,

      backgroundColor:
        '#0E0E12',

      shadowColor: '#000',

      shadowOffset: {
        width: 0,
        height: 20,
      },

      shadowOpacity: 0.55,

      shadowRadius: 35,

      elevation: 30,
    },

    /* ======================================================
       DECORATION
    ====================================================== */

    topAccent: {
      position: 'absolute',

      top: 0,

      left: '24%',

      right: '24%',

      height: 2,

      borderBottomLeftRadius:
        10,

      borderBottomRightRadius:
        10,

      zIndex: 10,
    },

    topDecoration: {
      position: 'absolute',

      width: 170,
      height: 170,

      borderRadius: 85,

      top: -100,

      right: -65,

      opacity: 0.5,
    },

    bottomDecoration: {
      position: 'absolute',

      width: 160,
      height: 160,

      borderRadius: 80,

      bottom: -110,

      left: -70,

      backgroundColor:
        'rgba(139,92,246,0.055)',
    },

    /* ======================================================
       HEADER
    ====================================================== */

    header: {
      minHeight: 72,

      paddingHorizontal: 18,

      paddingVertical: 14,

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent:
        'space-between',

      borderBottomWidth: 1,

      borderBottomColor:
        'rgba(255,255,255,0.055)',

      zIndex: 5,
    },

    brand: {
      flex: 1,

      minWidth: 0,

      flexDirection: 'row',

      alignItems: 'center',
    },

    logoContainer: {
      width: 42,
      height: 42,

      borderRadius: 13,

      alignItems: 'center',

      justifyContent:
        'center',

      borderWidth: 1,

      borderColor:
        'rgba(255,255,255,0.07)',

      backgroundColor:
        'rgba(255,255,255,0.025)',
    },

    logo: {
      width: 28,
      height: 28,
    },

    brandContent: {
      flex: 1,

      marginLeft: 11,
    },

    brandName: {
      color: '#E4E4E7',

      fontSize: 11,

      fontWeight: '900',

      letterSpacing: 1.25,
    },

    brandTagline: {
      color: '#52525B',

      fontSize: 6,

      fontWeight: '800',

      letterSpacing: 1.1,

      marginTop: 4,
    },

    closeButton: {
      width: 38,
      height: 38,

      borderRadius: 12,

      alignItems: 'center',

      justifyContent:
        'center',

      marginLeft: 12,

      borderWidth: 1,

      borderColor:
        'rgba(255,255,255,0.07)',

      backgroundColor:
        'rgba(255,255,255,0.025)',
    },

    closeButtonPressed: {
      opacity: 0.6,

      transform: [
        {
          scale: 0.95,
        },
      ],
    },

    closeText: {
      color: '#71717A',

      fontSize: 23,

      lineHeight: 25,

      fontWeight: '300',
    },

    /* ======================================================
       SCROLL
    ====================================================== */

    scrollView: {
      flexGrow: 0,
    },

    content: {
      paddingHorizontal: 18,

      paddingTop: 22,

      paddingBottom: 20,
    },

    /* ======================================================
       HEADING
    ====================================================== */

    headingRow: {
      width: '100%',

      flexDirection: 'row',

      alignItems:
        'flex-start',
    },

    typeIcon: {
      width: 50,
      height: 50,

      borderRadius: 16,

      borderWidth: 1,

      alignItems: 'center',

      justifyContent:
        'center',

      flexShrink: 0,
    },

    typeSymbol: {
      fontSize: 21,

      fontWeight: '900',
    },

    headingContent: {
      flex: 1,

      minWidth: 0,

      marginLeft: 13,
    },

    badgeRow: {
      flexDirection: 'row',

      alignItems: 'center',

      flexWrap: 'wrap',

      rowGap: 6,

      columnGap: 7,
    },

    typeBadge: {
      minHeight: 23,

      paddingHorizontal: 9,

      paddingVertical: 5,

      borderRadius: 20,

      borderWidth: 1,

      alignItems: 'center',

      justifyContent:
        'center',
    },

    typeBadgeText: {
      fontSize: 7,

      fontWeight: '900',

      letterSpacing: 1,
    },

    eyebrow: {
      flexShrink: 1,

      color: '#52525B',

      fontSize: 7,

      fontWeight: '900',

      letterSpacing: 0.9,
    },

    title: {
      color: '#FFFFFF',

      fontSize: 22,

      lineHeight: 28,

      fontWeight: '900',

      letterSpacing: -0.5,

      marginTop: 10,
    },

    /* ======================================================
       MESSAGE
    ====================================================== */

    messageCard: {
      width: '100%',

      marginTop: 20,

      paddingHorizontal: 16,

      paddingVertical: 15,

      borderRadius: 16,

      borderWidth: 1,

      borderColor:
        'rgba(255,255,255,0.06)',

      backgroundColor:
        'rgba(255,255,255,0.025)',
    },

    message: {
      color: '#A1A1AA',

      fontSize: 12,

      lineHeight: 20,

      fontWeight: '500',
    },

    /* ======================================================
       OFFICIAL UPDATE
    ====================================================== */

    officialRow: {
      width: '100%',

      flexDirection: 'row',

      alignItems: 'center',

      marginTop: 20,
    },

    divider: {
      flex: 1,

      height: 1,

      backgroundColor:
        'rgba(255,255,255,0.055)',
    },

    officialLabel: {
      flexDirection: 'row',

      alignItems: 'center',

      paddingHorizontal: 8,
    },

    officialSparkle: {
      fontSize: 7,

      marginRight: 5,

      opacity: 0.65,
    },

    officialText: {
      color: '#52525B',

      fontSize: 6,

      fontWeight: '900',

      letterSpacing: 0.9,
    },

    /* ======================================================
       CTA
    ====================================================== */

    actionButton: {
      width: '100%',

      minHeight: 54,

      marginTop: 20,

      paddingHorizontal: 16,

      borderRadius: 16,

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent:
        'space-between',

      shadowColor: '#000',

      shadowOffset: {
        width: 0,
        height: 8,
      },

      shadowOpacity: 0.25,

      shadowRadius: 15,

      elevation: 8,
    },

    actionButtonPressed: {
      opacity: 0.82,

      transform: [
        {
          scale: 0.985,
        },
      ],
    },

    actionButtonContent: {
      flex: 1,

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent:
        'center',

      paddingLeft: 20,
    },

    actionCheck: {
      color: '#FFFFFF',

      fontSize: 15,

      fontWeight: '900',

      marginRight: 8,
    },

    actionText: {
      color: '#FFFFFF',

      fontSize: 11,

      fontWeight: '900',

      textAlign: 'center',
    },

    actionArrow: {
      width: 20,

      color: '#FFFFFF',

      fontSize: 16,

      fontWeight: '900',

      textAlign: 'right',
    },

    /* ======================================================
       DISMISS TEXT
    ====================================================== */

    dismissText: {
      color: '#52525B',

      fontSize: 8,

      lineHeight: 13,

      fontWeight: '600',

      textAlign: 'center',

      marginTop: 11,

      paddingHorizontal: 10,
    },
  });