import React, { useState, useEffect } from 'react';
import {
  REPORTED_CONCEPTUAL_QUESTIONS,
  SUPPLEMENTARY_MCQS,
  COMPARISON_EXERCISES,
  ConceptualQuestion,
  MCQQuestion,
  SourceClassification,
} from '../data/vueQuestions';

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

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export default function VueInterviewPractice() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Navigation indices
  const [conceptualIndex, setConceptualIndex] = useState<number>(0);
  const [mcqIndex, setMcqIndex] = useState<number>(0);

  // Persistence maps
  const [userNotes, setUserNotes] = useState<Record<string, string>>({});
  const [statusMap, setStatusMap] = useState<Record<string, PracticeStatus>>({});
  const [bookmarkMap, setBookmarkMap] = useState<Record<string, boolean>>({});
  const [incorrectMap, setIncorrectMap] = useState<Record<string, boolean>>({});

  // UI state for current conceptual question
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [visibleHintCount, setVisibleHintCount] = useState<number>(0);
  const [currentNoteInput, setCurrentNoteInput] = useState<string>('');
  const [writtenFeedback, setWrittenFeedback] = useState<WrittenFeedback | null>(null);

  // MCQ state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [mcqSubmitted, setMcqSubmitted] = useState<boolean>(false);

  // Challenge Simulator State inside practice tab
  const [simPosts, setSimPosts] = useState<Post[]>([]);
  const [simLoading, setSimLoading] = useState<boolean>(false);
  const [simError, setSimError] = useState<string>('');
  const [simSimulateState, setSimSimulateState] = useState<'live' | 'error_500' | 'empty'>('live');

  const STORAGE_PREFIX = 'vue_prep_';

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
        'vue_jsonplaceholder_coding',
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

  const currentConceptual = allConceptual[conceptualIndex] || allConceptual[0];
  const currentMCQ = allMCQs[mcqIndex] || allMCQs[0];

  // Sync draft notes and reset UI toggles when conceptual index changes
  useEffect(() => {
    if (currentConceptual) {
      setCurrentNoteInput(userNotes[currentConceptual.id] || '');
      setShowExplanation(false);
      setVisibleHintCount(0);
      setWrittenFeedback(null);
    }
  }, [conceptualIndex, currentConceptual?.id]);

  // Sync MCQ selection when MCQ index changes
  useEffect(() => {
    setSelectedOption(null);
    setMcqSubmitted(false);
  }, [mcqIndex]);

  // Persistence handlers
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
    if (confirm('Are you sure you want to reset all Vue.js practice progress, notes, and bookmarks?')) {
      try {
        const allIds = [
          ...allConceptual.map((q) => q.id),
          ...allMCQs.map((q) => q.id),
          'vue_jsonplaceholder_coding',
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

  // Heuristic written answer evaluator
  const handleEvaluateWrittenAnswer = () => {
    if (!currentConceptual || !currentNoteInput.trim()) return;

    const words = currentNoteInput.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    const keywordBank: Record<string, string[]> = {
      vue_q1: ['freeze', 'shallow', 'strict mode', 'typeerror', 'nested', 'property', 'writable'],
      vue_q2: ['literal', 'constructor', 'class', 'object.create', 'prototype', 'null'],
      vue_q3: ['display: none', 'visibility: hidden', 'layout', 'reflow', 'repaint', 'accessibility'],
      vue_q4: ['onmounted', 'onunmounted', 'onupdated', 'lifecycle', 'timer', 'cleanup', 'dom'],
      vue_q5: ['props', 'emits', 'defineprops', 'defineemits', 'one-way data flow', 'validation'],
      vue_q6: ['semantic', 'header', 'nav', 'main', 'button', 'accessibility', 'aria', 'landmark'],
      vue_q7: ['call stack', 'microtask', 'macrotask', 'promise', 'settimeout', 'event loop'],
      vue_q8: ['ref', 'reactive', '.value', 'proxy', 'torefs', 'destructuring', 'unwrapping'],
      vue_q9: ['v-if', 'v-show', 'v-for', 'v-model', 'v-bind', 'v-on', 'key'],
      vue_q10: ['tailwind', 'vuetify', 'bootstrap', 'utility', 'component', 'bundle size', 'accessibility'],
      vue_q11: ['shallow', 'deep', 'spread', 'structuredclone', 'reference', 'nested'],
      vue_q12: ['promise', 'async', 'await', 'try/catch', 'pending', 'fulfilled', 'rejected'],
      vue_q13: ['promise.all', 'allsettled', 'race', 'any', 'fetch', 'response.ok', 'status'],
    };

    const targetKeywords = keywordBank[currentConceptual.id] || ['vue', 'javascript', 'reactivity'];
    const textLower = currentNoteInput.toLowerCase();

    const matched = targetKeywords.filter((kw) => textLower.includes(kw));
    const missing = targetKeywords.filter((kw) => !textLower.includes(kw));

    let score = 0;
    if (wordCount >= 20) score += 40;
    else if (wordCount >= 10) score += 20;

    score += Math.round((matched.length / targetKeywords.length) * 60);

    let feedbackMsg = '';
    if (score >= 80) {
      feedbackMsg = ' Excellent response! You covered core technical concepts and vocabulary effectively.';
    } else if (score >= 50) {
      feedbackMsg = ' Solid explanation framework. Add missing technical keywords to make your interview answer bulletproof.';
    } else {
      feedbackMsg = ' Initial draft recorded. Expand your written explanation with key technical terminology and code examples.';
    }

    setWrittenFeedback({
      score,
      wordCount,
      matchedKeywords: matched,
      missingKeywords: missing,
      feedbackMsg,
    });
  };

  // MCQ handler
  const handleMCQSubmit = () => {
    if (selectedOption === null || !currentMCQ) return;

    setMcqSubmitted(true);
    const isCorrect = selectedOption === currentMCQ.correctAnswerIndex;

    if (isCorrect) {
      handleStatusChange(currentMCQ.id, 'Completed');
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

  // Simulator fetch for Posts Table Challenge
  const fetchSimPosts = async () => {
    setSimLoading(true);
    setSimError('');

    try {
      if (simSimulateState === 'error_500') {
        await new Promise((resolve) => setTimeout(resolve, 600));
        throw new Error('Failed to fetch posts: HTTP 500 Internal Server Error');
      }

      if (simSimulateState === 'empty') {
        await new Promise((resolve) => setTimeout(resolve, 600));
        setSimPosts([]);
        return;
      }

      const res = await fetch('https://jsonplaceholder.typicode.com/posts');
      if (!res.ok) {
        throw new Error(`Failed to fetch posts: HTTP ${res.status}`);
      }
      const data = await res.json();
      setSimPosts(data.slice(0, 10)); // Display first 10 for clean UI
      handleStatusChange('vue_jsonplaceholder_coding', 'Completed');
    } catch (err) {
      setSimError(err instanceof Error ? err.message : 'Something went wrong');
      setSimPosts([]);
      handleStatusChange('vue_jsonplaceholder_coding', 'In Progress');
    } finally {
      setSimLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'coding') {
      fetchSimPosts();
    }
  }, [activeTab, simSimulateState]);

  // Stats
  const totalItems = allConceptual.length + allMCQs.length + 1; // +1 coding challenge
  const completedCount = Object.values(statusMap).filter((s) => s === 'Completed').length;
  const inProgressCount = Object.values(statusMap).filter((s) => s === 'In Progress').length;
  const bookmarkedCount = Object.values(bookmarkMap).filter(Boolean).length;
  const incorrectCount = Object.values(incorrectMap).filter(Boolean).length;

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.4rem' }}>🟢</span>
            <h2 style={{ margin: 0, color: '#4ade80', fontSize: '1.35rem' }}>
              Vue.js Interview Questions and Coding Practice
            </h2>
          </div>
          <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
            Role: Vue.js Developer / Frontend Developer | Composition API, JavaScript, Promises & JSONPlaceholder Coding Challenge
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

      {/* Navigation Tabs */}
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

      {/* Standard Disclaimer */}
      <div style={disclaimerBoxStyle}>
        ℹ️ <strong>Disclaimer:</strong> This preparation guide is based on readable topics from candidate-shared handwritten interview notes and has been supplemented with educational explanations and practice questions. Some original wording may have been unclear. It is not an official interview question paper, and actual interview questions may vary.
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={cardStyle}>
          <h3 style={{ color: '#4ade80', marginTop: 0 }}>📌 Module Overview & Assessment Metadata</h3>
          <div style={metaTableGrid}>
            <div style={metaCellStyle}><strong>Role:</strong> Vue.js Developer / Frontend Developer</div>
            <div style={metaCellStyle}><strong>Primary Technologies:</strong> Vue 3 Composition API, JavaScript, CSS, Promises, API Integration</div>
            <div style={metaCellStyle}><strong>Assessment Format:</strong> Conceptual questions, JS fundamentals, technical depth, and practical coding</div>
            <div style={metaCellStyle}><strong>Coding Challenge:</strong> Fetch JSONPlaceholder Posts & Display in a Vue 3 Table</div>
            <div style={metaCellStyle}><strong>Source Classification:</strong> Candidate-shared handwritten notes + generated educational material</div>
            <div style={metaCellStyle}><strong>Source URL:</strong> Not provided</div>
          </div>

          <h4 style={{ color: '#f8fafc', marginBottom: '0.5rem' }}>🎯 Practical Suite Breakdown</h4>
          <ul style={{ lineHeight: '1.6', color: '#cbd5e1' }}>
            <li><strong>13 Conceptual Questions:</strong> Covered with 8-part technical breakdowns, progressive hints, written answer drafts, and follow-up questions.</li>
            <li><strong>26 Supplementary MCQs:</strong> 2 targeted MCQs per conceptual topic with detailed explanations for correct and incorrect options.</li>
            <li><strong>JSONPlaceholder Posts Table Coding Challenge:</strong> Live interactive Vue 3 state simulation + standalone MachineSandbox preview.</li>
            <li><strong>7 Topic-Wise Revision Tables:</strong> Side-by-side trade-off matrices for reactivity, lifecycle, directives, state, and promises.</li>
          </ul>
        </div>
      )}

      {/* TAB 2: CONCEPTUAL QUESTIONS */}
      {activeTab === 'conceptual' && (
        <div>
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

          <div style={cardStyle}>
            {/* Meta tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' }}>
              <span style={badgeStyle(currentConceptual.badge)}>{currentConceptual.badge}</span>
              <span style={tagStyle}>{currentConceptual.category}</span>
              <span style={difficultyStyle(currentConceptual.difficulty)}>Difficulty: {currentConceptual.difficulty}</span>
              {currentConceptual.topicTags.map((tag) => (
                <span key={tag} style={tagStyle}>#{tag}</span>
              ))}
            </div>

            <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', margin: '0 0 1rem 0' }}>
              {conceptualIndex + 1}. {currentConceptual.title}
            </h3>

            {/* Direct Answer Box */}
            <div style={summaryBoxStyle}>
              <strong>Direct Answer:</strong> {currentConceptual.directAnswer}
            </div>

            {/* Practice Status Selector */}
            <div style={statusSelectRowStyle}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0' }}>My Practice Status:</span>
              {(['Not Started', 'In Progress', 'Completed'] as PracticeStatus[]).map((st) => (
                <label key={st} style={radioLabelStyle}>
                  <input
                    type="radio"
                    name={`vue-status-${currentConceptual.id}`}
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

            {/* Written Answer Submission */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>
                📝 Submit Written Answer Draft for Heuristic Evaluation / Notes:
              </label>
              <textarea
                rows={4}
                value={currentNoteInput}
                onChange={(e) => handleSaveNote(currentConceptual.id, e.target.value)}
                placeholder="Write your technical explanation here before revealing the reference solution..."
                style={textareaStyle}
              />

              <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                <button onClick={handleEvaluateWrittenAnswer} style={btnSecondaryStyle}>
                  🔍 Evaluate Written Answer Draft
                </button>
              </div>

              {writtenFeedback && (
                <div style={feedbackBoxStyle}>
                  <h5 style={{ margin: '0 0 0.5rem 0', color: '#4ade80' }}>
                    🔍 Automated Heuristic Rubric Check
                  </h5>
                  <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>
                    Technical Score: <span style={{ color: writtenFeedback.score >= 70 ? '#4ade80' : '#facc15' }}>{writtenFeedback.score}/100</span> | Length: {writtenFeedback.wordCount} words
                  </p>
                  <p style={{ margin: '0 0 0.5rem 0' }}>{writtenFeedback.feedbackMsg}</p>
                  {writtenFeedback.matchedKeywords.length > 0 && (
                    <div style={{ fontSize: '0.8rem', color: '#4ade80' }}>
                      ✓ Matched Vocabulary: {writtenFeedback.matchedKeywords.join(', ')}
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

            {/* Explanation Toggle */}
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              style={explanationToggleStyle(showExplanation)}
            >
              {showExplanation ? '🙈 Hide Detailed 8-Part Breakdown' : '👁️ Reveal Complete 8-Part Technical Solution'}
            </button>

            {/* 8-Part Breakdown */}
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
                  <h5 style={sectionHeaderStyle}>4. Why This Answer Is Correct</h5>
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
                      name={`vue-mcq-${currentMCQ.id}`}
                      checked={selectedOption === idx}
                      disabled={mcqSubmitted}
                      onChange={() => setSelectedOption(idx)}
                    />
                    <span>{String.fromCharCode(65 + idx)}. {opt}</span>
                  </label>
                );
              })}
            </div>

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
        <div style={cardStyle}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' }}>
            <span style={badgeStyle('Reported Coding Challenge')}>Reported Coding Challenge</span>
            <span style={difficultyStyle('Medium')}>Difficulty: Medium</span>
            <span style={tagStyle}>#vue3</span>
            <span style={tagStyle}>#composition-api</span>
            <span style={tagStyle}>#fetch-api</span>
          </div>

          <h3 style={{ color: '#4ade80', margin: '0 0 0.5rem 0' }}>
            💻 Fetch JSONPlaceholder Posts & Display in a Vue 3 Table
          </h3>

          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.5' }}>
            <strong>Objective:</strong> Build a Vue 3 Composition API component that fetches posts from <code>https://jsonplaceholder.typicode.com/posts</code> using <code>onMounted()</code> and displays them in an accessible HTML table with loading, success, empty, and error states.
          </p>

          {/* Interactive State Simulation Controls */}
          <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '8px', border: '1px solid #334155', marginBottom: '1.25rem' }}>
            <h4 style={{ color: '#38bdf8', margin: '0 0 0.5rem 0', fontSize: '0.95rem' }}>
              🧪 Live Challenge Simulator & Edge Case Tester
            </h4>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Simulate Network Mode:</span>
              <button
                onClick={() => setSimSimulateState('live')}
                style={btnSimStyle(simSimulateState === 'live')}
              >
                ✅ Live API Success
              </button>
              <button
                onClick={() => setSimSimulateState('error_500')}
                style={btnSimStyle(simSimulateState === 'error_500')}
              >
                ❌ HTTP 500 Error
              </button>
              <button
                onClick={() => setSimSimulateState('empty')}
                style={btnSimStyle(simSimulateState === 'empty')}
              >
                📭 Empty Posts Response
              </button>
            </div>

            {/* Live Table Render Output */}
            <div style={{ marginTop: '1rem', background: '#0f172a', padding: '1rem', borderRadius: '6px', border: '1px solid #475569' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h5 style={{ margin: 0, color: '#f8fafc', fontSize: '1rem' }}>Posts List</h5>
                {simLoading && <span role="status" style={{ color: '#facc15', fontSize: '0.85rem' }}>⏳ Loading posts...</span>}
              </div>

              {simLoading ? (
                <p role="status" style={{ color: '#94a3b8', fontStyle: 'italic' }}>Loading posts from API...</p>
              ) : simError ? (
                <div role="alert" style={{ background: '#451a1a', border: '1px solid #ef4444', padding: '0.75rem', borderRadius: '6px', color: '#f87171' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>{simError}</p>
                  <button type="button" onClick={fetchSimPosts} style={btnPrimaryStyle}>
                    🔄 Retry
                  </button>
                </div>
              ) : simPosts.length === 0 ? (
                <table style={tableStyle}>
                  <caption>Posts retrieved from JSONPlaceholder</caption>
                  <thead>
                    <tr>
                      <th scope="col" style={thStyle}>ID</th>
                      <th scope="col" style={thStyle}>User ID</th>
                      <th scope="col" style={thStyle}>Title</th>
                      <th scope="col" style={thStyle}>Body</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={4} style={{ ...tdStyle, textAlign: 'center', color: '#94a3b8', padding: '1.5rem' }}>
                        No posts found
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <table style={tableStyle}>
                  <caption>Posts retrieved from JSONPlaceholder</caption>
                  <thead>
                    <tr>
                      <th scope="col" style={thStyle}>ID</th>
                      <th scope="col" style={thStyle}>User ID</th>
                      <th scope="col" style={thStyle}>Title</th>
                      <th scope="col" style={thStyle}>Body</th>
                    </tr>
                  </thead>
                  <tbody>
                    {simPosts.map((post) => (
                      <tr key={post.id}>
                        <td style={tdStyle}><strong>{post.id}</strong></td>
                        <td style={tdStyle}>{post.userId}</td>
                        <td style={tdStyle}>{post.title}</td>
                        <td style={tdStyle}>{post.body}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Reference Implementation Code View */}
          <h4 style={{ color: '#f8fafc', marginBottom: '0.5rem' }}>📄 Vue 3 Composition API Reference Solution</h4>
          <pre style={preStyle}><code>{`<script setup>
import { ref, onMounted } from "vue";

const posts = ref([]);
const loading = ref(false);
const error = ref("");

async function fetchPosts() {
  loading.value = true;
  error.value = "";

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");

    if (!response.ok) {
      throw new Error(\`Failed to fetch posts: HTTP \${response.status}\`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid posts response");
    }

    posts.value = data;
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Something went wrong";
  } finally {
    loading.value = false;
  }
}

onMounted(fetchPosts);
</script>

<template>
  <main class="container">
    <h1>Posts List</h1>

    <p v-if="loading" role="status">
      Loading posts...
    </p>

    <div v-else-if="error" role="alert">
      <p>{{ error }}</p>
      <button type="button" @click="fetchPosts">
        Retry
      </button>
    </div>

    <table v-else>
      <caption>Posts retrieved from JSONPlaceholder</caption>

      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">User ID</th>
          <th scope="col">Title</th>
          <th scope="col">Body</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="post in posts" :key="post.id">
          <td>{{ post.id }}</td>
          <td>{{ post.userId }}</td>
          <td>{{ post.title }}</td>
          <td>{{ post.body }}</td>
        </tr>

        <tr v-if="posts.length === 0">
          <td colspan="4">No posts found</td>
        </tr>
      </tbody>
    </table>
  </main>
</template>`}</code></pre>
        </div>
      )}

      {/* TAB 5: TOPIC REVISION */}
      {activeTab === 'revision' && (
        <div style={cardStyle}>
          <h3 style={{ color: '#4ade80', marginTop: 0 }}>🔄 Vue.js & JavaScript Technical Comparison Matrices</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Side-by-side concept comparisons designed to prepare you for technical interviewer trade-off questions.
          </p>

          {COMPARISON_EXERCISES.map((comp, idx) => (
            <div key={idx} style={{ marginBottom: '1.5rem', background: '#0f172a', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
              <h4 style={{ color: '#f8fafc', margin: '0 0 0.75rem 0' }}>{comp.title}</h4>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Feature / Dimension</th>
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
              <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#4ade80', fontStyle: 'italic' }}>
                💡 <strong>Verdict:</strong> {comp.verdict}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 6: BOOKMARKED ITEMS */}
      {activeTab === 'bookmarks' && (
        <div style={cardStyle}>
          <h3 style={{ color: '#4ade80', marginTop: 0 }}>🔖 Bookmarked Vue.js Material</h3>
          {bookmarkedCount === 0 ? (
            <p style={{ color: '#94a3b8' }}>No items bookmarked yet. Click 'Bookmark Question' or 'Bookmark MCQ' on any item to save it here.</p>
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

      {/* TAB 7: INCOMPLETE ITEMS */}
      {activeTab === 'incomplete' && (
        <div style={cardStyle}>
          <h3 style={{ color: '#4ade80', marginTop: 0 }}>⏳ Incomplete & Revision Items</h3>
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

// Inline Styles
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
  background: active ? '#15803d' : '#0f172a',
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
  borderLeft: '4px solid #4ade80',
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
  background: disabled ? '#334155' : '#15803d',
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
  borderLeft: '4px solid #4ade80',
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

const btnSimStyle = (active: boolean): React.CSSProperties => ({
  background: active ? '#15803d' : '#1e293b',
  color: '#ffffff',
  border: active ? '1px solid #4ade80' : '1px solid #475569',
  padding: '0.35rem 0.75rem',
  borderRadius: '6px',
  fontSize: '0.8rem',
  cursor: 'pointer',
  fontWeight: 500,
});

const feedbackBoxStyle: React.CSSProperties = {
  marginTop: '0.75rem',
  padding: '0.85rem',
  background: '#1e293b',
  borderRadius: '6px',
  border: '1px solid #4ade80',
  fontSize: '0.875rem',
};

const explanationToggleStyle = (active: boolean): React.CSSProperties => ({
  width: '100%',
  background: active ? '#334155' : '#15803d',
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
  color: '#4ade80',
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
  color: '#4ade80',
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
