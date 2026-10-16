import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sun,
  Moon,
  Menu,
  X,
  Compass,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { PRESET_GRAPHS } from '../../data/presetGraphs';

interface TopNavProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  onSelectPreset?: (presetId: string) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  theme,
  toggleTheme,
  onSelectPreset,
}) => {
  const location = useLocation();
  const isVisualizer = location.pathname === '/visualizer';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Visualizer', path: '/visualizer' },
    { label: 'Compare', path: '/compare' },
    { label: 'About', path: '/about' },
  ];

  // Close mobile drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header
      className="h-[68px] border-b px-6 flex items-center justify-between z-40 select-none transition-colors"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Brand Wordmark */}
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] rounded-lg p-1"
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center border font-mono font-bold"
            style={{
              backgroundColor: 'var(--accent-subtle)',
              borderColor: 'var(--accent)',
              color: 'var(--accent)',
            }}
          >
            <Compass className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight font-sans">
                PathScope
              </span>
              <span
                className="text-[11px] font-mono font-medium px-2 py-0.5 rounded border"
                style={{
                  backgroundColor: 'var(--background-secondary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-secondary)',
                }}
              >
                50% Scope
              </span>
            </div>
            <p
              className="text-[12px] hidden sm:block font-medium leading-none mt-0.5"
              style={{ color: 'var(--text-muted)' }}
            >
              C++ Algorithm Laboratory
            </p>
          </div>
        </Link>
      </div>

      {/* Desktop 4-Link Navigation */}
      <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3.5 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] ${
                isActive
                  ? 'font-semibold border'
                  : 'hover:text-[var(--text-primary)]'
              }`}
              style={{
                backgroundColor: isActive ? 'var(--background-secondary)' : 'transparent',
                borderColor: isActive ? 'var(--border-strong)' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Preset Selector (Only in Visualizer) */}
        {isVisualizer && onSelectPreset && (
          <div
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs"
            style={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
              color: 'var(--text-secondary)',
            }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--active-step)' }} />
            <span className="font-medium" style={{ color: 'var(--text-muted)' }}>
              Preset:
            </span>
            <select
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) {
                  onSelectPreset(e.target.value);
                  e.target.value = '';
                }
              }}
              aria-label="Load graph preset"
              className="bg-transparent font-medium focus:outline-none cursor-pointer"
              style={{ color: 'var(--text-primary)' }}
            >
              <option value="" disabled style={{ backgroundColor: 'var(--surface)' }}>
                Load graph preset...
              </option>
              {PRESET_GRAPHS.map((p) => (
                <option
                  key={p.id}
                  value={p.id}
                  style={{
                    backgroundColor: 'var(--surface)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Primary Action Button (when not on visualizer) */}
        {!isVisualizer && (
          <Link
            to="/visualizer"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
            style={{
              backgroundColor: 'var(--accent)',
              color: '#FFFDF8',
            }}
          >
            <span>Open Visualizer</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light Warm Beige' : 'Dark Neutral Charcoal'} theme`}
          aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="w-10 h-10 rounded-md border flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          style={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)',
          }}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-neutral-800" />
          )}
        </button>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          className="md:hidden w-10 h-10 rounded-md border flex items-center justify-center transition-colors cursor-pointer"
          style={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)',
          }}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-x-0 top-[68px] border-b p-5 md:hidden z-50 shadow-xl transition-all"
          style={{
            backgroundColor: 'var(--surface-elevated)',
            borderColor: 'var(--border-strong)',
          }}
        >
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-md text-base font-medium flex items-center justify-between min-h-[44px]"
                  style={{
                    backgroundColor: isActive ? 'var(--background-secondary)' : 'transparent',
                    color: isActive ? 'var(--accent)' : 'var(--text-primary)',
                    border: isActive ? '1px solid var(--border)' : '1px solid transparent',
                  }}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />}
                </Link>
              );
            })}

            {!isVisualizer && (
              <Link
                to="/visualizer"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md text-base font-semibold min-h-[44px]"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: '#FFFDF8',
                }}
              >
                <span>Open Visualizer</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
