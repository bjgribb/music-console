import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Track } from '@spotify/web-api-ts-sdk';

@Component({
  selector: 'app-track-card',
  imports: [],
  templateUrl: './track-card.html',
  styleUrl: './track-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackCard {
  track = input.required<Track>();

  artistNames(): string {
    return this.track().artists.map((artist) => artist.name).join(', ');
  }
}
