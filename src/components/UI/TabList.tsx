import React, { useRef } from 'react';

export interface TabItem<T extends string> {
  id: T;
  label: string;
  icon?: React.ReactNode;
}

export interface TabListProps<T extends string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (id: T) => void;
  ariaLabel?: string;
}

export function TabList<T extends string>({
  tabs,
  activeTab,
  onChange,
  ariaLabel = 'Inspector tabs',
}: TabListProps<T>) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex: number | null = null;
    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = tabs.length - 1;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      const nextTab = tabs[nextIndex];
      onChange(nextTab.id);
      tabRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="grid grid-cols-4 border-b px-1 select-none w-full shrink-0"
      style={{
        borderColor: 'var(--border)',
        backgroundColor: 'var(--surface)',
      }}
    >
      {tabs.map((tab, idx) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[idx] = el;
            }}
            role="tab"
            aria-selected={isActive}
            id={`tab-${tab.id}`}
            aria-controls={`panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => {
              onChange(tab.id);
              tabRefs.current[idx]?.focus();
            }}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`
              relative min-h-[40px] px-1.5 py-2 text-xs font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer text-center
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]
              ${isActive ? 'font-semibold' : 'hover:text-[var(--text-primary)]'}
            `}
            style={{
              color: isActive ? 'var(--primary-action)' : 'var(--text-secondary)',
            }}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span className="truncate">{tab.label}</span>
            {isActive && (
              <span
                className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t"
                style={{ backgroundColor: 'var(--primary-action)' }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
