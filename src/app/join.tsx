import { router } from 'expo-router';
import { useMemo, useState } from 'react';

import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { useQuizConfig } from '../hooks/useQuizConfig';
import { supabase } from '../services/supabase';

type Language = 'en' | 'ta';

const COLORS = {
    background: '#09090B',
    card: '#101014',
    input: '#141418',

    white: '#FFFFFF',
    zinc200: '#E4E4E7',
    zinc300: '#D4D4D8',
    zinc500: '#71717A',
    zinc600: '#52525B',
    zinc700: '#3F3F46',

    violet: '#8B5CF6',
    violetLight: '#A78BFA',

    emerald: '#34D399',

    border: 'rgba(255,255,255,0.07)',
    softBorder: 'rgba(255,255,255,0.055)',
};

export default function JoinQuizScreen() {
    const {
        config,
        loading,
        error,
    } = useQuizConfig();

    const [pageLanguage, setPageLanguage] =
        useState<Language>('en');

    const [language, setLanguage] =
        useState<Language>('en');

    const [chapter, setChapter] =
        useState('');

    const [name, setName] =
        useState('');

    const [phone, setPhone] =
        useState('');

    const [place, setPlace] =
        useState('');

    const [starting, setStarting] =
        useState(false);

    const [
        showChapterPicker,
        setShowChapterPicker,
    ] = useState(false);

    /* ==========================================================
       CHAPTERS
    ========================================================== */

    const chapters = useMemo(() => {
        if (!config?.active_chapters) {
            return [];
        }

        return config.active_chapters.map(String);
    }, [config?.active_chapters]);

    /* ==========================================================
       PHONE
    ========================================================== */

    function handlePhoneChange(value: string) {
        const cleaned = value
            .replace(/[^0-9]/g, '')
            .slice(0, 10);

        setPhone(cleaned);
    }

    /* ==========================================================
       CONTINUE
    ========================================================== */

    async function handleContinue() {
        if (starting) {
            return;
        }

        const cleanName = name.trim();
        const cleanPhone = phone.trim();
        const cleanPlace = place.trim();

        /* ========================================================
           VALIDATION
        ======================================================== */

        if (
            !cleanName ||
            !cleanPhone ||
            !cleanPlace ||
            !language ||
            !chapter
        ) {
            Alert.alert(
                pageLanguage === 'en'
                    ? 'Missing details'
                    : 'விவரங்கள் தேவை',

                pageLanguage === 'en'
                    ? 'Please fill all fields.'
                    : 'எல்லா புலங்களையும் நிரப்பவும்.'
            );

            return;
        }

        if (!/^[0-9]{10}$/.test(cleanPhone)) {
            Alert.alert(
                pageLanguage === 'en'
                    ? 'Invalid phone number'
                    : 'தவறான தொலைபேசி எண்',

                pageLanguage === 'en'
                    ? 'Enter a valid 10-digit phone number.'
                    : 'செல்லுபடியாகும் 10 இலக்க தொலைபேசி எண்ணை உள்ளிடவும்.'
            );

            return;
        }

        try {
            setStarting(true);

            /* ======================================================
               CHECK EXISTING ATTEMPT
      
               We use an array + limit(1) instead of maybeSingle().
               This is safer if old data accidentally contains
               multiple results for the same phone + chapter.
            ====================================================== */

            const {
                data: existingAttempts,
                error: attemptError,
            } = await supabase
                .from('results')
                .select('*')
                .eq('phone', cleanPhone)
                .eq('chapter', chapter)
                .order('created_at', {
                    ascending: false,
                })
                .limit(1);

            if (attemptError) {
                throw attemptError;
            }

            const existingAttempt =
                existingAttempts?.[0] ?? null;

            /* ======================================================
               ALREADY ATTEMPTED
            ====================================================== */

            if (existingAttempt) {
                router.replace({
                    pathname: '/previous-result',

                    params: {
                        language,

                        name:
                            existingAttempt.name ??
                            cleanName,

                        phone:
                            existingAttempt.phone ??
                            cleanPhone,

                        place:
                            existingAttempt.place ??
                            cleanPlace,

                        chapter: String(
                            existingAttempt.chapter ??
                            chapter
                        ),

                        score: String(
                            existingAttempt.score ?? ''
                        ),

                        /*
                         * If your results table contains
                         * total, it will be passed.
                         *
                         * If total is missing, previous-result
                         * safely hides the percentage section.
                         */
                        total:
                            existingAttempt.total != null
                                ? String(
                                    existingAttempt.total
                                )
                                : '',

                        attemptedAt:
                            existingAttempt.created_at ??
                            '',
                    },
                });

                return;
            }

            /* ======================================================
               NEW PARTICIPANT
            ====================================================== */

            router.push({
                pathname: '/instructions',

                params: {
                    name: cleanName,
                    phone: cleanPhone,
                    place: cleanPlace,
                    language,
                    chapter,

                    duration: String(
                        config?.duration ?? 20
                    ),
                },
            });
        } catch (err) {
            console.error(
                'ATTEMPT CHECK ERROR:',
                err
            );

            Alert.alert(
                pageLanguage === 'en'
                    ? 'Something went wrong'
                    : 'பிழை ஏற்பட்டது',

                pageLanguage === 'en'
                    ? 'Unable to check your previous attempt. Please try again.'
                    : 'உங்கள் முந்தைய முயற்சியை சரிபார்க்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.'
            );
        } finally {
            setStarting(false);
        }
    }

    /* ==========================================================
       LOADING
    ========================================================== */

    if (loading) {
        return (
            <SafeAreaView style={styles.centerScreen}>
                <StatusBar
                    barStyle="light-content"
                />

                <ActivityIndicator
                    size="small"
                    color={COLORS.violet}
                />

                <Text style={styles.loadingText}>
                    Loading quiz setup...
                </Text>
            </SafeAreaView>
        );
    }

    /* ==========================================================
       ERROR
    ========================================================== */

    if (error || !config) {
        return (
            <SafeAreaView style={styles.centerScreen}>
                <StatusBar
                    barStyle="light-content"
                />

                <Text style={styles.errorTitle}>
                    {pageLanguage === 'en'
                        ? 'Unable to load quiz'
                        : 'வினாடி வினாவை ஏற்ற முடியவில்லை'}
                </Text>

                <Text style={styles.errorDescription}>
                    {error ??
                        (pageLanguage === 'en'
                            ? 'Quiz configuration is unavailable.'
                            : 'வினாடி வினா அமைப்பு கிடைக்கவில்லை.')}
                </Text>

                <Pressable
                    onPress={() => router.back()}
                    style={({ pressed }) => [
                        styles.errorBackButton,
                        pressed && styles.pressed,
                    ]}
                >
                    <Text style={styles.errorBackText}>
                        {pageLanguage === 'en'
                            ? 'GO BACK'
                            : 'திரும்பு'}
                    </Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar
                barStyle="light-content"
            />

            {/* ======================================================
          BACKGROUND GLOWS
      ====================================================== */}

            <View
                pointerEvents="none"
                style={StyleSheet.absoluteFill}
            >
                <View style={styles.topGlow} />
                <View style={styles.bottomGlow} />
            </View>

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={
                    Platform.OS === 'ios'
                        ? 'padding'
                        : undefined
                }
            >
                {/* ====================================================
            NAVBAR
        ==================================================== */}

                <View style={styles.navbar}>
                    <Pressable
                        onPress={() => router.back()}
                        disabled={starting}
                        hitSlop={10}
                        style={({ pressed }) => [
                            styles.backButton,
                            pressed &&
                            !starting &&
                            styles.pressed,
                        ]}
                    >
                        <Text style={styles.backArrow}>
                            ‹
                        </Text>
                    </Pressable>

                    <View style={styles.navTitleContainer}>
                        <Text style={styles.navTitle}>
                            QUIZTIANS
                        </Text>

                        <Text style={styles.navSubtitle}>
                            LEARN • PLAY • COMPETE
                        </Text>
                    </View>

                    {/* PAGE LANGUAGE */}

                    <View style={styles.languageToggle}>
                        <Pressable
                            disabled={starting}
                            onPress={() =>
                                setPageLanguage('en')
                            }
                            style={[
                                styles.languageToggleButton,

                                pageLanguage === 'en' &&
                                styles.languageToggleActive,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.languageToggleText,

                                    pageLanguage === 'en' &&
                                    styles.languageToggleTextActive,
                                ]}
                            >
                                EN
                            </Text>
                        </Pressable>

                        <Pressable
                            disabled={starting}
                            onPress={() =>
                                setPageLanguage('ta')
                            }
                            style={[
                                styles.languageToggleButton,

                                pageLanguage === 'ta' &&
                                styles.languageToggleActive,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.languageToggleText,

                                    pageLanguage === 'ta' &&
                                    styles.languageToggleTextActive,
                                ]}
                            >
                                தமிழ்
                            </Text>
                        </Pressable>
                    </View>
                </View>

                {/* ====================================================
            CONTENT
        ==================================================== */}

                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={
                        styles.scrollContent
                    }
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* ==================================================
              HEADER
          ================================================== */}

                    <View style={styles.header}>
                        <View style={styles.headerTop}>
                            <View style={styles.zapBox}>
                                <Text style={styles.zapIcon}>
                                    ⚡
                                </Text>
                            </View>

                            <View style={styles.headerTitleArea}>
                                <View style={styles.liveRow}>
                                    <StatusDot />

                                    <Text style={styles.liveText}>
                                        {pageLanguage === 'en'
                                            ? 'QUIZ IS LIVE'
                                            : 'வினாடி வினா நேரலை'}
                                    </Text>
                                </View>

                                <Text style={styles.title}>
                                    {pageLanguage === 'en'
                                        ? 'Join the challenge'
                                        : 'சவாலில் சேருங்கள்'}
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.description}>
                            {pageLanguage === 'en'
                                ? 'Choose your quiz language and chapter, then enter your details to continue.'
                                : 'உங்கள் வினாடி வினா மொழி மற்றும் அதிகாரத்தைத் தேர்ந்தெடுத்து, தொடர உங்கள் விவரங்களை உள்ளிடவும்.'}
                        </Text>
                    </View>

                    {/* ==================================================
              FORM CARD
          ================================================== */}

                    <View style={styles.formCard}>
                        {/* ================================================
                QUIZ LANGUAGE
            ================================================ */}

                        <FieldLabel
                            icon="文"
                            label={
                                pageLanguage === 'en'
                                    ? 'Quiz Language'
                                    : 'வினாடி வினா மொழி'
                            }
                        />

                        <View style={styles.optionRow}>
                            <SelectionCard
                                title="English"
                                code="EN"
                                selected={
                                    language === 'en'
                                }
                                disabled={starting}
                                onPress={() =>
                                    setLanguage('en')
                                }
                            />

                            <SelectionCard
                                title="தமிழ்"
                                code="TA"
                                selected={
                                    language === 'ta'
                                }
                                disabled={starting}
                                onPress={() =>
                                    setLanguage('ta')
                                }
                            />
                        </View>

                        {/* ================================================
                CHAPTER
            ================================================ */}

                        <View style={styles.fieldSpacing}>
                            <FieldLabel
                                icon="▤"
                                label={
                                    pageLanguage === 'en'
                                        ? 'Chapter'
                                        : 'அதிகாரம்'
                                }
                            />

                            <Pressable
                                disabled={
                                    starting ||
                                    chapters.length === 0
                                }
                                onPress={() =>
                                    setShowChapterPicker(
                                        (current) => !current
                                    )
                                }
                                style={[
                                    styles.selectBox,

                                    chapters.length === 0 &&
                                    styles.disabledInput,

                                    showChapterPicker &&
                                    styles.selectBoxActive,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.selectText,

                                        !chapter &&
                                        styles.placeholderText,
                                    ]}
                                >
                                    {chapter ||
                                        (pageLanguage === 'en'
                                            ? 'Select a chapter'
                                            : 'அதிகாரத்தைத் தேர்ந்தெடுக்கவும்')}
                                </Text>

                                <Text
                                    style={[
                                        styles.chevron,

                                        showChapterPicker &&
                                        styles.chevronOpen,
                                    ]}
                                >
                                    ⌄
                                </Text>
                            </Pressable>

                            {/* CHAPTER DROPDOWN */}

                            {showChapterPicker &&
                                chapters.length > 0 && (
                                    <View
                                        style={
                                            styles.chapterPicker
                                        }
                                    >
                                        {chapters.map(
                                            (item, index) => {
                                                const selected =
                                                    chapter === item;

                                                return (
                                                    <Pressable
                                                        key={item}
                                                        disabled={starting}
                                                        onPress={() => {
                                                            setChapter(item);

                                                            setShowChapterPicker(
                                                                false
                                                            );
                                                        }}
                                                        style={({ pressed }) => [
                                                            styles.chapterOption,

                                                            index !==
                                                            chapters.length -
                                                            1 &&
                                                            styles.chapterOptionBorder,

                                                            selected &&
                                                            styles.chapterOptionSelected,

                                                            pressed &&
                                                            styles.pressed,
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.chapterOptionText,

                                                                selected &&
                                                                styles.chapterOptionTextSelected,
                                                            ]}
                                                        >
                                                            {item}
                                                        </Text>

                                                        {selected && (
                                                            <Text
                                                                style={
                                                                    styles.chapterCheck
                                                                }
                                                            >
                                                                ✓
                                                            </Text>
                                                        )}
                                                    </Pressable>
                                                );
                                            }
                                        )}
                                    </View>
                                )}

                            {chapters.length === 0 && (
                                <Text style={styles.noChapterText}>
                                    {pageLanguage === 'en'
                                        ? 'No chapters are currently available.'
                                        : 'தற்போது அதிகாரங்கள் எதுவும் கிடைக்கவில்லை.'}
                                </Text>
                            )}
                        </View>

                        {/* ================================================
                DIVIDER
            ================================================ */}

                        <View style={styles.dividerRow}>
                            <View style={styles.divider} />

                            <Text style={styles.dividerText}>
                                {pageLanguage === 'en'
                                    ? 'YOUR DETAILS'
                                    : 'உங்கள் விவரங்கள்'}
                            </Text>

                            <View style={styles.divider} />
                        </View>

                        {/* ================================================
                NAME
            ================================================ */}

                        <FieldLabel
                            icon="●"
                            label={
                                pageLanguage === 'en'
                                    ? 'Your name'
                                    : 'உங்கள் பெயர்'
                            }
                        />

                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder={
                                pageLanguage === 'en'
                                    ? 'Enter your full name'
                                    : 'உங்கள் பெயரை உள்ளிடவும்'
                            }
                            placeholderTextColor={
                                COLORS.zinc700
                            }
                            autoCapitalize="words"
                            autoCorrect={false}
                            returnKeyType="next"
                            editable={!starting}
                            style={styles.input}
                        />

                        {/* ================================================
                PHONE
            ================================================ */}

                        <View style={styles.fieldSpacing}>
                            <FieldLabel
                                icon="☎"
                                label={
                                    pageLanguage === 'en'
                                        ? 'Phone number'
                                        : 'தொலைபேசி எண்'
                                }
                            />

                            <View style={styles.phoneInput}>
                                <View
                                    style={
                                        styles.countryCodeContainer
                                    }
                                >
                                    <Text
                                        style={styles.countryCode}
                                    >
                                        +91
                                    </Text>
                                </View>

                                <TextInput
                                    value={phone}
                                    onChangeText={
                                        handlePhoneChange
                                    }
                                    placeholder="98765 43210"
                                    placeholderTextColor={
                                        COLORS.zinc700
                                    }
                                    keyboardType="number-pad"
                                    maxLength={10}
                                    editable={!starting}
                                    style={
                                        styles.phoneTextInput
                                    }
                                />

                                {phone.length > 0 && (
                                    <Text
                                        style={[
                                            styles.phoneCounter,

                                            phone.length === 10 &&
                                            styles.phoneCounterComplete,
                                        ]}
                                    >
                                        {phone.length}/10
                                    </Text>
                                )}
                            </View>
                        </View>

                        {/* ================================================
                PLACE
            ================================================ */}

                        <View style={styles.fieldSpacing}>
                            <FieldLabel
                                icon="◆"
                                label={
                                    pageLanguage === 'en'
                                        ? 'Place'
                                        : 'இடம்'
                                }
                            />

                            <TextInput
                                value={place}
                                onChangeText={setPlace}
                                placeholder={
                                    pageLanguage === 'en'
                                        ? 'City or town'
                                        : 'உங்கள் ஊர்'
                                }
                                placeholderTextColor={
                                    COLORS.zinc700
                                }
                                autoCapitalize="words"
                                autoCorrect={false}
                                returnKeyType="done"
                                editable={!starting}
                                style={styles.input}
                            />
                        </View>

                        {/* ================================================
                SELECTED LANGUAGE
            ================================================ */}

                        <View
                            style={
                                styles.selectedLanguageCard
                            }
                        >
                            <View
                                style={
                                    styles.selectedLanguageLeft
                                }
                            >
                                <View
                                    style={
                                        styles.selectedLanguageIcon
                                    }
                                >
                                    <Text
                                        style={
                                            styles.selectedLanguageIconText
                                        }
                                    >
                                        文
                                    </Text>
                                </View>

                                <View style={styles.flex}>
                                    <Text
                                        style={
                                            styles.selectedLanguageLabel
                                        }
                                    >
                                        {pageLanguage === 'en'
                                            ? 'SELECTED QUIZ LANGUAGE'
                                            : 'தேர்ந்தெடுக்கப்பட்ட வினாடி வினா மொழி'}
                                    </Text>

                                    <Text
                                        style={
                                            styles.selectedLanguageValue
                                        }
                                    >
                                        {language === 'en'
                                            ? 'English'
                                            : 'தமிழ்'}
                                    </Text>
                                </View>
                            </View>

                            <View
                                style={
                                    styles.selectedLanguageBadge
                                }
                            >
                                <Text
                                    style={
                                        styles.selectedLanguageBadgeText
                                    }
                                >
                                    {language === 'en'
                                        ? 'EN'
                                        : 'தமிழ்'}
                                </Text>
                            </View>
                        </View>

                        {/* ================================================
                PRIVACY
            ================================================ */}

                        <View style={styles.privacyCard}>
                            <View style={styles.shieldBox}>
                                <Text style={styles.shieldIcon}>
                                    ✓
                                </Text>
                            </View>

                            <Text style={styles.privacyText}>
                                {pageLanguage === 'en'
                                    ? 'Your details are used only to identify your quiz attempt and score.'
                                    : 'உங்கள் வினாடி வினா முயற்சி மற்றும் மதிப்பெண்ணை அடையாளம் காண உங்கள் விவரங்கள் பயன்படுத்தப்படும்.'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.bottomSpace} />
                </ScrollView>

                {/* ====================================================
            STICKY CONTINUE
        ==================================================== */}

                <View style={styles.footer}>
                    <Pressable
                        disabled={
                            starting ||
                            chapters.length === 0
                        }
                        onPress={handleContinue}
                        style={({ pressed }) => [
                            styles.continueButton,

                            (starting ||
                                chapters.length === 0) &&
                            styles.continueButtonDisabled,

                            pressed &&
                            !starting &&
                            styles.pressed,
                        ]}
                    >
                        {starting ? (
                            <>
                                <ActivityIndicator
                                    size="small"
                                    color={COLORS.white}
                                />

                                <Text
                                    style={
                                        styles.continueButtonText
                                    }
                                >
                                    {pageLanguage === 'en'
                                        ? 'Checking attempt...'
                                        : 'முயற்சியை சரிபார்க்கிறது...'}
                                </Text>
                            </>
                        ) : (
                            <>
                                <Text style={styles.continueZap}>
                                    ⚡
                                </Text>

                                <Text
                                    style={
                                        styles.continueButtonText
                                    }
                                >
                                    {pageLanguage === 'en'
                                        ? 'Continue to Quiz'
                                        : 'வினாடி வினாவிற்கு தொடரவும்'}
                                </Text>

                                <Text
                                    style={styles.continueArrow}
                                >
                                    →
                                </Text>
                            </>
                        )}
                    </Pressable>

                    <Text style={styles.footerNote}>
                        {pageLanguage === 'en'
                            ? "We'll check whether this chapter was already attempted."
                            : 'இந்த அதிகாரம் ஏற்கனவே முயற்சிக்கப்பட்டதா என்பதை சரிபார்ப்போம்.'}
                    </Text>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

/* ==========================================================
   FIELD LABEL
========================================================== */

function FieldLabel({
    icon,
    label,
}: {
    icon: string;
    label: string;
}) {
    return (
        <View style={styles.fieldLabelRow}>
            <Text style={styles.fieldIcon}>
                {icon}
            </Text>

            <Text style={styles.fieldLabel}>
                {label}
            </Text>
        </View>
    );
}

/* ==========================================================
   LANGUAGE SELECTION
========================================================== */

type SelectionCardProps = {
    title: string;
    code: string;
    selected: boolean;
    disabled?: boolean;
    onPress: () => void;
};

function SelectionCard({
    title,
    code,
    selected,
    disabled = false,
    onPress,
}: SelectionCardProps) {
    return (
        <Pressable
            disabled={disabled}
            onPress={onPress}
            style={({ pressed }) => [
                styles.selectionCard,

                selected &&
                styles.selectionCardSelected,

                pressed &&
                !disabled &&
                styles.pressed,
            ]}
        >
            <View>
                <Text
                    style={[
                        styles.selectionTitle,

                        selected &&
                        styles.selectionTitleSelected,
                    ]}
                >
                    {title}
                </Text>

                <Text style={styles.selectionCode}>
                    {code}
                </Text>
            </View>

            <View
                style={[
                    styles.radio,

                    selected &&
                    styles.radioSelected,
                ]}
            >
                {selected && (
                    <View style={styles.radioInner} />
                )}
            </View>
        </Pressable>
    );
}

/* ==========================================================
   STATUS DOT
========================================================== */

function StatusDot() {
    return (
        <View style={styles.statusDotGlow}>
            <View style={styles.statusDot} />
        </View>
    );
}

/* ==========================================================
   STYLES
========================================================== */

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },

    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    scroll: {
        flex: 1,
    },

    scrollContent: {
        paddingBottom: 20,
    },

    pressed: {
        opacity: 0.78,
        transform: [{ scale: 0.99 }],
    },

    /* BACKGROUND */

    topGlow: {
        position: 'absolute',

        width: 380,
        height: 380,

        borderRadius: 190,

        top: -180,
        right: -170,

        backgroundColor:
            'rgba(124,58,237,0.055)',
    },

    bottomGlow: {
        position: 'absolute',

        width: 320,
        height: 320,

        borderRadius: 160,

        left: -220,
        bottom: 80,

        backgroundColor:
            'rgba(79,70,229,0.03)',
    },

    /* NAVBAR */

    navbar: {
        minHeight: 64,

        paddingHorizontal: 14,

        flexDirection: 'row',
        alignItems: 'center',

        borderBottomWidth: 1,
        borderBottomColor:
            COLORS.softBorder,

        backgroundColor:
            'rgba(9,9,11,0.98)',

        zIndex: 20,
    },

    backButton: {
        width: 38,
        height: 38,

        borderRadius: 12,

        alignItems: 'center',
        justifyContent: 'center',

        borderWidth: 1,
        borderColor: COLORS.border,

        backgroundColor:
            'rgba(255,255,255,0.025)',
    },

    backArrow: {
        color: COLORS.zinc300,

        fontSize: 31,
        lineHeight: 32,

        marginTop: -3,
    },

    navTitleContainer: {
        flex: 1,

        marginLeft: 11,
    },

    navTitle: {
        color: COLORS.zinc200,

        fontSize: 11,
        fontWeight: '900',

        letterSpacing: 1.3,
    },

    navSubtitle: {
        color: COLORS.zinc700,

        fontSize: 6,
        fontWeight: '800',

        letterSpacing: 1.2,

        marginTop: 2,
    },

    languageToggle: {
        flexDirection: 'row',

        padding: 3,

        borderRadius: 10,

        borderWidth: 1,
        borderColor: COLORS.border,

        backgroundColor:
            'rgba(255,255,255,0.025)',
    },

    languageToggleButton: {
        minWidth: 35,
        minHeight: 28,

        paddingHorizontal: 6,

        alignItems: 'center',
        justifyContent: 'center',

        borderRadius: 7,
    },

    languageToggleActive: {
        backgroundColor: COLORS.violet,
    },

    languageToggleText: {
        color: COLORS.zinc600,

        fontSize: 8,
        fontWeight: '900',
    },

    languageToggleTextActive: {
        color: COLORS.white,
    },

    /* HEADER */

    header: {
        paddingHorizontal: 20,
        paddingTop: 28,
        paddingBottom: 23,

        borderBottomWidth: 1,
        borderBottomColor:
            COLORS.softBorder,
    },

    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    zapBox: {
        width: 44,
        height: 44,

        borderRadius: 14,

        alignItems: 'center',
        justifyContent: 'center',

        borderWidth: 1,
        borderColor:
            'rgba(139,92,246,0.15)',

        backgroundColor:
            'rgba(139,92,246,0.07)',
    },

    zapIcon: {
        fontSize: 17,
    },

    headerTitleArea: {
        flex: 1,

        marginLeft: 13,
    },

    liveRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    statusDotGlow: {
        width: 10,
        height: 10,

        borderRadius: 5,

        backgroundColor:
            'rgba(52,211,153,0.12)',

        alignItems: 'center',
        justifyContent: 'center',
    },

    statusDot: {
        width: 5,
        height: 5,

        borderRadius: 3,

        backgroundColor: COLORS.emerald,
    },

    liveText: {
        color: COLORS.emerald,

        fontSize: 8.5,
        fontWeight: '900',

        letterSpacing: 1.3,

        marginLeft: 7,
    },

    title: {
        color: COLORS.white,

        fontSize: 24,
        fontWeight: '900',

        letterSpacing: -0.8,

        marginTop: 5,
    },

    description: {
        maxWidth: 500,

        color: COLORS.zinc600,

        fontSize: 11,
        lineHeight: 19,

        marginTop: 13,
    },

    /* FORM */

    formCard: {
        margin: 16,

        padding: 18,

        borderRadius: 24,

        borderWidth: 1,
        borderColor: COLORS.border,

        backgroundColor: COLORS.card,
    },

    fieldLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',

        marginBottom: 9,
    },

    fieldIcon: {
        width: 18,

        color: COLORS.zinc600,

        fontSize: 11,
        fontWeight: '800',
    },

    fieldLabel: {
        color: COLORS.zinc500,

        fontSize: 11,
        fontWeight: '700',
    },

    fieldSpacing: {
        marginTop: 18,
    },

    input: {
        minHeight: 54,

        borderRadius: 16,

        borderWidth: 1,
        borderColor: COLORS.border,

        backgroundColor: COLORS.input,

        paddingHorizontal: 15,

        color: COLORS.zinc200,

        fontSize: 14,
        fontWeight: '700',
    },

    disabledInput: {
        opacity: 0.45,
    },

    /* LANGUAGE */

    optionRow: {
        flexDirection: 'row',

        gap: 10,
    },

    selectionCard: {
        flex: 1,

        minHeight: 67,

        paddingHorizontal: 14,

        borderRadius: 16,

        borderWidth: 1,
        borderColor: COLORS.border,

        backgroundColor: COLORS.input,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    selectionCardSelected: {
        borderColor:
            'rgba(139,92,246,0.55)',

        backgroundColor:
            'rgba(139,92,246,0.08)',
    },

    selectionTitle: {
        color: COLORS.zinc500,

        fontSize: 13,
        fontWeight: '800',
    },

    selectionTitleSelected: {
        color: COLORS.zinc200,
    },

    selectionCode: {
        color: COLORS.zinc700,

        fontSize: 8,
        fontWeight: '800',

        marginTop: 4,
    },

    radio: {
        width: 18,
        height: 18,

        borderRadius: 9,

        borderWidth: 2,
        borderColor: COLORS.zinc600,

        alignItems: 'center',
        justifyContent: 'center',
    },

    radioSelected: {
        borderColor: COLORS.violet,
    },

    radioInner: {
        width: 8,
        height: 8,

        borderRadius: 4,

        backgroundColor: COLORS.violet,
    },

    /* CHAPTER */

    selectBox: {
        minHeight: 54,

        borderRadius: 16,

        borderWidth: 1,
        borderColor: COLORS.border,

        backgroundColor: COLORS.input,

        paddingHorizontal: 15,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    selectBoxActive: {
        borderColor:
            'rgba(139,92,246,0.5)',
    },

    selectText: {
        flex: 1,

        color: COLORS.zinc200,

        fontSize: 14,
        fontWeight: '700',
    },

    placeholderText: {
        color: COLORS.zinc700,

        fontWeight: '600',
    },

    chevron: {
        color: COLORS.zinc600,

        fontSize: 17,

        marginLeft: 10,
    },

    chevronOpen: {
        transform: [
            {
                rotate: '180deg',
            },
        ],
    },

    chapterPicker: {
        marginTop: 7,

        overflow: 'hidden',

        borderRadius: 16,

        borderWidth: 1,
        borderColor: COLORS.border,

        backgroundColor: '#121216',
    },

    chapterOption: {
        minHeight: 49,

        paddingHorizontal: 15,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    chapterOptionBorder: {
        borderBottomWidth: 1,
        borderBottomColor:
            'rgba(255,255,255,0.045)',
    },

    chapterOptionSelected: {
        backgroundColor:
            'rgba(139,92,246,0.08)',
    },

    chapterOptionText: {
        color: COLORS.zinc500,

        fontSize: 13,
        fontWeight: '700',
    },

    chapterOptionTextSelected: {
        color: COLORS.zinc200,
    },

    chapterCheck: {
        color: COLORS.violetLight,

        fontSize: 13,
        fontWeight: '900',
    },

    noChapterText: {
        color:
            'rgba(251,191,36,0.7)',

        fontSize: 10,
        lineHeight: 16,

        marginTop: 8,
    },

    /* DIVIDER */

    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',

        gap: 10,

        marginVertical: 22,
    },

    divider: {
        flex: 1,

        height: 1,

        backgroundColor:
            'rgba(255,255,255,0.05)',
    },

    dividerText: {
        color: COLORS.zinc700,

        fontSize: 8,
        fontWeight: '900',

        letterSpacing: 1.2,
    },

    /* PHONE */

    phoneInput: {
        minHeight: 54,

        borderRadius: 16,

        borderWidth: 1,
        borderColor: COLORS.border,

        backgroundColor: COLORS.input,

        flexDirection: 'row',
        alignItems: 'center',

        overflow: 'hidden',
    },

    countryCodeContainer: {
        minHeight: 30,

        paddingHorizontal: 14,

        borderRightWidth: 1,
        borderRightColor: COLORS.border,

        alignItems: 'center',
        justifyContent: 'center',
    },

    countryCode: {
        color: COLORS.zinc500,

        fontSize: 13,
        fontWeight: '700',
    },

    phoneTextInput: {
        flex: 1,

        minHeight: 52,

        paddingHorizontal: 13,

        color: COLORS.zinc200,

        fontSize: 14,
        fontWeight: '700',
    },

    phoneCounter: {
        color: COLORS.zinc700,

        fontSize: 8,
        fontWeight: '800',

        marginRight: 12,
    },

    phoneCounterComplete: {
        color: COLORS.emerald,
    },

    /* SELECTED LANGUAGE */

    selectedLanguageCard: {
        marginTop: 22,

        minHeight: 68,

        paddingHorizontal: 13,
        paddingVertical: 11,

        borderRadius: 16,

        borderWidth: 1,
        borderColor:
            'rgba(139,92,246,0.08)',

        backgroundColor:
            'rgba(139,92,246,0.025)',

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    selectedLanguageLeft: {
        flex: 1,

        flexDirection: 'row',
        alignItems: 'center',
    },

    selectedLanguageIcon: {
        width: 34,
        height: 34,

        borderRadius: 10,

        marginRight: 11,

        alignItems: 'center',
        justifyContent: 'center',

        borderWidth: 1,
        borderColor:
            'rgba(139,92,246,0.1)',

        backgroundColor:
            'rgba(139,92,246,0.05)',
    },

    selectedLanguageIconText: {
        color: COLORS.violetLight,

        fontSize: 12,
        fontWeight: '900',
    },

    selectedLanguageLabel: {
        color: COLORS.zinc700,

        fontSize: 7,
        fontWeight: '900',

        letterSpacing: 0.8,
    },

    selectedLanguageValue: {
        color: COLORS.zinc300,

        fontSize: 11,
        fontWeight: '700',

        marginTop: 4,
    },

    selectedLanguageBadge: {
        marginLeft: 10,

        paddingHorizontal: 9,
        paddingVertical: 6,

        borderRadius: 8,

        borderWidth: 1,
        borderColor:
            'rgba(139,92,246,0.1)',

        backgroundColor:
            'rgba(139,92,246,0.06)',
    },

    selectedLanguageBadgeText: {
        color: COLORS.violetLight,

        fontSize: 9,
        fontWeight: '900',
    },

    /* PRIVACY */

    privacyCard: {
        marginTop: 12,

        padding: 13,

        borderRadius: 16,

        borderWidth: 1,
        borderColor:
            'rgba(255,255,255,0.045)',

        backgroundColor:
            'rgba(255,255,255,0.018)',

        flexDirection: 'row',
        alignItems: 'flex-start',
    },

    shieldBox: {
        width: 29,
        height: 29,

        borderRadius: 9,

        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor:
            'rgba(16,185,129,0.05)',
    },

    shieldIcon: {
        color:
            'rgba(52,211,153,0.7)',

        fontSize: 12,
        fontWeight: '900',
    },

    privacyText: {
        flex: 1,

        color: COLORS.zinc600,

        fontSize: 10,
        lineHeight: 16,

        marginLeft: 10,
        paddingTop: 1,
    },

    bottomSpace: {
        height: 12,
    },

    /* FOOTER */

    footer: {
        paddingHorizontal: 16,
        paddingTop: 13,
        paddingBottom:
            Platform.OS === 'ios'
                ? 8
                : 14,

        borderTopWidth: 1,
        borderTopColor:
            COLORS.softBorder,

        backgroundColor: COLORS.card,
    },

    continueButton: {
        minHeight: 56,

        borderRadius: 17,

        paddingHorizontal: 18,

        backgroundColor: COLORS.violet,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    continueButtonDisabled: {
        backgroundColor: '#18181D',
    },

    continueZap: {
        fontSize: 14,

        marginRight: 9,
    },

    continueButtonText: {
        color: COLORS.white,

        fontSize: 13,
        fontWeight: '900',

        marginHorizontal: 8,

        textAlign: 'center',
    },

    continueArrow: {
        color: COLORS.white,

        fontSize: 17,
    },

    footerNote: {
        color: COLORS.zinc700,

        fontSize: 8.5,
        lineHeight: 14,

        textAlign: 'center',

        marginTop: 8,
    },

    /* STATES */

    centerScreen: {
        flex: 1,

        backgroundColor: COLORS.background,

        alignItems: 'center',
        justifyContent: 'center',

        paddingHorizontal: 30,
    },

    loadingText: {
        color: COLORS.zinc600,

        fontSize: 11,

        marginTop: 12,
    },

    errorTitle: {
        color: COLORS.white,

        fontSize: 20,
        fontWeight: '900',

        textAlign: 'center',
    },

    errorDescription: {
        color: COLORS.zinc600,

        fontSize: 11,
        lineHeight: 18,

        textAlign: 'center',

        marginTop: 8,
    },

    errorBackButton: {
        minHeight: 46,

        paddingHorizontal: 22,

        borderRadius: 14,

        backgroundColor: COLORS.violet,

        alignItems: 'center',
        justifyContent: 'center',

        marginTop: 22,
    },

    errorBackText: {
        color: COLORS.white,

        fontSize: 10,
        fontWeight: '900',

        letterSpacing: 1,
    },
});