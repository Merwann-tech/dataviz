const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOWZkMWUyNTE0OTgzYWVkODc4N2Y0ZThlN2IwZGFmZCIsIm5iZiI6MTc1MzEwMTU1Ni4yOTMsInN1YiI6IjY4N2UzNGY0Mjc0YjA5MWY3NjUyOGY3NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Y7LqI4nVTIqGOxo4C0MOIe2kH0W9VBOa51m3P5mtd6U",
  },
};
//******************************************************************************************************************************************************* */
const HEADER = document.getElementById("headerMovie");
const HOMEPAGE = document.getElementById("homePage");
const PREVIOUSBUTTON = document.getElementById("previousButton"); // pour aller à la page d'avant
const NEXTBUTTON = document.getElementById("nextButton"); // pour aller à la page d'après
const CURRENTPAGE = document.getElementById("currentPage");
const PAGE1 = document.getElementById("Page1");
const MAXPAGE = document.getElementById("maxPage");
const SELECTIONPAGE1 = document.getElementById("selectionPage1");
const SELECTIONPAGE2 = document.getElementById("selectionPage2");
const SELECTIONPAGE3 = document.getElementById("selectionPage3");
const SELECTIONPAGE4 = document.getElementById("selectionPage4");
const page = document.getElementById("Page");
const BODY = document.getElementById("body");

