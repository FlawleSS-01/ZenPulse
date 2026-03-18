import React, { createContext, useContext, useState, useCallback } from 'react';

const SubscriptionContext = createContext();

export function SubscriptionProvider({ children }) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [plan, setPlan] = useState(null);

  const subscribe = useCallback((selectedPlan) => {
    setPlan(selectedPlan);
    setIsSubscribed(true);
  }, []);

  return (
    <SubscriptionContext.Provider value={{ isSubscribed, plan, subscribe }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider');
  return ctx;
}
