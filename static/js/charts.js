/**
 * EmotionAI - Dashboard Charts
 */

document.addEventListener('DOMContentLoaded', function () {
    // Only initialize if we are on the dashboard page
    if (!document.getElementById('emotionDistributionChart')) return;

    initializeCharts();
});

function initializeCharts() {
    // Shared Chart Options
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        family: "'Inter', sans-serif",
                        size: 12
                    }
                }
            }
        }
    };

    // 1. Emotion Distribution Chart (Doughnut)
    const distributionCtx = document.getElementById('emotionDistributionChart').getContext('2d');

    // Get data from window.dashboardStats or use mock data
    let labels = ['Joy', 'Sadness', 'Anger', 'Fear', 'Love', 'Surprise'];
    let data = [35, 20, 15, 10, 12, 8];

    if (window.dashboardStats && window.dashboardStats.emotion_distribution) {
        const dist = window.dashboardStats.emotion_distribution;
        labels = Object.keys(dist).map(l => l.charAt(0).toUpperCase() + l.slice(1));
        data = Object.values(dist);
    }

    const distributionData = {
        labels: labels,
        datasets: [{
            data: data,
            backgroundColor: [
                '#FFD700', // Joy
                '#4169E1', // Sadness
                '#DC143C', // Anger
                '#800080', // Fear
                '#FF69B4', // Love
                '#FFA500'  // Surprise
            ],
            borderWidth: 0,
            hoverOffset: 4
        }]
    };

    new Chart(distributionCtx, {
        type: 'doughnut',
        data: distributionData,
        options: {
            ...commonOptions,
            cutout: '70%',
            plugins: {
                ...commonOptions.plugins,
                title: {
                    display: false
                }
            }
        }
    });

    // 2. Trend Chart (Line)
    const trendCtx = document.getElementById('trendChart').getContext('2d');

    // Create gradient
    const gradient = trendCtx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.5)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

    const trendData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Positive Sentiment',
            data: [65, 59, 80, 81, 56, 85, 90],
            fill: true,
            backgroundColor: gradient,
            borderColor: '#6366f1',
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#6366f1',
            pointBorderWidth: 2
        }]
    };

    new Chart(trendCtx, {
        type: 'line',
        data: trendData,
        options: {
            ...commonOptions,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            family: "'Inter', sans-serif"
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: "'Inter', sans-serif"
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}
