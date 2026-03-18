import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSubscription } from '../context/SubscriptionContext';
import { MOOD_AFFIRMATIONS } from '../data/meditations';

const MOODS = [
  { key: 'happy', emoji: '😊', label: 'Радостно', color: '#FBBF24', gradient: ['#FBBF24', '#F59E0B'] },
  { key: 'neutral', emoji: '😌', label: 'Спокойно', color: '#818CF8', gradient: ['#818CF8', '#6366F1'] },
  { key: 'sad', emoji: '😔', label: 'Грустно', color: '#A78BFA', gradient: ['#A78BFA', '#7C3AED'] },
];

export default function AIMoodScreen({ navigation }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [affirmation, setAffirmation] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { isSubscribed } = useSubscription();
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const generateAffirmation = (moodKey) => {
    setSelectedMood(moodKey);
    setIsGenerating(true);
    setAffirmation(null);
    fadeAnim.setValue(0);

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
    ).start();

    setTimeout(() => {
      const texts = MOOD_AFFIRMATIONS[moodKey];
      const randomText = texts[Math.floor(Math.random() * texts.length)];
      setAffirmation(randomText);
      setIsGenerating(false);
      pulseAnim.setValue(1);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, 1500);
  };

  const getMoodData = () => MOODS.find((m) => m.key === selectedMood);

  return (
    <LinearGradient colors={['#0F0A2E', '#1A1145', '#0F0A2E']} style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.aiBadge}>
            <LinearGradient
              colors={['#A78BFA', '#6366F1']}
              style={styles.aiBadgeGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="sparkles" size={12} color="#FFF" />
              <Text style={styles.aiBadgeText}>AI Настрой</Text>
            </LinearGradient>
          </View>
          <Text style={styles.title}>Настрой дня</Text>
          <Text style={styles.subtitle}>
            Выберите своё настроение, и AI создаст{'\n'}персональную аффирмацию для вас
          </Text>
        </View>

        <View style={styles.moodSelector}>
          {MOODS.map((mood) => {
            const isSelected = selectedMood === mood.key;
            return (
              <TouchableOpacity
                key={mood.key}
                style={[styles.moodBtn, isSelected && styles.moodBtnSelected]}
                onPress={() => generateAffirmation(mood.key)}
                activeOpacity={0.7}
              >
                {isSelected && (
                  <LinearGradient
                    colors={mood.gradient}
                    style={styles.moodBtnGradientBorder}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  />
                )}
                <Animated.Text
                  style={[
                    styles.moodEmoji,
                    isSelected && isGenerating && { transform: [{ scale: pulseAnim }] },
                  ]}
                >
                  {mood.emoji}
                </Animated.Text>
                <Text style={[styles.moodLabel, isSelected && { color: mood.color }]}>
                  {mood.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {isGenerating && (
          <View style={styles.generatingContainer}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <LinearGradient
                colors={['rgba(167,139,250,0.2)', 'rgba(99,102,241,0.1)']}
                style={styles.generatingBubble}
              >
                <Ionicons name="sparkles" size={24} color="#A78BFA" />
              </LinearGradient>
            </Animated.View>
            <Text style={styles.generatingText}>AI генерирует ваш настрой...</Text>
          </View>
        )}

        {affirmation && !isGenerating && (
          <Animated.View style={[styles.affirmationContainer, { opacity: fadeAnim }]}>
            <LinearGradient
              colors={[
                `${getMoodData()?.color}15`,
                'rgba(255,255,255,0.03)',
              ]}
              style={styles.affirmationCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.affirmationHeader}>
                <LinearGradient
                  colors={getMoodData()?.gradient || ['#A78BFA', '#6366F1']}
                  style={styles.affirmationIcon}
                >
                  <Ionicons name="sparkles" size={16} color="#FFF" />
                </LinearGradient>
                <Text style={styles.affirmationLabel}>Ваш настрой на сегодня</Text>
              </View>
              <View style={styles.quoteLine}>
                <View
                  style={[styles.quoteAccent, { backgroundColor: getMoodData()?.color }]}
                />
                <Text style={styles.affirmationText}>{affirmation}</Text>
              </View>
              <TouchableOpacity
                style={styles.refreshBtn}
                onPress={() => generateAffirmation(selectedMood)}
              >
                <Ionicons name="refresh-outline" size={16} color="rgba(255,255,255,0.5)" />
                <Text style={styles.refreshText}>Сгенерировать другой</Text>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        )}

        {!selectedMood && !isGenerating && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <LinearGradient
                colors={['rgba(167,139,250,0.15)', 'rgba(99,102,241,0.05)']}
                style={styles.emptyIcon}
              >
                <Text style={styles.emptyEmoji}>✨</Text>
              </LinearGradient>
            </View>
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
  container: {
    flex: 1,
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
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
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
    width: 96,
    height: 110,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  moodBtnSelected: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(167,139,250,0.4)',
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
    color: 'rgba(255,255,255,0.5)',
  },
  generatingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  generatingBubble: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  generatingText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    fontWeight: '500',
  },
  affirmationContainer: {
    width: '100%',
  },
  affirmationCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  affirmationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  affirmationIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  affirmationLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontWeight: '600',
  },
  quoteLine: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  quoteAccent: {
    width: 3,
    borderRadius: 2,
    marginRight: 16,
  },
  affirmationText: {
    fontSize: 17,
    color: '#FFFFFF',
    lineHeight: 28,
    flex: 1,
    fontWeight: '500',
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  refreshText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIconContainer: {
    marginBottom: 20,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    lineHeight: 20,
  },
});
