import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Platform,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSubscription } from '../context/SubscriptionContext';

const { width } = Dimensions.get('window');

const FEATURES = [
  { icon: 'infinite-outline', text: 'Безлимитный доступ ко всем медитациям' },
  { icon: 'sparkles-outline', text: 'AI-настрой дня: персональные аффирмации' },
  { icon: 'moon-outline', text: 'Специальные сессии для сна' },
  { icon: 'analytics-outline', text: 'Статистика и прогресс' },
  { icon: 'notifications-outline', text: 'Умные напоминания' },
];

const NUM_PARTICLES = 12;

function FloatingParticle({ delay, startX, startY, size }) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const duration = 3000 + Math.random() * 2000;
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: -120, duration, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        ]),
        Animated.timing(opacity, { toValue: 0, duration: 600, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.Text
      style={{
        position: 'absolute',
        left: startX,
        top: startY,
        fontSize: size,
        opacity,
        transform: [{ translateY }],
      }}
    >
      ✦
    </Animated.Text>
  );
}

function ShimmerButton({ onPress, children }) {
  const shimmer = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 2200,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const translateX = shimmer.interpolate({
    inputRange: [-1, 1],
    outputRange: [-width, width],
  });

  return (
    <TouchableOpacity style={styles.subscribeBtn} onPress={onPress} activeOpacity={0.85}>
      <LinearGradient
        colors={['#B8860B', '#DAA520', '#FFD700', '#DAA520', '#B8860B']}
        style={styles.subscribeBtnGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        {children}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              transform: [{ translateX }],
            },
          ]}
        >
          <LinearGradient
            colors={['transparent', 'rgba(255,255,255,0.35)', 'transparent']}
            style={{ flex: 1, width: 80 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </Animated.View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

function AnimatedFeatureRow({ feature, index }) {
  const slideAnim = useRef(new Animated.Value(40)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: 400 + index * 120,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: 400 + index * 120,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.featureRow,
        { opacity: fadeAnim, transform: [{ translateX: slideAnim }] },
      ]}
    >
      <LinearGradient
        colors={['rgba(218,165,32,0.25)', 'rgba(184,134,11,0.08)']}
        style={styles.featureIconBg}
      >
        <Ionicons name={feature.icon} size={20} color="#FFD700" />
      </LinearGradient>
      <Text style={styles.featureText}>{feature.text}</Text>
      <Ionicons name="checkmark-circle" size={18} color="#DAA520" style={{ marginLeft: 6 }} />
    </Animated.View>
  );
}

