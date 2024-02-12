// script.js
const apiKey = '774c4aa1';
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];


searchInput.addEventListener('input', debounce(searchMovies, 500));

async function searchMovies() {
  const searchTerm = searchInput.value.trim();
  if (searchTerm === '') {
    searchResults.innerHTML = '';
    return;
  }

  const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${searchTerm}`);
  const data = await response.json();
  if (data.Search) {
    displayMovies(data.Search);
  } else {
    searchResults.innerHTML = '<p>No results found</p>';
  }
}

function displayMovies(movies) {
    searchResults.innerHTML = movies.map(movie => {
      if (movie.imdbID) {
        return `
          <div class="movie">
            <img src="${movie.Poster}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <button class="favorite-btn" data-imdbid="${movie.imdbID}">Add to Favorites</button>
          </div>
        `;
      } else {
        return ''; // Exclude movies without IMDb ID
      }
    }).join('');
  
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    favoriteButtons.forEach(button => {
      button.addEventListener('click', addToFavorites);
    });
  }
  
  

  function addToFavorites(event) {
    const button = event.currentTarget; // Log dataset object
    const imdbID = button.dataset.imdbid;
    console.log(imdbID)
    const movie = favorites.find(m => m && m.imdbID === imdbID);
    if (!movie) {
      const title = button.previousElementSibling.textContent;
      favorites.push({ imdbID, title });
      localStorage.setItem('favorites', JSON.stringify(favorites));
      alert(`${title} added to favorites!`);
    } else {
      alert('Movie already in favorites!');
    }
  }
  
  function displayFavoriteMovies() {
    const favoriteMoviesContainer = document.getElementById('favoriteMovies');
    favoriteMoviesContainer.innerHTML = '';
  
    // Retrieve favorite movies from localStorage
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  
    if (favorites.length === 0) {
      favoriteMoviesContainer.innerHTML = '<p>No favorite movies yet!</p>';
      return;
    }
  
    favorites.forEach(movie => {
      if (movie) { // Check if movie is not null or undefined
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        movieElement.innerHTML = `
          <img src="https://via.placeholder.com/150" alt="${movie.title || 'Movie Title'}">
          <h3>${movie.title || 'Movie Title'}</h3>
          <button class="remove-btn" data-imdbid="${movie.imdbID}">Remove from Favorites</button>
        `;
        favoriteMoviesContainer.appendChild(movieElement);
  
        // Fetch the actual movie poster and update the img src
        fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`)
          .then(response => response.json())
          .then(data => {
            const poster = data.Poster;
            if (poster !== 'N/A') {
              movieElement.querySelector('img').src = poster;
            }
          })
          .catch(error => console.error('Error fetching poster:', error));
      }
    });
  
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
      button.addEventListener('click', removeFromFavorites);
    });
  }
  
  
  function removeFromFavorites(event) {
    const imdbID = event.target.dataset.imdbid;
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const index = favorites.findIndex(movie => movie && movie.imdbID === imdbID);
    if (index !== -1) {
      favorites.splice(index, 1);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      displayFavoriteMovies();
      alert('Movie removed from favorites!');
    }
  }
  

function debounce(func, delay) {
  let timeoutId;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}
