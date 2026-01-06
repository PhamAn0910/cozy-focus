import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';

// Declare chrome types for extension context
declare const chrome: {
  storage?: {
    sync: {
      get: (keys: string[], callback: (result: Record<string, any>) => void) => void;
      set: (items: Record<string, any>, callback?: () => void) => void;
    };
  };
  runtime?: {
    sendMessage: (message: Record<string, any>) => void;
  };
};

export function NewTabSetting() {
  const [replaceNewTab, setReplaceNewTab] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load setting from chrome.storage on mount
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.get(['replaceNewTab'], (result) => {
        setReplaceNewTab(result.replaceNewTab ?? false);
        setIsLoading(false);
      });
    } else {
      // Fallback for development (not in extension context)
      const saved = localStorage.getItem('replaceNewTab');
      setReplaceNewTab(saved === 'true');
      setIsLoading(false);
    }
  }, []);

  // Save setting when changed
  const handleToggle = (checked: boolean) => {
    setReplaceNewTab(checked);

    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.set({ replaceNewTab: checked }, () => {
        // Notify background script to update behavior
        if (chrome.runtime) {
          chrome.runtime.sendMessage({ type: 'UPDATE_NEW_TAB_SETTING', replaceNewTab: checked });
        }
      });
    } else {
      // Fallback for development
      localStorage.setItem('replaceNewTab', String(checked));
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="flex items-center gap-3"
    >
      <span className="text-sm font-medium text-muted-foreground italic">
        {replaceNewTab ? 'New Tab Replaced' : 'Replace New Tab'}
      </span>
      <Switch
        checked={replaceNewTab}
        onCheckedChange={handleToggle}
      />
    </motion.div>
  );
}
