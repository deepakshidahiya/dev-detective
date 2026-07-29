// type="module" scripts are strict mode by default — no 'use strict' needed.

const singleModeBtn = document.getElementById('single-mode-btn');
const battleModeBtn = document.getElementById('battle-mode-btn');
const singleSearchSection = document.getElementById('single-search-section');

const searchForm = document.getElementById('search-form');
const usernameInput = document.getElementById('username-input');
const searchBtn = document.getElementById('search-btn');
const loadingState = document.getElementById('loading-state');
const errorState = document.getElementById('error-state');
const errorMessage = document.getElementById('error-message');

const profileCard = document.getElementById('profile-card');
const profileAvatar = document.getElementById('profile-avatar');
const profileName = document.getElementById('profile-name');
const profileUsername = document.getElementById('profile-username');
const profileBio = document.getElementById('profile-bio');
const profileJoined = document.getElementById('profile-joined');
const profileLink = document.getElementById('profile-link');

const repoListSection = document.getElementById('repo-list-section');
const repoList = document.getElementById('repo-list');

const battleModeSection = document.getElementById('battle-mode-section');
const battleForm = document.getElementById('battle-form');
const battleUsernameOne = document.getElementById('battle-username-one');
const battleUsernameTwo = document.getElementById('battle-username-two');
const battleSubmitBtn = document.getElementById('battle-submit-btn');
const battleLoadingState = document.getElementById('battle-loading-state');
const battleErrorState = document.getElementById('battle-error-state');
const battleErrorMessage = document.getElementById('battle-error-message');

const battleResult = document.getElementById('battle-result');
const battleScore = document.getElementById('battle-score');
const battleCardOne = document.getElementById('battle-card-one');
const battleCardTwo = document.getElementById('battle-card-two');
const battleResetBtn = document.getElementById('battle-reset-btn');

// Grouped so init() can confirm every selector matched before later phases rely on them.
const requiredElements = {
  singleModeBtn,
  battleModeBtn,
  singleSearchSection,
  searchForm,
  usernameInput,
  searchBtn,
  loadingState,
  errorState,
  errorMessage,
  profileCard,
  profileAvatar,
  profileName,
  profileUsername,
  profileBio,
  profileJoined,
  profileLink,
  repoListSection,
  repoList,
  battleModeSection,
  battleForm,
  battleUsernameOne,
  battleUsernameTwo,
  battleSubmitBtn,
  battleLoadingState,
  battleErrorState,
  battleErrorMessage,
  battleResult,
  battleScore,
  battleCardOne,
  battleCardTwo,
  battleResetBtn,
};

function verifyRequiredElements() {
  const missing = Object.entries(requiredElements)
    .filter(([, element]) => !element)
    .map(([name]) => name);

  if (missing.length > 0) {
    console.error('Dev Detective: missing expected DOM elements:', missing);
    return false;
  }

  return true;
}

async function fetchGithubUser(username) {
  let response;

  try {
    response = await fetch(`https://api.github.com/users/${username}`);
  } catch (networkError) {
    throw new Error('Network error. Check your connection and try again.');
  }

  if (response.status === 404) {
    throw new Error('User not found. Check the username and try again.');
  }

  if (response.status === 403) {
    throw new Error("GitHub API rate limit reached. Please wait a bit and try again.");
  }

  if (!response.ok) {
    throw new Error('Something went wrong. Please try again.');
  }

  return response.json();
}

function formatJoinDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function setLoadingVisible(loadingEl, submitBtn, isVisible) {
  loadingEl.hidden = !isVisible;
  submitBtn.disabled = isVisible;
}

function setErrorMessage(errorEl, messageEl, message) {
  messageEl.textContent = message;
  errorEl.hidden = !message;
}

function showLoading() {
  setLoadingVisible(loadingState, searchBtn, true);
}

function hideLoading() {
  setLoadingVisible(loadingState, searchBtn, false);
}

function showError(message) {
  setErrorMessage(errorState, errorMessage, message);
}

function clearError() {
  setErrorMessage(errorState, errorMessage, '');
}

function resetProfileCard() {
  profileCard.hidden = true;
  profileAvatar.removeAttribute('src');
  profileName.textContent = '';
  profileUsername.textContent = '';
  profileBio.textContent = '';
  profileJoined.textContent = '';
  profileLink.textContent = '';
  profileLink.href = '';
}

