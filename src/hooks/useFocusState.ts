import { useState, useEffect, useCallback, useRef } from 'react';

export interface FocusState {
  isLocked: boolean;
  blockedDomains: string[];
  enabledDomains: string[]; // Domains that are checked/enabled for blocking
  totalFocusSeconds: number;
  sessionStartTime: number | null;
  sessionDurationMinutes: number;
  sessionEndTime: number | null;
}

const DEFAULT_DOMAINS = ['facebook.com', 'reddit.com', 'youtube.com'];
const DEFAULT_DURATION_MINUTES = 30;

// Safely check if we're running as a Chrome extension
const getChromeStorage = () => {
  if (typeof window !== 'undefined' && 'chrome' in window) {
    const chromeObj = (window as unknown as { chrome?: { storage?: { local?: unknown }; runtime?: { sendMessage?: unknown }; alarms?: unknown } }).chrome;
    if (chromeObj?.storage?.local) {
      return chromeObj as {
        storage: {
          local: {
            get: (keys: string[], callback: (result: Record<string, unknown>) => void) => void;
            set: (items: Record<string, unknown>) => void;
          };
        };
        runtime: {
          sendMessage: (message: Record<string, unknown>, callback?: (response: unknown) => void) => void;
        };
        alarms: {
          create: (name: string, alarmInfo: { when: number }) => void;
          clear: (name: string) => void;
        };
      };
    }
  }
  return null;
};

