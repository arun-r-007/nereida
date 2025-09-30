
    let speciesData = [];
    let chart = null;

    // Sample data for demonstration
    const sampleData = [
        { id: 1, name: "Humpback Whale", abundance: 45, region: "Pacific", category: "Mammal", endangered: true },
        { id: 2, name: "Clownfish", abundance: 320, region: "Indian", category: "Fish", endangered: false },
        { id: 3, name: "Sea Turtle", abundance: 78, region: "Atlantic", category: "Reptile", endangered: true },
        { id: 4, name: "Coral", abundance: 560, region: "Pacific", category: "Coral", endangered: true },
        { id: 5, name: "Dolphin", abundance: 120, region: "Indian", category: "Mammal", endangered: false },
        { id: 6, name: "Shark", abundance: 65, region: "Atlantic", category: "Fish", endangered: true },
        { id: 7, name: "Jellyfish", abundance: 420, region: "Pacific", category: "Invertebrate", endangered: false },
        { id: 8, name: "Seahorse", abundance: 85, region: "Indian", category: "Fish", endangered: true }
    ];

    function initDashboard() {
        speciesData = sampleData;
        populateRegions();
        updateStatistics();
        createChart('all');
        populateSpeciesList();
        setDefaultDates();
    }

    function setDefaultDates() {
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        document.getElementById('dateFrom').valueAsDate = thirtyDaysAgo;
        document.getElementById('dateTo').valueAsDate = today;
    }

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
            updateStatistics(regionSelect.value);
            populateSpeciesList(regionSelect.value);
        });

        document.getElementById('timeRange').addEventListener('change', function() {
            updateTimeRange(this.value);
        });
    }

    function updateTimeRange(range) {
        const today = new Date();
        const fromDate = new Date();
        
        switch(range) {
            case '7d':
                fromDate.setDate(today.getDate() - 7);
                break;
            case '30d':
                fromDate.setDate(today.getDate() - 30);
                break;
            case '90d':
                fromDate.setDate(today.getDate() - 90);
                break;
            case '1y':
                fromDate.setFullYear(today.getFullYear() - 1);
                break;
        }
        
        document.getElementById('dateFrom').valueAsDate = fromDate;
        document.getElementById('dateTo').valueAsDate = today;

        console.log(`Time range updated: ${fromDate.toDateString()} - ${today.toDateString()}`);
    }

    function updateStatistics(region = 'all') {
        let filtered = region === 'all' ? speciesData : speciesData.filter(item => item.region === region);

        document.getElementById('totalSpecies').textContent = filtered.length;

        const avg = filtered.reduce((sum, item) => sum + item.abundance, 0) / filtered.length;
        document.getElementById('avgAbundance').textContent = avg.toFixed(1);

        const endangered = filtered.filter(item => item.endangered).length;
        document.getElementById('endangeredCount').textContent = endangered;
    }

    function populateSpeciesList(region = 'all') {
        const speciesList = document.getElementById('speciesList');
        let filtered = region === 'all' ? speciesData : speciesData.filter(item => item.region === region);

        filtered.sort((a, b) => b.abundance - a.abundance);

        speciesList.innerHTML = '';

        const topSpecies = filtered.slice(0, 5);
        topSpecies.forEach(species => {
            const item = document.createElement('div');
            item.className = 'species-item';
            item.innerHTML = `
                <span class="species-name">${species.name}</span>
                <span class="species-abundance">${species.abundance}</span>
            `;
            speciesList.appendChild(item);
        });
    }

    function createChart(region) {
        const ctx = document.getElementById('speciesChart').getContext('2d');
        let filtered = region === 'all' ? speciesData : speciesData.filter(item => item.region === region);

        filtered.sort((a, b) => b.abundance - a.abundance);

        const labels = filtered.map(item => item.name);
        const data = filtered.map(item => item.abundance);

        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(0, 119, 182, 0.8)');
        gradient.addColorStop(1, 'rgba(0, 119, 182, 0.2)');

        const chartData = {
            labels: labels,
            datasets: [{
                label: 'Abundance',
                data: data,
                backgroundColor: gradient,
                borderColor: 'rgba(0, 119, 182, 1)',
                borderWidth: 1,
                borderRadius: 6,
                hoverBackgroundColor: 'rgba(0, 119, 182, 0.9)'
            }]
        };

        const config = {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                size: 12
                            },
                            callback: function(value) {
                                return value + ' specimens';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        },
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `Population: ${context.parsed.y} specimens`;
                            }
                        }
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart',
                    delays: function(context) {
                        return context.dataIndex * 100;
                    }
                },
                hover: {
                    mode: 'nearest',
                    intersect: false,
                    animationDuration: 200
                },
                onHover: (event, elements) => {
                    const chart = event.chart;
                    const canvas = chart.canvas;
                    canvas.style.cursor = elements.length ? 'pointer' : 'default';
                }
            }
        };

        if (chart) {
            chart.destroy();
        }
        chart = new Chart(ctx, config);
    }

    // Initialize everything once the page is fully loaded
    document.addEventListener('DOMContentLoaded', initDashboard);