import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ProfileTrack } from '../models/dashboard.models';

@Component({
    selector: 'app-top-tracks-card',
    templateUrl: './top-tracks-card.html',
    styleUrl: './top-tracks-card.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopTracksCard {
    readonly tracks = input.required<ProfileTrack[]>();
}
