import { useState, useEffect, useCallback } from 'react';

export interface FocusState {
  isLocked: boolean;
  blockedDomains: string[];
  totalFocusSeconds: number;
  sessionStartTime: number | null;
}

const DEFAULT_DOMAINS = ['twitter.com', 'reddit.com', 'youtube.com'];

// Safely check if we're running as a Chrome extension
const getChromeStorage = () => {
  if (typeof window !== 'undefined' && 'chrome' in window) {
    const chromeObj = (window as unknown as { chrome?: { storage?: { local?: unknown }; runtime?: { sendMessage?: unknown } } }).chrome;
    if (chromeObj?.storage?.local) {
      return chromeObj as {
        storage: {
          local: {
            get: (keys: string[], callback: (result: Record<string, unknown>) => void) => void;
            set: (items: Record<string, unknown>) => void;
          };
        };
        runtime: {
          sendMessage: (message: Record<string, unknown>) => void;
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
    totalFocusSeconds: 0,
    sessionStartTime: null,
  });
  const [currentSessionSeconds, setCurrentSessionSeconds] = useState(0);

  // Load initial state
  useEffect(() => {
    const chromeAPI = getChromeStorage();
    
    if (chromeAPI) {
      chromeAPI.storage.local.get(
        ['isLocked', 'blockedDomains', 'totalFocusSeconds', 'sessionStartTime'],
        (result) => {
          setState({
            isLocked: (result.isLocked as boolean) ?? false,
            blockedDomains: (result.blockedDomains as string[]) ?? DEFAULT_DOMAINS,
            totalFocusSeconds: (result.totalFocusSeconds as number) ?? 0,
            sessionStartTime: (result.sessionStartTime as number | null) ?? null,
          });
        }
      );
    } else {
      // Use localStorage for development
      const saved = localStorage.getItem('cozyFocusState');
      if (saved) {
        setState(JSON.parse(saved));
      }
    }
  }, []);

  // Timer for current session
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (state.isLocked && state.sessionStartTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - state.sessionStartTime!) / 1000);
        setCurrentSessionSeconds(elapsed);
      }, 1000);
    } else {
      setCurrentSessionSeconds(0);
    }

    return () => clearInterval(interval);
  }, [state.isLocked, state.sessionStartTime]);

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
      saveState({ ...state, blockedDomains: newDomains });
    }
  }, [state, saveState]);

  const removeDomain = useCallback((domain: string) => {
    const newDomains = state.blockedDomains.filter(d => d !== domain);
    saveState({ ...state, blockedDomains: newDomains });
  }, [state, saveState]);

  const toggleDomain = useCallback((_domain: string, _enabled: boolean) => {
    // For now, we just remove/add - could be enhanced with enabled/disabled state
  }, []);

  const lockIn = useCallback(() => {
    const newState = {
      ...state,
      isLocked: true,
      sessionStartTime: Date.now(),
    };
    saveState(newState);

    const chromeAPI = getChromeStorage();
    if (chromeAPI?.runtime?.sendMessage) {
      chromeAPI.runtime.sendMessage({
        type: 'UPDATE_BLOCKLIST',
        domains: state.blockedDomains,
      });
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
      totalFocusSeconds: state.totalFocusSeconds + sessionDuration,
    };
    saveState(newState);

    const chromeAPI = getChromeStorage();
    if (chromeAPI?.runtime?.sendMessage) {
      chromeAPI.runtime.sendMessage({ type: 'CLEAR_BLOCKLIST' });
    }
  }, [state, saveState]);

  return {
    ...state,
    currentSessionSeconds,
    addDomain,
    removeDomain,
    toggleDomain,
    lockIn,
    unlock,
  };
}
