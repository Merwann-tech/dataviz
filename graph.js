document.addEventListener('DOMContentLoaded', function () {
        const data = {
        labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
        datasets: [{
          label: 'Dataset 1',
          data: [12, 19, 5, 13, 18], //On peut les remplacer si on récupère des données
          backgroundColor: ['#f87171', '#fb923c', '#facc15', '#4ade80', '#60a5fa'],
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
              display: true,
              text: 'Chart.js Doughnut Chart'
            }
          }
        },
      };

      const ctx = document.getElementById('inshCaPasse');
      
      new Chart(ctx, config);
    });