/**
 * EmotionAI - Dashboard Functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    // Only run if on dashboard
    if (!document.querySelector('.dashboard-container')) return;

    // 1. Initialize Date & Time
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // 2. Initialize Charts (from charts.js)
    // charts.js executes automatically if included 

    // 3. Setup interactivity
    setupDashboardInteractivity();
});

function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    const dateString = now.toLocaleDateString('en-US', options);

    const dateTimeElement = document.getElementById('currentDateTime');
    if (dateTimeElement) {
        dateTimeElement.textContent = dateString;
    }
}

function setupDashboardInteractivity() {
    // Time Range Selector
    const timeRangeSelect = document.getElementById('timeRange');
    if (timeRangeSelect) {
        timeRangeSelect.addEventListener('change', (e) => {
            // In a real app, this would fetch new data
            console.log(`Time range changed to: ${e.target.value}`);
            refreshDashboardData(e.target.value);
        });
    }

    // Refresh Button handled inline in HTML onclick="refreshHistory()"
}

function refreshHistory() {
    const btn = document.querySelector('.btn-outline'); // Or specific ID
    if (!btn) return;

    // Add loading state
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="uil uil-spinner-alt uil-spin"></i> Refreshing...';
    btn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Here you would fetch new data and update the table
        // updateHistoryTable(newData);

        btn.innerHTML = originalContent;
        btn.disabled = false;

        // Show success toast (using main.js utility if available, or simple alert/console)
        console.log("Dashboard refreshed");
    }, 1500);
}

function refreshDashboardData(range) {
    // Placeholder for data fetching logic
    // const data = await fetch(`/api/stats?range=${range}`);
    // updateCharts(data);
}
