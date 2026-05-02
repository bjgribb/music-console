import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { NotificationService } from '../../notifications/notification.service';
import { UserProfile } from '../models/dashboard.models';

@Component({
    selector: 'app-hero-card',
    templateUrl: './hero-card.html',
    styleUrl: './hero-card.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroCard {
    readonly profile = input.required<UserProfile>();

    private readonly notifications = inject(NotificationService);

    protected copyShareLink(): void {
        navigator.clipboard.writeText(window.location.href).then(
            () => this.notifications.success('Link copied to clipboard!'),
            () => this.notifications.error('Could not copy link.'),
        );
    }
}
