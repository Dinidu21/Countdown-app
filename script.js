document.addEventListener('DOMContentLoaded', () => {
    let intervalId = null;
    const startDate = new Date('2025-01-27T00:00:00');
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 180);
    const refreshBtn = document.getElementById('refreshBtn');
    const stopBtn = document.getElementById('stopBtn');

    // Initialize display
    document.getElementById('endDate').textContent = `End: ${endDate.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    })}`;

    function formatNumber(num) {
        return String(num).padStart(2, '0');
    }

    function showCompletion() {
        clearInterval(intervalId);
        document.getElementById('completionMessage').classList.remove('d-none');
        document.getElementById('completionMessage').textContent = '🚀 Project Horizon Completed!';
        stopBtn.classList.add('d-none');
        refreshBtn.classList.remove('d-none');
    }

    function updateTimer() {
        const now = Date.now();
        const totalDuration = endDate - startDate;
        const elapsed = now - startDate;
        const remaining = endDate - now;

        if (remaining <= 0) {
            showCompletion();
            document.getElementById('progress').style.width = '100%';
            return;
        }

        // Progress calculations
        const progressPercent = Math.min((elapsed / totalDuration) * 100, 100);
        const progressBar = document.getElementById('progress');
        progressBar.style.width = `${progressPercent}%`;

        // Color transition
        const hue = 120 - (progressPercent * 0.6);
        progressBar.style.backgroundColor = `hsl(${hue}, 80%, 50%)`;

        // Time calculations
        const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

        // Update display with animation
        ['days', 'hours', 'minutes', 'seconds'].forEach((unit, index) => {
            const element = document.getElementById(unit);
            if (element.textContent !== formatNumber(eval(unit))) {
                element.classList.add('changing');
                setTimeout(() => {
                    element.textContent = index === 0 ? days : formatNumber(eval(unit));
                    element.classList.remove('changing');
                }, 200);
            }
        });
    }

    // Control buttons
    refreshBtn.addEventListener('click', () => {
        window.location.reload();
    });

    stopBtn.addEventListener('click', () => {
        clearInterval(intervalId);
        stopBtn.classList.add('d-none');
        refreshBtn.classList.remove('d-none');
    });

    // Initial setup
    updateTimer();
    intervalId = setInterval(updateTimer, 1000);
    stopBtn.classList.remove('d-none');
});