'use client';

import { Command } from 'cmdk';
import { ArrowUpRight } from 'lucide-react';
import { quickActions } from '@/data/navigation';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (id: string) => void;
};

export function CommandPalette({ open, onOpenChange, onNavigate }: Props) {
  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Portfolio quick navigation"
    >
      <div className="fixed inset-0 z-50 bg-[rgba(5,7,12,0.7)] backdrop-blur-sm" />
      <div className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,640px)] -translate-x-1/2 -translate-y-1/2 rounded-[26px] border border-[var(--border)] bg-[#111412] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
        <Command
          value=""
          onValueChange={(value) => {
            const match = quickActions.find((item) => item.label === value);
            if (match) onNavigate(match.target);
          }}
          className="w-full"
        >
          <Command.Input
            placeholder="Search sections..."
            className="w-full rounded-xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] px-3 py-2.5 text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]"
          />
          <Command.List className="mt-3 max-h-64 overflow-y-auto">
            {quickActions.map((action) => (
              <Command.Item
                key={action.label}
                value={action.label}
                onSelect={() => onNavigate(action.target)}
                className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm text-[var(--text-muted)] hover:bg-[rgba(255,255,255,0.03)] hover:text-[var(--text)]"
              >
                <span>{action.label}</span>
                <ArrowUpRight className="h-4 w-4" />
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </div>
    </Command.Dialog>
  );
}