const TRANSITION_DURATION = 800;
const SLIDE_INTERVAL = 10000 + TRANSITION_DURATION;
//******************************************************************************************************************************************************* */
let backupBody = BODY.innerHTML
let currentpage = 1;
let currentCategorie = 1
let totalPages = 100;
let slide = 0;
//******************************************************************************************************************************************************* */
//Affichage du tableau des films, avec image et titre avec le frameWork Bulma
async function showHomePage(filmData) {
  HOMEPAGE.innerHTML = "";
  for (let i = 0; i < filmData.results.length; i++) {
    const container = document.createElement("div");
    container.className = "card";
    container.addEventListener('click', showDetail)
    container.setAttribute("id", filmData.results[i].id)

    const cardImage = document.createElement("div");
    cardImage.className = "card-image";
    cardImage.setAttribute("id", filmData.results[i].id)

    const img = document.createElement("img");
    img.src = await urlImage(filmData.results[i].poster_path);
    // img.width = 250
    img.alt = "afficheFilm";
    img.className = "imageFilm";
    img.setAttribute("id", filmData.results[i].id)

    cardImage.appendChild(img);

    const cardHeader = document.createElement("div");
    cardHeader.className = "card-content";
    cardHeader.setAttribute("id", filmData.results[i].id)

    const title = document.createElement("p");
    title.className = "media-content";
    title.textContent = filmData.results[i].title;
    title.setAttribute("id", filmData.results[i].id)

    cardHeader.appendChild(title);
    cardHeader.setAttribute("id", filmData.results[i].id)

    container.appendChild(cardImage);
    container.appendChild(cardHeader);

    HOMEPAGE.appendChild(container);
  }
}
//******************************************************************************************************************************************************* */
//Affichage d'un slider avec affiche, détail qui fade out toutes les 20 secondes
async function showHomeHeader(filmData) {

  const oldHeader = document.querySelector(".header-image");

  if (oldHeader) {
    // Supprime la classe visible pour déclencher le fade-out
    oldHeader.classList.remove("visible");

    // ⏳ Attends que le fade-out soit fini
    await new Promise(resolve => setTimeout(resolve, TRANSITION_DURATION));


    // Ensuite, on peut le supprimer du DOM
    oldHeader.remove();
  }

  // Création du nouveau header
  const headerDiv = document.createElement("div");
  headerDiv.className = "header-image";

  let infoMovie = await infoFilm(filmData.results[slide].id);
  //Background du header est le backdrop du film, avec du style
  headerDiv.style.backgroundImage = `linear-gradient(to right,
    rgba(31,31,31,0.2) 0%,
    rgba(31,31,31,0.5) 30%,
    rgba(31,31,31,0.84) 60%,
    rgba(31,31,31,0.84) 100%), url('${await urlImage(infoMovie.backdrop_path)}')`;

  headerDiv.style.backgroundSize = "cover";
  headerDiv.style.backgroundPosition = "center";
  //Affichage de l'image du film
  const headerImg = document.createElement("img");
  headerImg.src = await urlImage(filmData.results[slide].poster_path);
  //Création des détails du film dans une balise p
  const headerParagraph = document.createElement("p");
  headerParagraph.className = "header-paragraph";
  headerParagraph.innerHTML += `<strong style="font-size: 40px;">${infoMovie.title}</strong><br><br>`;
  headerParagraph.innerHTML += `<strong style="font-size: 25px;">Durée :</strong> ${infoMovie.runtime} minutes<br>`;
  headerParagraph.innerHTML += `<strong style="font-size: 25px;">Genres :</strong> ${infoMovie.genres[0]?.name || ''} / ${infoMovie.genres[1]?.name || ''} <br>`;
  headerParagraph.innerHTML += `<strong style="font-size: 25px;">Pays : </strong>${infoMovie.origin_country}<br>`;
  headerParagraph.innerHTML += `<strong style="font-size: 25px;">Date de sortie : </strong>${infoMovie.release_date}<br>`;
  headerParagraph.innerHTML += `<strong style="font-size: 25px;">Synopsis : <br></strong>${infoMovie.overview}<br>`;
  //Le tout rentré dans le HTML
  headerDiv.appendChild(headerImg);
  headerDiv.appendChild(headerParagraph);
  HEADER.appendChild(headerDiv);

  // Lancer le fade-in
  setTimeout(() => {
    headerDiv.classList.add("visible");
  }, TRANSITION_DURATION );
}
//******************************************************************************************************************************************************* */
//Fonction pour passer de slide par slide dans le header
async function headerSlide() {
  let numberPage = 1
  const filmData = await upcoming(numberPage); // Charger une seule fois l'api
  await showHomeHeader(filmData);       // Afficher immédiatement

  setInterval(async () => {
    if (slide == 19) {
      slide = 0;
    }
    else {
      slide++
    }
    await showHomeHeader(filmData);
  }, SLIDE_INTERVAL);
}
//******************************************************************************************************************************************************* */
async function detailFilm(IdFilm) {
  page.style.display = "none"
  const detailDiv = document.createElement("div");

  const headerDiv = document.createElement("div");
  headerDiv.className = "detail";


  let infoMovie = await infoFilm(IdFilm);
  //Background du header est le backdrop du film, avec du style
  headerDiv.style.backgroundImage = `linear-gradient(to right,
    rgba(31,31,31,0.2) 0%,
    rgba(31,31,31,0.5) 30%,
    rgba(31,31,31,0.84) 60%,
    rgba(31,31,31,0.84) 100%), url('${await urlImage(infoMovie.backdrop_path)}')`;

  headerDiv.style.backgroundSize = "cover";
  headerDiv.style.backgroundPosition = "center";
  //Affichage de l'image du film
  const headerImg = document.createElement("img");
  headerImg.src = await urlImage(infoMovie.poster_path);
  //Création des détails du film dans une balise p
  const headerParagraph = document.createElement("p");
  headerParagraph.className = "detail-paragraph";
  headerParagraph.innerHTML += `<strong style="font-size: 40px;">${infoMovie.title}</strong><br><br>`;
  headerParagraph.innerHTML += `<strong style="font-size: 25px;">Durée :</strong> ${infoMovie.runtime} minutes<br>`;
  headerParagraph.innerHTML += `<strong style="font-size: 25px;">Genres :</strong> ${infoMovie.genres[0]?.name || ''} / ${infoMovie.genres[1]?.name || ''} <br>`;
  headerParagraph.innerHTML += `<strong style="font-size: 25px;">Pays : </strong>${infoMovie.origin_country}<br>`;
  headerParagraph.innerHTML += `<strong style="font-size: 25px;">Date de sortie : </strong>${infoMovie.release_date}<br>`;
  headerParagraph.innerHTML += `<strong style="font-size: 25px;">Synopsis : <br></strong>${infoMovie.overview}<br>`;

  const button = document.createElement("button")
  button.innerText = "back"
  button.className = "button is-link is-dark";
  button.addEventListener("click", () => {
    detailDiv.innerHTML = ""
    page.style.display = "inline"

  })

  //Le tout rentré dans le HTML

  headerDiv.appendChild(headerImg);
  headerDiv.appendChild(headerParagraph);
  detailDiv.appendChild(headerDiv);
  detailDiv.appendChild(button);
  BODY.appendChild(detailDiv);
}

//******************************************************************************************************************************************************* */
//Les fonctions pour chercher les différentes informations des api
async function urlImage(poster_path) {
  return `https://image.tmdb.org/t/p/original${poster_path}`;
}

async function infoFilm(id) {
  const RESPONSE = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?language=fr-FR`,
    options
  );
  const FILM = await RESPONSE.json();
  return FILM;
}

async function trendingMovies(page) {
  const RESPONSE = await fetch(
    `https://api.themoviedb.org/3/trending/movie/day?language=fr-FR&page=${page}`,
    options
  );
  const FILMS = await RESPONSE.json();
  return FILMS;
}

