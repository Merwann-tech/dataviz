const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOWZkMWUyNTE0OTgzYWVkODc4N2Y0ZThlN2IwZGFmZCIsIm5iZiI6MTc1MzEwMTU1Ni4yOTMsInN1YiI6IjY4N2UzNGY0Mjc0YjA5MWY3NjUyOGY3NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Y7LqI4nVTIqGOxo4C0MOIe2kH0W9VBOa51m3P5mtd6U'
  }
}

const TESTAFFICHAGE = document.getElementById('testAffichage')

async function afficheImage(id) {
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
  let image = `https://image.tmdb.org/t/p/original${FILMS.poster_path}`
  return image
}


async function urlTitle(id){
  const RESPONSE = await fetch (`https://api.themoviedb.org/3/movie/${id}?language=fr-FR`, options)
  const FILMS = await RESPONSE.json()
  return FILMS.title
}

afficheImage(500)

afficheImage(620)



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
