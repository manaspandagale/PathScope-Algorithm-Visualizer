import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass,
  Moon,
  Sun,
  HelpCircle,
  Rocket,
  Sparkles,
} from 'lucide-react';
import { PRESET_GRAPHS } from '../../data/presetGraphs';

interface TopNavProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  onOpenGuide?: () => void;
  onOpenComingSoon?: () => void;
  onSelectPreset?: (presetId: string) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  theme,
  toggleTheme,
  onOpenGuide,
  onOpenComingSoon,
  onSelectPreset,
}) => {
  const location = useLocation();
  const isVisualizer = location.pathname === '/visualizer';

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Visualizer', path: '/visualizer' },
    { label: 'Algorithms', path: '/algorithms' },
    { label: 'Comparison', path: '/compare' },
    { label: 'Learn', path: '/learn' },
    { label: 'About', path: '/about' },
  ];

  return (
    <header className={`h-16 border-b transition-colors duration-200 px-6 flex items-center justify-between z-30 select-none ${
      theme === 'dark' ? 'border-slate-800 bg-slate-950/95 text-slate-100' : 'border-slate-200 bg-white/95 text-slate-900'
    } backdrop-blur-md`}>
      {/* Branding */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight font-sans">
                PathScope
              </span>
              <span className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                Phase 1
              </span>
            </div>
            <p className={`text-[11px] hidden sm:block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              DAA Algorithm Visualizer
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="hidden lg:flex items-center gap-1 bg-slate-500/10 p-1 rounded-xl">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : theme === 'dark'
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5">
        {/* Preset Selector (Only in Visualizer) */}
        {isVisualizer && onSelectPreset && (
          <div className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
          }`}>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium text-slate-400">Preset:</span>
            <select
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) {
                  onSelectPreset(e.target.value);
                  e.target.value = '';
                }
              }}
              className="bg-transparent font-semibold focus:outline-none cursor-pointer"
            >
              <option value="" disabled className={theme === 'dark' ? 'bg-slate-900 text-slate-400' : 'bg-white text-slate-400'}>
                Load example...
              </option>
              {PRESET_GRAPHS.map((p) => (
                <option key={p.id} value={p.id} className={theme === 'dark' ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-800'}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Roadmap Modal Button */}
        {onOpenComingSoon && (
          <button
            onClick={onOpenComingSoon}
            title="Phase 2 Roadmap"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-900/60 bg-indigo-950/40 hover:bg-indigo-900/50 text-indigo-300 text-xs font-medium transition-colors cursor-pointer"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Roadmap</span>
          </button>
        )}

        {/* Visualizer Guide Button */}
        {onOpenGuide && isVisualizer && (
          <button
            onClick={onOpenGuide}
            title="How to Use Visualizer"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
              theme === 'dark' ? 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300' : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Guide</span>
          </button>
        )}

        {/* Dark / Light Toggle */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
            theme === 'dark' ? 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300' : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-400" />
          )}
        </button>
      </div>
    </header>
  );
};
