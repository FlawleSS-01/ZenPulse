import React, { createContext, useContext, useState, useCallback } from 'react';

const TRIAL_DAYS = 7;

const SubscriptionContext = createContext();

export function SubscriptionProvider({ children }) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [plan, setPlan] = useState(null);
  const [trialStartDate, setTrialStartDate] = useState(null);

  const subscribe = useCallback((selectedPlan) => {
    setPlan(selectedPlan);
    setIsSubscribed(true);
    setTrialStartDate(new Date());
  }, []);

  const getTrialDaysLeft = useCallback(() => {
    if (!trialStartDate) return 0;
    const elapsed = Math.floor((Date.now() - trialStartDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(TRIAL_DAYS - elapsed, 0);
  }, [trialStartDate]);

  return (
    <SubscriptionContext.Provider value={{ isSubscribed, plan, subscribe, trialStartDate, getTrialDaysLeft }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider');
  return ctx;
}
