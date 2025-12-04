// // filepath: src/components/QuestionsPanel.tsx
// import React, { useEffect, useState } from "react";

// type QAData = Record<string, string[] | string>;

// function toList(v: string[] | string | undefined | null): string[] {
//   if (!v) return [];
//   return Array.isArray(v) ? v : [v];
// }

// export default function QuestionsPanel() {
//   const [data, setData] = useState<QAData | null>(null);

//   useEffect(() => {
//     const handler = (e: Event) => setData((e as CustomEvent).detail as QAData);
//     window.addEventListener("questions:update", handler as EventListener);
//     return () => window.removeEventListener("questions:update", handler as EventListener);
//   }, []);

//   if (!data) {
//     return (
//       <div className="card p-3 text-sm text-[var(--muted)]">
//         Upload a resume with <b>Upload &amp; Parse</b> to generate questions.
//       </div>
//     );
//   }

//   const entries = Object.entries(data);
//   if (entries.length === 0) {
//     return <div className="card p-3 text-sm text-[var(--muted)]">No questions generated.</div>;
//   }

//   return (
//     <div className="space-y-3">
//       {entries.map(([topic, qs]) => (
//         <div key={topic} className="card p-3">
//           <div className="font-semibold mb-2">{topic}</div>
//           <ul className="list-disc pl-5 text-sm space-y-1">
//             {toList(qs).map((q, i) => (
//               <li key={i}>{q}</li>
//             ))}
//           </ul>
//         </div>
//       ))}
//     </div>
//   );
// }




import React, { useEffect, useState } from "react";

type QAData = Record<string, string[] | string>;

function toList(v: string[] | string | undefined | null): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

export default function QuestionsPanel() {
  const [data, setData] = useState<QAData | null>(null);
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handler = (e: Event) => {
      const newData = (e as CustomEvent).detail as QAData;
      setData(newData);
      // Auto-expand all topics when new data arrives
      setExpandedTopics(new Set(Object.keys(newData)));
    };
    window.addEventListener("questions:update", handler as EventListener);
    return () => window.removeEventListener("questions:update", handler as EventListener);
  }, []);

  const toggleTopic = (topic: string) => {
    setExpandedTopics(prev => {
      const newSet = new Set(prev);
      if (newSet.has(topic)) {
        newSet.delete(topic);
      } else {
        newSet.add(topic);
      }
      return newSet;
    });
  };

  if (!data) {
    return (
      <div className="glass-empty rounded-xl p-6 text-center border border-white/10">
        <style>{`
          .glass-empty {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
          }
          .glass-question-card {
            background: rgba(67, 97, 238, 0.08);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(67, 97, 238, 0.2);
            transition: all 0.3s ease;
          }
          .glass-question-card:hover {
            background: rgba(67, 97, 238, 0.12);
            border-color: rgba(67, 97, 238, 0.4);
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(67, 97, 238, 0.15);
          }
          .question-item {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            transition: all 0.2s ease;
          }
          .question-item:hover {
            background: rgba(255, 255, 255, 0.08);
            transform: translateX(4px);
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeInUp {
            animation: fadeInUp 0.4s ease-out backwards;
          }
        `}</style>
        <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-gray-400 text-sm font-medium mb-2">No Questions Yet</p>
        <p className="text-gray-500 text-xs">
          Upload a resume with <span className="text-[#4361EE] font-semibold">Upload & Parse</span> to generate interview questions
        </p>
      </div>
    );
  }

  const entries = Object.entries(data);
  if (entries.length === 0) {
    return (
      <div className="glass-empty rounded-xl p-6 text-center border border-white/10">
        <p className="text-gray-400 text-sm">No questions generated.</p>
      </div>
    );
  }

  const totalQuestions = entries.reduce((sum, [_, qs]) => sum + toList(qs).length, 0);

  return (
    <div className="space-y-3">
      <style>{`
        .glass-empty {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .glass-question-card {
          background: rgba(67, 97, 238, 0.08);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(67, 97, 238, 0.2);
          transition: all 0.3s ease;
        }
        .glass-question-card:hover {
          background: rgba(67, 97, 238, 0.12);
          border-color: rgba(67, 97, 238, 0.4);
          box-shadow: 0 8px 20px rgba(67, 97, 238, 0.15);
        }
        .question-item {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          transition: all 0.2s ease;
        }
        .question-item:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateX(4px);
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.4s ease-out backwards;
        }
        .chevron-icon {
          transition: transform 0.3s ease;
        }
        .chevron-icon.expanded {
          transform: rotate(180deg);
        }
      `}</style>

      {/* Summary Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#4361EE] animate-pulse"></div>
          <span className="text-sm text-gray-400">
            <span className="font-bold text-[#4361EE]">{totalQuestions}</span> questions generated
          </span>
        </div>
      </div>

      {/* Question Cards */}
      {entries.map(([topic, qs], index) => {
        const questions = toList(qs);
        const isExpanded = expandedTopics.has(topic);
        
        return (
          <div
            key={topic}
            className="glass-question-card rounded-xl overflow-hidden animate-fadeInUp"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Topic Header */}
            <button
              onClick={() => toggleTopic(topic)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#4361EE]/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#4361EE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-white text-sm">{topic}</div>
                  <div className="text-xs text-gray-400">{questions.length} question{questions.length !== 1 ? 's' : ''}</div>
                </div>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 chevron-icon ${isExpanded ? 'expanded' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Questions List */}
            {isExpanded && (
              <div className="px-4 pb-4 space-y-2">
                {questions.map((q, i) => (
                  <div
                    key={i}
                    className="question-item rounded-lg px-4 py-3 border border-white/5"
                    style={{ animationDelay: `${(index * 0.1) + (i * 0.05)}s` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#4361EE]/20 flex items-center justify-center mt-0.5">
                        <span className="text-xs font-bold text-[#4361EE]">{i + 1}</span>
                      </div>
                      <p className="text-sm text-gray-200 leading-relaxed flex-1">{q}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}