export default function PaywallScreen({ navigation }) {
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const { subscribe, isSubscribed } = useSubscription();
  const insets = useSafeAreaInsets();

  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(50)).current;
  const logoGlow = useRef(new Animated.Value(0.4)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const plansFade = useRef(new Animated.Value(0)).current;
  const plansSlide = useRef(new Animated.Value(30)).current;
  const btnScale = useRef(new Animated.Value(0.9)).current;

  const particles = useRef(
    Array.from({ length: NUM_PARTICLES }, () => ({
      x: Math.random() * (width - 40),
      y: 60 + Math.random() * 200,
      size: 8 + Math.random() * 10,
      delay: Math.random() * 3000,
    })),
  ).current;

  useEffect(() => {
    Animated.stagger(200, [
      Animated.parallel([
        Animated.timing(headerFade, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(headerSlide, { toValue: 0, duration: 700, easing: Easing.out(Easing.back(1.2)), useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(plansFade, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(plansSlide, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
      Animated.spring(btnScale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(logoGlow, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(logoGlow, { toValue: 0.4, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    ).start();

    Animated.loop(
      Animated.timing(logoRotate, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  useEffect(() => {
    if (isSubscribed) navigation.replace('MainTabs');
  }, [isSubscribed]);

  const spin = logoRotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <LinearGradient colors={['#0A0618', '#120D30', '#1A1145', '#2D1B69']} style={styles.container}>
      <View style={styles.particlesContainer} pointerEvents="none">
        {particles.map((p, i) => (
          <FloatingParticle key={i} delay={p.delay} startX={p.x} startY={p.y} size={p.size} />
        ))}
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={[styles.closeBtn, { top: insets.top + 10 }]}
          onPress={() => navigation.navigate('MainTabs')}
        >
          <Ionicons name="close" size={24} color="rgba(255,255,255,0.5)" />
        </TouchableOpacity>

        <Animated.View style={[styles.header, { opacity: headerFade, transform: [{ translateY: headerSlide }] }]}>
          <View style={styles.logoContainer}>
            <Animated.View style={[styles.logoRing, { opacity: logoGlow, transform: [{ rotate: spin }] }]}>
              <LinearGradient
                colors={['#FFD700', '#DAA520', '#B8860B', '#FFD700']}
                style={styles.logoRingGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            </Animated.View>
            <LinearGradient
              colors={['#1A1145', '#2D1B69']}
              style={styles.logoInner}
            >
              <Ionicons name="flower-outline" size={36} color="#FFD700" />
            </LinearGradient>
          </View>

          <View style={styles.titleRow}>
            <Ionicons name="diamond" size={16} color="#FFD700" />
            <Text style={styles.title}> ZenPulse Premium</Text>
          </View>
          <Text style={styles.subtitle}>
            Раскрой потенциал осознанности{'\n'}с персональным AI-наставником
          </Text>

          <View style={styles.goldDivider}>
            <LinearGradient
              colors={['transparent', '#DAA520', '#FFD700', '#DAA520', 'transparent']}
              style={styles.goldDividerLine}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
        </Animated.View>

        <View style={styles.featuresContainer}>
          {FEATURES.map((feature, index) => (
            <AnimatedFeatureRow key={index} feature={feature} index={index} />
          ))}
        </View>

        <Animated.View style={[styles.plansContainer, { opacity: plansFade, transform: [{ translateY: plansSlide }] }]}>
          <TouchableOpacity
            style={[styles.planCard, selectedPlan === 'yearly' && styles.planCardSelected]}
            onPress={() => setSelectedPlan('yearly')}
            activeOpacity={0.8}
          >
            {selectedPlan === 'yearly' && (
              <LinearGradient
                colors={['#FFD700', '#DAA520', '#B8860B']}
                style={styles.planCardGradientBorder}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            )}
            <View style={styles.planCardInner}>
              <View style={styles.planBadge}>
                <LinearGradient
                  colors={['#FFD700', '#DAA520']}
                  style={styles.badgeGradient}
                >
                  <Ionicons name="star" size={8} color="#1A1145" />
                  <Text style={styles.badgeText}> ЛУЧШЕЕ</Text>
                </LinearGradient>
              </View>
              <View style={styles.planInfo}>
                <Text style={[styles.planName, selectedPlan === 'yearly' && styles.goldText]}>Годовой</Text>
                <Text style={styles.planPrice}>
                  <Text style={[styles.priceAmount, selectedPlan === 'yearly' && styles.goldText]}>2 990 ₽</Text>
                  <Text style={styles.pricePeriod}> / год</Text>
                </Text>
                <Text style={styles.planSaving}>249 ₽/мес · Экономия 60%</Text>
              </View>
              <View style={[styles.radioOuter, selectedPlan === 'yearly' && styles.radioOuterGold]}>
                {selectedPlan === 'yearly' && (
                  <LinearGradient colors={['#FFD700', '#DAA520']} style={styles.radioInner} />
                )}
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.planCard, selectedPlan === 'monthly' && styles.planCardSelected]}
            onPress={() => setSelectedPlan('monthly')}
            activeOpacity={0.8}
          >
            {selectedPlan === 'monthly' && (
              <LinearGradient
                colors={['#A78BFA', '#6366F1']}
                style={styles.planCardGradientBorder}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            )}
            <View style={styles.planCardInner}>
              <View style={styles.planInfo}>
                <Text style={styles.planName}>Месячный</Text>
                <Text style={styles.planPrice}>
                  <Text style={styles.priceAmount}>599 ₽</Text>
                  <Text style={styles.pricePeriod}> / месяц</Text>
                </Text>
              </View>
              <View style={styles.radioOuter}>
                {selectedPlan === 'monthly' && (
                  <LinearGradient colors={['#A78BFA', '#6366F1']} style={styles.radioInner} />
                )}
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ width: '100%', transform: [{ scale: btnScale }] }}>
          <ShimmerButton onPress={() => subscribe(selectedPlan)}>
            <Text style={styles.subscribeBtnText}>Попробовать бесплатно</Text>
            <Text style={styles.subscribeBtnSub}>7 дней бесплатно, затем автопродление</Text>
          </ShimmerButton>
        </Animated.View>

        <Text style={styles.termsText}>
          Отмена в любой момент · Восстановить покупку
        </Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  particlesContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 2,
  },
  closeBtn: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 24,
  },
  logoContainer: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoRing: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRingGradient: {
    width: 96,
    height: 96,
    borderRadius: 30,
  },
  logoInner: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: { elevation: 12 },
    }),
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFD700',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
    lineHeight: 22,
  },
  goldDivider: {
    width: '60%',
    height: 2,
    marginTop: 20,
  },
  goldDividerLine: {
    flex: 1,
    borderRadius: 1,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    backgroundColor: 'rgba(218,165,32,0.04)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(218,165,32,0.08)',
  },
  featureIconBg: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    flex: 1,
  },
  plansContainer: {
    width: '100%',
    marginBottom: 24,
    gap: 12,
  },
  planCard: {
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  planCardSelected: {
    borderColor: '#A78BFA',
    backgroundColor: 'rgba(167,139,250,0.06)',
  },
  planCardSelectedGold: {
    borderColor: '#DAA520',
    backgroundColor: 'rgba(218,165,32,0.06)',
  },
  planCardGradientBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  planCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },
  planBadge: {
    position: 'absolute',
    top: -1,
    right: 16,
  },
  badgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  badgeText: {
    color: '#1A1145',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  planInfo: { flex: 1 },
  planName: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  goldText: {
    color: '#FFD700',
  },
  planPrice: { marginBottom: 2 },
  priceAmount: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  pricePeriod: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
  },
  planSaving: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterGold: {
    borderColor: '#DAA520',
  },
  radioInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  subscribeBtn: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 14,
      },
      android: { elevation: 10 },
    }),
  },
  subscribeBtnGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 16,
    overflow: 'hidden',
  },
  subscribeBtnText: {
    color: '#1A1145',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  subscribeBtnSub: {
    color: 'rgba(26,17,69,0.6)',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  termsText: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 12,
    textAlign: 'center',
  },
});
