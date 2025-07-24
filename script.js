const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOWZkMWUyNTE0OTgzYWVkODc4N2Y0ZThlN2IwZGFmZCIsIm5iZiI6MTc1MzEwMTU1Ni4yOTMsInN1YiI6IjY4N2UzNGY0Mjc0YjA5MWY3NjUyOGY3NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Y7LqI4nVTIqGOxo4C0MOIe2kH0W9VBOa51m3P5mtd6U",
  },
};
let slide = 0;
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

async function showHomeHeader(filmData) {
  // ⛔️ Ne vide pas HEADER immédiatement
  const oldHeader = document.querySelector(".header-image");

  if (oldHeader) {
    // Supprime la classe visible pour déclencher le fade-out
    oldHeader.classList.remove("visible");

    // ⏳ Attends que le fade-out soit fini (1s ici)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Ensuite, on peut le supprimer du DOM
    oldHeader.remove();
  }

  // Création du nouveau header
  const headerDiv = document.createElement("div");
  headerDiv.className = "header-image";

  let infoMovie = await infoFilm(filmData.results[slide].id);

  headerDiv.style.backgroundImage = `linear-gradient(to right,
    rgba(31,31,31,0.2) 0%,
    rgba(31,31,31,0.5) 30%,
    rgba(31,31,31,0.84) 60%,
    rgba(31,31,31,0.84) 100%), url('${await urlImage(infoMovie.backdrop_path)}')`;

  headerDiv.style.backgroundSize = "cover";
  headerDiv.style.backgroundPosition = "center";

  const headerImg = document.createElement("img");
  headerImg.src = await urlImage(filmData.results[slide].poster_path);

  const headerParagraph = document.createElement("p");
  headerParagraph.className = "header-paragraph";
  headerParagraph.innerHTML += `<strong style="font-size: 40px;">${infoMovie.title}</strong><br><br>`;
  headerParagraph.innerHTML += `<strong style="font-size: 25px;">Durée :</strong> ${infoMovie.runtime} minutes<br>`;
  headerParagraph.innerHTML += `<strong style="font-size: 25px;">Genres :</strong> ${infoMovie.genres[0]?.name || ''} / ${infoMovie.genres[1]?.name || ''} <br>`;
  headerParagraph.innerHTML += `<strong style="font-size: 25px;">Pays : </strong>${infoMovie.origin_country}<br>`;
  headerParagraph.innerHTML += `<strong style="font-size: 25px;">Date de sortie : </strong>${infoMovie.release_date}<br>`;
  headerParagraph.innerHTML += `<strong style="font-size: 25px;">Synopsis : <br></strong>${infoMovie.overview}<br>`;

  headerDiv.appendChild(headerImg);
  headerDiv.appendChild(headerParagraph);
  HEADER.appendChild(headerDiv);

  // ⏱ Lancer le fade-in
  setTimeout(() => {
    headerDiv.classList.add("visible");
  }, 50);
}
async function headerSlide() {
  const filmData = await nowPlaying(1); // Charger une seule fois
  await showHomeHeader(filmData);       // Afficher immédiatement

  setInterval(async () => {
    slide++;
    if (slide >= filmData.results.length) {
      slide = 0;
    }
    await showHomeHeader(filmData);
  }, 20000);
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

headerSlide();
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
