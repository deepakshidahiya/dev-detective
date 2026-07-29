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

function init() {
  const allElementsFound = verifyRequiredElements();

  if (!allElementsFound) {
    console.error('Dev Detective: initialization stopped — fix the missing elements above.');
    return;
  }

  console.log('Dev Detective: all required DOM elements found.');
  console.log('Dev Detective: initialization complete. Ready for Phase 2 (API integration).');
}

init();