function renderProfile(user) {
  profileAvatar.src = user.avatar_url;
  profileName.textContent = user.name || user.login;
  profileUsername.textContent = `@${user.login}`;
  profileBio.textContent = user.bio || 'No bio available.';
  profileJoined.textContent = `Joined ${formatJoinDate(user.created_at)}`;

  if (user.blog) {
    profileLink.href = user.blog.startsWith('http') ? user.blog : `https://${user.blog}`;
    profileLink.textContent = 'Visit portfolio';
  } else {
    profileLink.href = user.html_url;
    profileLink.textContent = 'View GitHub profile';
  }

  profileCard.hidden = false;
}

async function handleSearchSubmit(event) {
  event.preventDefault();

  if (searchBtn.disabled) {
    return;
  }

  const username = usernameInput.value.trim();

  clearError();

  if (!username) {
    showError('Please enter a GitHub username.');
    return;
  }

  resetProfileCard();
  showLoading();

  try {
    const user = await fetchGithubUser(username);
    renderProfile(user);
  } catch (error) {
    showError(error.message);
  } finally {
    hideLoading();
  }
}

function handleUsernameInput() {
  clearError();

  if (usernameInput.value.trim() === '') {
    resetProfileCard();
  }
}

function switchToSingleSearch() {
  singleModeBtn.classList.add('mode-btn--active');
  battleModeBtn.classList.remove('mode-btn--active');
  singleSearchSection.hidden = false;
  battleModeSection.hidden = true;
}

function switchToBattleMode() {
  battleModeBtn.classList.add('mode-btn--active');
  singleModeBtn.classList.remove('mode-btn--active');
  battleModeSection.hidden = false;
  singleSearchSection.hidden = true;
}

function showBattleLoading() {
  setLoadingVisible(battleLoadingState, battleSubmitBtn, true);
}

function hideBattleLoading() {
  setLoadingVisible(battleLoadingState, battleSubmitBtn, false);
}

function showBattleError(message) {
  setErrorMessage(battleErrorState, battleErrorMessage, message);
}

function clearBattleError() {
  setErrorMessage(battleErrorState, battleErrorMessage, '');
}

function handleBattleUsernameInput() {
  clearBattleError();

  if (!battleUsernameOne.value.trim() || !battleUsernameTwo.value.trim()) {
    battleResult.hidden = true;
  }
}

function createStatRow(label, value, isWinning) {
  const row = document.createElement('li');
  row.className = isWinning ? 'battle-stat battle-stat--winning' : 'battle-stat';

  const labelEl = document.createElement('span');
  labelEl.className = 'battle-stat__label';
  labelEl.textContent = label;

  const valueEl = document.createElement('span');
  valueEl.className = 'battle-stat__value';
  valueEl.textContent = value;

  if (isWinning) {
    const hint = document.createElement('span');
    hint.className = 'visually-hidden';
    hint.textContent = ' (winning category)';
    valueEl.append(hint);
  }

  row.append(labelEl, valueEl);
  return row;
}

function renderBattleCard(cardEl, user, categoryWins) {
  cardEl.textContent = '';
  cardEl.classList.remove('battle-card--winner', 'battle-card--loser');

  const avatar = document.createElement('img');
  avatar.className = 'battle-card__avatar';
  avatar.src = user.avatar_url;
  avatar.alt = `${user.name || user.login} avatar`;

  const name = document.createElement('h3');
  name.className = 'battle-card__name';
  name.textContent = user.name || user.login;

  const username = document.createElement('p');
  username.className = 'battle-card__username';
  username.textContent = `@${user.login}`;

  const stats = document.createElement('ul');
  stats.className = 'battle-card__stats';
  stats.append(
    createStatRow('Followers', user.followers, categoryWins.followers),
    createStatRow('Following', user.following, false),
    createStatRow('Public Repos', user.public_repos, categoryWins.publicRepos),
    createStatRow('Joined', formatJoinDate(user.created_at), categoryWins.accountAge),
  );

  const badge = document.createElement('p');
  badge.className = 'battle-card__badge';
  badge.hidden = true;

  cardEl.append(avatar, name, username, stats, badge);

  return badge;
}

