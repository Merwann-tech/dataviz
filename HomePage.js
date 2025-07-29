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
const btnHome = document.getElementById("btnHome");
const detailDiv = document.getElementById("detailDiv");
const searchBtn = document.getElementById("searchBtn");


const TRANSITION_DURATION = 500;
const SLIDE_INTERVAL = 10000 + (TRANSITION_DURATION * 2);
//******************************************************************************************************************************************************* */
let backupBody = BODY.innerHTML
let currentpage = 1;
let currentCategorie = 1
let totalPages = 100;
let slide = 0;
let headerInterval = null;
let currentInput = ""
//******************************************************************************************************************************************************* */
//Affichage du tableau des films, avec image et titre avec le frameWork Bulma
async function showHomePage(filmData) {
  HOMEPAGE.innerHTML = "";
  totalPages = filmData.total_pages;
  MAXPAGE.innerText = totalPages
  for (let i = 0; i < filmData.results.length; i++) {
    if (filmData.results[i].poster_path != null) {
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
}
//******************************************************************************************************************************************************* */
//Affichage d'un slider avec affiche, détail qui fade out toutes les 20 secondes
async function showHomeHeader(filmData) {

  const oldHeader = document.querySelector(".header-image");


  // Création du nouveau header
  const headerDiv = document.createElement("div");
  headerDiv.className = "header-image";
  headerDiv.setAttribute("id", filmData.results[slide].id)

  let infoMovie = await infoFilm(filmData.results[slide].id);
  // Background du header est le backdrop du film, avec du style
  headerDiv.style.backgroundImage = `linear-gradient(to right,
    rgba(31,31,31,0.2) 0%,
    rgba(31,31,31,0.5) 30%,
    rgba(31,31,31,0.84) 60%,
    rgba(31,31,31,0.84) 100%), url('${await urlBackdrop(infoMovie.backdrop_path)}')`;

  headerDiv.style.backgroundSize = "cover";
  headerDiv.style.backgroundPosition = "center";
  //Affichage de l'image du film
  const headerImg = document.createElement("img");
  headerImg.src = await urlImage(filmData.results[slide].poster_path);
  headerImg.setAttribute("id", filmData.results[slide].id)
  //Création des détails du film dans une balise p
  const headerParagraph = document.createElement("p");
  headerParagraph.setAttribute("id", filmData.results[slide].id)
  headerParagraph.className = "header-paragraph";
  headerParagraph.innerHTML += `<strong id="${filmData.results[slide].id}" style="font-size: 40px;">${infoMovie.title}</strong><br><br>`;
  headerParagraph.innerHTML += `<strong id="${filmData.results[slide].id}" style="font-size: 25px;">Durée :</strong> ${infoMovie.runtime} minutes<br>`;
  headerParagraph.innerHTML += `<strong id="${filmData.results[slide].id}" style="font-size: 25px;">Genres :</strong> ${infoMovie.genres[0]?.name || ''} / ${infoMovie.genres[1]?.name || ''} <br>`;
  headerParagraph.innerHTML += `<strong id="${filmData.results[slide].id}" style="font-size: 25px;">Pays : </strong>${infoMovie.origin_country}<br>`;
  headerParagraph.innerHTML += `<strong id="${filmData.results[slide].id}" style="font-size: 25px;">Date de sortie : </strong>${infoMovie.release_date}<br>`;
  // headerParagraph.innerHTML += `<strong style="font-size: 25px;">Synopsis : <br></strong>${infoMovie.overview}<br>`;
  if (oldHeader) {
    // Supprime la classe visible pour déclencher le fade-out
    oldHeader.classList.remove("visible");

    // ⏳ Attends que le fade-out soit fini
    await new Promise(resolve => setTimeout(resolve, TRANSITION_DURATION));


    // Ensuite, on peut le supprimer du DOM
    oldHeader.remove();
  }


  //Le tout rentré dans le HTML

  headerDiv.appendChild(headerImg);
  headerDiv.appendChild(headerParagraph);
  headerDiv.addEventListener('click', showDetail)
  HEADER.appendChild(headerDiv);


  // Lancer le fade-in
  setTimeout(() => {
    headerDiv.classList.add("visible");
  }, TRANSITION_DURATION);
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

  const headerDiv = document.createElement("div");
  headerDiv.className = "detail";


  let infoMovie = await infoFilm(IdFilm);
  //Background du header est le backdrop du film, avec du style
  headerDiv.style.backgroundImage = `linear-gradient(to right,
    rgba(31,31,31,0.2) 0%,
    rgba(31,31,31,0.5) 30%,
    rgba(31,31,31,0.84) 60%,
    rgba(31,31,31,0.84) 100%), url('${await urlBackdrop(infoMovie.backdrop_path)}')`;

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
  headerParagraph.innerHTML += `<strong style="font-size: 25px;">Budget : </strong>${infoMovie.budget}$<br>`;
  headerParagraph.innerHTML += `<strong style="font-size: 25px;">Synopsis : <br></strong>${infoMovie.overview}<br>`;

  const DivButton = document.createElement("div")
  DivButton.className = "buttons has-addons is-centered";

  const button = document.createElement("button")
  button.innerText = "back"
  button.className = "button is-link is-dark ";

  button.addEventListener("click", () => {
    detailDiv.innerHTML = ""
    page.style.display = "inline"

  })

  //Le tout rentré dans le HTML
  DivButton.appendChild(button)
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
    `https://dataviz-backend-aizu.onrender.com/movies/${id}`,
    options
  );
  const FILM = await RESPONSE.json();
  return FILM;
}

async function trendingMovies(page) {
  const RESPONSE = await fetch(
    `https://dataviz-backend-aizu.onrender.com/trending/${page}`,
    options
  );
  const FILMS = await RESPONSE.json();
  return FILMS;
}

async function PopularMovies(page) {
  const RESPONSE = await fetch(
    `https://dataviz-backend-aizu.onrender.com/popular/${page}`,
    options
  );
  const FILMS = await RESPONSE.json();
  return FILMS;
}

async function topRated(page) {
  const RESPONSE = await fetch(
    `https://dataviz-backend-aizu.onrender.com/top_rated/${page}`,
    options
  );
  const FILMS = await RESPONSE.json();
  return FILMS;
}
async function nowPlaying(page) {
  const RESPONSE = await fetch(
    `https://dataviz-backend-aizu.onrender.com/now_playing/${page}`,
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

async function search(page, input) {
  const RESPONSE = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${input}&include_adult=false&language=fr-FR&page=${page}`,
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
  } else if (categorie == 5) {
    showHomePage(await search(page, currentInput));
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



btnHome.addEventListener("click", async () => {
  detailDiv.innerHTML = ""
  page.style.display = "inline"
  currentCategorie = 1
  PAGE1.click()
  SELECTIONPAGE1.setAttribute("class", "button is-success is-selected")
  SELECTIONPAGE2.setAttribute("class", "button")
  SELECTIONPAGE3.setAttribute("class", "button")
  SELECTIONPAGE4.setAttribute("class", "button")
  homePageSelection(currentCategorie, currentpage)
})


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
  PAGE1.click()
  SELECTIONPAGE1.setAttribute("class", "button is-success is-selected")
  SELECTIONPAGE2.setAttribute("class", "button")
  SELECTIONPAGE3.setAttribute("class", "button")
  SELECTIONPAGE4.setAttribute("class", "button")
  homePageSelection(currentCategorie, currentpage)
});
SELECTIONPAGE2.addEventListener("click", async () => {
  currentCategorie = 2
  PAGE1.click()
  SELECTIONPAGE1.setAttribute("class", "button")
  SELECTIONPAGE2.setAttribute("class", "button is-link is-selected")
  SELECTIONPAGE3.setAttribute("class", "button")
  SELECTIONPAGE4.setAttribute("class", "button")
  homePageSelection(currentCategorie, currentpage)
});
SELECTIONPAGE3.addEventListener("click", async () => {
  currentCategorie = 3
  PAGE1.click()
  SELECTIONPAGE1.setAttribute("class", "button")
  SELECTIONPAGE2.setAttribute("class", "button")
  SELECTIONPAGE3.setAttribute("class", "button is-danger is-selected")
  SELECTIONPAGE4.setAttribute("class", "button")
  homePageSelection(currentCategorie, currentpage)
});
SELECTIONPAGE4.addEventListener("click", async () => {
  currentCategorie = 4
  PAGE1.click()
  SELECTIONPAGE1.setAttribute("class", "button")
  SELECTIONPAGE2.setAttribute("class", "button")
  SELECTIONPAGE3.setAttribute("class", "button")
  SELECTIONPAGE4.setAttribute("class", "button is-warning is-selected")
  homePageSelection(currentCategorie, currentpage)
});

searchBtn.addEventListener("click", async () => {
  currentInput = document.getElementById("searchInput").value;
  if (currentInput != "") {
    currentCategorie = 5
    PAGE1.click()
    homePageSelection(currentCategorie, currentpage)
    SELECTIONPAGE1.setAttribute("class", "button")
    SELECTIONPAGE2.setAttribute("class", "button")
    SELECTIONPAGE3.setAttribute("class", "button")
    SELECTIONPAGE4.setAttribute("class", "button")
  }
})


