import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, Compass } from 'lucide-react';

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
      className="h-16 border-b px-6 flex items-center justify-between z-40 select-none transition-colors"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Brand Logo & Wordmark Only (No badges or subtitles) */}
      <Link
        to="/"
        className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
      >
        <div
          className="w-8 h-8 rounded-md flex items-center justify-center border"
          style={{
            backgroundColor: 'var(--primary-subtle)',
            borderColor: 'var(--border-strong)',
            color: 'var(--primary-action)',
          }}
        >
          <Compass className="w-4 h-4 stroke-[2]" />
        </div>
        <span
          className="text-lg font-semibold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          PathScope
        </span>
      </Link>

      {/* Clean Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] ${
                isActive ? 'font-semibold' : 'hover:text-[var(--text-primary)] font-medium'
              }`}
              style={{
                backgroundColor: isActive ? 'var(--background-secondary)' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Right Controls: Theme Toggle & Mobile Trigger */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="w-9 h-9 rounded-md border flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          style={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)',
          }}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-stone-700" />
          )}
        </button>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          className="md:hidden w-9 h-9 rounded-md border flex items-center justify-center transition-colors cursor-pointer"
          style={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)',
          }}
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
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
                  className="px-3.5 py-2.5 rounded-md text-sm font-medium flex items-center justify-between min-h-[44px]"
                  style={{
                    backgroundColor: isActive ? 'var(--background-secondary)' : 'transparent',
                    color: isActive ? 'var(--primary-action)' : 'var(--text-primary)',
                  }}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: 'var(--primary-action)' }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default TopNav;
