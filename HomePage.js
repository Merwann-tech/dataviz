import { updateChartwithGenre } from "./graphGenre.js";
//******************************************************************************************************************************************************* */
const header = document.getElementById("headerMovie");
const homePage = document.getElementById("homePage");
const previousButton = document.getElementById("previousButton"); // pour aller à la page d'avant
const nextButton = document.getElementById("nextButton"); // pour aller à la page d'après
const currentPage = document.getElementById("currentPage");
const page1 = document.getElementById("Page1");
const maxPage = document.getElementById("maxPage");
const selectionPage1 = document.getElementById("selectionPage1");
const selectionPage2 = document.getElementById("selectionPage2");
const selectionPage3 = document.getElementById("selectionPage3");
const selectionPage4 = document.getElementById("selectionPage4");
const page = document.getElementById("Page");
const buttonHome = document.getElementById("btnHome");
const detailDiv = document.getElementById("detailDiv");
const searchButton = document.getElementById("searchBtn");

const transitionDuration = 500;
const slideInterval = 10000 + transitionDuration * 2;
//******************************************************************************************************************************************************* */
let currentpage = 1;
let currentCategorie = 1;
let totalPages = 100;
let slide = 0;
let currentInput = ""

//******************************************************************************************************************************************************* */
//Affichage du tableau des films, avec image et titre avec le frameWork Bulma
async function showHomePage(filmData) {
  homePage.innerHTML = "";
  totalPages = filmData.total_pages;
  if (totalPages > 500) {
    maxPage.innerText = 500
  } else {
    maxPage.innerText = totalPages;
  }
  for (let i = 0; i < filmData.results.length; i++) {
    if (filmData.results[i].poster_path != null) {
      const container = document.createElement("div");
      container.className = "card";
      container.addEventListener("click", showDetail);
      container.setAttribute("id", filmData.results[i].id);

      const cardImage = document.createElement("div");
      cardImage.className = "card-image";
      cardImage.setAttribute("id", filmData.results[i].id);

      const img = document.createElement("img");
      img.src = await urlImage(filmData.results[i].poster_path);
      // img.width = 250
      img.alt = "afficheFilm";
      img.className = "imageFilm";
      img.setAttribute("id", filmData.results[i].id);

      cardImage.appendChild(img);

      const cardHeader = document.createElement("div");
      cardHeader.className = "card-content";
      cardHeader.setAttribute("id", filmData.results[i].id);

      const title = document.createElement("p");
      title.className = "media-content";
      title.textContent = filmData.results[i].title;
      title.setAttribute("id", filmData.results[i].id);

      cardHeader.appendChild(title);
      cardHeader.setAttribute("id", filmData.results[i].id);

      container.appendChild(cardImage);
      container.appendChild(cardHeader);

      homePage.appendChild(container);
    }
  }
}
//******************************************************************************************************************************************************* */
//Affichage d'un slider avec affiche, détail qui fade out toutes les 10 secondes
async function showHomeHeader(filmData) {
  const oldHeader = document.querySelector(".header-image");

  // Création du nouveau header
  const headerDiv = document.createElement("div");
  headerDiv.className = "header-image";
  headerDiv.setAttribute("id", filmData.results[slide].id);

  let infoMovie = await infoFilm(filmData.results[slide].id);
  // Background du header est le backdrop du film, avec du style
  headerDiv.style.backgroundImage = `linear-gradient(to right,
    rgba(31,31,31,0.2) 0%,
    rgba(31,31,31,0.5) 30%,
    rgba(31,31,31,0.84) 60%,
    rgba(31,31,31,0.84) 100%), url('${await urlBackdrop(
    infoMovie.backdrop_path
  )}')`;

  headerDiv.style.backgroundSize = "cover";
  headerDiv.style.backgroundPosition = "center";
  //Affichage de l'image du film
  const headerImg = document.createElement("img");
  headerImg.src = await urlImage(filmData.results[slide].poster_path);
  headerImg.setAttribute("id", filmData.results[slide].id);
  //Création des détails du film dans une balise p
  const headerParagraph = document.createElement("p");
  headerParagraph.setAttribute("id", filmData.results[slide].id);
  headerParagraph.className = "header-paragraph";
  headerParagraph.innerHTML += `<strong id="${filmData.results[slide].id}" style="font-size: 40px;">${infoMovie.title}</strong><br><br>`;
  if (infoMovie.runtime == 0) {
    headerParagraph.innerHTML += `<strong id="${filmData.results[slide].id}" style="font-size: 25px;">Durée :</strong> Inconnue<br>`;
  } else {
    headerParagraph.innerHTML += `<strong id="${filmData.results[slide].id}" style="font-size: 25px;">Durée :</strong> ${infoMovie.runtime} minutes<br>`;
  }
  if (infoMovie.genres.length == 1)
    headerParagraph.innerHTML += `<strong style="font-size: 25px;">Genres :</strong> ${infoMovie.genres[0]?.name || ""
      } <br>`;
  else {
    headerParagraph.innerHTML += `<strong style="font-size: 25px;">Genres :</strong> ${infoMovie.genres[0]?.name || ""
      } / ${infoMovie.genres[1]?.name || ""} <br>`;
  }

  headerParagraph.innerHTML += `<strong id="${filmData.results[slide].id}" style="font-size: 25px;">Pays : </strong>${infoMovie.origin_country}<br>`;
  headerParagraph.innerHTML += `<strong id="${filmData.results[slide].id}" style="font-size: 25px;">Date de sortie : </strong>${infoMovie.release_date}<br>`;
  // headerParagraph.innerHTML += `<strong style="font-size: 25px;">Synopsis : <br></strong>${infoMovie.overview}<br>`;
  if (oldHeader) {
    // Supprime la classe visible pour déclencher le fade-out
    oldHeader.classList.remove("visible");

    //Attends que le fade-out soit fini
    await new Promise((resolve) => setTimeout(resolve, transitionDuration));

    //Ensuite, on peut le supprimer du DOM
    oldHeader.remove();
  }

  //Le tout rentré dans le HTML

  headerDiv.appendChild(headerImg);
  headerDiv.appendChild(headerParagraph);
  headerDiv.addEventListener("click", showDetail);
  header.appendChild(headerDiv);

  // Lancer le fade-in
  setTimeout(() => {
    headerDiv.classList.add("visible");
  }, transitionDuration);
}
//******************************************************************************************************************************************************* */
//Fonction pour passer de slide par slide dans le header
async function headerSlide() {
  let numberPage = 1;
  const filmData = await upcoming(numberPage); // Charger une seule fois l'api
  await showHomeHeader(filmData); // Afficher immédiatement

  setInterval(async () => {
    if (slide == 19) {
      slide = 0;
    } else {
      slide++;
    }
    await showHomeHeader(filmData);
  }, slideInterval);
}
//******************************************************************************************************************************************************* */
//Affiche le détail du film quand on clique sur la carte entière du film  
async function detailFilm(IdFilm) {
  page.style.display = "none";

  const headerDiv = document.createElement("div");
  headerDiv.className = "detail";

  let infoMovie = await infoFilm(IdFilm);
  //Background du header est le backdrop du film, avec du style
  headerDiv.style.backgroundImage = `linear-gradient(to right,
    rgba(31,31,31,0.2) 0%,
    rgba(31,31,31,0.5) 30%,
    rgba(31,31,31,0.84) 60%,
    rgba(31,31,31,0.84) 100%), url('${await urlBackdrop(
    infoMovie.backdrop_path
  )}')`;

  headerDiv.style.backgroundSize = "cover";
  headerDiv.style.backgroundPosition = "center";
  //Affichage de l'image du film
  const headerImg = document.createElement("img");
  headerImg.src = await urlImage(infoMovie.poster_path);
  //Création des détails du film dans une balise p
  const headerParagraph = document.createElement("p");
  headerParagraph.className = "detail-paragraph";
  headerParagraph.innerHTML += `<strong style="font-size: 40px;">${infoMovie.title}</strong><br><br>`;
  if (infoMovie.runtime == 0) {
    headerParagraph.innerHTML += `<strong style="font-size: 25px;">Durée :</strong> Inconnue<br>`;
  } else {
    headerParagraph.innerHTML += `<strong style="font-size: 25px;">Durée :</strong> ${infoMovie.runtime} minutes<br>`;
  }

  if (infoMovie.genres.length == 1)
    headerParagraph.innerHTML += `<strong style="font-size: 25px;">Genres :</strong> ${infoMovie.genres[0]?.name || ""
      } <br>`;
  else {
    headerParagraph.innerHTML += `<strong style="font-size: 25px;">Genres :</strong> ${infoMovie.genres[0]?.name || ""
      } / ${infoMovie.genres[1]?.name || ""} <br>`;
  }

  headerParagraph.innerHTML += `<strong style="font-size: 25px;">Pays : </strong>${infoMovie.origin_country}<br>`;
  headerParagraph.innerHTML += `<strong style="font-size: 25px;">Date de sortie : </strong>${infoMovie.release_date}<br>`;

  if (infoMovie.budget == 0) {
    headerParagraph.innerHTML += `<strong style="font-size: 25px;">Budget : </strong> Inconnue<br>`;
  } else {
    headerParagraph.innerHTML += `<strong style="font-size: 25px;">Budget : </strong>${infoMovie.budget}$<br>`;
  }

  if (infoMovie.overview == "") {
    headerParagraph.innerHTML += `<strong style="font-size: 25px;">Synopsis : <br></strong> Inconnue<br>`;
  } else {
    headerParagraph.innerHTML += `<strong style="font-size: 25px;">Synopsis : <br></strong>${infoMovie.overview}<br>`;
  }

  const DivButton = document.createElement("div");
  DivButton.className = "buttons has-addons is-centered";

  const button = document.createElement("button");
  button.innerText = "back";
  button.className = "button is-link is-dark ";

  button.addEventListener("click", () => {
    detailDiv.innerHTML = "";
    page.style.display = "inline";
  });

  //Le tout rentré dans le HTML
  DivButton.appendChild(button);
  headerDiv.appendChild(headerImg);
  headerDiv.appendChild(headerParagraph);
  detailDiv.appendChild(headerDiv);
  detailDiv.appendChild(DivButton);
}

