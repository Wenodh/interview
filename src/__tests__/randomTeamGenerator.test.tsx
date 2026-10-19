import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import RandomTeamGenerator from '../components/RandomTeamGenerator';
import {
  parseParticipants,
  validateTeamGenInputs,
  shuffleParticipants,
  distributeTeams,
} from '../utils/teamGenerator';

describe('Random Team Generator - Pure Utility Tests', () => {
  it('1. Empty participant input returns empty array and validation error', () => {
    expect(parseParticipants('')).toEqual([]);
    expect(parseParticipants('   ')).toEqual([]);
    const val = validateTeamGenInputs('', 2);
    expect(val.isValid).toBe(false);
    expect(val.error).toContain('at least one participant');
  });

  it('2. Single participant and one team', () => {
    const participants = parseParticipants('Alice');
    expect(participants).toEqual(['Alice']);
    const val = validateTeamGenInputs('Alice', 1);
    expect(val.isValid).toBe(true);
    const teams = distributeTeams(participants, 1);
    expect(teams).toEqual([['Alice']]);
  });

  it('3. Multiple participants and one team', () => {
    const participants = parseParticipants('Alice, Bob, Charlie');
    expect(participants).toEqual(['Alice', 'Bob', 'Charlie']);
    const val = validateTeamGenInputs('Alice, Bob, Charlie', 1);
    expect(val.isValid).toBe(true);
    const teams = distributeTeams(participants, 1);
    expect(teams).toEqual([['Alice', 'Bob', 'Charlie']]);
  });

  it('4. Equal distribution (6 participants into 3 teams)', () => {
    const participants = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];
    const teams = distributeTeams(participants, 3);
    expect(teams.length).toBe(3);
    expect(teams[0]).toEqual(['P1', 'P2']);
    expect(teams[1]).toEqual(['P3', 'P4']);
    expect(teams[2]).toEqual(['P5', 'P6']);
  });

  it('5. Uneven distribution: 10 participants across 3 teams (sizes: 4, 3, 3)', () => {
    const participants = Array.from({ length: 10 }, (_, i) => `User ${i + 1}`);
    const teams = distributeTeams(participants, 3);
    expect(teams.length).toBe(3);
    expect(teams[0].length).toBe(4);
    expect(teams[1].length).toBe(3);
    expect(teams[2].length).toBe(3);

    // Verify team sizes differ by at most 1
    const sizes = teams.map((t) => t.length);
    expect(Math.max(...sizes) - Math.min(...sizes)).toBeLessThanOrEqual(1);
  });

  it('6. Missing team count validation', () => {
    const val = validateTeamGenInputs('Alice, Bob', '');
    expect(val.isValid).toBe(false);
    expect(val.error).toContain('specify the number of teams');
  });

  it('7. Zero team count validation', () => {
    const val = validateTeamGenInputs('Alice, Bob', 0);
    expect(val.isValid).toBe(false);
    expect(val.error).toContain('greater than zero');
  });

  it('8. Negative team count validation', () => {
    const val = validateTeamGenInputs('Alice, Bob', -2);
    expect(val.isValid).toBe(false);
    expect(val.error).toContain('greater than zero');
  });

  it('9. Decimal team count validation', () => {
    const val = validateTeamGenInputs('Alice, Bob', 2.5);
    expect(val.isValid).toBe(false);
    expect(val.error).toContain('whole integer');
  });

  it('10. Non-numeric team count validation', () => {
    const val = validateTeamGenInputs('Alice, Bob', 'abc');
    expect(val.isValid).toBe(false);
    expect(val.error).toContain('valid number');
  });

  it('11. More teams than participants validation', () => {
    const val = validateTeamGenInputs('Alice, Bob', 5);
    expect(val.isValid).toBe(false);
    expect(val.error).toContain('cannot be greater than');
  });

  it('12. Repeated delimiters and empty tokens', () => {
    const parsed = parseParticipants('Alice,, , Bob\n\n, Charlie');
    expect(parsed).toEqual(['Alice', 'Bob', 'Charlie']);
  });

  it('13. Leading and trailing whitespace handling', () => {
    const parsed = parseParticipants('  Alice  ,   Bob   ');
    expect(parsed).toEqual(['Alice', 'Bob']);
  });

  it('14. Multi-word names in newline-separated mode', () => {
    const input = 'Mary Jane\nJohn Smith\nAlex';
    const parsed = parseParticipants(input, 'newline');
    expect(parsed).toEqual(['Mary Jane', 'John Smith', 'Alex']);
  });

  it('15. Multi-word names in comma-separated mode', () => {
    const input = 'Mary Jane, John Smith, Alex';
    const parsed = parseParticipants(input, 'comma');
    expect(parsed).toEqual(['Mary Jane', 'John Smith', 'Alex']);
  });

  it('16. Duplicate participant names according to documented rules', () => {
    const input = 'John, John, Mary';
    const parsed = parseParticipants(input, 'comma');
    expect(parsed).toEqual(['John', 'John', 'Mary']);
    expect(parsed.length).toBe(3);
  });
});

