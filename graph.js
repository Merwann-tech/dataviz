//méthodo pour pouvoir utiliser la clé API
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOWZkMWUyNTE0OTgzYWVkODc4N2Y0ZThlN2IwZGFmZCIsIm5iZiI6MTc1MzEwMTU1Ni4yOTMsInN1YiI6IjY4N2UzNGY0Mjc0YjA5MWY3NjUyOGY3NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Y7LqI4nVTIqGOxo4C0MOIe2kH0W9VBOa51m3P5mtd6U",
  },
}

//*******************************************************************************************************************************************************

let chart // on définit une variable chart qui va contenir notre affichage ( c'est la chart qu'on va créer toutes les x secondes )
let yearToShow = 2014 // on l'a met en variable globale car on doit pouvoir la modifier lors de notre appel du setInterval. --> démarre l'affichage en 2015

//*******************************************************************************************************************************************************

//Permet de récupérer les différentes informations des pages de l'api
async function dataFilm(yearToShow) {

  const monthCounts = new Array(12).fill(0) // on créer un nouveau tableau qu'on va remplir et qu'on va renvoyer pour qu'on les utilisent dans le graph

  for (let i = 1; i <= 50; i++) { // nombre de page a analyser
    try {
      const response = await fetch(`https://api.themoviedb.org/3/trending/movie/day?language=fr-FR&page=${i}`, options)
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
        
        const year = Number(SplitedDate[0])
        const month = Number(SplitedDate[1])

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

//*******************************************************************************************************************************************************

//L'évenement DOMContentLoader se lance au moment ou le fichier est chargé
document.addEventListener('DOMContentLoaded', function () {
  const data = {
    labels: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
    datasets: [{
      label: 'Nombre de sorties',

      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // on le fait démarrer à 0 pour qu'on ait un affichage ou il n'y a rien

      backgroundColor: ['#f87171', '#fb923c', '#facc15', '#4ade80', '#60a5fa', '#3339ff', '#ff33d1', '#39ff33', '#7a33ff', '#33fff3', '#d8e80b', '#8f3192'],
    }]
  }

  const config = {
    type: 'doughnut',
    data: data,
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

  updateChartWithRealData()
  
  let interval = setInterval(() => {
    yearToShow++

    if(yearToShow === 2025){
        clearInterval(interval)
        console.log("Fin de l'affichage")
    }

    updateChartWithRealData()
  }, 11600) // pour que ça se synchronise avec avec l'effet du slider
  
  // permet de lancer la génération de charts différents --> pour l'instant c'est aléatoire mais a terme il faudrait que ça récupère les sorties par années
  // fonction dataFilm, le return devra renvoyer le tableau de données a utiliser
})
