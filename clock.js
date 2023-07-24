function updateClock() {
    document.getElementById('clock-time').textContent = new Date().toLocaleTimeString();
    document.getElementById('clock-date').textContent = new Date().toLocaleDateString();
}

setInterval(updateClock, 1000);