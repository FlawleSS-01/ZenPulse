import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSubscription } from '../context/SubscriptionContext';
import { MEDITATIONS } from '../data/meditations';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 24 * 2 - 14) / 2;

function GoldOrbBackground() {
  const float1 = useRef(new Animated.Value(0)).current;
  const float2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(float1, { toValue: 1, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(float1, { toValue: 0, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(float2, { toValue: 1, duration: 5000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(float2, { toValue: 0, duration: 5000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  const ty1 = float1.interpolate({ inputRange: [0, 1], outputRange: [0, -20] });
  const ty2 = float2.interpolate({ inputRange: [0, 1], outputRange: [0, 15] });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View style={[styles.orb, styles.orb1, { transform: [{ translateY: ty1 }] }]} />
      <Animated.View style={[styles.orb, styles.orb2, { transform: [{ translateY: ty2 }] }]} />
    </View>
  );
}

function MeditationCard({ item, index, isSubscribed, onLockedPress }) {
  const isLocked = !item.free && !isSubscribed;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay: index * 100,
      friction: 6,
      tension: 80,
      useNativeDriver: true,
    }).start();

    if (!isLocked) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 2000 + index * 300, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0, duration: 2000 + index * 300, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
      ).start();
    }
  }, []);

  const borderOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.06, 0.2],
  });

  return (
    <Animated.View style={[styles.cardWrapper, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={styles.card}
        activeOpacity={isLocked ? 0.7 : 0.85}
        onPress={isLocked ? onLockedPress : undefined}
      >
        <Animated.View
          style={[
            styles.cardBorderGlow,
            !isLocked && { borderColor: item.color, opacity: borderOpacity },
          ]}
        />
        <LinearGradient
          colors={
            isLocked
              ? ['rgba(255,255,255,0.03)', 'rgba(255,255,255,0.01)']
              : [`${item.color}20`, `${item.color}05`, 'rgba(15,10,46,0.8)']
          }
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardTop}>
            <View style={[styles.emojiContainer, isLocked && styles.emojiContainerLocked]}>
              <Text style={[styles.cardEmoji, isLocked && styles.lockedEmoji]}>
                {item.emoji}
              </Text>
            </View>
            {isLocked && (
              <LinearGradient
                colors={['rgba(218,165,32,0.3)', 'rgba(184,134,11,0.15)']}
                style={styles.lockBadge}
              >
                <Ionicons name="lock-closed" size={11} color="#FFD700" />
              </LinearGradient>
            )}
          </View>

          <Text
            style={[styles.cardTitle, isLocked && styles.lockedText]}
            numberOfLines={2}
          >
            {item.title}
          </Text>

          <Text
            style={[styles.cardDesc, isLocked && styles.lockedText]}
            numberOfLines={2}
          >
            {item.description}
          </Text>

          <View style={styles.cardFooter}>
            <View style={[styles.durationBadge, isLocked && styles.lockedBadge]}>
              <Ionicons
                name="time-outline"
                size={12}
                color={isLocked ? 'rgba(255,255,255,0.25)' : item.color}
              />
              <Text style={[styles.durationText, isLocked ? styles.lockedText : { color: item.color }]}>
                {item.duration}
              </Text>
            </View>
            <Text
              style={[styles.categoryText, isLocked && styles.lockedText]}
              numberOfLines={1}
            >
              {item.category}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function MeditationsScreen({ navigation }) {
  const { isSubscribed } = useSubscription();
  const insets = useSafeAreaInsets();
  const titleFade = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(titleFade, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(titleSlide, { toValue: 0, duration: 600, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLockedPress = () => {
    navigation.navigate('Paywall');
  };

  const renderHeader = () => (
    <Animated.View style={[styles.headerContainer, { opacity: titleFade, transform: [{ translateX: titleSlide }] }]}>
      <View>
        <Text style={styles.greeting}>Добрый день 🙏</Text>
        <View style={styles.headerTitleRow}>
          <Text style={styles.headerTitle}>Медитации</Text>
          <Text style={styles.headerStar}> ✦</Text>
        </View>
        <View style={styles.goldAccent}>
          <LinearGradient
            colors={['#FFD700', '#DAA520', 'transparent']}
            style={styles.goldAccentLine}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </View>
      </View>
      {!isSubscribed && (
        <TouchableOpacity style={styles.premiumBtn} onPress={handleLockedPress}>
          <LinearGradient
            colors={['#FFD700', '#DAA520', '#B8860B']}
            style={styles.premiumBtnGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="diamond" size={13} color="#1A1145" />
            <Text style={styles.premiumBtnText}>Premium</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </Animated.View>
  );

  const renderItem = ({ item, index }) => (
    <MeditationCard
      item={item}
      index={index}
      isSubscribed={isSubscribed}
      onLockedPress={handleLockedPress}
    />
  );

  return (
    <LinearGradient colors={['#0A0618', '#120D30', '#0F0A2E']} style={styles.container}>
      <GoldOrbBackground />
      <FlatList
        data={MEDITATIONS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 90 },
        ]}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  orb: {
    position: 'absolute',
    borderRadius: 999,
  },
  orb1: {
    width: 200,
    height: 200,
    top: -40,
    right: -60,
    backgroundColor: 'rgba(218,165,32,0.04)',
  },
  orb2: {
    width: 160,
    height: 160,
    bottom: 120,
    left: -50,
    backgroundColor: 'rgba(99,102,241,0.04)',
  },
  listContent: {
    paddingHorizontal: 24,
  },
  columnWrapper: {
    gap: 14,
    marginBottom: 14,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.45)',
    marginBottom: 4,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerStar: {
    fontSize: 18,
    color: '#FFD700',
  },
  goldAccent: {
    width: 50,
    height: 2,
    marginTop: 8,
  },
  goldAccentLine: {
    flex: 1,
    borderRadius: 1,
  },
  premiumBtn: {
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: { elevation: 6 },
    }),
  },
  premiumBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  premiumBtnText: {
    color: '#1A1145',
    fontSize: 13,
    fontWeight: '800',
  },
  cardWrapper: {
    flex: 1,
    maxWidth: CARD_WIDTH,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardBorderGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    zIndex: 1,
  },
  cardGradient: {
    padding: 16,
    minHeight: 190,
    justifyContent: 'space-between',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiContainerLocked: {
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  cardEmoji: {
    fontSize: 26,
  },
  lockedEmoji: {
    opacity: 0.25,
  },
  lockBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
    lineHeight: 20,
  },
  cardDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
    lineHeight: 16,
    marginBottom: 12,
  },
  lockedText: {
    color: 'rgba(255,255,255,0.2)',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flexShrink: 0,
  },
  lockedBadge: {
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  durationText: {
    fontSize: 11,
    fontWeight: '600',
  },
  categoryText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.35)',
    fontWeight: '500',
    flexShrink: 1,
  },
});
