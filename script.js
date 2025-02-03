document.addEventListener('DOMContentLoaded', () => {
    let intervalId = null;
    const startDate = new Date('2025-01-27T00:00:00');
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 90);
    const refreshBtn = document.getElementById('refreshBtn');
    const stopBtn = document.getElementById('stopBtn');
    const totalDuration = endDate - startDate;

    // Initialize display
    document.getElementById('endDate').textContent = `End: ${endDate.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    })}`;

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
        document.getElementById('completionMessage').classList.remove('d-none');
        document.getElementById('completionMessage').textContent = '🚀 Project Horizon Completed!';
        stopBtn.classList.add('d-none');
        refreshBtn.classList.remove('d-none');

        // Set final progress state
        document.getElementById('progress').style.width = '100%';
        document.getElementById('elapsedPercentage').textContent = '100%';
        document.getElementById('remainingPercentage').textContent = '0%';
    }

    function updateTimer() {
        const now = Date.now();
        const elapsed = now - startDate;
        const remaining = endDate - now;

        if (remaining <= 0) {
            showCompletion();
            return;
        }

        // Calculate main progress
        const progressPercent = Math.min((elapsed / totalDuration) * 100, 100);
        const progressBar = document.getElementById('progress');
        progressBar.style.width = `${progressPercent}%`;

        // Update progress color
        const hue = 120 - (progressPercent * 0.6);
        progressBar.style.backgroundColor = `hsl(${hue}, 80%, 50%)`;

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

        // Calculate individual progress percentages
        const dayPercentage = (daysElapsed / 90) * 100;
        const hourPercentage = (hoursElapsed / 24) * 100;
        const minutePercentage = (minutesElapsed / 60) * 100;
        const secondPercentage = (secondsElapsed / 60) * 100;

        // Update elapsed time display
        const elapsedContainer = document.getElementById('elapsedTime');
        elapsedContainer.innerHTML = '';
        elapsedContainer.append(
            createTimeCard('elapsed', daysElapsed, 'Days', dayPercentage),
            createTimeCard('elapsed', formatNumber(hoursElapsed), 'Hours', hourPercentage),
            createTimeCard('elapsed', formatNumber(minutesElapsed), 'Minutes', minutePercentage),
            createTimeCard('elapsed', formatNumber(secondsElapsed), 'Seconds', secondPercentage)
        );

        // Update remaining time display
        const remainingContainer = document.getElementById('remainingTime');
        remainingContainer.innerHTML = '';
        remainingContainer.append(
            createTimeCard('remaining', daysRemaining, 'Days', 100-dayPercentage),
            createTimeCard('remaining', formatNumber(hoursRemaining), 'Hours', 100-hourPercentage),
            createTimeCard('remaining', formatNumber(minutesRemaining), 'Minutes', 100-minutePercentage),
            createTimeCard('remaining', formatNumber(secondsRemaining), 'Seconds', 100-secondPercentage)
        );

        // Update main display with animation
        ['days', 'hours', 'minutes', 'seconds'].forEach((unit, index) => {
            const element = document.getElementById(unit);
            const value = index === 0 ? daysRemaining :
                index === 1 ? formatNumber(hoursRemaining) :
                    index === 2 ? formatNumber(minutesRemaining) :
                        formatNumber(secondsRemaining);

            if (element.textContent !== value) {
                element.classList.add('changing');
                setTimeout(() => {
                    element.textContent = value;
                    element.classList.remove('changing');
                }, 200);
            }
        });

        // Update percentage displays
        document.getElementById('elapsedPercentage').textContent = `${Math.round(progressPercent)}%`;
        document.getElementById('remainingPercentage').textContent = `${Math.round(100 - progressPercent)}%`;
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