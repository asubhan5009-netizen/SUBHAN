
import React, { useState } from 'react';
import { ToolType } from './types';
import StudyHub from './components/StudyHub';
import CreativeStudio from './components/CreativeStudio';
import CinemaLab from './components/CinemaLab';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ToolType>(ToolType.STUDY);

  const tabs = [
    { id: ToolType.STUDY, label: 'Study Buddy', icon: '📚' },
    { id: ToolType.IMAGE, label: 'Creative Studio', icon: '🎨' },
    { id: ToolType.VIDEO, label: 'Cinema Lab', icon: '🎬' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-72 bg-white border-b md:border-b-0 md:border-r border-gray-200 p-6 flex flex-col h-screen sticky top-0">
        <div className="mb-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30">
            O
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">OmniGenius</h1>
            <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">AI Multiverse</p>
          </div>
        </div>

        <div className="space-y-2 flex-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-blue-50 text-blue-700 shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-gray-100">
          <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">Student User</p>
              <p className="text-xs text-gray-500 truncate">Free Tier</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen relative">
        <header className="sticky top-0 z-20 glass px-8 py-4 flex items-center justify-between border-b border-gray-200/50">
          <h2 className="text-lg font-bold text-gray-800">
            {tabs.find(t => t.id === activeTab)?.label}
          </h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </button>
          </div>
        </header>

        <div className="p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            {activeTab === ToolType.STUDY && <StudyHub />}
            {activeTab === ToolType.IMAGE && <CreativeStudio />}
            {activeTab === ToolType.VIDEO && <CinemaLab />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
