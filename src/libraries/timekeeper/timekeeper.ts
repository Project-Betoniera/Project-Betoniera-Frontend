type TimePrecision = "second" | "minute" | "hour";
type TimekeeperListener = (date: Date) => unknown;

export default class Timekeeper {
    private registeredEvents: boolean = false;
    private interval: number | null = null;
    private previousTimestamp: number | null = null;
    private listeners: { precision: TimePrecision, callback: TimekeeperListener; }[] = [];
    private started: boolean = false;

    private static splitTimestamp(timestamp: number) {
        return {
            second: Math.floor(timestamp / 1000),
            minute: Math.floor(timestamp / 1000 / 60),
            hour: Math.floor(timestamp / 1000 / 60 / 60),
        };
    }

    private tick() {
        const now = new Date();
        const currentTimestamp = now.getTime();
        const currentTime = Timekeeper.splitTimestamp(currentTimestamp);
        const previousTime = this.previousTimestamp ? Timekeeper.splitTimestamp(this.previousTimestamp) : null;
        if (currentTime.second !== previousTime?.second) {
            this.listeners.filter(listener => listener.precision === "second").forEach(listener => listener.callback(now));
        }
        if (currentTime.minute !== previousTime?.minute) {
            this.listeners.filter(listener => listener.precision === "minute").forEach(listener => listener.callback(now));
        }
        if (currentTime.hour !== previousTime?.hour) {
            this.listeners.filter(listener => listener.precision === "hour").forEach(listener => listener.callback(now));
        }
        this.previousTimestamp = currentTimestamp;
    }

    private resume() {
        // ensures that the interval is NOT set
        this.pause();

        // determines the current precision
        let timeout = 60_000;
        let smallestPrecision = "hour";
        this.listeners.forEach(listener => {
            if (listener.precision === "second" && smallestPrecision !== "second") {
                timeout = 100;
                smallestPrecision = "second";
            } else if (listener.precision === "minute" && smallestPrecision !== "second" && smallestPrecision !== "minute") {
                timeout = 1_000;
                smallestPrecision = "minute";
            }
        });

        this.interval = window.setInterval(() => {
            this.tick();
        }, timeout);
        this.tick();
    }

    private pause() {
        if (this.interval) {
            window.clearInterval(this.interval);
            this.interval = null;
        }
    }

    private onVisibilityChange = () => {
        if (document.visibilityState === "visible") {
            this.resume();
        } else {
            this.pause();
        }
    };

    private registerEvents() {
        if (this.registeredEvents) return;
        this.registeredEvents = true;
        document.addEventListener("visibilitychange", this.onVisibilityChange);
    }

    private unregisterEvents() {
        if (!this.registeredEvents) return;
        this.registeredEvents = false;
        document.removeEventListener("visibilitychange", this.onVisibilityChange);
    }

    start() {
        this.started = true;
        this.onVisibilityChange();
        this.registerEvents();
    }

    stop() {
        this.pause();
        this.unregisterEvents();
        this.started = false;
    }

    addListener(precision: TimePrecision, callback: TimekeeperListener) {
        let currentIndex = this.listeners.findIndex(listener => listener.callback === callback);
        if (currentIndex !== -1) {
            this.listeners[currentIndex].precision = precision;
        } else {
            this.listeners.push({ precision, callback });
            if (this.started) this.start(); // ensures that the interval runs exactly as fast as necessary and that the interval is running if it wasn't already
        }
    }

    removeListener(callback: TimekeeperListener) {
        let currentIndex = this.listeners.findIndex(listener => listener.callback === callback);
        if (currentIndex !== -1) {
            this.listeners.splice(currentIndex, 1);
            if (this.started) this.start(); // ensures that the interval runs exactly as fast as necessary (slowing down if possible)
        }
    }
}
export type { TimePrecision, TimekeeperListener };

