import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SubscriptionProvider } from './src/context/SubscriptionContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <SubscriptionProvider>
        <StatusBar style="light" />
        <AppNavigator />
      </SubscriptionProvider>
    </SafeAreaProvider>
  );
}
