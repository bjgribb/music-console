import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationService } from './notification.service';

@Component({
    selector: 'app-toast',
    imports: [],
    templateUrl: './toast.html',
    styleUrl: './toast.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toast {
    protected readonly notificationService = inject(NotificationService);
}
