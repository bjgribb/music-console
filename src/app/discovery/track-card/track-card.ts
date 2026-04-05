import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { Track } from '@spotify/web-api-ts-sdk';
import { EMPTY, catchError, finalize, switchMap, tap } from 'rxjs';
import { ReccoBeatsAudioFeatures, ReccoBeatsService } from '../../recco-beats/recco-beats.service';

export type SeedTrackSelection = {
  track: Track;
  reccoId: string;
  audioFeatures: ReccoBeatsAudioFeatures;
};

@Component({
  selector: 'app-track-card',
  imports: [],
  templateUrl: './track-card.html',
  styleUrl: './track-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackCard {
  private readonly reccoBeatsService = inject(ReccoBeatsService);

  readonly track = input.required<Track>();
  readonly variant = input<'compact' | 'full'>('full');
  readonly seedSelected = output<SeedTrackSelection>();
  readonly isLoading = signal(false);

  protected artistNames(): string {
    return this.track().artists.map((artist) => artist.name).join(', ');
  }

  protected onSelectTrack(): void {
    if (this.isLoading()) {
      return;
    }

    const spotifyTrack = this.track();
    this.isLoading.set(true);

    this.reccoBeatsService.getTrackBySpotifyId(spotifyTrack.id).pipe(
      switchMap(trackLookup => {
        const reccoId = trackLookup.content[0]?.id;

        if (!reccoId) {
          console.error('[ReccoBeats] No track mapping found for Spotify track ID:', spotifyTrack.id);
          return EMPTY;
        }

        return this.reccoBeatsService.getTrackAudioFeaturesByReccoId(reccoId).pipe(
          tap(audioFeatures => {
            this.seedSelected.emit({
              track: spotifyTrack,
              reccoId,
              audioFeatures,
            });
          })
        );
      }),
      catchError(error => {
        console.error('[ReccoBeats] Failed to load audio features for Spotify track ID:', spotifyTrack.id, error);
        return EMPTY;
      }),
      finalize(() => this.isLoading.set(false))
    ).subscribe();
  }
}
