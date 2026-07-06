import React from 'react';
import { HelpCircle } from 'lucide-react';
import { SuggestedQuestion } from '../types';

interface SuggestedQuestionsProps {
  questions: SuggestedQuestion[];
}

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ questions }) => {
  return (
    <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs text-left">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-emerald-500" />
          Suggested Clinical Questions
        </h3>
        <span className="text-[8px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-250/30 font-mono">
          Decision Support
        </span>
      </div>

      {questions.length === 0 ? (
        <p className="text-xs text-slate-400 font-semibold italic text-center py-4">
          No additional constitutional follow-up questions needed.
        </p>
      ) : (
        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
          {questions.map((q, idx) => (
            <div 
              key={q.key || idx} 
              className="bg-slate-50 border border-slate-150 p-3.5 rounded-2xl space-y-2 hover:border-emerald-300 transition duration-200"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-[10px] font-black text-slate-800">{q.questionText}</span>
                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full font-mono ${
                  q.priority === 1 
                    ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  {q.priority === 1 ? 'High Priority' : 'Medium'}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-1.5 pt-1">
                {q.options.map((opt, oIdx) => (
                  <div 
                    key={oIdx} 
                    className="bg-white border border-slate-150 p-2 rounded-xl text-[9px] font-semibold text-slate-600 flex items-center gap-2 hover:bg-slate-50 hover:text-slate-800 transition"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span>{opt}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
