
import React, { useState, useEffect, useCallback } from 'react';
import { analyzeIntelligence } from './services/geminiService';
import { AnalysisEntry } from './types';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { EXAMPLE_INPUTS } from './constants';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [history, setHistory] = useState<AnalysisEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load history from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('tati_intel_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHistory(parsed.map((h: any) => ({ ...h, timestamp: new Date(h.timestamp) })));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to local storage
  useEffect(() => {
    localStorage.setItem('tati_intel_history', JSON.stringify(history));
  }, [history]);

  const handleAnalyze = async (textToUse?: string) => {
    const text = textToUse || inputText;
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await analyzeIntelligence(text);
      const newEntry: AnalysisEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        rawInput: text,
        analysis: result,
      };
      setHistory(prev => [newEntry, ...prev]);
      if (!textToUse) setInputText('');
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear your analysis history?")) {
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-xl py-6 px-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center font-black text-2xl border-2 border-white">
              TA
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase">Texas American Trade Inc.</h1>
              <p className="text-xs font-bold tracking-[0.2em] text-blue-400 uppercase">Prospecting Intelligence Analyst</p>
            </div>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-medium">
            <a href="https://www.texasamericantrade.com" target="_blank" className="hover:text-blue-400 transition-colors">Website</a>
            <span className="text-slate-600">|</span>
            <span>+1 (832) 238 1103</span>
            <span className="text-slate-600">|</span>
            <span>Houston, Texas</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input & Controls */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Intelligence Feed</h2>
            <textarea
              className="w-full h-48 p-4 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-slate-800 placeholder:text-slate-400 font-medium"
              placeholder="Paste LinkedIn posts, news articles, permit lists, or earnings reports here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase w-full mb-1">Quick Load Examples:</span>
              {EXAMPLE_INPUTS.map((ex, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputText(ex.text)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-full transition-colors border border-slate-200"
                >
                  {ex.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleAnalyze()}
              disabled={loading || !inputText.trim()}
              className={`w-full mt-6 py-4 rounded-lg font-black uppercase tracking-widest text-sm transition-all shadow-lg active:transform active:scale-95 ${
                loading || !inputText.trim() 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Intelligence...
                </span>
              ) : 'Run Analysis Engine'}
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
                {error}
              </div>
            )}
          </section>

          {/* History Sidebar */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[400px]">
            <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest">Recent Analyses</h2>
              <button 
                onClick={clearHistory}
                className="text-[10px] text-slate-400 hover:text-red-500 font-bold uppercase"
              >
                Clear
              </button>
            </div>
            <div className="overflow-y-auto flex-1">
              {history.length === 0 ? (
                <div className="p-12 text-center text-slate-300 italic text-sm">
                  No previous analyses found.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {history.map((entry) => (
                    <button
                      key={entry.id}
                      onClick={() => {/* Potentially scroll into view or re-focus result */}}
                      className="w-full p-4 text-left hover:bg-slate-50 transition-colors group"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-bold text-blue-500 uppercase">
                          {entry.timestamp.toLocaleDateString()}
                        </span>
                        <span className="text-[10px] text-slate-400 group-hover:text-slate-600">
                          {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-700 truncate">
                        {entry.rawInput.substring(0, 60)}...
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Output */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {history.length > 0 ? (
            <div className="space-y-12 pb-24">
              {history.map((entry, index) => (
                <div key={entry.id} className={index === 0 ? "" : "opacity-60 hover:opacity-100 transition-opacity"}>
                  <AnalysisDisplay content={entry.analysis} />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full min-h-[500px] border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-12 text-center text-slate-400">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-500 mb-2">Ready for Intelligence</h3>
              <p className="max-w-xs text-sm">
                Paste raw oilfield intel on the left to generate qualified leads and outreach drafts.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-100 border-t border-slate-200 py-4 px-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
        &copy; {new Date().getFullYear()} Texas American Trade Inc. &bull; Internal Sales Support Tool &bull; Houston, TX
      </footer>
    </div>
  );
};

export default App;
