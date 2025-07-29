//********************************************************************Variables globales*****************************************************************

let chart // on définit une variable chart qui va contenir notre affichage ( c'est la chart qu'on va créer toutes les x secondes )
let yearToShow = 2014 // on l'a met en variable globale car on doit pouvoir la modifier lors de notre appel du setInterval. --> démarre l'affichage en 2015

// Valeurs par défaut pour faire le premier appel de la fonction
let categoryDisplayedDefault = 1 // correspond à la catégorie trending donc celle de la page d'accueil
let pageDefault = 1 // valeur par défaut, on va la changer à l'avenir
let categoryNameDefault = "" // valeur par défaut, on va la changer au fur et à mesure de nos instances

//Contient notre tableau de référence qui associe l'id avec les genres
const genreIdToIndex = {
  28: 0, // Action
  12: 1, // Aventure
  16: 2, // Animation
  35: 3, // Comédie
  80: 4, // Crime
  99: 5, // Documentaire
  18: 6, // Drame
  10751: 7, // Familial
  14: 8, // Histoire
  36: 9, // Fantastique
  27: 10, // Horreur
  10402: 11, // Musique
  9648: 12, // Mystère
  10749: 13, // Romance
  878: 14, // Science-Fiction
  10770: 15, // Téléfilm
  53: 16, // Thriller
  10752: 17, // Guerre
  37: 18 // Western
}

const CURRENTYEAR = new Date() // on récupère la date système
const ACTUALYEAR = CURRENTYEAR.getFullYear() // on récupère l'année de la date système


//***************************************************************************GRAPHE 2********************************************************************

//L'évenement DOMContentLoader se lance au moment ou le fichier est chargé
document.addEventListener('DOMContentLoaded', function () {
  const DATAGRAPH2 = {
    labels: ["Action", "Aventure", "Animation", "Comédie", "Crime", "Documentaire", "Drame", "Familial", "Fantastique", "Histoire", "Horreur", "Musique", "Mystère", "Romance", "Science-Fiction", "Téléfilm", "Thriller", "Guerre", "Western"],
    datasets: [{
      label: 'Genre des films',

      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // on le fait démarrer à 0 pour qu'on ait un affichage ou il n'y a rien

      backgroundColor: ['#f87171', '#fb923c', '#facc15', '#4ade80', '#60a5fa', '#3339ff', '#ff33d1', '#39ff33', '#7a33ff', '#33fff3', '#d8e80b', '#8f3192', '#F54927', '#B122AF', '#C260BF', '#496EBD', '#C2A2DF', '#7A5111', '#E9B526'],
    }]
  }

  const configGenre = {
    type: 'doughnut',
    data: DATAGRAPH2,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
        },
        title: {    
          display: true,
          text: 'Genre des films de cette page'
        }
      }
    },
  }

  const DISPLAYGRAPHGENRE = document.getElementById('displayGraphGenre')
  chart = new Chart(DISPLAYGRAPHGENRE, configGenre)
})


//méthodo qui permet de récupérer les informations précises de la page
//penser à inclure une function qui permet de vérifier la catégorie pour changer la catégorie à afficher
async function getPageGenre(categoryToShow, pageToShow){
    
  const response = await fetch(`https://dataviz-backend-aizu.onrender.com/${categoryToShow}/${pageToShow}`)
  const ANSWER = await response.json()
  
  return sortDataGenre(ANSWER.results) // permet de renvoyer le tableau créer dans la fonction
}

//permet de changer l'url et la catégorie de la page pour avoir des informations différentes en fonction des catégories
function chosenCategory(category){
  if( category == 1 ) return "trending"
  if( category == 2 ) return "top_rated"
  if( category == 3 ) return "popular"
  if( category == 4 ) return "now_playing"
  if( category == 5 ) return
}


// Méthodo qui va permettre de créer le tableau de données de la page
// récupère les infos de ANSWER.results et va les trier dans un tableau de genre ( les genres ont des id )
// récuperer les id et créer un tableau qui va prendre les id dans un ordre précis ( voir label de DATAGRAPH2)
async function sortDataGenre(dataPage){
  const genreCounts = new Array(19).fill(0) // on créer un tableau de 19 elements et on les remplit de 0 pour éviter qu'ils soient indéfinis

  for(const movie of dataPage){ // pour chaque film de dataPage ( en l'occurence la data de la page)
    for(const genreId of movie.genre_ids){ // pour chaque genre écrit dans chaque film ( il peut y en avoir plusieurs )
      const index = genreIdToIndex[genreId] // regarde chaque élément du tableau de genre
      if(index !== undefined){ // sécurité --> backdrop vide, on ne sait jamais
        genreCounts[index]++
      }
    }
  }

  return genreCounts
}