export function useFocusState() {
  const [state, setState] = useState<FocusState>({
    isLocked: false,
    blockedDomains: DEFAULT_DOMAINS,
    enabledDomains: ['twitter.com', 'reddit.com'], // Only first two enabled by default
    totalFocusSeconds: 0,
    sessionStartTime: null,
    sessionDurationMinutes: DEFAULT_DURATION_MINUTES,
    sessionEndTime: null,
  });
  const [currentSessionSeconds, setCurrentSessionSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const hasAutoUnlockedRef = useRef(false);

  // Load initial state
  useEffect(() => {
    const chromeAPI = getChromeStorage();
    
    if (chromeAPI) {
      chromeAPI.storage.local.get(
        ['isLocked', 'blockedDomains', 'enabledDomains', 'totalFocusSeconds', 'sessionStartTime', 'sessionDurationMinutes', 'sessionEndTime'],
        (result) => {
          const blockedDomains = (result.blockedDomains as string[]) ?? DEFAULT_DOMAINS;
          setState({
            isLocked: (result.isLocked as boolean) ?? false,
            blockedDomains: blockedDomains,
            enabledDomains: (result.enabledDomains as string[]) ?? ['twitter.com', 'reddit.com'],
            totalFocusSeconds: (result.totalFocusSeconds as number) ?? 0,
            sessionStartTime: (result.sessionStartTime as number | null) ?? null,
            sessionDurationMinutes: (result.sessionDurationMinutes as number) ?? DEFAULT_DURATION_MINUTES,
            sessionEndTime: (result.sessionEndTime as number | null) ?? null,
          });
        }
      );
    } else {
      // Use localStorage for development
      const saved = localStorage.getItem('cozyFocusState');
      if (saved) {
        const parsed = JSON.parse(saved);
        setState({
          ...parsed,
          enabledDomains: parsed.enabledDomains ?? ['twitter.com', 'reddit.com'],
          sessionDurationMinutes: parsed.sessionDurationMinutes ?? DEFAULT_DURATION_MINUTES,
          sessionEndTime: parsed.sessionEndTime ?? null,
        });
      }
    }
  }, []);

  // Reset the auto-unlock flag when a new session starts
  useEffect(() => {
    if (state.isLocked && state.sessionStartTime) {
      hasAutoUnlockedRef.current = false;
    }
  }, [state.isLocked, state.sessionStartTime]);

  // Timer for current session and remaining time + auto-unlock
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (state.isLocked && state.sessionStartTime && state.sessionEndTime) {
      const updateTimers = () => {
        const now = Date.now();
        
        // Check if session has expired
        if (now >= state.sessionEndTime! && !hasAutoUnlockedRef.current) {
          hasAutoUnlockedRef.current = true;
          
          // Session has expired, auto-unlock
          const sessionDuration = Math.floor((state.sessionEndTime! - state.sessionStartTime!) / 1000);

          const newState: FocusState = {
            isLocked: false,
            blockedDomains: state.blockedDomains,
            enabledDomains: state.enabledDomains,
            totalFocusSeconds: state.totalFocusSeconds + sessionDuration,
            sessionStartTime: null,
            sessionDurationMinutes: state.sessionDurationMinutes,
            sessionEndTime: null,
          };

          const chromeAPI = getChromeStorage();
          if (chromeAPI) {
            chromeAPI.storage.local.set(newState as unknown as Record<string, unknown>);
            chromeAPI.runtime.sendMessage({ type: 'CLEAR_BLOCKLIST' });
            chromeAPI.alarms.clear('sessionEnd');
          } else {
            localStorage.setItem('cozyFocusState', JSON.stringify(newState));
          }
          
          setState(newState);
          setCurrentSessionSeconds(0);
          setRemainingSeconds(0);
          return;
        }

        if (now < state.sessionEndTime!) {
          const elapsed = Math.floor((now - state.sessionStartTime!) / 1000);
          setCurrentSessionSeconds(elapsed);

          const remaining = Math.floor((state.sessionEndTime! - now) / 1000);
          setRemainingSeconds(remaining);
        }
      };

      updateTimers();
      interval = setInterval(updateTimers, 1000);
    } else {
      setCurrentSessionSeconds(0);
      setRemainingSeconds(0);
    }

    return () => clearInterval(interval);
  }, [state.isLocked, state.sessionStartTime, state.sessionEndTime, state.blockedDomains, state.totalFocusSeconds, state.sessionDurationMinutes]);

  const saveState = useCallback((newState: FocusState) => {
    const chromeAPI = getChromeStorage();
    
    if (chromeAPI) {
      chromeAPI.storage.local.set(newState as unknown as Record<string, unknown>);
    } else {
      localStorage.setItem('cozyFocusState', JSON.stringify(newState));
    }
    setState(newState);
  }, []);

  const addDomain = useCallback((domain: string) => {
    const cleaned = domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/.*$/, '');
    if (cleaned && !state.blockedDomains.includes(cleaned)) {
      const newDomains = [...state.blockedDomains, cleaned];
      // New domains are enabled by default
      const newEnabledDomains = [...state.enabledDomains, cleaned];
      saveState({ ...state, blockedDomains: newDomains, enabledDomains: newEnabledDomains });
    }
  }, [state, saveState]);

  const removeDomain = useCallback((domain: string) => {
    const newDomains = state.blockedDomains.filter(d => d !== domain);
    const newEnabledDomains = state.enabledDomains.filter(d => d !== domain);
    saveState({ ...state, blockedDomains: newDomains, enabledDomains: newEnabledDomains });
  }, [state, saveState]);

  const toggleDomain = useCallback((domain: string) => {
    const newEnabledDomains = state.enabledDomains.includes(domain)
      ? state.enabledDomains.filter(d => d !== domain)
      : [...state.enabledDomains, domain];
    saveState({ ...state, enabledDomains: newEnabledDomains });
  }, [state, saveState]);

  const setSessionDuration = useCallback((minutes: number) => {
    saveState({ ...state, sessionDurationMinutes: minutes });
  }, [state, saveState]);

  const lockIn = useCallback(() => {
    const now = Date.now();
    const endTime = now + state.sessionDurationMinutes * 60 * 1000;

    const newState = {
      ...state,
      isLocked: true,
      sessionStartTime: now,
      sessionEndTime: endTime,
    };
    saveState(newState);

    // Only block domains that are enabled (checked)
    const domainsToBlock = state.blockedDomains.filter(domain => 
      state.enabledDomains.includes(domain)
    );

    const chromeAPI = getChromeStorage();
    if (chromeAPI?.runtime?.sendMessage) {
      chromeAPI.runtime.sendMessage({
        type: 'UPDATE_BLOCKLIST',
        domains: domainsToBlock,
      });
    }

    // Set up chrome alarm for auto-unlock
    if (chromeAPI?.alarms) {
      chromeAPI.alarms.create('sessionEnd', { when: endTime });
    }
  }, [state, saveState]);

  const unlock = useCallback(() => {
    // Add session time to total
    const sessionDuration = state.sessionStartTime 
      ? Math.floor((Date.now() - state.sessionStartTime) / 1000)
      : 0;

    const newState = {
      ...state,
      isLocked: false,
      sessionStartTime: null,
      sessionEndTime: null,
      totalFocusSeconds: state.totalFocusSeconds + sessionDuration,
    };
    saveState(newState);

    const chromeAPI = getChromeStorage();
    if (chromeAPI?.runtime?.sendMessage) {
      chromeAPI.runtime.sendMessage({ type: 'CLEAR_BLOCKLIST' });
    }

    // Clear the alarm
    if (chromeAPI?.alarms) {
      chromeAPI.alarms.clear('sessionEnd');
    }
  }, [state, saveState]);

  return {
    ...state,
    currentSessionSeconds,
    remainingSeconds,
    addDomain,
    removeDomain,
    toggleDomain,
    setSessionDuration,
    lockIn,
    unlock,
  };
}
