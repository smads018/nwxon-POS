
import React from 'react';
import { CompanySettings, Language } from '../types';

interface Props {
  currentView: string;
  setView: (v: string) => void;
  isDelivery: boolean;
  t: any;
  settings: CompanySettings;
}

const Sidebar: React.FC<Props> = ({ currentView, setView, isDelivery, t, settings }) => {
  const menuItems = [
    { id: 'pos', icon: 'fa-solid fa-cash-register', label: t.pos },
    { id: 'inventory', icon: 'fa-solid fa-boxes-stacked', label: t.inventory },
    ...(isDelivery ? [
      { id: 'kitchen', icon: 'fa-solid fa-utensils', label: t.kitchen },
      { id: 'delivery', icon: 'fa-solid fa-truck-fast', label: t.delivery },
    ] : []),
    { id: 'reports', icon: 'fa-solid fa-chart-line', label: t.reports },
    { id: 'settings', icon: 'fa-solid fa-gear', label: t.settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full z-10">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-black">
          N
        </div>
        <div className="leading-tight">
          <p className="text-white font-bold tracking-tight">NEXUS PRO</p>
          <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Enterprise Edition</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              currentView === item.id 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
              : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <i className={`${item.icon} text-lg ${currentView === item.id ? 'text-indigo-200' : 'text-slate-500'}`}></i>
            <span className={settings.language === Language.UR ? 'urdu-font text-base' : ''}>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-xl p-4">
          <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">System Status</p>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs text-white">Database Connected</span>
          </div>
          <button className="w-full bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 py-2 rounded-lg text-xs font-bold transition-colors">
            FORCE SYNC NOW
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
