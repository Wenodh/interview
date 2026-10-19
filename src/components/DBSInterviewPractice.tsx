import React, { useState, useEffect } from 'react';
import {
  REPORTED_CONCEPTUAL_QUESTIONS,
  SUPPLEMENTARY_MCQS,
  COMPARISON_EXERCISES,
  ConceptualQuestion,
  MCQQuestion,
  SourceClassification,
} from '../data/dbsQuestions';
import RandomTeamGenerator from './RandomTeamGenerator';

type TabType =
  | 'overview'
  | 'conceptual'
  | 'mcq'
  | 'coding'
  | 'revision'
  | 'bookmarks'
  | 'incomplete';

type PracticeStatus = 'Not Started' | 'In Progress' | 'Completed';

interface WrittenFeedback {
  score: number;
  wordCount: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  feedbackMsg: string;
}

export default function DBSInterviewPractice() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Question navigation state
  const [conceptualIndex, setConceptualIndex] = useState<number>(0);
  const [mcqIndex, setMcqIndex] = useState<number>(0);

  // Practice state tracking maps
  const [userNotes, setUserNotes] = useState<Record<string, string>>({});
  const [statusMap, setStatusMap] = useState<Record<string, PracticeStatus>>({});
  const [bookmarkMap, setBookmarkMap] = useState<Record<string, boolean>>({});
  const [incorrectMap, setIncorrectMap] = useState<Record<string, boolean>>({});

  // UI toggle states
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [visibleHintCount, setVisibleHintCount] = useState<number>(0);
  const [currentNoteInput, setCurrentNoteInput] = useState<string>('');
  const [writtenFeedback, setWrittenFeedback] = useState<WrittenFeedback | null>(null);

  // MCQ state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [mcqSubmitted, setMcqSubmitted] = useState<boolean>(false);

  const STORAGE_PREFIX = 'dbs_prep_';

  // All question IDs combined
  const allConceptual = REPORTED_CONCEPTUAL_QUESTIONS;
  const allMCQs = SUPPLEMENTARY_MCQS;

  // Load localStorage on mount safely
  useEffect(() => {
    try {
      const loadedNotes: Record<string, string> = {};
      const loadedStatus: Record<string, PracticeStatus> = {};
      const loadedBookmarks: Record<string, boolean> = {};
      const loadedIncorrect: Record<string, boolean> = {};

      const allIds = [
        ...allConceptual.map((q) => q.id),
        ...allMCQs.map((q) => q.id),
        'dbs_rtg_coding',
      ];

      allIds.forEach((id) => {
        const note = localStorage.getItem(`${STORAGE_PREFIX}note_${id}`);
        if (note) loadedNotes[id] = note;

        const stat = localStorage.getItem(`${STORAGE_PREFIX}status_${id}`);
        if (stat === 'Not Started' || stat === 'In Progress' || stat === 'Completed') {
          loadedStatus[id] = stat as PracticeStatus;
        } else {
          loadedStatus[id] = 'Not Started';
        }

        const bkmk = localStorage.getItem(`${STORAGE_PREFIX}bookmark_${id}`);
        loadedBookmarks[id] = bkmk === 'true';

        const inc = localStorage.getItem(`${STORAGE_PREFIX}incorrect_${id}`);
        loadedIncorrect[id] = inc === 'true';
      });

      setUserNotes(loadedNotes);
      setStatusMap(loadedStatus);
      setBookmarkMap(loadedBookmarks);
      setIncorrectMap(loadedIncorrect);
    } catch (e) {
      console.warn('localStorage unavailable or restricted:', e);
    }
  }, []);

  // Current Question getters
  const currentConceptual = allConceptual[conceptualIndex] || allConceptual[0];
  const currentMCQ = allMCQs[mcqIndex] || allMCQs[0];

  // Sync draft note and resets when switching conceptual question
  useEffect(() => {
    if (currentConceptual) {
      setCurrentNoteInput(userNotes[currentConceptual.id] || '');
      setShowExplanation(false);
      setVisibleHintCount(0);
      setWrittenFeedback(null);
    }
  }, [conceptualIndex, currentConceptual?.id]);

  // Sync MCQ state on index change
  useEffect(() => {
    setSelectedOption(null);
    setMcqSubmitted(false);
  }, [mcqIndex]);

  // Handlers for persistence
  const handleSaveNote = (id: string, text: string) => {
    setCurrentNoteInput(text);
    setUserNotes((prev) => ({ ...prev, [id]: text }));
    try {
      localStorage.setItem(`${STORAGE_PREFIX}note_${id}`, text);
    } catch (e) {
      console.warn('Failed to persist note:', e);
    }
  };

  const handleStatusChange = (id: string, status: PracticeStatus) => {
    setStatusMap((prev) => ({ ...prev, [id]: status }));
    try {
      localStorage.setItem(`${STORAGE_PREFIX}status_${id}`, status);
    } catch (e) {
      console.warn('Failed to persist status:', e);
    }
  };

  const handleToggleBookmark = (id: string) => {
    const nextVal = !bookmarkMap[id];
    setBookmarkMap((prev) => ({ ...prev, [id]: nextVal }));
    try {
      localStorage.setItem(`${STORAGE_PREFIX}bookmark_${id}`, String(nextVal));
    } catch (e) {
      console.warn('Failed to persist bookmark:', e);
    }
  };

  const handleResetAllProgress = () => {
    if (confirm('Are you sure you want to reset all DBS Bank practice progress, notes, and bookmarks?')) {
      try {
        const allIds = [
          ...allConceptual.map((q) => q.id),
          ...allMCQs.map((q) => q.id),
          'dbs_rtg_coding',
        ];
        allIds.forEach((id) => {
          localStorage.removeItem(`${STORAGE_PREFIX}note_${id}`);
          localStorage.removeItem(`${STORAGE_PREFIX}status_${id}`);
          localStorage.removeItem(`${STORAGE_PREFIX}bookmark_${id}`);
          localStorage.removeItem(`${STORAGE_PREFIX}incorrect_${id}`);
        });

        setUserNotes({});
        const resetStatus: Record<string, PracticeStatus> = {};
        allIds.forEach((id) => (resetStatus[id] = 'Not Started'));
        setStatusMap(resetStatus);
        setBookmarkMap({});
        setIncorrectMap({});
        setCurrentNoteInput('');
      } catch (e) {
        console.warn('Failed to clear progress:', e);
      }
    }
  };

  // Written Answer Evaluation Heuristic
  const handleEvaluateWrittenAnswer = () => {
    if (!currentConceptual || !currentNoteInput.trim()) return;

    const words = currentNoteInput.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // Domain keywords to match against user text
    const keywordBank: Record<string, string[]> = {
      dbs_q1: ['singleton', 'shared', 'modulefederationplugin', 'requiredversion', 'hook', 'dispatcher', 'webpack'],
      dbs_q2: ['module federation', 'remoteentry', 'runtime', 'host', 'remote', 'suspense', 'lazy'],
      dbs_q3: ['tree shaking', 'es module', 'import', 'export', 'sideeffects', 'dead code', 'ast'],
      dbs_q4: ['lazy', 'loading', 'intersection observer', 'viewport', 'lcp', 'viewport', 'cls'],
      dbs_q5: ['usestate', 'local', 'colocation', 'functional update', 'context', 'encapsulation'],
      dbs_q6: ['higher-order', 'component', 'props', 'displayname', 'wrapper', 'hooks'],
      dbs_q7: ['rewrite', 'index.html', '404', 'fallback', 'nginx', 'history', 'pushstate'],
      dbs_q8: ['watcher', 'worker', 'takelatest', 'takeevery', 'call', 'put', 'generator'],
      dbs_q9: ['hydration', 'hydrateroot', 'ssr', 'event listener', 'mismatch', 'server'],
    };

    const targetKeywords = keywordBank[currentConceptual.id] || ['react', 'javascript', 'performance'];
    const textLower = currentNoteInput.toLowerCase();

    const matched = targetKeywords.filter((kw) => textLower.includes(kw));
    const missing = targetKeywords.filter((kw) => !textLower.includes(kw));

    let score = 0;
    if (wordCount >= 20) score += 40;
    else if (wordCount >= 10) score += 20;

    score += Math.round((matched.length / targetKeywords.length) * 60);

    let feedbackMsg = '';
    if (score >= 80) {
      feedbackMsg = ' Excellent draft! You included core technical terminology and articulated the concept clearly.';
    } else if (score >= 50) {
      feedbackMsg = ' Solid response framework! Consider adding missing technical keywords to strengthen your explanation.';
    } else {
      feedbackMsg = ' Preliminary attempt. Expand your written draft with key technical terms and concrete code examples.';
    }

    setWrittenFeedback({
      score,
      wordCount,
      matchedKeywords: matched,
      missingKeywords: missing,
      feedbackMsg,
    });
  };

  // MCQ answer submission
  const handleMCQSubmit = () => {
    if (selectedOption === null || !currentMCQ) return;

    setMcqSubmitted(true);
    const isCorrect = selectedOption === currentMCQ.correctAnswerIndex;

    if (isCorrect) {
      handleStatusChange(currentMCQ.id, 'Completed');
      // Clear incorrect status
      setIncorrectMap((prev) => ({ ...prev, [currentMCQ.id]: false }));
      try {
        localStorage.setItem(`${STORAGE_PREFIX}incorrect_${currentMCQ.id}`, 'false');
      } catch (e) {}
    } else {
      handleStatusChange(currentMCQ.id, 'In Progress');
      setIncorrectMap((prev) => ({ ...prev, [currentMCQ.id]: true }));
      try {
        localStorage.setItem(`${STORAGE_PREFIX}incorrect_${currentMCQ.id}`, 'true');
      } catch (e) {}
    }
  };

  // Stats calculations
  const totalItems = allConceptual.length + allMCQs.length + 1; // +1 for coding challenge
  const completedCount = Object.values(statusMap).filter((s) => s === 'Completed').length;
  const inProgressCount = Object.values(statusMap).filter((s) => s === 'In Progress').length;
  const bookmarkedCount = Object.values(bookmarkMap).filter(Boolean).length;
  const incorrectCount = Object.values(incorrectMap).filter(Boolean).length;

  return (
    <div style={containerStyle}>
      {/* Header Banner */}
      <div style={headerStyle}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.4rem' }}>🏦</span>
            <h2 style={{ margin: 0, color: '#38bdf8', fontSize: '1.35rem' }}>
              DBS Bank → React Developer Interview Preparation
            </h2>
          </div>
          <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
            Candidate-reported interview questions, supplementary MCQs, Random Team Generator coding challenge, and topic revision.
          </p>
        </div>

        <div style={statsBoxStyle}>
          <span style={statBadgeStyle('#22c55e')}>Completed: {completedCount}/{totalItems}</span>
          <span style={statBadgeStyle('#eab308')}>In Progress: {inProgressCount}</span>
          <span style={statBadgeStyle('#38bdf8')}>Bookmarked: {bookmarkedCount}</span>
          {incorrectCount > 0 && <span style={statBadgeStyle('#f87171')}>Needs Revision: {incorrectCount}</span>}
          <button onClick={handleResetAllProgress} style={resetBtnStyle}>Reset Progress</button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={tabRowStyle}>
        {[
          { id: 'overview', label: '📋 Overview' },
          { id: 'conceptual', label: `🧠 Conceptual (${allConceptual.length})` },
          { id: 'mcq', label: `📝 MCQ Practice (${allMCQs.length})` },
          { id: 'coding', label: '💻 Coding Challenge' },
          { id: 'revision', label: '🔄 Topic Revision' },
          { id: 'bookmarks', label: `🔖 Bookmarked (${bookmarkedCount})` },
          { id: 'incomplete', label: `⏳ Incomplete (${totalItems - completedCount})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            style={tabBtnStyle(activeTab === tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Disclaimer */}
      <div style={disclaimerBoxStyle}>
        ℹ️ <strong>Disclaimer:</strong> This is a preparation guide based on candidate-shared interview topics, supplemented with educational explanations and practice material. It is not an official DBS Bank question paper. Actual interview questions and assessment formats may vary.
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={cardStyle}>
          <h3 style={{ color: '#38bdf8', marginTop: 0 }}>📌 Experience Overview & Preparation Roadmap</h3>
          <div style={metaTableGrid}>
            <div style={metaCellStyle}><strong>Company:</strong> DBS Bank</div>
            <div style={metaCellStyle}><strong>Role:</strong> React Developer</div>
            <div style={metaCellStyle}><strong>Assessment Format:</strong> MCQs, Conceptual Questions, Technical Depth, Practical Coding</div>
            <div style={metaCellStyle}><strong>Core Technologies:</strong> React.js, JavaScript, Redux-Saga, React Router, Module Federation, Web Performance</div>
            <div style={metaCellStyle}><strong>Coding Challenge:</strong> Random Team Generator</div>
            <div style={metaCellStyle}><strong>Content Status:</strong> Candidate-reported material + supplementary practice content</div>
          </div>

          <h4 style={{ color: '#f8fafc', marginBottom: '0.5rem' }}>🎯 Module Contents</h4>
          <ul style={{ lineHeight: '1.6', color: '#cbd5e1' }}>
            <li><strong>9 Candidate-Reported Conceptual Questions:</strong> Module Federation, Tree Shaking, Lazy Loading, Local State, HOCs, SPA Routing, Redux-Saga, and SSR Hydration.</li>
            <li><strong>18 Supplementary Practice MCQs:</strong> 2 practice MCQs per topic with detailed explanations for correct and incorrect options.</li>
            <li><strong>Random Team Generator React Challenge:</strong> Full interactive application with Fisher–Yates shuffling, balanced team partitioning, and 22 automated test scenarios.</li>
            <li><strong>Topic-Wise Revision & Comparison Exercises:</strong> 7 side-by-side technical comparison tables.</li>
          </ul>
        </div>
      )}

      {/* TAB 2: CONCEPTUAL QUESTIONS */}
      {activeTab === 'conceptual' && (
        <div>
          {/* Controls Bar */}
          <div style={controlsRowStyle}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                disabled={conceptualIndex === 0}
                onClick={() => setConceptualIndex((prev) => prev - 1)}
                style={navBtnStyle(conceptualIndex === 0)}
              >
                ← Previous
              </button>
              <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                Question {conceptualIndex + 1} of {allConceptual.length}
              </span>
              <button
                disabled={conceptualIndex === allConceptual.length - 1}
                onClick={() => setConceptualIndex((prev) => prev + 1)}
                style={navBtnStyle(conceptualIndex === allConceptual.length - 1)}
              >
                Next →
              </button>
            </div>

            <button
              onClick={() => handleToggleBookmark(currentConceptual.id)}
              style={bkmkBtnStyle(!!bookmarkMap[currentConceptual.id])}
            >
              {bookmarkMap[currentConceptual.id] ? '★ Bookmarked' : '☆ Bookmark Question'}
            </button>
          </div>

          {/* Conceptual Card */}
          <div style={cardStyle}>
            {/* Meta Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' }}>
              <span style={badgeStyle(currentConceptual.badge)}>{currentConceptual.badge}</span>
              <span style={tagStyle}>{currentConceptual.category}</span>
              <span style={difficultyStyle(currentConceptual.difficulty)}>Difficulty: {currentConceptual.difficulty}</span>
              {currentConceptual.topicTags.map((tag) => (
                <span key={tag} style={tagStyle}>#{tag}</span>
              ))}
            </div>

            {/* Question Title */}
            <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', margin: '0 0 1rem 0' }}>
              {conceptualIndex + 1}. {currentConceptual.title}
            </h3>

            {/* Direct Answer Preview Box */}
            <div style={summaryBoxStyle}>
              <strong>Direct Interview Answer:</strong> {currentConceptual.directAnswer}
            </div>

            {/* Practice Status */}
            <div style={statusSelectRowStyle}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0' }}>My Practice Status:</span>
              {(['Not Started', 'In Progress', 'Completed'] as PracticeStatus[]).map((st) => (
                <label key={st} style={radioLabelStyle}>
                  <input
                    type="radio"
                    name={`status-${currentConceptual.id}`}
                    checked={(statusMap[currentConceptual.id] || 'Not Started') === st}
                    onChange={() => handleStatusChange(currentConceptual.id, st)}
                  />
                  {st}
                </label>
              ))}
            </div>

            {/* Progressive Hints */}
            {currentConceptual.hints && currentConceptual.hints.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#facc15' }}>
                    💡 Progressive Hints ({visibleHintCount}/{currentConceptual.hints.length})
                  </span>
                  {visibleHintCount < currentConceptual.hints.length && (
                    <button
                      onClick={() => setVisibleHintCount((prev) => prev + 1)}
                      style={hintBtnStyle}
                    >
                      Show Hint {visibleHintCount + 1}
                    </button>
                  )}
                </div>
                {currentConceptual.hints.slice(0, visibleHintCount).map((hint, idx) => (
                  <div key={idx} style={hintBoxStyle}>
                    <strong>Hint {idx + 1}:</strong> {hint}
                  </div>
                ))}
              </div>
            )}

            {/* Written Answer Draft & Heuristic Evaluator */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>
                📝 Submit Written Answer for Evaluation / Personal Notes:
              </label>
              <textarea
                rows={4}
                value={currentNoteInput}
                onChange={(e) => handleSaveNote(currentConceptual.id, e.target.value)}
                placeholder="Attempt your technical answer here before revealing the reference solution..."
                style={textareaStyle}
              />

              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                <button onClick={handleEvaluateWrittenAnswer} style={btnSecondaryStyle}>
                  🔍 Evaluate Written Answer Draft
                </button>
              </div>

              {/* Heuristic Feedback display */}
              {writtenFeedback && (
                <div style={feedbackBoxStyle}>
                  <h5 style={{ margin: '0 0 0.5rem 0', color: '#38bdf8' }}>
                    🔍 Automated Heuristic Feedback (Client-Side Rubric Check)
                  </h5>
                  <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>
                    Technical Clarity Score: <span style={{ color: writtenFeedback.score >= 70 ? '#4ade80' : '#facc15' }}>{writtenFeedback.score}/100</span> | Word Count: {writtenFeedback.wordCount} words
                  </p>
                  <p style={{ margin: '0 0 0.5rem 0' }}>{writtenFeedback.feedbackMsg}</p>
                  {writtenFeedback.matchedKeywords.length > 0 && (
                    <div style={{ fontSize: '0.8rem', color: '#4ade80' }}>
                      ✓ Matched Key Terms: {writtenFeedback.matchedKeywords.join(', ')}
                    </div>
                  )}
                  {writtenFeedback.missingKeywords.length > 0 && (
                    <div style={{ fontSize: '0.8rem', color: '#f87171', marginTop: '0.25rem' }}>
                      ✗ Recommended Terms to Include: {writtenFeedback.missingKeywords.join(', ')}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Reveal Explanation Toggle */}
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              style={explanationToggleStyle(showExplanation)}
            >
              {showExplanation ? '🙈 Hide Detailed 8-Part Breakdown' : '👁️ Reveal Complete 8-Part Technical Solution'}
            </button>

            {/* Detailed 8-Part Breakdown */}
            {showExplanation && (
              <div style={revealedSectionStyle}>
                <div style={sectionBoxStyle}>
                  <h5 style={sectionHeaderStyle}>1. Direct Answer</h5>
                  <p style={{ margin: 0 }}>{currentConceptual.directAnswer}</p>
                </div>

                <div style={sectionBoxStyle}>
                  <h5 style={sectionHeaderStyle}>2. Detailed Explanation</h5>
                  <div style={{ whiteSpace: 'pre-line', margin: 0 }}>{currentConceptual.detailedExplanation}</div>
                </div>

                <div style={sectionBoxStyle}>
                  <h5 style={sectionHeaderStyle}>3. Practical Example</h5>
                  <pre style={preStyle}><code>{currentConceptual.practicalExample}</code></pre>
                </div>

                <div style={sectionBoxStyle}>
                  <h5 style={sectionHeaderStyle}>4. Why This Is Correct</h5>
                  <p style={{ margin: 0 }}>{currentConceptual.whyCorrect}</p>
                </div>

                <div style={sectionBoxStyle}>
                  <h5 style={sectionHeaderStyle}>5. Common Misconceptions</h5>
                  <p style={{ margin: 0 }}>{currentConceptual.commonMisconceptions}</p>
                </div>

                <div style={sectionBoxStyle}>
                  <h5 style={sectionHeaderStyle}>6. Follow-up Questions</h5>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                    {currentConceptual.followUpQuestions.map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                </div>

                <div style={sectionBoxStyle}>
                  <h5 style={sectionHeaderStyle}>7. Interview-Ready Answer (30-90 sec spoken summary)</h5>
                  <div style={{ background: '#0f172a', padding: '0.75rem', borderRadius: '6px', borderLeft: '4px solid #10b981' }}>
                    "{currentConceptual.interviewReadyAnswer}"
                  </div>
                </div>

                <div style={sectionBoxStyle}>
                  <h5 style={sectionHeaderStyle}>8. Advanced Discussion & Edge Cases</h5>
                  <p style={{ margin: 0 }}>{currentConceptual.advancedDiscussion}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: MCQ PRACTICE */}
      {activeTab === 'mcq' && (
        <div>
          <div style={controlsRowStyle}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                disabled={mcqIndex === 0}
                onClick={() => setMcqIndex((prev) => prev - 1)}
                style={navBtnStyle(mcqIndex === 0)}
              >
                ← Previous MCQ
              </button>
              <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                MCQ {mcqIndex + 1} of {allMCQs.length}
              </span>
              <button
                disabled={mcqIndex === allMCQs.length - 1}
                onClick={() => setMcqIndex((prev) => prev + 1)}
                style={navBtnStyle(mcqIndex === allMCQs.length - 1)}
              >
                Next MCQ →
              </button>
            </div>

            <button
              onClick={() => handleToggleBookmark(currentMCQ.id)}
              style={bkmkBtnStyle(!!bookmarkMap[currentMCQ.id])}
            >
              {bookmarkMap[currentMCQ.id] ? '★ Bookmarked' : '☆ Bookmark MCQ'}
            </button>
          </div>

          <div style={cardStyle}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' }}>
              <span style={badgeStyle(currentMCQ.badge)}>{currentMCQ.badge}</span>
              <span style={difficultyStyle(currentMCQ.difficulty)}>Difficulty: {currentMCQ.difficulty}</span>
              <span style={tagStyle}>#{currentMCQ.topicTag}</span>
            </div>

            <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', margin: '0 0 0.5rem 0' }}>
              MCQ {mcqIndex + 1}: {currentMCQ.title}
            </h3>

            <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '8px', border: '1px solid #334155', marginBottom: '1rem' }}>
              {currentMCQ.questionText}
            </div>

            {/* Options List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              {currentMCQ.options.map((opt, idx) => {
                let borderCol = '#475569';
                let bgCol = '#1e293b';

                if (selectedOption === idx) {
                  borderCol = '#38bdf8';
                  bgCol = '#0f172a';
                }

                if (mcqSubmitted) {
                  if (idx === currentMCQ.correctAnswerIndex) {
                    borderCol = '#22c55e';
                    bgCol = '#052e16';
                  } else if (selectedOption === idx && idx !== currentMCQ.correctAnswerIndex) {
                    borderCol = '#ef4444';
                    bgCol = '#451a1a';
                  }
                }

                return (
                  <label
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      background: bgCol,
                      border: `1px solid ${borderCol}`,
                      borderRadius: '6px',
                      cursor: mcqSubmitted ? 'default' : 'pointer',
                      fontSize: '0.9rem',
                    }}
                  >
                    <input
                      type="radio"
                      name={`mcq-${currentMCQ.id}`}
                      checked={selectedOption === idx}
                      disabled={mcqSubmitted}
                      onChange={() => setSelectedOption(idx)}
                    />
                    <span>{String.fromCharCode(65 + idx)}. {opt}</span>
                  </label>
                );
              })}
            </div>

            {/* MCQ Action */}
            {!mcqSubmitted ? (
              <button
                disabled={selectedOption === null}
                onClick={handleMCQSubmit}
                style={btnPrimaryStyle}
              >
                Submit MCQ Answer
              </button>
            ) : (
              <div style={feedbackBoxStyle}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: selectedOption === currentMCQ.correctAnswerIndex ? '#4ade80' : '#f87171' }}>
                  {selectedOption === currentMCQ.correctAnswerIndex ? ' Correct Answer!' : ' Incorrect Attempt'}
                </h4>
                <p style={{ margin: '0 0 0.75rem 0' }}>{currentMCQ.explanation}</p>
                <div style={{ borderTop: '1px solid #334155', paddingTop: '0.5rem' }}>
                  <strong>Option Breakdown:</strong>
                  <ul style={{ margin: '0.35rem 0 0 1.25rem', fontSize: '0.85rem' }}>
                    {currentMCQ.optionExplanations.map((exp, i) => (
                      <li key={i} style={{ marginBottom: '0.25rem' }}>{exp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: CODING CHALLENGE */}
      {activeTab === 'coding' && (
        <RandomTeamGenerator />
      )}

      {/* TAB 5: TOPIC REVISION */}
      {activeTab === 'revision' && (
        <div style={cardStyle}>
          <h3 style={{ color: '#38bdf8', marginTop: 0 }}>🔄 Topic-Wise Revision & Comparison Exercises</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Review key concepts side-by-side to prepare for technical interview trade-off questions.
          </p>

          {COMPARISON_EXERCISES.map((comp, idx) => (
            <div key={idx} style={{ marginBottom: '1.5rem', background: '#0f172a', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
              <h4 style={{ color: '#f8fafc', margin: '0 0 0.75rem 0' }}>{comp.title}</h4>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Feature</th>
                    <th style={thStyle}>{comp.conceptA}</th>
                    <th style={thStyle}>{comp.conceptB}</th>
                  </tr>
                </thead>
                <tbody>
                  {comp.comparisonPoints.map((pt, pIdx) => (
                    <tr key={pIdx}>
                      <td style={tdStyle}><strong>{pt.feature}</strong></td>
                      <td style={tdStyle}>{pt.conceptAVal}</td>
                      <td style={tdStyle}>{pt.conceptBVal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#38bdf8', fontStyle: 'italic' }}>
                💡 <strong>Verdict:</strong> {comp.verdict}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 6: BOOKMARKED QUESTIONS */}
      {activeTab === 'bookmarks' && (
        <div style={cardStyle}>
          <h3 style={{ color: '#38bdf8', marginTop: 0 }}>🔖 Bookmarked Preparation Material</h3>
          {bookmarkedCount === 0 ? (
            <p style={{ color: '#94a3b8' }}>No questions bookmarked yet. Click 'Bookmark Question' on any item to save it here.</p>
          ) : (
            <div>
              {allConceptual
                .filter((q) => bookmarkMap[q.id])
                .map((q) => (
                  <div key={q.id} style={listItemStyle}>
                    <div>
                      <span style={badgeStyle(q.badge)}>{q.badge}</span>
                      <h4 style={{ margin: '0.35rem 0', color: '#f8fafc' }}>{q.title}</h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1' }}>{q.directAnswer}</p>
                    </div>
                  </div>
                ))}

              {allMCQs
                .filter((q) => bookmarkMap[q.id])
                .map((q) => (
                  <div key={q.id} style={listItemStyle}>
                    <div>
                      <span style={badgeStyle(q.badge)}>{q.badge}</span>
                      <h4 style={{ margin: '0.35rem 0', color: '#f8fafc' }}>{q.title}</h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1' }}>{q.questionText}</p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 7: INCOMPLETE / REVISION LIST */}
      {activeTab === 'incomplete' && (
        <div style={cardStyle}>
          <h3 style={{ color: '#38bdf8', marginTop: 0 }}>⏳ Incomplete & Revision Items</h3>
          {allConceptual
            .filter((q) => (statusMap[q.id] || 'Not Started') !== 'Completed')
            .map((q) => (
              <div key={q.id} style={listItemStyle}>
                <div>
                  <span style={tagStyle}>Status: {statusMap[q.id] || 'Not Started'}</span>
                  <h4 style={{ margin: '0.35rem 0', color: '#f8fafc' }}>{q.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>{q.category}</p>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

// Inline Style definitions
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

const statsBoxStyle: React.CSSProperties = {
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

const tabRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
  overflowX: 'auto',
  paddingBottom: '0.5rem',
  marginBottom: '1rem',
  borderBottom: '1px solid #334155',
};

const tabBtnStyle = (active: boolean): React.CSSProperties => ({
  background: active ? '#0284c7' : '#0f172a',
  color: active ? '#ffffff' : '#cbd5e1',
  border: '1px solid #334155',
  padding: '0.4rem 0.8rem',
  borderRadius: '6px',
  fontSize: '0.85rem',
  fontWeight: 600,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
});

const disclaimerBoxStyle: React.CSSProperties = {
  background: '#0f172a',
  borderLeft: '4px solid #38bdf8',
  padding: '0.75rem',
  borderRadius: '0 6px 6px 0',
  fontSize: '0.825rem',
  color: '#cbd5e1',
  marginBottom: '1rem',
};

const cardStyle: React.CSSProperties = {
  background: '#0f172a',
  padding: '1.25rem',
  borderRadius: '8px',
  border: '1px solid #334155',
};

const metaTableGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '0.75rem',
  marginBottom: '1.25rem',
};

const metaCellStyle: React.CSSProperties = {
  background: '#1e293b',
  padding: '0.6rem',
  borderRadius: '6px',
  fontSize: '0.85rem',
  border: '1px solid #334155',
};

const controlsRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1rem',
  flexWrap: 'wrap',
  gap: '0.75rem',
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

const bkmkBtnStyle = (active: boolean): React.CSSProperties => ({
  background: active ? '#854d0e' : '#1e293b',
  color: active ? '#fef08a' : '#cbd5e1',
  border: '1px solid #eab308',
  padding: '0.35rem 0.75rem',
  borderRadius: '6px',
  fontSize: '0.825rem',
  cursor: 'pointer',
});

const badgeStyle = (badge: SourceClassification): React.CSSProperties => {
  let bg = '#0284c7';
  if (badge === 'Reported Question') bg = '#16a34a';
  if (badge === 'Reported Coding Challenge') bg = '#059669';
  if (badge === 'Supplementary MCQ') bg = '#9333ea';
  if (badge === 'Supplementary Coding Test') bg = '#4f46e5';
  if (badge === 'Generated Explanation') bg = '#0284c7';
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

const summaryBoxStyle: React.CSSProperties = {
  background: '#1e293b',
  padding: '0.85rem',
  borderRadius: '6px',
  borderLeft: '4px solid #38bdf8',
  marginBottom: '1rem',
  fontSize: '0.9rem',
  lineHeight: '1.5',
};

const statusSelectRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  marginBottom: '1rem',
  padding: '0.6rem',
  background: '#1e293b',
  borderRadius: '6px',
};

const radioLabelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.35rem',
  cursor: 'pointer',
  fontSize: '0.85rem',
  color: '#f8fafc',
};

const hintBtnStyle: React.CSSProperties = {
  background: '#854d0e',
  color: '#fef08a',
  border: '1px solid #ca8a04',
  padding: '0.2rem 0.5rem',
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

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.85rem',
  fontWeight: 600,
  color: '#cbd5e1',
  marginBottom: '0.35rem',
};

const textareaStyle: React.CSSProperties = {
  width: '100%',
  background: '#1e293b',
  color: '#f8fafc',
  border: '1px solid #475569',
  borderRadius: '6px',
  padding: '0.6rem',
  fontSize: '0.875rem',
  boxSizing: 'border-box',
  outline: 'none',
};

const btnSecondaryStyle: React.CSSProperties = {
  background: '#475569',
  color: '#ffffff',
  border: 'none',
  padding: '0.4rem 0.8rem',
  borderRadius: '6px',
  fontSize: '0.825rem',
  fontWeight: 600,
  cursor: 'pointer',
};

const btnPrimaryStyle: React.CSSProperties = {
  background: '#16a34a',
  color: '#ffffff',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  fontWeight: 600,
  fontSize: '0.875rem',
  cursor: 'pointer',
};

const feedbackBoxStyle: React.CSSProperties = {
  marginTop: '0.75rem',
  padding: '0.85rem',
  background: '#1e293b',
  borderRadius: '6px',
  border: '1px solid #38bdf8',
  fontSize: '0.875rem',
};

const explanationToggleStyle = (active: boolean): React.CSSProperties => ({
  width: '100%',
  background: active ? '#334155' : '#0369a1',
  color: '#ffffff',
  border: 'none',
  padding: '0.6rem',
  borderRadius: '6px',
  fontWeight: 600,
  cursor: 'pointer',
  fontSize: '0.9rem',
});

const revealedSectionStyle: React.CSSProperties = {
  marginTop: '1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.85rem',
};

const sectionBoxStyle: React.CSSProperties = {
  background: '#1e293b',
  padding: '0.85rem',
  borderRadius: '6px',
  border: '1px solid #334155',
  fontSize: '0.9rem',
};

const sectionHeaderStyle: React.CSSProperties = {
  margin: '0 0 0.35rem 0',
  color: '#38bdf8',
  fontSize: '0.95rem',
};

const preStyle: React.CSSProperties = {
  background: '#0f172a',
  padding: '0.6rem',
  borderRadius: '6px',
  overflowX: 'auto',
  fontSize: '0.825rem',
  margin: 0,
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '0.5rem',
  fontSize: '0.85rem',
};

const thStyle: React.CSSProperties = {
  borderBottom: '2px solid #475569',
  padding: '0.5rem',
  textAlign: 'left',
  color: '#38bdf8',
};

const tdStyle: React.CSSProperties = {
  borderBottom: '1px solid #334155',
  padding: '0.5rem',
  verticalAlign: 'top',
};

const listItemStyle: React.CSSProperties = {
  background: '#1e293b',
  padding: '0.75rem',
  borderRadius: '6px',
  border: '1px solid #334155',
  marginBottom: '0.5rem',
};
