'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");

const homeBtn = document.querySelector(".home-btn")

// AUTORUN 
const autorun = async () => {
  const movies = await fetchMovies();
  renderMovies(movies.results);
};



// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}`;
};


// FETCH PARTICULAR MOVIE
// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  renderMovie(movieRes);
};

// FETCH NOW_PLAYING MOVIES
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();
};

// FETCH ONE MOVIE
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};

// RENDER MOVIES
const renderMovies = (movies) => {
  CONTAINER.innerHTML = ""
  movies.map((movie) => {
    // console.log(movie)
    const movieDiv = document.createElement("div");
    movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
    } poster">
        <h3>${movie.title}</h3>`;
    
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    
    CONTAINER.appendChild(movieDiv);
    CONTAINER.classList.add("bg-cover", "grid", "grid-cols-1", "gap-4","md:grid-cols-2", "lg:grid-cols-3", "p-20" )
  });


};
// ////////////////////////////////////////////////////////
// FATCH CAST
const fetchActors = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/credits`);
  const res = await fetch(url);
  return res.json();
}
///////////////////////////////////////////////////////////
// RENDER ONE MOVIE
const renderMovie = (movie) => {
  
  console.log(movie)
  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4 bg-yellow ">
             <img id="movie-backdrop" src=${
               BACKDROP_BASE_URL + movie.backdrop_path
             }>
        </div>
        <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${
              movie.release_date
            }</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
        </div>
        </div>
            <h3>Actors:</h3>
            <ul id="actors" class="list-unstyled">
            
            </ul>
    </div>`;

  };
  

homeBtn.addEventListener("click", autorun );


document.addEventListener("DOMContentLoaded", autorun);

