export type ParsingMode = 'auto' | 'comma' | 'newline' | 'whitespace';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  participants: string[];
  teamCountNum: number;
}

/**
 * Parses participant input string based on the selected mode or auto-detection.
 * Defaults to auto-detection (combining comma and newline delimiters).
 * Preserves multi-word names in comma and newline modes.
 * Duplicate names are preserved.
 */
export function parseParticipants(input: string, mode: ParsingMode = 'auto'): string[] {
  if (!input || !input.trim()) return [];

  let rawTokens: string[] = [];

  if (mode === 'whitespace') {
    // Splits on any whitespace sequence
    rawTokens = input.trim().split(/\s+/);
  } else if (mode === 'comma') {
    rawTokens = input.split(',');
  } else if (mode === 'newline') {
    rawTokens = input.split(/\r?\n/);
  } else {
    // 'auto': split on newlines and commas
    rawTokens = input.split(/[\n\r,]+/);
  }

  return rawTokens
    .map((name) => name.trim())
    .filter((name) => name.length > 0);
}

/**
 * Validates participant list and team count string/number.
 */
export function validateTeamGenInputs(
  participantsInput: string | string[],
  teamCountInput: string | number,
  parsingMode: ParsingMode = 'auto'
): ValidationResult {
  const participants = Array.isArray(participantsInput)
    ? participantsInput
    : parseParticipants(participantsInput, parsingMode);

  if (participants.length === 0) {
    return {
      isValid: false,
      error: 'Please enter at least one participant name.',
      participants: [],
      teamCountNum: 0,
    };
  }

  // Parse team count
  const rawCount = typeof teamCountInput === 'number' ? teamCountInput : String(teamCountInput).trim();

  if (rawCount === '' || rawCount === null || rawCount === undefined) {
    return {
      isValid: false,
      error: 'Please specify the number of teams.',
      participants,
      teamCountNum: 0,
    };
  }

  const num = Number(rawCount);

  if (isNaN(num)) {
    return {
      isValid: false,
      error: 'Team count must be a valid number.',
      participants,
      teamCountNum: 0,
    };
  }

  if (!Number.isInteger(num)) {
    return {
      isValid: false,
      error: 'Team count must be a whole integer.',
      participants,
      teamCountNum: 0,
    };
  }

  if (num <= 0) {
    return {
      isValid: false,
      error: 'Team count must be greater than zero.',
      participants,
      teamCountNum: 0,
    };
  }

  if (num > participants.length) {
    return {
      isValid: false,
      error: 'Team count cannot be greater than the number of participants.',
      participants,
      teamCountNum: num,
    };
  }

  return {
    isValid: true,
    participants,
    teamCountNum: num,
  };
}

/**
 * Shuffles an array of participants using the Fisher-Yates algorithm.
 * Accepts an optional custom random function for deterministic unit testing.
 */
export function shuffleParticipants<T>(arr: T[], randomFn: () => number = Math.random): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(randomFn() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Distributes shuffled participants into `k` teams evenly.
 * Base size = Math.floor(n / k)
 * Remainder = n % k
 * The first `remainder` teams receive `baseSize + 1` members, remaining teams receive `baseSize`.
 */
export function distributeTeams(participants: string[], teamCount: number): string[][] {
  if (teamCount <= 0 || participants.length === 0) return [];

  const n = participants.length;
  const k = teamCount;
  const baseSize = Math.floor(n / k);
  const remainder = n % k;

  const teams: string[][] = Array.from({ length: k }, () => []);

  let currentIndex = 0;
  for (let i = 0; i < k; i++) {
    const targetSize = i < remainder ? baseSize + 1 : baseSize;
    teams[i] = participants.slice(currentIndex, currentIndex + targetSize);
    currentIndex += targetSize;
  }

  return teams;
}
