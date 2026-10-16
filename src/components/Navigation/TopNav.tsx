import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, Compass } from 'lucide-react';
import { IconButton } from '../UI/IconButton';

interface TopNavProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ theme, toggleTheme }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Visualizer', path: '/visualizer' },
    { label: 'Compare', path: '/compare' },
    { label: 'About', path: '/about' },
  ];

  // Close drawer on ESC
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
      className="h-16 border-b px-6 flex items-center justify-between z-40 select-none transition-colors shrink-0"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Brand Logo & Wordmark */}
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] group"
        >
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center border transition-transform duration-150 group-hover:scale-105"
            style={{
              backgroundColor: 'var(--primary-subtle)',
              borderColor: 'var(--border-strong)',
              color: 'var(--primary-action)',
            }}
          >
            <Compass className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span
            className="text-base font-semibold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            PathScope
          </span>
        </Link>

        <span
          className="hidden lg:inline-flex items-center gap-1.5 text-xs font-mono px-2 py-0.5 rounded border"
          style={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
            color: 'var(--text-muted)',
          }}
        >
          DAA Laboratory <span className="opacity-40">|</span> 50% Milestone
        </span>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-1 h-full" aria-label="Main Navigation">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              aria-current={isActive ? 'page' : undefined}
              className={`
                relative h-16 px-3.5 inline-flex items-center text-xs font-medium tracking-tight transition-colors
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]
                ${isActive ? 'font-semibold' : 'hover:text-[var(--text-primary)]'}
              `}
              style={{
                color: isActive ? 'var(--primary-action)' : 'var(--text-secondary)',
              }}
            >
              {link.label}
              {isActive && (
                <span
                  className="absolute bottom-0 left-2 right-2 h-[2px] rounded-t"
                  style={{ backgroundColor: 'var(--primary-action)' }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Right Actions: Theme Toggle & Mobile Trigger */}
      <div className="flex items-center gap-2">
        <IconButton
          icon={theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
          label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          onClick={toggleTheme}
          variant="surface"
          size="md"
        />

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <IconButton
            icon={mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            variant="surface"
            size="md"
          />
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-x-0 top-16 border-b p-4 md:hidden z-50 shadow-lg"
          style={{
            backgroundColor: 'var(--surface-elevated)',
            borderColor: 'var(--border-strong)',
          }}
        >
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                  className="px-4 py-3 rounded-md text-sm font-medium flex items-center justify-between min-h-[44px] transition-colors"
                  style={{
                    backgroundColor: isActive ? 'var(--primary-subtle)' : 'transparent',
                    color: isActive ? 'var(--primary-action)' : 'var(--text-primary)',
                  }}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[var(--primary-action)]" />}
                </Link>
              );
            })}
          </div>
          <div
            className="mt-4 pt-3 border-t text-xs flex items-center justify-between"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--text-muted)',
            }}
          >
            <span>C++17 & WebAssembly Engine</span>
            <span className="font-mono">BFS & Dijkstra</span>
          </div>
        </div>
      )}
    </header>
  );
};

export default TopNav;
