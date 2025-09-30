let speciesData = [];
let chart = null;

// Fetch species data
fetch('data/species.json')
    .then(response => response.json())
    .then(data => {
        speciesData = data;
        populateRegions();
        createChart('all');
    });

// Populate dropdown with unique regions
function populateRegions() {
    const regionSelect = document.getElementById('regionSelect');
    const regions = [...new Set(speciesData.map(item => item.region))];
    regions.forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        regionSelect.appendChild(option);
    });

    regionSelect.addEventListener('change', () => {
        createChart(regionSelect.value);
    });
}

// Create or update the chart
function createChart(region) {
    const ctx = document.getElementById('speciesChart').getContext('2d');

    // Filter data based on selected region
    let filtered = region === 'all' ? speciesData : speciesData.filter(item => item.region === region);

    const labels = filtered.map(item => item.name);
    const data = filtered.map(item => item.abundance);

    const chartData = {
        labels: labels,
        datasets: [{
            label: 'Abundance',
            data: data,
            backgroundColor: 'rgba(54, 162, 235, 0.6)'
        }]
    };

    const config = {
        type: 'bar',
        data: chartData,
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    };

    if (chart) {
        chart.destroy();
    }
    chart = new Chart(ctx, config);
}
