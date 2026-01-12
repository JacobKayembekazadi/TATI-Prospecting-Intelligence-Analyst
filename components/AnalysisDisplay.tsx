
import React from 'react';

interface AnalysisDisplayProps {
  content: string;
}

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ content }) => {
  // Parsing: Split by '---' and filter out empty segments
  const segments = content.split('---').map(s => s.trim()).filter(Boolean);

  // Helper to detect if a segment is a header
  const isHeader = (text: string) => {
    return text.includes('🎯') || text.includes('📊') || text.includes('🛒') || text.includes('📧') || text.includes('🔍');
  };

  const renderSegment = (text: string, index: number) => {
    if (isHeader(text)) {
      return (
        <h3 key={index} className="text-xl font-black text-blue-900 mb-4 mt-8 flex items-center bg-blue-50/50 p-2 rounded border-l-4 border-blue-600">
          {text}
        </h3>
      );
    }

    return (
      <div key={index} className="space-y-2 mb-4">
        {text.split('\n').map((line, i) => {
          const trimmedLine = line.trim();
          if (!trimmedLine) return <div key={i} className="h-1" />;

          // Handle bullet points (supporting both • and - just in case)
          if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
            return (
              <div key={i} className="flex gap-3 ml-2 text-slate-700">
                <span className="text-blue-500 font-bold">•</span>
                <span>{trimmedLine.replace(/^[•\-*]\s*/, '')}</span>
              </div>
            );
          }

          // Key-Value pairs like "Company: Name"
          if (trimmedLine.includes(':') && trimmedLine.length < 100 && !trimmedLine.startsWith('Subject:')) {
            const [label, ...valueParts] = trimmedLine.split(':');
            const value = valueParts.join(':').trim();
            const isHighPriority = value.includes('🔥') || value.includes('HOT');
            
            return (
              <p key={i} className="text-sm">
                <span className="font-bold text-slate-500 uppercase tracking-tight mr-2">{label}:</span>
                <span className={`font-semibold ${isHighPriority ? 'text-red-600 underline decoration-2 underline-offset-4' : 'text-slate-900'}`}>
                  {value}
                </span>
              </p>
            );
          }

          // Special styling for Outreach Draft Subject
          if (trimmedLine.startsWith('Subject:')) {
            return (
              <div key={i} className="my-4 bg-slate-900 text-white p-3 rounded text-sm font-mono border-l-4 border-blue-400">
                <span className="text-blue-400 font-bold mr-2">SUBJ:</span> {trimmedLine.replace(/^Subject:\s*/, '')}
              </div>
            );
          }

          return <p key={i} className="text-slate-700 leading-relaxed">{trimmedLine}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-xl shadow-lg p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6 border-b-2 border-slate-100 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter">INTELLIGENCE REPORT</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Texas American Trade Inc.</p>
        </div>
        <button 
          onClick={() => {
            navigator.clipboard.writeText(content);
            alert('Copied to clipboard!');
          }}
          className="bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest text-slate-600 transition-all border border-slate-200"
        >
          Copy Raw Data
        </button>
      </div>
      <div className="analysis-content">
        {segments.map((seg, idx) => renderSegment(seg, idx))}
      </div>
    </div>
  );
};
