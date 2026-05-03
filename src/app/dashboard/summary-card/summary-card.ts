import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ProfileSummary, TopGenre } from '../models/dashboard.models';

@Component({
    selector: 'app-summary-card',
    templateUrl: './summary-card.html',
    styleUrl: './summary-card.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryCard {
    readonly summary = input.required<ProfileSummary>();
    readonly topGenres = input.required<TopGenre[]>();
}
