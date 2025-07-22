const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOWZkMWUyNTE0OTgzYWVkODc4N2Y0ZThlN2IwZGFmZCIsIm5iZiI6MTc1MzEwMTU1Ni4yOTMsInN1YiI6IjY4N2UzNGY0Mjc0YjA5MWY3NjUyOGY3NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Y7LqI4nVTIqGOxo4C0MOIe2kH0W9VBOa51m3P5mtd6U'
  }
}

const TESTAFFICHAGE = document.getElementById('testAffichage')

async function afficherAffiche() {
  try {

    const RESPONSE = await fetch('https://api.themoviedb.org/3/movie/552524?language=fr-FR', options)
    const FILMS = await RESPONSE.json()

    afficheImage(FILMS)

  } catch (error) {
    TESTAFFICHAGE.innerHTML = "Désolé, nous n'avons pas pu charger l'affiche du film"
    console.error(error)
  }
}

async function afficheImage(id) {
  TESTAFFICHAGE.innerHTML = `<img src="${await urlImage(id)}" alt="afficheFilm">`

  
}

async function urlImage(id) {
  const RESPONSE = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=fr-FR`, options)
  const FILMS = await RESPONSE.json()
  console.log(FILMS)
  let image = `https://image.tmdb.org/t/p/original${FILMS.poster_path}`
  return image
}
afficheImage(500)



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
