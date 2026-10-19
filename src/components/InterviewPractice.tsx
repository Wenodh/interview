import React, { useState, useEffect } from 'react';

export interface QuestionItem {
  id: string;
  round: string; // e.g. 'Round 1: Technical & Coding' | 'Round 2: Resume & Project'
  category: string; // e.g. 'JavaScript', 'React.js', 'Coding Challenges', 'Project Experience'
  type: 'conceptual' | 'coding' | 'project-discussion';
  title: string;
  badge: 'Reported Question' | 'Linked Reference' | 'Supplementary Practice Question';
  sourceUrl?: string;
  sourceNote?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  summary: string;
  hints?: string[];
  explanation: string;
  codeSnippet?: string;
  sampleInputOutput?: string;
  acceptanceCriteria?: string[];
  edgeCases?: string[];
  testChecklist?: string[];
  followUpQuestions?: string[];
}

interface InterviewPracticeProps {
  storagePrefix?: string;
  questions: QuestionItem[];
}

type PracticeStatus = 'Not Started' | 'In Progress' | 'Completed';

export default function InterviewPractice({ storagePrefix = 'mphasis_prep_', questions }: InterviewPracticeProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedRound, setSelectedRound] = useState<string>('All');
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [visibleHintCount, setVisibleHintCount] = useState<number>(0);
  const [userNotes, setUserNotes] = useState<Record<string, string>>({});
  const [statusMap, setStatusMap] = useState<Record<string, PracticeStatus>>({});
  const [currentNoteInput, setCurrentNoteInput] = useState<string>('');

  // Filter questions based on selected round
  const filteredQuestions = questions.filter(
    (q) => selectedRound === 'All' || q.round === selectedRound
  );

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];

  // Load localStorage data on mount
  useEffect(() => {
    try {
      const loadedNotes: Record<string, string> = {};
      const loadedStatus: Record<string, PracticeStatus> = {};

      questions.forEach((q) => {
        const note = localStorage.getItem(`${storagePrefix}note_${q.id}`);
        if (note) loadedNotes[q.id] = note;

        const stat = localStorage.getItem(`${storagePrefix}status_${q.id}`);
        if (stat === 'Not Started' || stat === 'In Progress' || stat === 'Completed') {
          loadedStatus[q.id] = stat as PracticeStatus;
        } else {
          loadedStatus[q.id] = 'Not Started';
        }
      });

      setUserNotes(loadedNotes);
      setStatusMap(loadedStatus);
    } catch (e) {
      console.warn('localStorage access failed or unavailable:', e);
    }
  }, [questions, storagePrefix]);

  // Sync current note input when current question changes
  useEffect(() => {
    if (currentQ) {
      setCurrentNoteInput(userNotes[currentQ.id] || '');
      setShowExplanation(false);
      setVisibleHintCount(0);
    }
  }, [currentIndex, selectedRound, currentQ?.id]);

  const handleSaveNote = (text: string) => {
    if (!currentQ) return;
    setCurrentNoteInput(text);
    setUserNotes((prev) => ({ ...prev, [currentQ.id]: text }));
    try {
      localStorage.setItem(`${storagePrefix}note_${currentQ.id}`, text);
    } catch (e) {
      console.warn('Failed to save note to localStorage', e);
    }
  };

  const handleStatusChange = (status: PracticeStatus) => {
    if (!currentQ) return;
    setStatusMap((prev) => ({ ...prev, [currentQ.id]: status }));
    try {
      localStorage.setItem(`${storagePrefix}status_${currentQ.id}`, status);
    } catch (e) {
      console.warn('Failed to save status to localStorage', e);
    }
  };

  const handleResetProgress = () => {
    if (confirm('Are you sure you want to reset all practice notes and progress status?')) {
      try {
        questions.forEach((q) => {
          localStorage.removeItem(`${storagePrefix}note_${q.id}`);
          localStorage.removeItem(`${storagePrefix}status_${q.id}`);
        });
        setUserNotes({});
        const resetMap: Record<string, PracticeStatus> = {};
        questions.forEach((q) => (resetMap[q.id] = 'Not Started'));
        setStatusMap(resetMap);
        setCurrentNoteInput('');
      } catch (e) {
        console.warn('Failed to clear localStorage', e);
      }
    }
  };

  const completedCount = questions.filter((q) => statusMap[q.id] === 'Completed').length;
  const inProgressCount = questions.filter((q) => statusMap[q.id] === 'In Progress').length;

  const roundsList = ['All', ...Array.from(new Set(questions.map((q) => q.round)))];

  if (!currentQ) {
    return <div style={{ padding: '1rem', color: '#94a3b8' }}>No questions available for selected filters.</div>;
  }

  return (
    <div style={containerStyle}>
      {/* Header & Stats Banner */}
      <div style={headerStyle}>
        <div>
          <h3 style={{ margin: 0, color: '#38bdf8', fontSize: '1.25rem' }}>⚡ Interactive Interview Practice Mode</h3>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#94a3b8' }}>
            Attempt your answer first, reveal hints gradually, draft your response, and track your practice status.
          </p>
        </div>
        <div style={statsStyle}>
          <span style={statBadgeStyle('#22c55e')}>Completed: {completedCount}/{questions.length}</span>
          <span style={statBadgeStyle('#eab308')}>In Progress: {inProgressCount}</span>
          <button onClick={handleResetProgress} style={resetBtnStyle}>Reset All Progress</button>
        </div>
      </div>

      {/* Filter and Navigation Controls */}
      <div style={controlsRowStyle}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <label style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Filter Round:</label>
          <select
            value={selectedRound}
            onChange={(e) => {
              setSelectedRound(e.target.value);
              setCurrentIndex(0);
            }}
            style={selectStyle}
          >
            {roundsList.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => prev - 1)}
            style={navBtnStyle(currentIndex === 0)}
          >
            ← Previous
          </button>
          <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
            Question {currentIndex + 1} of {filteredQuestions.length}
          </span>
          <button
            disabled={currentIndex === filteredQuestions.length - 1}
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            style={navBtnStyle(currentIndex === filteredQuestions.length - 1)}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Main Question Card */}
      <div style={questionCardStyle}>
        {/* Badges & Meta */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' }}>
          <span style={badgeStyle(currentQ.badge)}>{currentQ.badge}</span>
          <span style={tagStyle}>{currentQ.category}</span>
          <span style={tagStyle}>{currentQ.round}</span>
          {currentQ.difficulty && <span style={difficultyStyle(currentQ.difficulty)}>Difficulty: {currentQ.difficulty}</span>}
          {currentQ.type && <span style={tagStyle}>Type: {currentQ.type}</span>}
        </div>

        {/* Question Title */}
        <h4 style={{ fontSize: '1.2rem', margin: '0 0 0.5rem 0', color: '#f8fafc' }}>
          {currentIndex + 1}. {currentQ.title}
        </h4>

        {/* Source Note or URL if any */}
        {currentQ.sourceUrl && (
          <p style={{ fontSize: '0.85rem', color: '#38bdf8', margin: '0 0 0.75rem 0' }}>
            🔗 Reference Link: <a href={currentQ.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', textDecoration: 'underline' }}>{currentQ.sourceUrl}</a>
            {currentQ.sourceNote && <span style={{ color: '#94a3b8', marginLeft: '0.5rem' }}>({currentQ.sourceNote})</span>}
          </p>
        )}

        {/* Question Summary / Prompt */}
        <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '8px', border: '1px solid #334155', marginBottom: '1rem', lineHeight: '1.5' }}>
          {currentQ.summary}
        </div>

        {/* Practice Status Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', padding: '0.75rem', background: '#0f172a', borderRadius: '6px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0' }}>My Practice Status:</span>
          {(['Not Started', 'In Progress', 'Completed'] as PracticeStatus[]).map((st) => (
            <label key={st} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', fontSize: '0.85rem', color: '#f8fafc' }}>
              <input
                type="radio"
                name={`status-${currentQ.id}`}
                checked={(statusMap[currentQ.id] || 'Not Started') === st}
                onChange={() => handleStatusChange(st)}
              />
              {st}
            </label>
          ))}
        </div>

        {/* Progressive Hints Section */}
        {currentQ.hints && currentQ.hints.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#facc15' }}>💡 Progressive Hints ({visibleHintCount}/{currentQ.hints.length})</span>
              {visibleHintCount < currentQ.hints.length && (
                <button
                  onClick={() => setVisibleHintCount((prev) => prev + 1)}
                  style={hintBtnStyle}
                >
                  Show Hint {visibleHintCount + 1}
                </button>
              )}
            </div>
            {currentQ.hints.slice(0, visibleHintCount).map((hint, idx) => (
              <div key={idx} style={hintBoxStyle}>
                <strong>Hint {idx + 1}:</strong> {hint}
              </div>
            ))}
          </div>
        )}

        {/* Answer Draft & Notes Input */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem', color: '#cbd5e1' }}>
            📝 My Answer Draft / Personal Preparation Notes:
          </label>
          <textarea
            rows={4}
            value={currentNoteInput}
            onChange={(e) => handleSaveNote(e.target.value)}
            placeholder="Type your notes or attempt your answer here (saved automatically to browser storage)..."
            style={textareaStyle}
          />
        </div>

        {/* Reveal Explanation Toggle Button */}
        <div style={{ marginTop: '1rem' }}>
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            style={explanationToggleBtnStyle(showExplanation)}
          >
            {showExplanation ? '🙈 Hide Verified Solution & Explanation' : '👁️ Reveal Solution, Key Concepts & Answer Framework'}
          </button>
        </div>

        {/* Revealed Explanation & Structured Content */}
        {showExplanation && (
          <div style={revealedBoxStyle}>
            <h5 style={{ margin: '0 0 0.5rem 0', color: '#38bdf8', fontSize: '1rem' }}>Key Concepts & Answer Framework</h5>
            <div style={{ whiteSpace: 'pre-line', lineHeight: '1.6', fontSize: '0.95rem' }}>
              {currentQ.explanation}
            </div>

            {currentQ.codeSnippet && (
              <div style={{ marginTop: '1rem' }}>
                <strong style={{ color: '#38bdf8' }}>Code Example / Reference Implementation:</strong>
                <pre style={preStyle}><code>{currentQ.codeSnippet}</code></pre>
              </div>
            )}

            {currentQ.sampleInputOutput && (
              <div style={{ marginTop: '0.75rem' }}>
                <strong style={{ color: '#cbd5e1' }}>Sample Input / Output:</strong>
                <pre style={preStyle}><code>{currentQ.sampleInputOutput}</code></pre>
              </div>
            )}

            {currentQ.acceptanceCriteria && currentQ.acceptanceCriteria.length > 0 && (
              <div style={{ marginTop: '0.75rem' }}>
                <strong style={{ color: '#4ade80' }}>Acceptance Criteria & Test Requirements:</strong>
                <ul style={{ margin: '0.35rem 0 0 1.25rem', padding: 0 }}>
                  {currentQ.acceptanceCriteria.map((item, i) => (
                    <li key={i} style={{ marginBottom: '0.25rem' }}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {currentQ.edgeCases && currentQ.edgeCases.length > 0 && (
              <div style={{ marginTop: '0.75rem' }}>
                <strong style={{ color: '#f87171' }}>Edge Cases to Handle:</strong>
                <ul style={{ margin: '0.35rem 0 0 1.25rem', padding: 0 }}>
                  {currentQ.edgeCases.map((item, i) => (
                    <li key={i} style={{ marginBottom: '0.25rem' }}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {currentQ.testChecklist && currentQ.testChecklist.length > 0 && (
              <div style={{ marginTop: '0.75rem' }}>
                <strong style={{ color: '#facc15' }}>Test Checklist:</strong>
                <ul style={{ margin: '0.35rem 0 0 1.25rem', padding: 0 }}>
                  {currentQ.testChecklist.map((item, i) => (
                    <li key={i} style={{ marginBottom: '0.25rem' }}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {currentQ.followUpQuestions && currentQ.followUpQuestions.length > 0 && (
              <div style={{ marginTop: '0.75rem' }}>
                <strong style={{ color: '#c084fc' }}>Potential Interview Follow-up Questions:</strong>
                <ul style={{ margin: '0.35rem 0 0 1.25rem', padding: 0 }}>
                  {currentQ.followUpQuestions.map((item, i) => (
                    <li key={i} style={{ marginBottom: '0.25rem' }}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Styling objects
const containerStyle: React.CSSProperties = {
  background: '#1e293b',
  borderRadius: '10px',
  padding: '1.25rem',
  border: '1px solid #334155',
  color: '#f8fafc',
  margin: '1.5rem 0',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '1rem',
  borderBottom: '1px solid #334155',
  paddingBottom: '1rem',
  marginBottom: '1rem',
};

const statsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
  alignItems: 'center',
  flexWrap: 'wrap',
};

const statBadgeStyle = (color: string): React.CSSProperties => ({
  background: 'rgba(15, 23, 42, 0.8)',
  border: `1px solid ${color}`,
  color: color,
  padding: '0.25rem 0.6rem',
  borderRadius: '4px',
  fontSize: '0.75rem',
  fontWeight: 600,
});

const resetBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid #ef4444',
  color: '#f87171',
  padding: '0.25rem 0.6rem',
  borderRadius: '4px',
  fontSize: '0.75rem',
  cursor: 'pointer',
};

const controlsRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '1rem',
  marginBottom: '1rem',
};

const selectStyle: React.CSSProperties = {
  background: '#0f172a',
  color: '#f8fafc',
  border: '1px solid #475569',
  padding: '0.35rem 0.6rem',
  borderRadius: '6px',
  fontSize: '0.85rem',
  outline: 'none',
};

const navBtnStyle = (disabled: boolean): React.CSSProperties => ({
  background: disabled ? '#334155' : '#0284c7',
  color: disabled ? '#94a3b8' : '#ffffff',
  border: 'none',
  padding: '0.35rem 0.75rem',
  borderRadius: '6px',
  fontSize: '0.85rem',
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontWeight: 500,
});

const questionCardStyle: React.CSSProperties = {
  background: '#0f172a',
  padding: '1.25rem',
  borderRadius: '8px',
  border: '1px solid #334155',
};

const badgeStyle = (badge: string): React.CSSProperties => {
  let bg = '#0284c7';
  if (badge === 'Reported Question') bg = '#16a34a';
  if (badge === 'Linked Reference') bg = '#d97706';
  if (badge === 'Supplementary Practice Question') bg = '#9333ea';
  return {
    background: bg,
    color: '#ffffff',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 600,
  };
};

const tagStyle: React.CSSProperties = {
  background: '#1e293b',
  color: '#cbd5e1',
  border: '1px solid #475569',
  padding: '0.2rem 0.5rem',
  borderRadius: '4px',
  fontSize: '0.75rem',
};

const difficultyStyle = (diff: string): React.CSSProperties => {
  let col = '#4ade80';
  if (diff === 'Medium') col = '#facc15';
  if (diff === 'Hard') col = '#f87171';
  return {
    background: '#1e293b',
    color: col,
    border: `1px solid ${col}`,
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 600,
  };
};

const textareaStyle: React.CSSProperties = {
  width: '100%',
  background: '#1e293b',
  color: '#f8fafc',
  border: '1px solid #475569',
  borderRadius: '6px',
  padding: '0.75rem',
  fontSize: '0.9rem',
  boxSizing: 'border-box',
  outline: 'none',
};

const hintBtnStyle: React.CSSProperties = {
  background: '#854d0e',
  color: '#fef08a',
  border: '1px solid #ca8a04',
  padding: '0.25rem 0.5rem',
  borderRadius: '4px',
  fontSize: '0.75rem',
  cursor: 'pointer',
};

const hintBoxStyle: React.CSSProperties = {
  background: '#1e293b',
  borderLeft: '4px solid #facc15',
  padding: '0.5rem 0.75rem',
  fontSize: '0.85rem',
  marginBottom: '0.5rem',
  borderRadius: '0 4px 4px 0',
};

const explanationToggleBtnStyle = (active: boolean): React.CSSProperties => ({
  width: '100%',
  background: active ? '#334155' : '#0369a1',
  color: '#ffffff',
  border: 'none',
  padding: '0.6rem',
  borderRadius: '6px',
  fontWeight: 600,
  cursor: 'pointer',
  fontSize: '0.9rem',
  transition: 'background 0.2s',
});

const revealedBoxStyle: React.CSSProperties = {
  marginTop: '1rem',
  padding: '1rem',
  background: '#1e293b',
  borderRadius: '6px',
  border: '1px solid #38bdf8',
};

const preStyle: React.CSSProperties = {
  background: '#0f172a',
  padding: '0.75rem',
  borderRadius: '6px',
  overflowX: 'auto',
  fontSize: '0.85rem',
  margin: '0.35rem 0 0 0',
  border: '1px solid #334155',
};