//******************************************************************************************************************************************************* */
//Les fonctions pour chercher les différentes informations des api
async function urlImage(poster_path) {
  return `https://image.tmdb.org/t/p/w500${poster_path}`;
}

async function urlBackdrop(backdrop_path) {
  return `https://image.tmdb.org/t/p/original${backdrop_path}`;
}

async function infoFilm(id) {
  const RESPONSE = await fetch(
    `https://dataviz-backend-aizu.onrender.com/movies/${id}`
  );
  const FILM = await RESPONSE.json();
  return FILM;
}

async function trendingMovies(page) {
  const RESPONSE = await fetch(
    `https://dataviz-backend-aizu.onrender.com/trending/${page}`
  );
  const FILMS = await RESPONSE.json();
  return FILMS;
}

async function PopularMovies(page) {
  const RESPONSE = await fetch(
    `https://dataviz-backend-aizu.onrender.com/popular/${page}`
  );
  const FILMS = await RESPONSE.json();
  return FILMS;
}

async function topRated(page) {
  const RESPONSE = await fetch(
    `https://dataviz-backend-aizu.onrender.com/top_rated/${page}`
  );
  const FILMS = await RESPONSE.json();
  return FILMS;
}
async function nowPlaying(page) {
  const RESPONSE = await fetch(
    `https://dataviz-backend-aizu.onrender.com/now_playing/${page}`
  );
  const FILMS = await RESPONSE.json();
  return FILMS;
}
async function upcoming(page) {
  const RESPONSE = await fetch(
    `https://dataviz-backend-aizu.onrender.com/upcoming/${page}`
  );
  const FILMS = await RESPONSE.json();
  return FILMS;
}