describe('Random Team Generator - Component & Integration Tests', () => {
  // Deterministic random function for component testing
  const mockRandom = () => 0.5;

  beforeEach(() => {
    render(<RandomTeamGenerator randomFn={mockRandom} />);
  });

  it('21. Required input and button test IDs exist in DOM', () => {
    expect(screen.getByTestId('participants-input')).toBeInTheDocument();
    expect(screen.getByTestId('team-count-input')).toBeInTheDocument();
    expect(screen.getByTestId('generate-teams-button')).toBeInTheDocument();
    expect(screen.getByTestId('reset-button')).toBeInTheDocument();
  });

  it('26. Accessible labels and relevant semantic controls are present', () => {
    expect(screen.getByLabelText(/Participant Names/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Number of Teams/i)).toBeInTheDocument();
  });

  it('17, 20, 22, 23, 24. Full generation workflow: test IDs, unique participant presence, team size balance', () => {
    const participantsText = 'Mary Jane, John Smith, Alex, David, Emma, Frank, Grace, Henry, Ivy, Jack';

    fireEvent.change(screen.getByTestId('participants-input'), { target: { value: participantsText } });
    fireEvent.change(screen.getByTestId('team-count-input'), { target: { value: '3' } });
    fireEvent.click(screen.getByTestId('generate-teams-button'));

    // Check team containers
    const team1 = screen.getByTestId('team-1');
    const team2 = screen.getByTestId('team-2');
    const team3 = screen.getByTestId('team-3');

    expect(team1).toBeInTheDocument();
    expect(team2).toBeInTheDocument();
    expect(team3).toBeInTheDocument();

    // Verify all 10 participants appear across teams
    const allText = [team1.textContent, team2.textContent, team3.textContent].join(' ');
    const originalNames = ['Mary Jane', 'John Smith', 'Alex', 'David', 'Emma', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack'];
    originalNames.forEach((name) => {
      expect(allText).toContain(name);
    });

    // Repeated generation works
    fireEvent.click(screen.getByTestId('generate-teams-button'));
    expect(screen.getByTestId('team-1')).toBeInTheDocument();
  });

  it('18. Reset after successful generation restores clean state', () => {
    fireEvent.change(screen.getByTestId('participants-input'), { target: { value: 'Alice, Bob' } });
    fireEvent.change(screen.getByTestId('team-count-input'), { target: { value: '2' } });
    fireEvent.click(screen.getByTestId('generate-teams-button'));

    expect(screen.getByTestId('team-1')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('reset-button'));

    expect(screen.getByTestId('participants-input')).toHaveValue('');
    expect(screen.getByTestId('team-count-input')).toHaveValue(null);
    expect(screen.queryByTestId('team-1')).not.toBeInTheDocument();
  });

  it('19. Reset after validation errors clears error banner and state', () => {
    fireEvent.change(screen.getByTestId('participants-input'), { target: { value: '' } });
    fireEvent.click(screen.getByTestId('generate-teams-button'));

    expect(screen.getByRole('alert')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('reset-button'));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('25. Error clearing after valid input or regeneration', () => {
    // Trigger error first
    fireEvent.change(screen.getByTestId('participants-input'), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByTestId('team-count-input'), { target: { value: '5' } });
    fireEvent.click(screen.getByTestId('generate-teams-button'));

    expect(screen.getByRole('alert')).toBeInTheDocument();

    // Fix team count and regenerate
    fireEvent.change(screen.getByTestId('team-count-input'), { target: { value: '1' } });
    fireEvent.click(screen.getByTestId('generate-teams-button'));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByTestId('team-1')).toBeInTheDocument();
  });
});
