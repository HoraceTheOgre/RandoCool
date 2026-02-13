class VueAccueil {
    constructor() {
        this.html = document.getElementById("html-vue-accueil").innerHTML;
        this.watchId = null;
    }

    afficher() {
        document.getElementsByTagName("body")[0].innerHTML = this.html;

        console.log('Ready');
        this.updateStatus('Ready');

        const startBtn = document.getElementById('startBtn');
        const stopBtn = document.getElementById('stopBtn');

        if (startBtn) startBtn.addEventListener('click', () => this.startTracking());
        if (stopBtn) stopBtn.addEventListener('click', () => this.stopTracking());
    }

    startTracking() {
        if (!navigator.geolocation) {
            this.updateStatus('GPS not available');
            return;
        }

        this.updateStatus('Starting GPS...');

        const options = {
            enableHighAccuracy: true,
            timeout: 30000,
            maximumAge: 0
        };

        this.watchId = navigator.geolocation.watchPosition(
            (position) => this.onSuccess(position),
            (error) => this.onError(error),
            options
        );

        document.getElementById('startBtn').disabled = true;
        document.getElementById('stopBtn').disabled = false;
        this.updateStatus('Tracking...');
    }

    stopTracking() {
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }

        document.getElementById('startBtn').disabled = false;
        document.getElementById('stopBtn').disabled = true;
        document.getElementById('speedKmh').textContent = '0';
        this.updateStatus('Stopped');
    }

    onSuccess(position) {
        const speedMs = position.coords.speed;

        if (speedMs !== null && speedMs >= 0) {
            const speedKmh = speedMs * 3.6;
            document.getElementById('speedKmh').textContent = Math.round(speedKmh);
        } else {
            document.getElementById('speedKmh').textContent = '0';
        }

        this.updateStatus('Tracking...');
    }

    onError(error) {
        let errorMessage = 'Error';
        if (error.code === error.PERMISSION_DENIED) errorMessage = 'Permission denied';
        else if (error.code === error.POSITION_UNAVAILABLE) errorMessage = 'GPS unavailable';
        else if (error.code === error.TIMEOUT) errorMessage = 'GPS timeout';

        this.updateStatus(errorMessage);
    }

    updateStatus(message) {
        const statusElement = document.getElementById('status');
        if (statusElement) {
            statusElement.textContent = message;
        }
    }
}

app.initialize();
