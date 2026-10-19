function parseInput(raw) {
  if (!raw || !raw.trim()) return [];
  return raw
    .split(/[\n\r,]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function distribute(participants, k) {
  const n = participants.length;
  const base = Math.floor(n / k);
  const rem = n % k;
  const teams = [];
  let curr = 0;
  for (let i = 0; i < k; i++) {
    const size = i < rem ? base + 1 : base;
    teams.push(participants.slice(curr, curr + size));
    curr += size;
  }
  return teams;
}

document.addEventListener('DOMContentLoaded', () => {
  const participantsInput = document.getElementById('participants-input');
  const teamCountInput = document.getElementById('team-count-input');
  const generateBtn = document.getElementById('generate-teams-button');
  const resetBtn = document.getElementById('reset-button');
  const errorMsg = document.getElementById('error-message');
  const teamsOutput = document.getElementById('teams-output');

  function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.style.display = 'block';
    teamsOutput.innerHTML = '';
  }

  function clearError() {
    errorMsg.textContent = '';
    errorMsg.style.display = 'none';
  }

  generateBtn.addEventListener('click', () => {
    clearError();
    const names = parseInput(participantsInput.value);
    const countVal = teamCountInput.value.trim();

    if (names.length === 0) {
      showError('Please enter at least one participant name.');
      return;
    }
    if (!countVal) {
      showError('Please specify the number of teams.');
      return;
    }
    const k = Number(countVal);
    if (isNaN(k) || !Number.isInteger(k) || k <= 0) {
      showError('Team count must be a positive integer.');
      return;
    }
    if (k > names.length) {
      showError('Team count cannot exceed the number of participants.');
      return;
    }

    const shuffled = shuffle(names);
    const teams = distribute(shuffled, k);

    teamsOutput.innerHTML = '';
    teams.forEach((team, idx) => {
      const card = document.createElement('div');
      card.className = 'team-card';
      card.setAttribute('data-testid', `team-${idx + 1}`);

      const header = document.createElement('h4');
      header.textContent = `Team ${idx + 1} (${team.length})`;
      card.appendChild(header);

      const ul = document.createElement('ul');
      team.forEach((m) => {
        const li = document.createElement('li');
        li.textContent = m;
        ul.appendChild(li);
      });
      card.appendChild(ul);
      teamsOutput.appendChild(card);
    });
  });

  resetBtn.addEventListener('click', () => {
    participantsInput.value = '';
    teamCountInput.value = '';
    clearError();
    teamsOutput.innerHTML = '';
  });
});