async function search(page, input) {
  const RESPONSE = await fetch(
    `https://dataviz-backend-aizu.onrender.com/search/${input}/${page}`
  );
  const FILMS = await RESPONSE.json();
  return FILMS;
}
//******************************************************************************************************************************************************* */
//Changement de catégorie dans la navbar
async function homePageSelection(categorie, page) {
  updateChartwithGenre(currentCategorie, currentpage)
  if (categorie == 1) {
    showHomePage(await trendingMovies(page));
  } else if (categorie == 2) {
    showHomePage(await topRated(page));
  } else if (categorie == 3) {
    showHomePage(await PopularMovies(page));
  } else if (categorie == 4) {
    showHomePage(await nowPlaying(page));
  } else if (categorie == 5) {
    showHomePage(await search(page, currentInput));
  }
}
//******************************************************Appel des fonctions************************************************************************************************* */
//Charge la page une première fois

homePageSelection(currentCategorie, currentpage);

//Charge le header une première fois
headerSlide();
//******************************************************************************************************************************************************* */
//Tout les addEventListener

function showDetail(event) {
  detailFilm(event.target.id);
}

buttonHome.addEventListener("click", async () => {
  detailDiv.innerHTML = "";
  page.style.display = "inline";
  currentCategorie = 1;
  page1.click();
  selectionPage1.setAttribute("class", "button is-success is-selected");
  selectionPage2.setAttribute("class", "button");
  selectionPage3.setAttribute("class", "button");
  selectionPage4.setAttribute("class", "button");
  homePageSelection(currentCategorie, currentpage);
});

