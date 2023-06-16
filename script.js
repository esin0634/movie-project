'use strict';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");

const YOUTUBE_BASE_URL = "https://www.youtube.com/watch?v="

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
  const urL = constructUrl(`movie/${movieId}`);
  const res = await fetch(urL);
  return res.json();
};

// - uses fetchMovie 
// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);

  const castcrewRes = await fetchActors(movie.id)
  const directorRes = castcrewRes.crew.filter(({job})=> job ==='Director')
  const actorsRes = castcrewRes["cast"].slice(0, 5)
  
  const similarMovieList =  await fetchSimilarMovies(movie.id)
  const similarMoviesRes= similarMovieList["results"].slice(0, 5)

  const videosRes = await fetchVideos(movie.id)
  const trailerRes = videosRes["results"].pop()

  renderMovie(movieRes, actorsRes, similarMoviesRes, trailerRes, directorRes);
};

const actorDetails = async ( actor ) =>{
  const actorRes = await fetchActor(actor.id)
  const actorMoviesRes = await fetchActorMovies(actor.id)
  renderActor(actorRes, actorMoviesRes)

}

/// esin fetch functions START ///
const fetchActorMovies = async ( actorId ) =>{
  const url = constructUrl(`/person/${actorId}/movie_credits`);
  const res = await fetch(url);
  return res.json();
}




const fetchActor = async ( actorId ) =>{
  const url = constructUrl(`/person/${actorId}`);
  const res = await fetch(url);
  return res.json();
}


const fetchActors = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/credits`);
  const res = await fetch(url);
  return res.json();
}

const fetchSimilarMovies = async (movieId) =>{
  const url = constructUrl(`/movie/${movieId}/similar`)
  const res = await fetch(url)
  return res.json()
}

const fetchVideos = async (movieId) =>{
  const url = constructUrl(`/movie/${movieId}/videos`)
  const res = await fetch(url)
  return res.json()
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
const renderMovie = (movie, actors, similarMovies, trailerRes, directorRes) => {
  console.log(movie)
  // Render Trailer start//
   const movieKey = trailerRes["key"]
   const videoSrc = YOUTUBE_BASE_URL+movieKey
   const directors = directorRes.map((director) => director.name)
   console.log(directors)

   console.log(videoSrc)
  //Render Trailer end // 

  let language
  if (movie.original_language === "en"){
    language = "English"
  }else{
    language = "?"
  }

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
  <p id="language"> <b>Language:</b> ${language} </p>
  <h3><b>Overview:</b></h3>
  <p id="movie-overview">${movie.overview}</p>
  </div>
  <div>
  <p id="production-company"> <b>Production Company:</b>${movie["production_companies"][0]["name"]} </p>
  <img id="movie-backdrop" src=${
    BACKDROP_BASE_URL + movie["production_companies"][0]["logo_path"]
  }>
  </div>
  <p id="director"> <b>Director:</b> ${directors} </p>
  
  <p id="movie-rating"> <b>Movie Rating:</b> ${movie.vote_average} </p>
  <p id="movie-votes"> <b>Movie Votes:</b> ${movie.vote_count} </p>

  <div>
  <h3>Actors:</h3>
  <ul id="movie-page-actors-ul-item" class="flex flex-row">
  <!-- actors  -->
  </ul>
  </div>
  
  <div>
  <h3>Similar Movies:</h3>
  <ul id="similar-movies-ul-item" class="flex flex-row">
  <!-- similar movies  -->
  </ul>
  </div>

  <div>
  <!-- trailer -->
  <!-- Embed YouTube video -->
        <iframe width="560" height="315" src="${videoSrc}" frameborder="0" allowfullscreen></iframe>
  </video>

  </div>

  `;
  
  //Render Actors in One Movie Page start //
  const moviePageActors = document.querySelector("#movie-page-actors-ul-item")
  actors.map((actor) => {
    const actorElement = document.createElement("div")
    actorElement.innerHTML = `
    <img src="${PROFILE_BASE_URL + actor.profile_path}" alt="${actor.profile_path}" >
    <h4 id= "actor-name"> ${actor.name} </h4>
    <p><span style= "color:gray "> ${actor.character} </span> </p>
    `;

    actorElement.addEventListener("click", () =>{
      actorDetails(actor)
      // console.log(actor)
    } );
    
    moviePageActors.appendChild(actorElement)
  });
  //Render Actors in One Movie Page end //

  
  //Render Similar Movies start //
  const  similarMoviesUl = document.querySelector("#similar-movies-ul-item")
  similarMovies.map((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
    } poster">
        <h3>${movie.title}</h3>`;
    
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });

    similarMoviesUl.appendChild(movieDiv)
  });
  //Render Similar Movies end //

};


const renderActor = (actorRes, actorMoviesRes) =>{
  
  const actorMovies = actorMoviesRes.cast.splice(0,5)
  console.log(actorMovies)

  CONTAINER.innerHTML = `
    <div class="row">
      <h1>${actorRes.name} </h1>
      <p> Gender: ${actorRes.gender === 2 ? "male" : "female"}
      <img src="${PROFILE_BASE_URL + actorRes.profile_path}" alt="${actorRes.profile_path}" >
      <p> <span> Popularity : </span> ${actorRes.popularity} </p>
      <p> <span> Birthday : </span> ${actorRes.birthday} </p>
      ${actorRes.deathday !== null ? ` <p> <span> Deathday : </span> ${actorRes.deathday} </p>` : ""}
      <p> <span> Biography : </span> ${actorRes.biography}
      <div>
        <h3>Actor Movies:</h3>
        <ul id="actor-movies-ul-item" class="flex flex-row">
        <!-- similar movies  -->
        </ul>
      </div>

    </div>
  
  `
  
  // movies the actor participated in Render 
  const actorMoviesUl = document.querySelector("#actor-movies-ul-item")
  actorMovies.map((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
    } poster">
        <h3>${movie.title}</h3>`;
    
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });

    actorMoviesUl.appendChild(movieDiv)
  });
  
}





homeBtn.addEventListener("click", autorun );


document.addEventListener("DOMContentLoaded", autorun);

//git branch deneme