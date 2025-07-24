const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOWZkMWUyNTE0OTgzYWVkODc4N2Y0ZThlN2IwZGFmZCIsIm5iZiI6MTc1MzEwMTU1Ni4yOTMsInN1YiI6IjY4N2UzNGY0Mjc0YjA5MWY3NjUyOGY3NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Y7LqI4nVTIqGOxo4C0MOIe2kH0W9VBOa51m3P5mtd6U",
  },
};

// // let yearToShow = 2025 // pour vérifier qu'on est bien entrain de travailler sur la bonne année

// // On se sert des deux prochaines variables pour pouvoir stocker nos informations en fonction du mois et de la data
// // let monthInNumber = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] // pour stocker nos résultats à chaque analyse
// // let monthList = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"] // réferentiel des mois

// // on devra mettre en paramètre datasets.label / datasets.data et labels
// // le label ne sera pas changé sur ce doughnut car il affichera les sorties par mois par année



// //Version scrap, à revoir quand j'aurai réussi a d'abord faire des affichages graphiques réguliers
// //
// // for(let numberOfPageToAnalyse; numberOfPageToAnalyse <= 100; numberOfPageToAnalyse++){
// //   const RESPONSE = await fetch(`https://api.themoviedb.org/3/trending/movie/day?language=fr-FR&page=${numberOfPageToAnalyse}`,options);
// //   const DataPage = await RESPONSE.json();
// //   // on récupère les infos de chaque page


// // }

// // function releaseDateSeparated(date){
// //   let yearSplited = date.split('-')

// //   let releaseYear = yearSplited[0] // on récupère l'année de la sortie
// //   let releaseMonth = yearSplited[1] // on récupère le mois de la sortie
  
  
// // }

//---------------------------------------------------------------------------------------------------------------------

let chart; // on définit une variable chart qui va contenir 

function randomiseData(){
  const actualData = chart.data.datasets[0].data // ça nous rends bien les données contenues dans l'objet data
  for(let i = 0; i < actualData.length; i++ ){
    actualData[i] = Math.floor(Math.random() * 30)//math.floor permet de rendre un entier et math.random rends nombre entre 0 et 1 et * additionne 
  }
  chart.update()
}

//L'évenement DOMContentLoader se lance au moment ou le fichier est chargé
document.addEventListener('DOMContentLoaded', function () {
  const data = {
    labels: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
    datasets: [{
      label: 'Nombre de sorties',
      data: [12, 19, 5, 13, 18, 10, 4, 8, 22, 12, 4, 12],
      backgroundColor: ['#f87171', '#fb923c', '#facc15', '#4ade80', '#60a5fa', '#3339ff', '#ff33d1', '#39ff33', '#7a33ff', '#33fff3', '#d8e80b', '#8f3192'],
    }]
  };

  const config = {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: false,
          text: 'Chart.js Doughnut Chart'
        }
      }
    },
  };

  const INSHCAPASSE = document.getElementById('inshCaPasse');
  chart = new Chart(INSHCAPASSE, config);

  console.log(chart.data.datasets[0].data)

  setInterval(randomiseData, 5000);
});
