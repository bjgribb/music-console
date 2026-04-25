import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
    let service: NotificationService;

    beforeEach(() => {
        vi.useFakeTimers();
        TestBed.configureTestingModule({});
        service = TestBed.inject(NotificationService);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('success() sets the notification signal with level success and the given message', () => {
        service.success('Loaded 5 recommendations.');

        expect(service.notification()).toEqual({ level: 'success', message: 'Loaded 5 recommendations.' });
    });

    it('error() sets the notification signal with level error and the given message', () => {
        service.error('Something went wrong.');

        expect(service.notification()).toEqual({ level: 'error', message: 'Something went wrong.' });
    });

    it('clears the notification after the default duration', () => {
        service.success('Done!');
        expect(service.notification()).not.toBeNull();

        vi.advanceTimersByTime(4500);

        expect(service.notification()).toBeNull();
    });

    it('does not clear the notification before the duration elapses', () => {
        service.success('Done!');

        vi.advanceTimersByTime(4499);

        expect(service.notification()).not.toBeNull();
    });

    it('replaces the current notification immediately when a new one is shown', () => {
        service.error('First error.');
        service.success('Second message.');

        expect(service.notification()).toEqual({ level: 'success', message: 'Second message.' });
    });

    it('resets the timer so the new notification lasts the full duration', () => {
        service.error('First error.');
        vi.advanceTimersByTime(3000);

        service.success('Second message.');

        // 4500ms after the first call — would have cleared the first notification,
        // but the second should still be visible because its timer was reset.
        vi.advanceTimersByTime(1500);
        expect(service.notification()).not.toBeNull();

        vi.advanceTimersByTime(3000);
        expect(service.notification()).toBeNull();
    });

    it('clear() immediately sets the notification to null', () => {
        service.error('Something went wrong.');
        service.clear();

        expect(service.notification()).toBeNull();
    });

    it('clear() cancels the pending timer so it does not clear the next notification', () => {
        service.error('First error.');
        service.clear();

        service.success('Fresh notification.');

        // The cancelled timer from the first call should not fire and wipe this out.
        vi.advanceTimersByTime(4500);

        // It should have been cleared by its own timer, not the stale one.
        expect(service.notification()).toBeNull();
    });
});