nextButton.addEventListener("click", async () => {
  if (currentpage < totalPages) {
    currentpage++;
    homePageSelection(currentCategorie, currentpage);
    currentPage.innerText = currentpage;
  } else {
    currentpage = 1;
    homePageSelection(currentCategorie, currentpage);
    currentPage.innerText = currentpage;
  }
});

previousButton.addEventListener("click", async () => {
  if (currentpage > 1) {
    currentpage--;
    homePageSelection(currentCategorie, currentpage);
    currentPage.innerText = currentpage;
  } else {
    currentpage = totalPages;
    homePageSelection(currentCategorie, currentpage);
    currentPage.innerText = currentpage;
  }
});

page1.addEventListener("click", async () => {
  currentpage = 1;
  homePageSelection(currentCategorie, currentpage);
  currentPage.innerText = currentpage;
});

maxPage.addEventListener("click", async () => {
  currentpage = totalPages;
  homePageSelection(currentCategorie, currentpage);
  currentPage.innerText = currentpage;
});

selectionPage1.addEventListener("click", async () => {
  currentCategorie = 1
  page1.click()
  selectionPage1.setAttribute("class", "button is-success is-selected")
  selectionPage2.setAttribute("class", "button")
  selectionPage3.setAttribute("class", "button")
  selectionPage4.setAttribute("class", "button")
  homePageSelection(currentCategorie, currentpage)
});
selectionPage2.addEventListener("click", async () => {
  currentCategorie = 2
  page1.click()
  selectionPage1.setAttribute("class", "button")
  selectionPage2.setAttribute("class", "button is-link is-selected")
  selectionPage3.setAttribute("class", "button")
  selectionPage4.setAttribute("class", "button")
  homePageSelection(currentCategorie, currentpage)
});
selectionPage3.addEventListener("click", async () => {
  currentCategorie = 3
  page1.click()
  selectionPage1.setAttribute("class", "button")
  selectionPage2.setAttribute("class", "button")
  selectionPage3.setAttribute("class", "button is-danger is-selected")
  selectionPage4.setAttribute("class", "button")
  homePageSelection(currentCategorie, currentpage)
});
selectionPage4.addEventListener("click", async () => {
  currentCategorie = 4
  page1.click()
  selectionPage1.setAttribute("class", "button")
  selectionPage2.setAttribute("class", "button")
  selectionPage3.setAttribute("class", "button")
  selectionPage4.setAttribute("class", "button is-warning is-selected")
  homePageSelection(currentCategorie, currentpage)
});

searchButton.addEventListener("click", async () => {
  currentInput = document.getElementById("searchInput").value;
  if (currentInput != "") {
    currentCategorie = 5
    page1.click()
    homePageSelection(currentCategorie, currentpage)
    selectionPage1.setAttribute("class", "button")
    selectionPage2.setAttribute("class", "button")
    selectionPage3.setAttribute("class", "button")
    selectionPage4.setAttribute("class", "button")
  }
});
