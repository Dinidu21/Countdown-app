document.addEventListener('DOMContentLoaded', () => {
    const startDate = new Date('2025-01-27T00:00:00');
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 180);

    // Set end date display
    document.getElementById('endDate').textContent = `End: ${endDate.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    })}`;

    function updateTimer() {
        const now = new Date().getTime();
        const totalDuration = endDate - startDate;
        const elapsed = now - startDate;
        const remaining = endDate - now;

        // Update progress bar
        const progressPercent = Math.min((elapsed / totalDuration) * 100, 100);
        document.getElementById('progress').style.width = `${progressPercent}%`;

        // Calculate time units
        const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

        // Update display
        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

        // Smooth color transition
        const progressBar = document.getElementById('progress');
        const hue = 120 - (progressPercent * 0.6);
        progressBar.style.backgroundColor = `hsl(${hue}, 80%, 50%)`;
    }

    // Initial call and update every second
    updateTimer();
    setInterval(updateTimer, 1000);
});