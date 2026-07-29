// type="module" scripts are strict mode by default — no 'use strict' needed.

const singleModeBtn = document.getElementById('single-mode-btn');
const battleModeBtn = document.getElementById('battle-mode-btn');

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
const battleCardOne = document.getElementById('battle-card-one');
const battleCardTwo = document.getElementById('battle-card-two');

// Grouped so init() can confirm every selector matched before later phases rely on them.
const requiredElements = {
  singleModeBtn,
  battleModeBtn,
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
  battleCardOne,
  battleCardTwo,
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

  if (!response.ok) {
    throw new Error('Something went wrong. Please try again.');
  }

  return response.json();
}

function showLoading() {
  loadingState.hidden = false;
  searchBtn.disabled = true;
}

function hideLoading() {
  loadingState.hidden = true;
  searchBtn.disabled = false;
}

function showError(message) {
  errorMessage.textContent = message;
  errorState.hidden = false;
}

function clearError() {
  errorState.hidden = true;
  errorMessage.textContent = '';
}

function renderProfile(user) {
  profileAvatar.src = user.avatar_url;
  profileName.textContent = user.name || user.login;
  profileUsername.textContent = `@${user.login}`;
  profileBio.textContent = user.bio || 'No bio available.';

  const joinedDate = new Date(user.created_at);
  profileJoined.textContent = `Joined ${joinedDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })}`;

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

  const username = usernameInput.value.trim();

  clearError();

  if (!username) {
    showError('Please enter a GitHub username.');
    return;
  }

  profileCard.hidden = true;
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
    profileCard.hidden = true;
  }
}

function init() {
  const allElementsFound = verifyRequiredElements();

  if (!allElementsFound) {
    console.error('Dev Detective: initialization stopped — fix the missing elements above.');
    return;
  }

  searchForm.addEventListener('submit', handleSearchSubmit);
  usernameInput.addEventListener('input', handleUsernameInput);

  console.log('Dev Detective: all required DOM elements found.');
  console.log('Dev Detective: initialization complete. Single-search API integration active.');
}

init();