async function PopularMovies(page) {
  const RESPONSE = await fetch(
    `https://api.themoviedb.org/3/movie/popular?language=fr-FR&page=${page}`,
    options
  );
  const FILMS = await RESPONSE.json();
  return FILMS;
}

async function topRated(page) {
  const RESPONSE = await fetch(
    `https://api.themoviedb.org/3/movie/top_rated?language=fr-FR&page=${page}`,
    options
  );
  const FILMS = await RESPONSE.json();
  return FILMS;
}
async function nowPlaying(page) {
  const RESPONSE = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?language=fr-FR&page=${page}`,
    options
  );
  const FILMS = await RESPONSE.json();
  return FILMS;
}
async function upcoming(page) {
  const RESPONSE = await fetch(
    `https://api.themoviedb.org/3/movie/upcoming?language=fr-FR&page=${page}`,
    options
  );
  const FILMS = await RESPONSE.json();
  return FILMS;
}
//******************************************************************************************************************************************************* */
//Changement de catégorie dans la navbar 
async function homePageSelection(categorie, page) {
  if (categorie == 1) {
    showHomePage(await trendingMovies(page));
  } else if (categorie == 2) {
    showHomePage(await topRated(page));
  } else if (categorie == 3) {
    showHomePage(await PopularMovies(page));
  } else if (categorie == 4) {
    showHomePage(await nowPlaying(page));
  }

}
//******************************************************************************************************************************************************* */
//Appel des fonctions
homePageSelection(currentCategorie, currentpage)

headerSlide();
//******************************************************************************************************************************************************* */
//Pagination de la page 

function showDetail(event) {
  detailFilm(event.target.id)
}




NEXTBUTTON.addEventListener("click", async () => {
  if (currentpage < totalPages) {
    currentpage++;
    homePageSelection(currentCategorie, currentpage)
    CURRENTPAGE.innerText = currentpage;
  } else {
    currentpage = 1;
    homePageSelection(currentCategorie, currentpage)
    CURRENTPAGE.innerText = currentpage;
  }
});

PREVIOUSBUTTON.addEventListener("click", async () => {
  if (currentpage > 1) {
    currentpage--;
    homePageSelection(currentCategorie, currentpage)
    CURRENTPAGE.innerText = currentpage;
  } else {
    currentpage = totalPages;
    homePageSelection(currentCategorie, currentpage)
    CURRENTPAGE.innerText = currentpage;
  }
});

PAGE1.addEventListener("click", async () => {
  currentpage = 1;
  homePageSelection(currentCategorie, currentpage)
  CURRENTPAGE.innerText = currentpage;
});

MAXPAGE.addEventListener("click", async () => {
  currentpage = totalPages;
  homePageSelection(currentCategorie, currentpage)
  CURRENTPAGE.innerText = currentpage;
});

SELECTIONPAGE1.addEventListener("click", async () => {
  currentCategorie = 1
  SELECTIONPAGE1.setAttribute("class", "button is-success is-selected")
  SELECTIONPAGE2.setAttribute("class", "button")
  SELECTIONPAGE3.setAttribute("class", "button")
  SELECTIONPAGE4.setAttribute("class", "button")
  homePageSelection(currentCategorie, currentpage)
});
SELECTIONPAGE2.addEventListener("click", async () => {
  currentCategorie = 2
  SELECTIONPAGE1.setAttribute("class", "button")
  SELECTIONPAGE2.setAttribute("class", "button is-link is-selected")
  SELECTIONPAGE3.setAttribute("class", "button")
  SELECTIONPAGE4.setAttribute("class", "button")
  homePageSelection(currentCategorie, currentpage)
});
SELECTIONPAGE3.addEventListener("click", async () => {
  currentCategorie = 3
  SELECTIONPAGE1.setAttribute("class", "button")
  SELECTIONPAGE2.setAttribute("class", "button")
  SELECTIONPAGE3.setAttribute("class", "button is-danger is-selected")
  SELECTIONPAGE4.setAttribute("class", "button")
  homePageSelection(currentCategorie, currentpage)
});
SELECTIONPAGE4.addEventListener("click", async () => {
  currentCategorie = 4
  SELECTIONPAGE1.setAttribute("class", "button")
  SELECTIONPAGE2.setAttribute("class", "button")
  SELECTIONPAGE3.setAttribute("class", "button")
  SELECTIONPAGE4.setAttribute("class", "button is-warning is-selected")
  homePageSelection(currentCategorie, currentpage)
});


