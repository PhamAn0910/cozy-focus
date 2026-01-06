import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Check } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface BlocklistProps {
  domains: string[];
  enabledDomains: string[];
  onAddDomain: (domain: string) => void;
  onRemoveDomain: (domain: string) => void;
  onToggleDomain: (domain: string) => void;
  isLocked: boolean;
}

export function Blocklist({ domains, enabledDomains, onAddDomain, onRemoveDomain, onToggleDomain, isLocked }: BlocklistProps) {
  const [newDomain, setNewDomain] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDomain.trim()) {
      onAddDomain(newDomain.trim());
      setNewDomain('');
    }
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-2 bg-muted/30 rounded-xl px-4 py-3">
          <Plus className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            placeholder="Add website to block..."
            disabled={isLocked}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
          />
        </div>
      </form>

      <div className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
        <AnimatePresence>
          {domains.map((domain, index) => (
            <motion.div
              key={domain}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 py-2 group"
            >
              <Checkbox
                checked={enabledDomains.includes(domain)}
                onCheckedChange={() => onToggleDomain(domain)}
                disabled={isLocked}
                className="border-secondary data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
              />
              <span className="text-sm text-muted-foreground flex-1">{domain}</span>
              {!isLocked && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onRemoveDomain(domain)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                </motion.button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
