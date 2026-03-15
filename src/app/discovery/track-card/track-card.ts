import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { Track } from '@spotify/web-api-ts-sdk';
import { EMPTY, catchError, finalize, switchMap, tap } from 'rxjs';
import { ReccoBeatsService } from '../../recco-beats/recco-beats.service';

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
  readonly isLoading = signal(false);

  protected artistNames(): string {
    return this.track().artists.map((artist) => artist.name).join(', ');
  }

  protected onSelectTrack(): void {
    if (this.isLoading()) {
      return;
    }

    const spotifyTrackId = this.track().id;
    this.isLoading.set(true);

    this.reccoBeatsService.getTrackBySpotifyId(spotifyTrackId).pipe(
      switchMap(trackLookup => {
        const reccoId = trackLookup.content[0]?.id;

        if (!reccoId) {
          console.error('[ReccoBeats] No track mapping found for Spotify track ID:', spotifyTrackId);
          return EMPTY;
        }

        return this.reccoBeatsService.getTrackAudioFeaturesByReccoId(reccoId).pipe(
          tap(audioFeatures => {
            console.log('[ReccoBeats] Spotify track ID:', spotifyTrackId);
            console.log('[ReccoBeats] ReccoBeats UUID:', reccoId);
            console.log('[ReccoBeats] Audio features:', audioFeatures);
          })
        );
      }),
      catchError(error => {
        console.error('[ReccoBeats] Failed to load audio features for Spotify track ID:', spotifyTrackId, error);
        return EMPTY;
      }),
      finalize(() => this.isLoading.set(false))
    ).subscribe();
  }
}
