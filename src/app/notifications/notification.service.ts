import { Injectable, signal } from '@angular/core';

export type NotificationLevel = 'success' | 'error';

export type AppNotification = {
    level: NotificationLevel;
    message: string;
};

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private readonly defaultDurationMs = 4500;
    private currentTimeoutId: number | null = null;

    readonly notification = signal<AppNotification | null>(null);

    private show(level: NotificationLevel, message: string): void {
        this.notification.set({ level, message });

        if (this.currentTimeoutId !== null) {
            window.clearTimeout(this.currentTimeoutId);
        }

        this.currentTimeoutId = window.setTimeout(() => {
            this.notification.set(null);
            this.currentTimeoutId = null;
        }, this.defaultDurationMs);
    }

    success(message: string): void {
        this.show('success', message);
    }

    error(message: string): void {
        this.show('error', message);
    }

    clear(): void {
        if (this.currentTimeoutId !== null) {
            window.clearTimeout(this.currentTimeoutId);
            this.currentTimeoutId = null;
        }

        this.notification.set(null);
    }
}
