const loginForm = document.querySelector('#login-form');
const articlesList = document.querySelector('#articles-list');
const favoritesList = document.querySelector('#favorites-list');

// Listen for the user to log in
loginForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent the form from submitting

  // Get the username and password from the form
  const username = event.target.elements.username.value;
  const password = event.target.elements.password.value;

  // Clear the form
  event.target.reset();

  // Update the UI to show the username
  const usernameHeading = document.createElement('h3');
  usernameHeading.textContent = `Logged in as ${username}`;
  document.querySelector('header').appendChild(usernameHeading);

  // Load the articles
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

const favoriteButton = document.createElement('button');
favoriteButton.classList.add('favorite-button');
favoriteButton.textContent = 'Favorite';
favoriteButton.addEventListener('click', () => {
  addStoryToFavorites(story);
});
article.appendChild(favoriteButton);

return article;
}

// Add a story to the favorites list
function addStoryToFavorites(story) {
const favorite = createArticleElement(story);
favoritesList.appendChild(favorite);
}

