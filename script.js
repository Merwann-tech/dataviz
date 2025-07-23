const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOWZkMWUyNTE0OTgzYWVkODc4N2Y0ZThlN2IwZGFmZCIsIm5iZiI6MTc1MzEwMTU1Ni4yOTMsInN1YiI6IjY4N2UzNGY0Mjc0YjA5MWY3NjUyOGY3NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Y7LqI4nVTIqGOxo4C0MOIe2kH0W9VBOa51m3P5mtd6U'
  }
}

const TESTAFFICHAGE = document.getElementById('testAffichage')
const PREVIOUSBUTTON = document.getElementById('previousButton') // pour aller à la page d'avant
const NEXTBUTTON = document.getElementById('nextButton') // pour aller à la page d'après

async function showHomePage(filmData) {
  for(let i=0;i<filmData.results.length;i++){
  const container = document.createElement('div');
  container.className = "card"

  const cardImage = document.createElement('div');
  cardImage.className= "card-image"


  const img = document.createElement('img');
  img.src = await urlImage(filmData.results[i].poster_path);
  // img.width = 250
  img.alt = 'afficheFilm';
  img.className = "imageFilm"

  cardImage.appendChild(img);

  const cardHeader = document.createElement('div');
  cardHeader.className = "card-content"


  const title = document.createElement('p');
  title.className = "media-content"
  title.textContent = filmData.results[i].title;

  cardHeader.appendChild(title);


  container.appendChild(cardImage);
  container.appendChild(cardHeader);
  

  TESTAFFICHAGE.appendChild(container);
  }
}

async function urlImage(poster_path) {
  return `https://image.tmdb.org/t/p/w500${poster_path}`
}


async function infoFilm(id) {
  const RESPONSE = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=fr-FR`, options)
  const FILM = await RESPONSE.json()
  return FILM
}



async function trendingMovies(page){
  const RESPONSE = await fetch (`https://api.themoviedb.org/3/trending/movie/day?language=fr-FR&page=${page}`, options)
  const FILMS = await RESPONSE.json()
  return FILMS
}

showHomePage(await trendingMovies(4))

//------------------------------------------------------------------------------------------------------------------------------------
// on doit ajouter des addEventListener('click', *fonction*) sur les boutons previews et next
