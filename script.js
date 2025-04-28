document.addEventListener('DOMContentLoaded', () => {
    let intervalId = null;
    const startDate = new Date('2025-04-28T00:00:00');
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 140);
    const refreshBtn = document.getElementById('refreshBtn');
    const stopBtn = document.getElementById('stopBtn');
    const totalDuration = endDate - startDate;

    // Initialize display
    const endDateElement = document.getElementById('endDate');
    if(endDateElement) {
        endDateElement.textContent = `End: ${endDate.toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        })}`;
    }

    function formatNumber(num) {
        return String(num).padStart(2, '0');
    }

    function createTimeCard(type, value, label, percentage) {
        const card = document.createElement('div');
        card.className = `time-card ${type}-card`;
        card.innerHTML = `
            <div class="value">${value}</div>
            <div class="label">${label}</div>
            <div class="time-progress">
                <div class="progress-bar ${type}-progress" style="width: ${percentage}%"></div>
            </div>
        `;
        return card;
    }

    function showCompletion() {
        clearInterval(intervalId);
        const completionMessage = document.getElementById('completionMessage');
        if(completionMessage) {
            completionMessage.classList.remove('d-none');
            completionMessage.textContent = '🚀 Project Horizon Completed!';
        }
        if(stopBtn) stopBtn.classList.add('d-none');
        if(refreshBtn) refreshBtn.classList.remove('d-none');
    }

    function updateTimer() {
        const now = Date.now();
        const elapsed = now - startDate;
        const remaining = endDate - now;

        if (remaining <= 0) {
            showCompletion();
            return;
        }

        // Update main progress
        const progressPercent = Math.min((elapsed / totalDuration) * 100, 100);
        const progressBar = document.getElementById('progress');
        if(progressBar) {
            progressBar.style.width = `${progressPercent}%`;
            const hue = 120 - (progressPercent * 0.6);
            progressBar.style.backgroundColor = `hsl(${hue}, 80%, 50%)`;
        }

        // Update current percentage
        const currentPercentElement = document.getElementById('currentPercentage');
        if(currentPercentElement) {
            const percentValue = Math.round(progressPercent);
            currentPercentElement.innerHTML = `<span class="badge bg-primary rounded-pill">${percentValue}%</span>`;
            currentPercentElement.style.left = `${progressPercent}%`;
        }

        // Calculate time units
        const daysRemaining = Math.floor(remaining / (1000 * 60 * 60 * 24));
        const hoursRemaining = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutesRemaining = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const secondsRemaining = Math.floor((remaining % (1000 * 60)) / 1000);

        const daysElapsed = Math.floor(elapsed / (1000 * 60 * 60 * 24));
        const currentDate = new Date(now);
        const hoursElapsed = currentDate.getHours();
        const minutesElapsed = currentDate.getMinutes();
        const secondsElapsed = currentDate.getSeconds();

        // Update elapsed time display
        const elapsedContainer = document.getElementById('elapsedTime');
        if(elapsedContainer) {
            elapsedContainer.innerHTML = '';
            elapsedContainer.append(
                createTimeCard('elapsed', daysElapsed, 'Days', (daysElapsed/90)*100),
                createTimeCard('elapsed', formatNumber(hoursElapsed), 'Hours', (hoursElapsed/24)*100),
                createTimeCard('elapsed', formatNumber(minutesElapsed), 'Minutes', (minutesElapsed/60)*100),
                createTimeCard('elapsed', formatNumber(secondsElapsed), 'Seconds', (secondsElapsed/60)*100)
            );
        }

        // Update remaining time display
        const remainingContainer = document.getElementById('remainingTime');
        if(remainingContainer) {
            remainingContainer.innerHTML = '';
            remainingContainer.append(
                createTimeCard('remaining', daysRemaining, 'Days', 100-(daysElapsed/90)*100),
                createTimeCard('remaining', formatNumber(hoursRemaining), 'Hours', 100-(hoursElapsed/24)*100),
                createTimeCard('remaining', formatNumber(minutesRemaining), 'Minutes', 100-(minutesElapsed/60)*100),
                createTimeCard('remaining', formatNumber(secondsRemaining), 'Seconds', 100-(secondsElapsed/60)*100)
            );
        }

        // Update percentage displays
        const elapsedPercentage = document.getElementById('elapsedPercentage');
        const remainingPercentage = document.getElementById('remainingPercentage');
        if(elapsedPercentage && remainingPercentage) {
            elapsedPercentage.textContent = `${Math.round(progressPercent)}%`;
            remainingPercentage.textContent = `${Math.round(100 - progressPercent)}%`;
        }
    }

    // Control buttons
    if(refreshBtn) {
        refreshBtn.addEventListener('click', () => window.location.reload());
    }

    if(stopBtn) {
        stopBtn.addEventListener('click', () => {
            clearInterval(intervalId);
            stopBtn.classList.add('d-none');
            if(refreshBtn) refreshBtn.classList.remove('d-none');
        });
    }

    // Initial setup
    if(typeof updateTimer === 'function') {
        updateTimer();
        intervalId = setInterval(updateTimer, 1000);
    }
    if(stopBtn) stopBtn.classList.remove('d-none');
});