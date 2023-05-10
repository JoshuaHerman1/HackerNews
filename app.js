const loginForm = document.querySelector('#login-form');
const articlesList = document.querySelector('#articles-list');
const favoritesList = document.querySelector('#favorites-list');
const loginMessage = document.querySelector('#login-message');

let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; // Retrieve login status from local storage

// Check login status on page load
if (isLoggedIn) {
  const username = localStorage.getItem('username');
  showLoggedInUI(username);
  loadFavorites();
} else {
  showLoginForm();
}

// Listen for the user to log in
loginForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent the form from submitting

  // Get the username and password from the form
  const username = event.target.elements.username.value;
  const password = event.target.elements.password.value;

  // Clear the form
  event.target.reset();

  // Update the UI to show the username and change the login message
  if (!isLoggedIn) {
    showLoggedInUI(username);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', username);
  }

  loadFavorites();
  loadArticles();
});

// Load the top articles from Hacker News and display them on the page
function loadArticles() {
  // Get the IDs of the top stories from the Hacker News API
  fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
    .then(response => response.json())
    .then((storyIds) => {
      // Get the top 10 stories
      const topStoryIds = storyIds.slice(0, 30);

      // Load the details for each story
      Promise.all(topStoryIds.map(getStoryDetails))
        .then((stories) => {
          // Clear the existing articles
          articlesList.innerHTML = '';

          // Add each article to the list
          stories.forEach((story) => {
            const article = createArticleElement(story);
            articlesList.appendChild(article);
          });
        });
    });
}

// Get the details for a story by ID
function getStoryDetails(storyId) {
  return fetch(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`)
    .then(response => response.json());
}

// Create an article element
function createArticleElement(story) {
  const article = document.createElement('li');
  article.classList.add('article');

  const titleLink = document.createElement('a');
  titleLink.classList.add('article-title');
  titleLink.textContent = story.title;
  titleLink.href = story.url;
  article.appendChild(titleLink);

  const urlLink = document.createElement('a');
  urlLink.classList.add('article-url');
  urlLink.textContent = story.url;
  urlLink.href = story.url;
  article.appendChild(urlLink);

  if (isLoggedIn) {
    const favoriteButton = document.createElement('button');
    favoriteButton.classList.add('favorite-button');
    const starIcon = document.createElement('i');
    starIcon.classList.add('fas', 'fa-star');
    favoriteButton.appendChild(starIcon);
    favoriteButton.addEventListener('click', () => {
      addStoryToFavorites(story);
    });
    article.appendChild(favoriteButton);
  }

  return article;
}

// Add a story to the favorites list
function addStoryToFavorites(story) {
  const favorite = createArticleElement(story);
  favoritesList.appendChild(favorite);
}

// Show login form
function showLoginForm() {
  loginForm.style.display = 'block';
  loginMessage.textContent = 'Please log in to add your favorites';
}

// Show logged-in UI
function showLoggedInUI(username) {
  loginForm.style.display = 'none';
  const usernameHeading = document.createElement('h3');
  usernameHeading.textContent = `Logged in as ${username}`;
  document.querySelector('header').appendChild(usernameHeading);
  isLoggedIn = true;
  loginMessage.textContent = 'Add your favorites by clicking the star icon!';

  // Remove the login form
  loginForm.remove();
}

// Load the favorites from local storage and display them on the page
function loadFavorites() {
  favoritesList.innerHTML = ''; // Clear existing favorites

  // Retrieve favorites from local storage
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  // Create favorite articles
  favorites.forEach((favorite) => {
    const article = createArticleElement(favorite);
    favoritesList.appendChild(article);
  });
}

// Add a story to the favorites list
function addStoryToFavorites(story) {
  const favorite = createArticleElement(story);
  favoritesList.appendChild(favorite);

  // Save favorites to local storage
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  favorites.push(story);
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

