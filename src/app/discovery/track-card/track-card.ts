import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Track } from '@spotify/web-api-ts-sdk';

@Component({
  selector: 'app-track-card',
  imports: [],
  templateUrl: './track-card.html',
  styleUrl: './track-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackCard {
  readonly track = input.required<Track>();
  readonly variant = input<'compact' | 'full'>('full');
  readonly seedSelected = output<Track>();

  protected artistNames(): string {
    return this.track().artists.map((artist) => artist.name).join(', ');
  }

  protected onSelectTrack(): void {
    this.seedSelected.emit(this.track());
  }
}
