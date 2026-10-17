import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, ArrowRight } from 'lucide-react';
import { PathScopeLogo } from './PathScopeLogo';

interface TopNavProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ theme, toggleTheme }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Visualizer', path: '/visualizer' },
    { label: 'Compare', path: '/compare' },
    { label: 'About', path: '/about' },
  ];

  const isVisualizerPage = location.pathname === '/visualizer';

  // Handle ESC key to close mobile drawer and return focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Sync mobile drawer state with route change
  const [prevPathname, setPrevPathname] = useState(location.pathname);
  if (prevPathname !== location.pathname) {
    setPrevPathname(location.pathname);
    setMobileMenuOpen(false);
  }

  // Click outside to close mobile drawer
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as HTMLElement) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(e.target as HTMLElement)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [mobileMenuOpen]);

  return (
    <header
      className="glass-header sticky top-0 w-full h-[60px] md:h-[68px] px-4 sm:px-6 flex items-center justify-between z-40 select-none shrink-0"
    >
      {/* Brand Identity Lockup */}
      <div className="flex items-center gap-3 sm:gap-4">
        <Link
          to="/"
          aria-label="PathScope Home"
          className="flex items-center rounded-lg p-1 -m-1 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] group"
        >
          <PathScopeLogo size={30} />
        </Link>

        {/* Secondary Laboratory Descriptor */}
        <span
          className="hidden lg:inline-block text-[11px] font-mono tracking-wider uppercase opacity-60 pl-2 border-l"
          style={{
            borderColor: 'var(--border)',
            color: 'var(--text-muted)',
          }}
        >
          Algorithm Laboratory
        </span>
      </div>

      {/* Desktop Coordinated Liquid-Glass Navigation Island */}
      <nav
        className="hidden md:flex items-center p-1 rounded-xl glass-nav-tray"
        aria-label="Primary Navigation"
      >
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              aria-current={isActive ? 'page' : undefined}
              className={`
                relative px-3.5 py-1.5 rounded-lg text-[13.5px] font-medium transition-all duration-150 flex items-center gap-1.5
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]
                ${
                  isActive
                    ? 'glass-pill-active font-semibold shadow-xs'
                    : 'hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5'
                }
              `}
              style={{
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontFamily: "var(--font-sans)",
                letterSpacing: "-0.012em",
              }}
            >
              {isActive && (
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: 'var(--primary-action)' }}
                  aria-hidden="true"
                />
              )}
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Right Actions: Contextual CTA, Theme Switch, and Mobile Toggle */}
      <div className="flex items-center gap-2">
        {/* Optional Contextual Launch Lab CTA (shown only when NOT on /visualizer) */}
        {!isVisualizerPage && (
          <Link
            to="/visualizer"
            className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-xs font-semibold text-white transition-all duration-150 shadow-xs hover:shadow-sm active:translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
            style={{
              backgroundColor: 'var(--primary-action)',
            }}
          >
            <span>Launch Lab</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}

        {/* Liquid-Glass Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-pressed={theme === 'dark'}
          className="w-10 h-10 rounded-lg flex items-center justify-center glass-interactive cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          style={{
            color: 'var(--text-primary)',
          }}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 rotate-0 hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-stone-700 transition-transform duration-200 -rotate-12 hover:rotate-0" />
          )}
        </button>

        {/* Mobile Menu Trigger Button */}
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav-menu"
          aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          title={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          className="md:hidden w-10 h-10 rounded-lg flex items-center justify-center glass-interactive cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          style={{
            color: 'var(--text-primary)',
          }}
        >
          {mobileMenuOpen ? (
            <X className="w-4 h-4 transition-transform duration-150 rotate-90 animate-in" />
          ) : (
            <Menu className="w-4 h-4 transition-transform duration-150" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Drawer Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-[60px] bg-black/20 backdrop-blur-xs z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Menu */}
          <div
            id="mobile-nav-menu"
            ref={mobileMenuRef}
            className="fixed inset-x-0 top-[60px] glass-header border-b p-4 md:hidden z-50 shadow-xl transition-all animate-in fade-in slide-in-from-top-2 duration-150"
          >
            <div className="flex flex-col gap-1.5" role="menu">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    role="menuitem"
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-between min-h-[44px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                    style={{
                      backgroundColor: isActive ? 'var(--primary-subtle)' : 'transparent',
                      color: isActive ? 'var(--primary-action)' : 'var(--text-primary)',
                      fontFamily: "var(--font-sans)",
                      letterSpacing: "-0.012em",
                    }}
                  >
                    <span className="font-medium">{link.label}</span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-[var(--primary-action)]" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Footer Meta */}
            <div
              className="mt-4 pt-3 border-t text-xs flex items-center justify-between"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--text-muted)',
              }}
            >
              <span className="font-mono text-[11px]">C++17 & WebAssembly Engine</span>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-black/5 dark:bg-white/5">
                BFS & Dijkstra
              </span>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default TopNav;
