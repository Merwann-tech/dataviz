const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOWZkMWUyNTE0OTgzYWVkODc4N2Y0ZThlN2IwZGFmZCIsIm5iZiI6MTc1MzEwMTU1Ni4yOTMsInN1YiI6IjY4N2UzNGY0Mjc0YjA5MWY3NjUyOGY3NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Y7LqI4nVTIqGOxo4C0MOIe2kH0W9VBOa51m3P5mtd6U",
  },
};
let p = 0;
const HEADER = document.getElementById("headerMovie");
const TESTAFFICHAGE = document.getElementById("testAffichage");
const PREVIOUSBUTTON = document.getElementById("previousButton"); // pour aller à la page d'avant
const NEXTBUTTON = document.getElementById("nextButton"); // pour aller à la page d'après
const CURRENTPAGE = document.getElementById("currentPage");
const Page1 = document.getElementById("Page1");
const maxPage = document.getElementById("maxPage");
let currentpage = 1;
let currentCategorie = 1
let totalPages = 100;

async function showHomePage(filmData) {
  TESTAFFICHAGE.innerHTML = "";
  for (let i = 0; i < filmData.results.length; i++) {
    const container = document.createElement("div");
    container.className = "card";

    const cardImage = document.createElement("div");
    cardImage.className = "card-image";

    const img = document.createElement("img");
    img.src = await urlImage(filmData.results[i].poster_path);
    // img.width = 250
    img.alt = "afficheFilm";
    img.className = "imageFilm";

    cardImage.appendChild(img);

    const cardHeader = document.createElement("div");
    cardHeader.className = "card-content";

    const title = document.createElement("p");
    title.className = "media-content";
    title.textContent = filmData.results[i].title;

    cardHeader.appendChild(title);

    container.appendChild(cardImage);
    container.appendChild(cardHeader);

    TESTAFFICHAGE.appendChild(container);
  }
}
//Affichage d'un header (Détail d'un trending movie)
async function showHomeHeader(filmData) {
  const headerDiv = document.createElement("div");
  headerDiv.className = "header-image";

  // Définir le background-image en cover avec une superposition
  let infoMovie = await infoFilm(filmData.results[p].id);
  headerDiv.style.backgroundImage = `linear-gradient(to right, rgba(31,31,31,1) calc((50vw - 170px) - 340px), rgba(31,31,31,0.84) 50%, rgba(31,31,31,0.84) 100%), url('${await urlImage(
    infoMovie.backdrop_path
  )}')`;
  headerDiv.style.backgroundSize = "cover";
  headerDiv.style.backgroundPosition = "center";

  // Ajout de l'affiche (poster) et du texte
  const headerImg = document.createElement("img");
  headerImg.src = await urlImage(filmData.results[p].poster_path);

  const headerParagraph = document.createElement("p");
  headerParagraph.className = "header-paragraph";
  headerParagraph.innerHTML += `<strong style="font-size: 24px;">${infoMovie.title}</strong><br>`;
  headerParagraph.innerHTML += `Budget : ${infoMovie.budget}$<br>`;
  headerParagraph.innerHTML += `Durée : ${infoMovie.runtime} minutes<br>`;

  // Composition
  headerDiv.appendChild(headerImg);
  headerDiv.appendChild(headerParagraph);
  HEADER.appendChild(headerDiv);
}

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

async function homePageSelection(categorie,page){
  if (categorie==1){
    showHomePage(await trendingMovies(page));
  }else if(categorie==2){
    showHomePage(await topRated(page));
  }else if(categorie==3){
    showHomePage(await PopularMovies(page));
  }else if(categorie==4){
    showHomePage(await nowPlaying(page));
  }

}
homePageSelection(currentCategorie,currentpage)

showHomeHeader(await trendingMovies(1));
//------------------------------------------------------------------------------------------------------------------------------------
// on doit ajouter des addEventListener('click', *fonction*) sur les boutons previews et next

NEXTBUTTON.addEventListener("click", async () => {
  if (currentpage < totalPages) {
    currentpage++;
    let dataPage = await trendingMovies(currentpage);
    showHomePage(dataPage);
    CURRENTPAGE.innerText = currentpage;
  } else {
    currentpage = 1;
    let dataPage = await trendingMovies(currentpage);
    showHomePage(dataPage);
    CURRENTPAGE.innerText = currentpage;
  }
});

PREVIOUSBUTTON.addEventListener("click", async () => {
  if (currentpage > 1) {
    currentpage--;
    let dataPage = await trendingMovies(currentpage);
    showHomePage(dataPage);
    CURRENTPAGE.innerText = currentpage;
  } else {
    currentpage = totalPages;
    let dataPage = await trendingMovies(currentpage);
    showHomePage(dataPage);
    CURRENTPAGE.innerText = currentpage;
  }
});

Page1.addEventListener("click", async () => {
  currentpage = 1;
  let dataPage = await trendingMovies(currentpage);
  showHomePage(dataPage);
  CURRENTPAGE.innerText = currentpage;
});

maxPage.addEventListener("click", async () => {
  currentpage = totalPages;
  let dataPage = await trendingMovies(currentpage);
  showHomePage(dataPage);
  CURRENTPAGE.innerText = currentpage;
});
