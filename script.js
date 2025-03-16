// script.js
import { auth, db } from './firebase-config.js';
import { doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js';

const provider = new GoogleAuthProvider();

document.addEventListener('DOMContentLoaded', () => {
    let intervalId = null;
    const startDate = new Date('2025-01-27T00:00:00');
    let endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 90); // Default end date
    const refreshBtn = document.getElementById('refreshBtn');
    const stopBtn = document.getElementById('stopBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const googleSignInBtn = document.getElementById('googleSignInBtn');
    const mainContent = document.getElementById('mainContent');
    const userName = document.getElementById('userName'); // Changed from userEmail
    let totalDuration = endDate - startDate;

    const signinModal = new bootstrap.Modal(document.getElementById('signinModal'), {
        backdrop: 'static',
        keyboard: false
    });

    const endDateElement = document.getElementById('endDate');
    if (endDateElement) {
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
        if (completionMessage) {
            completionMessage.classList.remove('d-none');
            completionMessage.textContent = '🚀 Project Horizon Completed!';
        }
        if (stopBtn) stopBtn.classList.add('d-none');
        if (refreshBtn) refreshBtn.classList.remove('d-none');
    }

    function updateTimer() {
        const now = Date.now();
        const elapsed = now - startDate;
        const remaining = endDate - now;

        if (remaining <= 0) {
            showCompletion();
            return;
        }

        const progressPercent = Math.min((elapsed / totalDuration) * 100, 100);
        const progressBar = document.getElementById('progress');
        if (progressBar) {
            progressBar.style.width = `${progressPercent}%`;
            const hue = 120 - (progressPercent * 0.6);
            progressBar.style.backgroundColor = `hsl(${hue}, 80%, 50%)`;
        }

        const currentPercentElement = document.getElementById('currentPercentage');
        if (currentPercentElement) {
            const percentValue = Math.round(progressPercent);
            currentPercentElement.innerHTML = `<span class="badge bg-primary rounded-pill">${percentValue}%</span>`;
            currentPercentElement.style.left = `${progressPercent}%`;
        }

        const daysRemaining = Math.floor(remaining / (1000 * 60 * 60 * 24));
        const hoursRemaining = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutesRemaining = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const secondsRemaining = Math.floor((remaining % (1000 * 60)) / 1000);

        const daysElapsed = Math.floor(elapsed / (1000 * 60 * 60 * 24));
        const currentDate = new Date(now);
        const hoursElapsed = currentDate.getHours();
        const minutesElapsed = currentDate.getMinutes();
        const secondsElapsed = currentDate.getSeconds();

        const elapsedContainer = document.getElementById('elapsedTime');
        if (elapsedContainer) {
            elapsedContainer.innerHTML = '';
            elapsedContainer.append(
                createTimeCard('elapsed', daysElapsed, 'Days', (daysElapsed / (totalDuration / (1000 * 60 * 60 * 24))) * 100),
                createTimeCard('elapsed', formatNumber(hoursElapsed), 'Hours', (hoursElapsed / 24) * 100),
                createTimeCard('elapsed', formatNumber(minutesElapsed), 'Minutes', (minutesElapsed / 60) * 100),
                createTimeCard('elapsed', formatNumber(secondsElapsed), 'Seconds', (secondsElapsed / 60) * 100)
            );
        }

        const remainingContainer = document.getElementById('remainingTime');
        if (remainingContainer) {
            remainingContainer.innerHTML = '';
            remainingContainer.append(
                createTimeCard('remaining', daysRemaining, 'Days', (daysRemaining / (totalDuration / (1000 * 60 * 60 * 24))) * 100),
                createTimeCard('remaining', formatNumber(hoursRemaining), 'Hours', 100 - (hoursElapsed / 24) * 100),
                createTimeCard('remaining', formatNumber(minutesRemaining), 'Minutes', 100 - (minutesElapsed / 60) * 100),
                createTimeCard('remaining', formatNumber(secondsRemaining), 'Seconds', 100 - (secondsElapsed / 60) * 100)
            );
        }
    }

    function startTimer() {
        clearInterval(intervalId);
        totalDuration = endDate - startDate;
        if (endDateElement) {
            endDateElement.textContent = `End: ${endDate.toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
            })}`;
        }
        updateTimer();
        intervalId = setInterval(updateTimer, 1000);
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            startTimer();
            stopBtn.classList.remove('d-none');
            refreshBtn.classList.add('d-none');
        });
    }

    if (stopBtn) {
        stopBtn.addEventListener('click', () => {
            clearInterval(intervalId);
            stopBtn.classList.add('d-none');
            if (refreshBtn) refreshBtn.classList.remove('d-none');
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            signOut(auth).catch(error => console.error('Logout failed:', error));
        });
    }

    if (googleSignInBtn) {
        googleSignInBtn.addEventListener('click', () => {
            signInWithPopup(auth, provider)
                .then(() => signinModal.hide())
                .catch(error => console.error('Google Sign-In failed:', error));
        });
    }

    auth.onAuthStateChanged(async user => {
        if (user) {
            mainContent.style.display = 'block';
            signinModal.hide();
            userName.textContent = user.displayName || 'User'; // Use displayName, fallback to 'User'
            try {
                const docRef = doc(db, 'countdowns', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    endDate = new Date(docSnap.data().endDate);
                } else {
                    await setDoc(docRef, {
                        endDate: endDate.toISOString()
                    });
                    console.log('Initialized countdown for new user:', user.uid);
                }
                startTimer();
            } catch (error) {
                console.error('Error with countdown data:', error);
                endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 90);
                startTimer();
            }
        } else {
            mainContent.style.display = 'none';
            signinModal.show();
            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 90);
            clearInterval(intervalId);
        }
    });

    window.saveCountdown = async function () {
        const user = auth.currentUser;
        if (user) {
            const newEndDate = new Date(document.getElementById('countdown-date').value);
            if (newEndDate > new Date()) {
                endDate = newEndDate;
                try {
                    await setDoc(doc(db, 'countdowns', user.uid), {
                        endDate: newEndDate.toISOString()
                    });
                    startTimer();
                } catch (error) {
                    console.error('Error saving countdown:', error);
                }
            } else {
                alert('Please select a future date.');
            }
        } else {
            alert('Please sign in to save a custom countdown.');
        }
    };
});