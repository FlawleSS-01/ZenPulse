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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSubscription } from '../context/SubscriptionContext';

const { width, height } = Dimensions.get('window');

const FEATURES = [
  { icon: 'infinite-outline', text: 'Безлимитный доступ ко всем медитациям' },
  { icon: 'sparkles-outline', text: 'AI-настрой дня: персональные аффирмации' },
  { icon: 'moon-outline', text: 'Специальные сессии для сна' },
  { icon: 'analytics-outline', text: 'Статистика и прогресс' },
  { icon: 'notifications-outline', text: 'Умные напоминания' },
];

export default function PaywallScreen({ navigation }) {
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const { subscribe, isSubscribed } = useSubscription();
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (isSubscribed) {
      navigation.replace('MainTabs');
    }
  }, [isSubscribed]);

  const handleSubscribe = () => {
    subscribe(selectedPlan);
  };

  return (
    <LinearGradient colors={['#0F0A2E', '#1A1145', '#2D1B69']} style={styles.container}>
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

        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['#A78BFA', '#818CF8', '#6366F1']}
              style={styles.logoGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="flower-outline" size={40} color="#FFF" />
            </LinearGradient>
          </View>
          <Text style={styles.title}>ZenPulse Premium</Text>
          <Text style={styles.subtitle}>
            Раскрой потенциал осознанности{'\n'}с персональным AI-наставником
          </Text>
        </Animated.View>

        <Animated.View style={[styles.featuresContainer, { opacity: fadeAnim }]}>
          {FEATURES.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <LinearGradient
                colors={['rgba(167,139,250,0.3)', 'rgba(99,102,241,0.1)']}
                style={styles.featureIconBg}
              >
                <Ionicons name={feature.icon} size={20} color="#A78BFA" />
              </LinearGradient>
              <Text style={styles.featureText}>{feature.text}</Text>
            </View>
          ))}
        </Animated.View>

        <Animated.View style={[styles.plansContainer, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={[styles.planCard, selectedPlan === 'yearly' && styles.planCardSelected]}
            onPress={() => setSelectedPlan('yearly')}
            activeOpacity={0.8}
          >
            {selectedPlan === 'yearly' && (
              <LinearGradient
                colors={['#A78BFA', '#6366F1']}
                style={styles.planCardGradientBorder}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            )}
            <View style={styles.planCardInner}>
              <View style={styles.planBadge}>
                <LinearGradient
                  colors={['#FBBF24', '#F59E0B']}
                  style={styles.badgeGradient}
                >
                  <Text style={styles.badgeText}>ВЫГОДНО</Text>
                </LinearGradient>
              </View>
              <View style={styles.planInfo}>
                <Text style={styles.planName}>Годовой</Text>
                <Text style={styles.planPrice}>
                  <Text style={styles.priceAmount}>2 990 ₽</Text>
                  <Text style={styles.pricePeriod}> / год</Text>
                </Text>
                <Text style={styles.planSaving}>249 ₽/мес · Экономия 60%</Text>
              </View>
              <View style={styles.radioOuter}>
                {selectedPlan === 'yearly' && (
                  <LinearGradient
                    colors={['#A78BFA', '#6366F1']}
                    style={styles.radioInner}
                  />
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
                  <LinearGradient
                    colors={['#A78BFA', '#6366F1']}
                    style={styles.radioInner}
                  />
                )}
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity style={styles.subscribeBtn} onPress={handleSubscribe} activeOpacity={0.85}>
          <LinearGradient
            colors={['#A78BFA', '#7C3AED', '#6366F1']}
            style={styles.subscribeBtnGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.subscribeBtnText}>Попробовать бесплатно</Text>
            <Text style={styles.subscribeBtnSub}>7 дней бесплатно, затем автопродление</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          Отмена в любой момент · Восстановить покупку
        </Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
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
    marginBottom: 28,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
      },
      android: { elevation: 12 },
    }),
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 22,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 28,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  featureIconBg: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  featureText: {
    fontSize: 15,
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
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  planCardSelected: {
    borderColor: '#A78BFA',
    backgroundColor: 'rgba(167,139,250,0.08)',
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
  planInfo: {
    flex: 1,
  },
  planName: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  planPrice: {
    marginBottom: 2,
  },
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
    color: '#FBBF24',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
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
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
    }),
  },
  subscribeBtnGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 16,
  },
  subscribeBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subscribeBtnSub: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginTop: 4,
  },
  termsText: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 12,
    textAlign: 'center',
  },
});