// la método qui va update le graphe quand on va changer de page
export async function updateChartwithGenre(categoryToGraph, pageToGraph){

  const categoryName = chosenCategory(categoryToGraph)
  const arrayInfo = await getPageGenre(categoryName, pageToGraph) // des informations qu'on retrouve dans les addEventListener présent dans les lignes d'avant ( a voir si il faut pas lancer la fonction depuis l'autre fichier)
  
  // permet de transférer les données de notre array dans notre chart
  for (let i = 0; i < 19; i++) {
    chart.data.datasets[0].data[i] = arrayInfo[i]
  }

  chart.update() // va relancer la génération du graphe
}


//***************************************************************************GRAPHE 1********************************************************************

//Premier graphe : Films sortis par mois et par année
//L'évenement DOMContentLoader se lance au moment ou le fichier est chargé
document.addEventListener('DOMContentLoaded', function () {
  const DATAGRAPH1 = {
    labels: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
    datasets: [{
      label: 'Nombre de sorties',

      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // on le fait démarrer à 0 pour qu'on ait un affichage ou il n'y a rien

      backgroundColor: ['#f87171', '#fb923c', '#facc15', '#4ade80', '#60a5fa', '#3339ff', '#ff33d1', '#39ff33', '#7a33ff', '#33fff3', '#d8e80b', '#8f3192'],
    }]
  }

  const config = {
    type: 'doughnut',
    data: DATAGRAPH1,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
        },
        title: {    
          display: true,
          text: 'Films sortis par mois par année'
        }
      }
    },
  }

  const DISPLAYGRAPH = document.getElementById('displayGraph')
  chart = new Chart(DISPLAYGRAPH, config)

  updateChartWithRealData() // on lance la fonction une première fois pour que le graphe se charge une première fois sans que ça reste vide

  let interval = setInterval(() => {
    yearToShow++

    if(yearToShow === ACTUALYEAR){
        clearInterval(interval)
        console.log("Fin de l'affichage")
    }

    updateChartWithRealData()
  }, 11600) // pour que ça se synchronise avec avec l'effet du slider
})

//***********************************************************************Fonctions graphe 1******************************************************************

//Permet de récupérer les différentes informations des pages de l'api
async function dataFilm(yearToShow) {

  const monthCounts = new Array(12).fill(0) // on créer un nouveau tableau qu'on va remplir et qu'on va renvoyer pour qu'on les utilisent dans le graph

  for (let i = 1; i <= 50; i++) { // nombre de page a analyser
    try {
      const response = await fetch(`https://dataviz-backend-aizu.onrender.com/trending/${i}`)
      const data = await response.json()

      if (data.results && Array.isArray(data.results)) { // on vérifie bien qu'on récupérer les informations de la page en cours et qu'on a un tableau
        sortData(data.results, yearToShow, monthCounts) // on appelle une fonction qui va remplir le tableau en fonction du résultat
      }

    } 
    
    catch (error) {
      console.error(`Erreur sur la page ${i} :`, error) // on renvoi une erreur dans la console si jamais on a pas réussi à réc
    }

  }

  return monthCounts // on retourne notre tableau fini
}

function sortData(results, yearToShow, monthCounts) {
  for (let film of results) { // on récupère la page en cours et on l'analyse ( d'ou la notion de vérifier si c'est un tableau )
    if (!film.release_date == ""){ // on sait jamais --> on a des backdrops vide donc bon, c'est plus sur

        let SplitedDate = film.release_date.split("-") // variable tampon pour séparer le string
        
        const year = Number(SplitedDate[0]) // c'est un string a la base
        const month = Number(SplitedDate[1])  // c'est un string a la base

        if (year === yearToShow && month >= 1 && month <= 12) {
        monthCounts[month - 1]++
        }
    }
  }
}

async function updateChartWithRealData() {
  const monthData = await dataFilm(yearToShow)

  // permet de transférer les données de notre array dans notre chart
  for (let i = 0; i < 12; i++) {
    chart.data.datasets[0].data[i] = monthData[i]
  }
  chart.options.plugins.title.text = `Sorties de films en ${yearToShow}`
  chart.update()
}