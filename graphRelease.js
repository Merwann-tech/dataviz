//********************************************************************Variables globales*****************************************************************

let releaseChart // on définit une variable chart qui va contenir notre affichage ( c'est la chart qu'on va créer toutes les x secondes )
let yearToShow = 2014 // on l'a met en variable globale car on doit pouvoir la modifier lors de notre appel du setInterval. --> démarre l'affichage en 2015

const CURRENTYEAR = new Date()
const ACTUALYEAR = CURRENTYEAR.getFullYear()
const maxMonthDay = ["31","28","31","30","31","30","31","31","30","31","30","31"]
//***************************************************************************GRAPHE 1********************************************************************


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
  releaseChart = new Chart(DISPLAYGRAPH, config)
  updateChartWithRealData() // on lance la fonction une première fois pour que le graphe se charge une première fois sans que ça reste vide
  
  let interval = setInterval(() => {
    yearToShow++

    if(yearToShow === ACTUALYEAR){
        clearInterval(interval)
        console.log("Fin de l'affichage de la boucle de graphes")
    }
    updateChartWithRealData()}, 11600) // pour que ça se synchronise avec avec l'effet du slider
})

//***********************************************************************Fonctions graphe********************************************************************

//Permet de récupérer les différentes informations des pages de l'api
async function dataFilm(yearToShow) {

  const monthCounts = new Array(12).fill(0)

  for (let month = 1; month <= 12; month++) {
    try {
      const response = await fetch(`https://dataviz-backend-aizu.onrender.com/graph/${yearToShow}/${month}/${maxMonthDay[month - 1]}`)
      const data = await response.json()
      releaseChart.data.datasets[0].data[month - 1] = data.total_results
      }    
    catch (error) {
      console.error(`Erreur sur la page ${i} :`, error)
    }
  }

  return monthCounts
}

async function updateChartWithRealData() {
  await dataFilm(yearToShow)
  releaseChart.options.plugins.title.text = `Sorties de films en ${yearToShow}`
  releaseChart.update()
}