import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ProfileArtist } from '../models/dashboard.models';

@Component({
    selector: 'app-top-artists-card',
    templateUrl: './top-artists-card.html',
    styleUrl: './top-artists-card.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopArtistsCard {
    readonly artists = input.required<ProfileArtist[]>();
}
