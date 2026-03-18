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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSubscription } from '../context/SubscriptionContext';
import { MEDITATIONS } from '../data/meditations';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 24 * 2 - 14) / 2;

function MeditationCard({ item, index, isSubscribed, onLockedPress }) {
  const isLocked = !item.free && !isSubscribed;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay: index * 80,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.cardWrapper, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={styles.card}
        activeOpacity={isLocked ? 0.7 : 0.85}
        onPress={isLocked ? onLockedPress : undefined}
      >
        <LinearGradient
          colors={
            isLocked
              ? ['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.02)']
              : [`${item.color}22`, `${item.color}08`]
          }
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardTop}>
            <Text style={[styles.cardEmoji, isLocked && styles.lockedEmoji]}>
              {item.emoji}
            </Text>
            {isLocked && (
              <View style={styles.lockBadge}>
                <Ionicons name="lock-closed" size={12} color="#FFF" />
              </View>
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
                color={isLocked ? 'rgba(255,255,255,0.3)' : item.color}
              />
              <Text style={[styles.durationText, isLocked ? styles.lockedText : { color: item.color }]}>
                {item.duration}
              </Text>
            </View>
            <Text style={[styles.categoryText, isLocked && styles.lockedText]}>
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

  const handleLockedPress = () => {
    navigation.navigate('Paywall');
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View>
        <Text style={styles.greeting}>Добрый день 🙏</Text>
        <Text style={styles.headerTitle}>Медитации</Text>
      </View>
      {!isSubscribed && (
        <TouchableOpacity style={styles.premiumBtn} onPress={handleLockedPress}>
          <LinearGradient
            colors={['#A78BFA', '#6366F1']}
            style={styles.premiumBtnGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="diamond-outline" size={14} color="#FFF" />
            <Text style={styles.premiumBtnText}>Premium</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
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
    <LinearGradient colors={['#0F0A2E', '#1A1145', '#0F0A2E']} style={styles.container}>
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
  container: {
    flex: 1,
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
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  premiumBtn: {
    borderRadius: 20,
    overflow: 'hidden',
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
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  cardWrapper: {
    flex: 1,
    maxWidth: CARD_WIDTH,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  cardGradient: {
    padding: 16,
    minHeight: 180,
    justifyContent: 'space-between',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardEmoji: {
    fontSize: 32,
  },
  lockedEmoji: {
    opacity: 0.3,
  },
  lockBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: 24,
    height: 24,
    borderRadius: 12,
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
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 16,
    marginBottom: 12,
  },
  lockedText: {
    color: 'rgba(255,255,255,0.25)',
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
  },
  lockedBadge: {
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  durationText: {
    fontSize: 11,
    fontWeight: '600',
  },
  categoryText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '500',
  },
});
