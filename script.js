'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");

const homeBtn = document.querySelector(".home-btn")



// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}`;
};

////////////////// fetch functions ////////////////////////////////

// AUTORUN - refresh edince olan şey 
const autorun = async () => {
  const movies = await fetchMovies();
  renderMovies(movies.results);
};



// FETCH NOW_PLAYING MOVIES
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();
};


const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};

// - uses fetchMovie 
// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  const castcrewRes = await fetchActors(movie.id)
  const actorsRes = castcrewRes["cast"].slice(0, 5)
  renderMovie(movieRes, actorsRes);
};

/// esin fetch functions START ///


const fetchActors = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/credits`);
  const res = await fetch(url);
  return res.json();
}
/// esin fetch functions END ///


////////////////// render functions ////////////////////////////////

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


// RENDER ONE MOVIE
const renderMovie = (movie, actors) => {
  console.log(movie)
  console.log(actors)

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
  <div>
  <h3>Actors:</h3>
  <ul id="movie-page-actors-ul-item" class="list-unstyled">
  
  </ul>
  </div>`;
  
  //Render Actors in One Movie Page
  const moviePageActors = document.querySelector("#movie-page-actors-ul-item")
  actors.map((actor => {
    const actorLiElement = document.createElement("li")
    actorLiItem.innerHTML = `
    <img src="${PROFILE_BASE_URL + actor.profile_path}" alt="${actor.profile_path}" >
    <h4 id= "actor-name"> ${actor.name} </h4>
    <p><span style= "color:gray "> ${actor.character} </span> </p>
    `
    // actorLiItem.addEventListener("click", () => {
    //   actorDetails(?????);
    // });
  
    console.log(actorLiElement)
    moviePageActors.appendChild(actorLiElement)
  }))

};






homeBtn.addEventListener("click", autorun );


document.addEventListener("DOMContentLoaded", autorun);

