const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOWZkMWUyNTE0OTgzYWVkODc4N2Y0ZThlN2IwZGFmZCIsIm5iZiI6MTc1MzEwMTU1Ni4yOTMsInN1YiI6IjY4N2UzNGY0Mjc0YjA5MWY3NjUyOGY3NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Y7LqI4nVTIqGOxo4C0MOIe2kH0W9VBOa51m3P5mtd6U'
  }
}

const TESTAFFICHAGE = document.getElementById('testAffichage')

async function showHomePage(id){
  const container = document.createElement('div');
  container.className = "divFilm"

  const img = document.createElement('img');
  img.src = await urlImage(id);
  img.width = 250
  img.alt = 'afficheFilm';
  img.className = "imageFilm"

  const title = document.createElement('p');
  title.className = "titreFilm"
  title.textContent = await urlTitle(id);

  container.appendChild(img);
  container.appendChild(title);

  TESTAFFICHAGE.appendChild(container);
}

async function urlImage(id) {
  const RESPONSE = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=fr-FR`, options)
  const FILMS = await RESPONSE.json()
  return `https://image.tmdb.org/t/p/original${FILMS.poster_path}`
}

// On récupère le titre
async function urlTitle(id){
  const RESPONSE = await fetch (`https://api.themoviedb.org/3/movie/${id}?language=fr-FR`, options)
  const FILMS = await RESPONSE.json()
  return FILMS.title
}

//On récupère la description
async function  urlDescription(id){
  const RESPONSE = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=fr-FR`, options)
  const FILMS = await RESPONSE.json()
  return FILMS.overview
}

//On récupère le genre
async function  urlGenres(id){
  const RESPONSE = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=fr-FR`, options)
  const FILMS = await RESPONSE.json()
  return FILMS.genres[0].name // tableau
}

//On récupère la date de sortie
async function  urlReleaseDate(id){
  const RESPONSE = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=fr-FR`, options)
  const FILMS = await RESPONSE.json()
  return FILMS.release_date
}

//On récupère la durée du film
async function  urlRuntime(id){
  const RESPONSE = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=fr-FR`, options)
  const FILMS = await RESPONSE.json()
  return FILMS.runtime
}

//On récupère la note donnée au film par les utilisateurs 
async function  urlNote(id){
  const RESPONSE = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=fr-FR`, options)
  const FILMS = await RESPONSE.json()
  return FILMS.vote_average
}

showHomePage(629)
showHomePage(620)

async function test(){
  console.log(await urlDescription(629))
  console.log(await urlGenres(629))
  console.log(await urlReleaseDate(629))
  console.log(await urlRuntime(629))
  console.log(await urlNote(629))
}

test()

//----------------------------------------------------------------------------------------------------------------------------------------
// fetch('https://api.themoviedb.org/3/trending/movie/day?language=fr-FR', options)
//   .then(res => res.json())
//   .then(res => console.log(res.results[0].id)) // on récupère l'id des films
//   .catch(err => console.error(err));

// fetch("https://api.themoviedb.org/3/movie/552524?language=fr-FR ", options)
//   .then(res => res.json())
//   .then(res => console.log(res))
//   .then(TESTAFFICHAGE.innerHTML = `<img src="https://image.tmdb.org/t/p/original${res.poster_path}" alt="afficheFilm">`)
//   .catch(err => console.error(err));



// async function afficherAffiche() {
//   try {

//     const RESPONSE = await fetch('https://api.themoviedb.org/3/movie/552524?language=fr-FR', options)
//     const FILMS = await RESPONSE.json()

//     afficheImage(FILMS)

//   } catch (error) {
//     TESTAFFICHAGE.innerHTML = "Désolé, nous n'avons pas pu charger l'affiche du film"
//     console.error(error)
//   }
// }