function compareBattleCategories(userOne, userTwo) {
  const categories = {
    followers: [userOne.followers, userTwo.followers],
    publicRepos: [userOne.public_repos, userTwo.public_repos],
    // Negated timestamps so "higher value wins" applies uniformly — an older account
    // (smaller timestamp) should win, which becomes a larger number once negated.
    accountAge: [-new Date(userOne.created_at).getTime(), -new Date(userTwo.created_at).getTime()],
  };

  const winsOne = {};
  const winsTwo = {};
  let scoreOne = 0;
  let scoreTwo = 0;

  for (const [key, [valueOne, valueTwo]] of Object.entries(categories)) {
    winsOne[key] = valueOne > valueTwo;
    winsTwo[key] = valueTwo > valueOne;

    if (winsOne[key]) scoreOne++;
    if (winsTwo[key]) scoreTwo++;
  }

  return { scoreOne, scoreTwo, winsOne, winsTwo };
}

function renderBattleResult(userOne, userTwo) {
  const { scoreOne, scoreTwo, winsOne, winsTwo } = compareBattleCategories(userOne, userTwo);

  const badgeOne = renderBattleCard(battleCardOne, userOne, winsOne);
  const badgeTwo = renderBattleCard(battleCardTwo, userTwo, winsTwo);

  battleScore.textContent = `${scoreOne} - ${scoreTwo}`;

  if (scoreOne === scoreTwo) {
    badgeOne.textContent = "It's a tie";
    badgeTwo.textContent = "It's a tie";
  } else if (scoreOne > scoreTwo) {
    badgeOne.textContent = 'Winner';
    battleCardOne.classList.add('battle-card--winner');
    badgeTwo.textContent = 'Loser';
    battleCardTwo.classList.add('battle-card--loser');
  } else {
    badgeTwo.textContent = 'Winner';
    battleCardTwo.classList.add('battle-card--winner');
    badgeOne.textContent = 'Loser';
    battleCardOne.classList.add('battle-card--loser');
  }

  badgeOne.hidden = false;
  badgeTwo.hidden = false;
  battleResult.hidden = false;
}

function describeBattleFailure(resultOne, resultTwo) {
  if (resultOne.status === 'rejected' && resultTwo.status === 'rejected') {
    return 'Neither username could be found. Check both and try again.';
  }

  if (resultOne.status === 'rejected') {
    return `Player One: ${resultOne.reason.message}`;
  }

  return `Player Two: ${resultTwo.reason.message}`;
}

function handleBattleReset() {
  battleUsernameOne.value = '';
  battleUsernameTwo.value = '';
  clearBattleError();
  battleResult.hidden = true;
  battleUsernameOne.focus();
}

async function handleBattleSubmit(event) {
  event.preventDefault();

  if (battleSubmitBtn.disabled) {
    return;
  }

  const usernameOne = battleUsernameOne.value.trim();
  const usernameTwo = battleUsernameTwo.value.trim();

  clearBattleError();

  if (!usernameOne || !usernameTwo) {
    showBattleError('Please enter both GitHub usernames.');
    return;
  }

  battleResult.hidden = true;
  showBattleLoading();

  const [resultOne, resultTwo] = await Promise.allSettled([
    fetchGithubUser(usernameOne),
    fetchGithubUser(usernameTwo),
  ]);

  hideBattleLoading();

  if (resultOne.status === 'rejected' || resultTwo.status === 'rejected') {
    showBattleError(describeBattleFailure(resultOne, resultTwo));
    return;
  }

  renderBattleResult(resultOne.value, resultTwo.value);
}

function init() {
  const allElementsFound = verifyRequiredElements();

  if (!allElementsFound) {
    console.error('Dev Detective: initialization stopped — fix the missing elements above.');
    return;
  }

  searchForm.addEventListener('submit', handleSearchSubmit);
  usernameInput.addEventListener('input', handleUsernameInput);
  singleModeBtn.addEventListener('click', switchToSingleSearch);
  battleModeBtn.addEventListener('click', switchToBattleMode);
  battleForm.addEventListener('submit', handleBattleSubmit);
  battleUsernameOne.addEventListener('input', handleBattleUsernameInput);
  battleUsernameTwo.addEventListener('input', handleBattleUsernameInput);
  battleResetBtn.addEventListener('click', handleBattleReset);
}

init();
