import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  ScrollView,
  Dimensions,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSubscription } from '../context/SubscriptionContext';
import { MOOD_AFFIRMATIONS } from '../data/meditations';

const { width } = Dimensions.get('window');

const MOODS = [
  { key: 'happy', emoji: '😊', label: 'Радостно', color: '#FBBF24', gradient: ['#FBBF24', '#F59E0B'] },
  { key: 'neutral', emoji: '😌', label: 'Спокойно', color: '#818CF8', gradient: ['#818CF8', '#6366F1'] },
  { key: 'sad', emoji: '😔', label: 'Грустно', color: '#A78BFA', gradient: ['#A78BFA', '#7C3AED'] },
];

function FloatingDot({ delay, x, color }) {
  const anim = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0.6, duration: 600, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 1, duration: 2000, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        ]),
        Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  const ty = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -60] });
  const scale = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.5, 1.2, 0.3] });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x,
        bottom: 0,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: color || '#FFD700',
        opacity,
        transform: [{ translateY: ty }, { scale }],
      }}
    />
  );
}

function AnimatedMoodBtn({ mood, isSelected, isGenerating, onPress, pulseAnim, index }) {
  const entryAnim = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(entryAnim, {
      toValue: 1,
      delay: 200 + index * 150,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(pressScale, { toValue: 0.9, friction: 5, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(pressScale, { toValue: 1, friction: 5, useNativeDriver: true }).start();
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale: entryAnim }] }}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View style={[
          styles.moodBtn,
          isSelected && styles.moodBtnSelected,
          { transform: [{ scale: pressScale }] },
        ]}>
          {isSelected && (
            <>
              <LinearGradient
                colors={[`${mood.color}30`, 'transparent']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
              />
              <LinearGradient
                colors={mood.gradient}
                style={styles.moodBtnGradientBorder}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            </>
          )}
          <Animated.Text
            style={[
              styles.moodEmoji,
              isSelected && isGenerating && { transform: [{ scale: pulseAnim }] },
            ]}
          >
            {mood.emoji}
          </Animated.Text>
          <Text style={[styles.moodLabel, isSelected && { color: mood.color, fontWeight: '700' }]}>
            {mood.label}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function AIMoodScreen() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [affirmation, setAffirmation] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { isSubscribed } = useSubscription();
  const insets = useSafeAreaInsets();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const cardSlide = useRef(new Animated.Value(30)).current;
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(30)).current;
  const orbFloat = useRef(new Animated.Value(0)).current;

  const generatingDots = useRef(
    Array.from({ length: 6 }, (_, i) => ({
      x: width * 0.15 + (width * 0.7 / 5) * i,
      delay: i * 200,
    })),
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(headerSlide, { toValue: 0, duration: 700, easing: Easing.out(Easing.back(1.3)), useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(orbFloat, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(orbFloat, { toValue: 0, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  const orbTY = orbFloat.interpolate({ inputRange: [0, 1], outputRange: [0, -15] });

  const generateAffirmation = (moodKey) => {
    setSelectedMood(moodKey);
    setIsGenerating(true);
    setAffirmation(null);
    fadeAnim.setValue(0);
    cardSlide.setValue(30);

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
    ).start();

    setTimeout(() => {
      const texts = MOOD_AFFIRMATIONS[moodKey];
      const randomText = texts[Math.floor(Math.random() * texts.length)];
      setAffirmation(randomText);
      setIsGenerating(false);
      pulseAnim.setValue(1);

      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(cardSlide, { toValue: 0, duration: 500, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
      ]).start();
    }, 1800);
  };

  const getMoodData = () => MOODS.find((m) => m.key === selectedMood);

  return (
    <LinearGradient colors={['#0A0618', '#120D30', '#0F0A2E']} style={styles.container}>
      <Animated.View style={[styles.bgOrb1, { transform: [{ translateY: orbTY }] }]} pointerEvents="none" />
      <Animated.View style={[styles.bgOrb2, { transform: [{ translateY: Animated.multiply(orbTY, -1) }] }]} pointerEvents="none" />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.header, { opacity: headerFade, transform: [{ translateY: headerSlide }] }]}>
          <View style={styles.aiBadge}>
            <LinearGradient
              colors={['#FFD700', '#DAA520', '#B8860B']}
              style={styles.aiBadgeGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="sparkles" size={12} color="#1A1145" />
              <Text style={styles.aiBadgeText}>AI Настрой</Text>
            </LinearGradient>
          </View>
          <Text style={styles.title}>Настрой дня</Text>
          <View style={styles.goldDivider}>
            <LinearGradient
              colors={['transparent', '#DAA520', '#FFD700', '#DAA520', 'transparent']}
              style={styles.goldDividerLine}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
          <Text style={styles.subtitle}>
            Выберите своё настроение, и AI создаст{'\n'}персональную аффирмацию для вас
          </Text>
        </Animated.View>

        <View style={styles.moodSelector}>
          {MOODS.map((mood, index) => (
            <AnimatedMoodBtn
              key={mood.key}
              mood={mood}
              index={index}
              isSelected={selectedMood === mood.key}
              isGenerating={isGenerating}
              pulseAnim={pulseAnim}
              onPress={() => generateAffirmation(mood.key)}
            />
          ))}
        </View>

        {isGenerating && (
          <View style={styles.generatingContainer}>
            <View style={styles.generatingDotsRow}>
              {generatingDots.map((dot, i) => (
                <FloatingDot
                  key={i}
                  delay={dot.delay}
                  x={dot.x - width * 0.15}
                  color={getMoodData()?.color || '#FFD700'}
                />
              ))}
            </View>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <LinearGradient
                colors={[`${getMoodData()?.color || '#FFD700'}30`, `${getMoodData()?.color || '#FFD700'}08`]}
                style={styles.generatingBubble}
              >
                <Ionicons name="sparkles" size={28} color={getMoodData()?.color || '#FFD700'} />
              </LinearGradient>
            </Animated.View>
            <Text style={[styles.generatingText, { color: getMoodData()?.color || '#FFD700' }]}>
              AI генерирует ваш настрой...
            </Text>
          </View>
        )}

        {affirmation && !isGenerating && (
          <Animated.View style={[styles.affirmationContainer, { opacity: fadeAnim, transform: [{ translateY: cardSlide }] }]}>
            <LinearGradient
              colors={[
                `${getMoodData()?.color}12`,
                'rgba(218,165,32,0.04)',
                'rgba(255,255,255,0.02)',
              ]}
              style={styles.affirmationCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.affirmationGoldTop}>
                <LinearGradient
                  colors={['#FFD700', '#DAA520', '#B8860B', 'transparent']}
                  style={styles.affirmationGoldTopLine}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </View>
              <View style={styles.affirmationHeader}>
                <LinearGradient
                  colors={getMoodData()?.gradient || ['#A78BFA', '#6366F1']}
                  style={styles.affirmationIcon}
                >
                  <Ionicons name="sparkles" size={16} color="#FFF" />
                </LinearGradient>
                <View>
                  <Text style={styles.affirmationLabel}>Ваш настрой на сегодня</Text>
                  <Text style={styles.affirmationSublabel}>Персональная аффирмация</Text>
                </View>
              </View>

              <View style={styles.quoteLine}>
                <View style={styles.quoteAccentContainer}>
                  <LinearGradient
                    colors={['#FFD700', getMoodData()?.color || '#DAA520']}
                    style={styles.quoteAccent}
                  />
                </View>
                <Text style={styles.affirmationText}>{affirmation}</Text>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.refreshBtn}
                  onPress={() => generateAffirmation(selectedMood)}
                >
                  <Ionicons name="refresh-outline" size={16} color="#DAA520" />
                  <Text style={styles.refreshText}>Другой настрой</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>
        )}

        {!selectedMood && !isGenerating && (
          <View style={styles.emptyState}>
            <Animated.View style={[styles.emptyIconContainer, { transform: [{ translateY: orbTY }] }]}>
              <LinearGradient
                colors={['rgba(218,165,32,0.12)', 'rgba(218,165,32,0.03)']}
                style={styles.emptyIcon}
              >
                <LinearGradient
                  colors={['rgba(218,165,32,0.2)', 'rgba(218,165,32,0.05)']}
                  style={styles.emptyIconInner}
                >
                  <Text style={styles.emptyEmoji}>✨</Text>
                </LinearGradient>
              </LinearGradient>
            </Animated.View>
            <Text style={styles.emptyTitle}>Как вы себя чувствуете?</Text>
            <Text style={styles.emptyText}>
              Нажмите на смайлик выше,{'\n'}чтобы получить персональный настрой
            </Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bgOrb1: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(218,165,32,0.03)',
    top: -50,
    left: -80,
  },
  bgOrb2: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(99,102,241,0.03)',
    bottom: 100,
    right: -60,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  aiBadge: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },
  aiBadgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  aiBadgeText: {
    color: '#1A1145',
    fontSize: 12,
    fontWeight: '800',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  goldDivider: {
    width: '40%',
    height: 2,
    marginBottom: 12,
  },
  goldDividerLine: {
    flex: 1,
    borderRadius: 1,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    lineHeight: 20,
  },
  moodSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 36,
  },
  moodBtn: {
    width: 100,
    height: 115,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  moodBtnSelected: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: 'rgba(218,165,32,0.25)',
  },
  moodBtnGradientBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  moodEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.45)',
  },
  generatingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  generatingDotsRow: {
    width: width * 0.7,
    height: 70,
    marginBottom: -20,
  },
  generatingBubble: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  generatingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  affirmationContainer: {
    width: '100%',
  },
  affirmationCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(218,165,32,0.1)',
    overflow: 'hidden',
  },
  affirmationGoldTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  affirmationGoldTopLine: {
    flex: 1,
  },
  affirmationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  affirmationIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  affirmationLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '700',
  },
  affirmationSublabel: {
    color: '#DAA520',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  quoteLine: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  quoteAccentContainer: {
    marginRight: 16,
  },
  quoteAccent: {
    width: 3,
    flex: 1,
    borderRadius: 2,
  },
  affirmationText: {
    fontSize: 17,
    color: '#FFFFFF',
    lineHeight: 28,
    flex: 1,
    fontWeight: '500',
  },
  cardActions: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(218,165,32,0.08)',
    paddingTop: 14,
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  refreshText: {
    color: '#DAA520',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIconContainer: {
    marginBottom: 20,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyEmoji: {
    fontSize: 36,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.35)',
    textAlign: 'center',
    lineHeight: 20,
  },
});
