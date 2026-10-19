import React, { useState } from 'react';
import {
  parseParticipants,
  validateTeamGenInputs,
  shuffleParticipants,
  distributeTeams,
  ParsingMode,
} from '../utils/teamGenerator';

interface RandomTeamGeneratorProps {
  randomFn?: () => number;
}

export default function RandomTeamGenerator({ randomFn = Math.random }: RandomTeamGeneratorProps) {
  const [rawParticipants, setRawParticipants] = useState<string>('');
  const [teamCount, setTeamCount] = useState<string>('');
  const [parsingMode, setParsingMode] = useState<ParsingMode>('auto');
  const [teams, setTeams] = useState<string[][]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [visibleHintCount, setVisibleHintCount] = useState<number>(0);
  const [showSolution, setShowSolution] = useState<boolean>(false);

  const hints = [
    'Parse the input string into clean participant names, trimming whitespace and dropping empty lines or tokens.',
    'Validate edge cases: check for empty inputs, non-numeric or negative team count, and team count exceeding total participants.',
    'Use the Fisher-Yates shuffle algorithm (swapping elements from back to front) for unbiased random permutation.',
    'Calculate base team size with Math.floor(n / k) and remainder with n % k. Assign 1 extra member to the first remainder teams.'
  ];

  const handleGenerate = () => {
    setErrorMessage(null);

    const validation = validateTeamGenInputs(rawParticipants, teamCount, parsingMode);

    if (!validation.isValid) {
      setErrorMessage(validation.error || 'Invalid input.');
      setTeams([]);
      return;
    }

    const shuffled = shuffleParticipants(validation.participants, randomFn);
    const generatedTeams = distributeTeams(shuffled, validation.teamCountNum);
    setTeams(generatedTeams);
  };

  const handleReset = () => {
    setRawParticipants('');
    setTeamCount('');
    setParsingMode('auto');
    setTeams([]);
    setErrorMessage(null);
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h3 style={{ margin: 0, color: '#38bdf8', fontSize: '1.2rem' }}>
          🎲 DBS React Coding Challenge: Random Team Generator
        </h3>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
          Distribute participants evenly into teams using Fisher–Yates shuffle and balanced partition algorithms.
        </p>
      </div>

      {/* Parsing Mode selector */}
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <label style={labelStyle} htmlFor="parsing-mode-select">Parsing Mode:</label>
        <select
          id="parsing-mode-select"
          value={parsingMode}
          onChange={(e) => setParsingMode(e.target.value as ParsingMode)}
          style={selectStyle}
        >
          <option value="auto">Auto (Comma & Newline separated)</option>
          <option value="newline">Newline separated only</option>
          <option value="comma">Comma separated only</option>
          <option value="whitespace">Whitespace separated (interprets multi-word names as individual tokens)</option>
        </select>
      </div>

      {/* Inputs Form */}
      <div style={formGridStyle}>
        <div>
          <label htmlFor="participants-input" style={labelStyle}>
            Participant Names:
          </label>
          <textarea
            id="participants-input"
            data-testid="participants-input"
            rows={5}
            value={rawParticipants}
            onChange={(e) => {
              setRawParticipants(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="Enter participant names (comma-separated or one per line)...&#10;e.g.:&#10;Mary Jane&#10;John Smith&#10;Alex"
            style={textareaStyle}
          />
        </div>

        <div>
          <label htmlFor="team-count-input" style={labelStyle}>
            Number of Teams:
          </label>
          <input
            id="team-count-input"
            data-testid="team-count-input"
            type="number"
            value={teamCount}
            onChange={(e) => {
              setTeamCount(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="e.g. 3"
            style={inputStyle}
          />

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <button
              data-testid="generate-teams-button"
              onClick={handleGenerate}
              style={btnPrimaryStyle}
            >
              Generate Teams
            </button>
            <button
              data-testid="reset-button"
              onClick={handleReset}
              style={btnSecondaryStyle}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Error display */}
      {errorMessage && (
        <div role="alert" style={errorBoxStyle}>
          ⚠️ <strong>Error:</strong> {errorMessage}
        </div>
      )}

      {/* Generated Teams Display */}
      {teams.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h4 style={{ color: '#4ade80', margin: '0 0 1rem 0' }}>
            Generated Teams ({teams.length} teams, {teams.reduce((acc, t) => acc + t.length, 0)} total participants)
          </h4>
          <div style={teamsGridStyle}>
            {teams.map((teamMembers, idx) => (
              <div
                key={idx}
                data-testid={`team-${idx + 1}`}
                style={teamCardStyle}
              >
                <div style={teamCardHeaderStyle}>
                  Team {idx + 1}
                  <span style={teamCountBadgeStyle}>{teamMembers.length} members</span>
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#e2e8f0', fontSize: '0.9rem' }}>
                  {teamMembers.map((member, memberIdx) => (
                    <li key={`${member}-${memberIdx}`} style={{ marginBottom: '0.25rem' }}>
                      {member}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progressive Hints */}
      <div style={{ marginTop: '1.5rem', borderTop: '1px solid #334155', paddingTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#facc15' }}>
            💡 Progressive Challenge Hints ({visibleHintCount}/{hints.length})
          </span>
          {visibleHintCount < hints.length && (
            <button
              onClick={() => setVisibleHintCount((prev) => prev + 1)}
              style={hintBtnStyle}
            >
              Show Hint {visibleHintCount + 1}
            </button>
          )}
        </div>
        {hints.slice(0, visibleHintCount).map((hint, idx) => (
          <div key={idx} style={hintBoxStyle}>
            <strong>Hint {idx + 1}:</strong> {hint}
          </div>
        ))}
      </div>

      {/* Reference Solution Toggle */}
      <div style={{ marginTop: '1rem' }}>
        <button
          onClick={() => setShowSolution(!showSolution)}
          style={solutionBtnStyle(showSolution)}
        >
          {showSolution ? '🙈 Hide Reference Solution Code' : '👁️ Reveal Reference Solution & Algorithm Walkthrough'}
        </button>

        {showSolution && (
          <div style={solutionBoxStyle}>
            <h5 style={{ margin: '0 0 0.5rem 0', color: '#38bdf8' }}>Fisher-Yates Shuffle & Balanced Partition Reference Implementation</h5>
            <pre style={preStyle}><code>{`function shuffleParticipants(participants) {
  const shuffled = [...participants];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function distributeTeams(participants, k) {
  const n = participants.length;
  const baseSize = Math.floor(n / k);
  const remainder = n % k;
  const teams = [];
  let curr = 0;

  for (let i = 0; i < k; i++) {
    const size = i < remainder ? baseSize + 1 : baseSize;
    teams.push(participants.slice(curr, curr + size));
    curr += size;
  }
  return teams;
}`}</code></pre>
          </div>
        )}
      </div>
    </div>
  );
}

// Styling definitions
const containerStyle: React.CSSProperties = {
  background: '#0f172a',
  borderRadius: '8px',
  padding: '1.25rem',
  border: '1px solid #334155',
  color: '#f8fafc',
  margin: '1rem 0',
};

const headerStyle: React.CSSProperties = {
  borderBottom: '1px solid #334155',
  paddingBottom: '0.75rem',
  marginBottom: '1rem',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.85rem',
  fontWeight: 600,
  color: '#cbd5e1',
  marginBottom: '0.35rem',
};

const formGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '1rem',
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

const inputStyle: React.CSSProperties = {
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

const selectStyle: React.CSSProperties = {
  background: '#1e293b',
  color: '#f8fafc',
  border: '1px solid #475569',
  borderRadius: '6px',
  padding: '0.4rem 0.6rem',
  fontSize: '0.85rem',
  outline: 'none',
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

const btnSecondaryStyle: React.CSSProperties = {
  background: '#475569',
  color: '#ffffff',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  fontWeight: 600,
  fontSize: '0.875rem',
  cursor: 'pointer',
};

const errorBoxStyle: React.CSSProperties = {
  marginTop: '1rem',
  padding: '0.75rem',
  background: '#451a1a',
  border: '1px solid #ef4444',
  borderRadius: '6px',
  color: '#fca5a5',
  fontSize: '0.875rem',
};

const teamsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
  gap: '1rem',
};

const teamCardStyle: React.CSSProperties = {
  background: '#1e293b',
  border: '1px solid #3b82f6',
  borderRadius: '6px',
  padding: '0.85rem',
};

const teamCardHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontWeight: 700,
  fontSize: '0.95rem',
  color: '#38bdf8',
  borderBottom: '1px solid #334155',
  paddingBottom: '0.35rem',
  marginBottom: '0.5rem',
};

const teamCountBadgeStyle: React.CSSProperties = {
  background: '#0284c7',
  color: '#ffffff',
  fontSize: '0.7rem',
  padding: '0.15rem 0.4rem',
  borderRadius: '4px',
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

const solutionBtnStyle = (active: boolean): React.CSSProperties => ({
  width: '100%',
  background: active ? '#334155' : '#0369a1',
  color: '#ffffff',
  border: 'none',
  padding: '0.5rem',
  borderRadius: '6px',
  fontWeight: 600,
  fontSize: '0.85rem',
  cursor: 'pointer',
});

const solutionBoxStyle: React.CSSProperties = {
  marginTop: '0.75rem',
  background: '#1e293b',
  padding: '0.85rem',
  borderRadius: '6px',
  border: '1px solid #38bdf8',
};

const preStyle: React.CSSProperties = {
  background: '#0f172a',
  padding: '0.75rem',
  borderRadius: '6px',
  fontSize: '0.8rem',
  overflowX: 'auto',
  margin: 0,
};
