import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Track } from '@spotify/web-api-ts-sdk';
import { EMPTY, catchError, finalize, switchMap, tap } from 'rxjs';
import { ReccoBeatsAudioFeatures, ReccoBeatsRecommendation, ReccoBeatsService } from '../../recco-beats/recco-beats.service';
import { RecommendationResults } from '../recommendation-results/recommendation-results';
import { SeedSearch } from '../seed-search/seed-search';
import { SeedTrackSelection } from '../track-card/track-card';
import { TuningPanel, TuningRequest } from '../tuning-panel/tuning-panel';

@Component({
  selector: 'app-discovery-page',
  imports: [SeedSearch, TuningPanel, RecommendationResults],
  templateUrl: './discovery-page.html',
  styleUrl: './discovery-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscoveryPage {
  private readonly reccoBeatsService = inject(ReccoBeatsService);

  protected readonly selectedTrack = signal<Track | null>(null);
  protected readonly selectedAudioFeatures = signal<ReccoBeatsAudioFeatures | null>(null);
  protected readonly recommendations = signal<ReccoBeatsRecommendation[]>([]);
  protected readonly isSearching = signal(false);
  protected readonly hasSearchError = signal(false);
  protected readonly isLoadingSeed = signal(false);

  protected onSeedSelected(selection: SeedTrackSelection): void {
    this.selectedTrack.set(selection.track);
    this.selectedAudioFeatures.set(selection.audioFeatures);
    this.recommendations.set([]);
    this.hasSearchError.set(false);
  }

  protected onSearchRequested(request: TuningRequest): void {
    const spotifyId = this.selectedTrack()?.id;
    if (!spotifyId || this.isSearching()) {
      return;
    }

    this.isSearching.set(true);
    this.hasSearchError.set(false);

    this.reccoBeatsService
      .getRecommendations({
        spotifyId,
        size: request.size,
        danceability: request.danceability,
        energy: request.energy,
        valence: request.valence,
        tempo: request.tempo,
        acousticness: request.acousticness,
        instrumentalness: request.instrumentalness,
      })
      .pipe(
        catchError(() => {
          this.hasSearchError.set(true);
          return EMPTY;
        }),
        finalize(() => this.isSearching.set(false)),
      )
      .subscribe(items => {
        this.recommendations.set(items);
      });
  }

  protected onRecommendationSeedRequested(track: Track): void {
    if (this.isLoadingSeed()) {
      return;
    }

    this.isLoadingSeed.set(true);

    this.reccoBeatsService.getTrackBySpotifyId(track.id).pipe(
      switchMap(trackLookup => {
        const reccoId = trackLookup.content[0]?.id;

        if (!reccoId) {
          console.error('[ReccoBeats] No track mapping found for Spotify track ID:', track.id);
          return EMPTY;
        }

        return this.reccoBeatsService.getTrackAudioFeaturesByReccoId(reccoId).pipe(
          tap(audioFeatures => {
            this.selectedTrack.set(track);
            this.selectedAudioFeatures.set(audioFeatures);
            this.recommendations.set([]);
            this.hasSearchError.set(false);
          })
        );
      }),
      catchError(error => {
        console.error('[ReccoBeats] Failed to hydrate seed from recommendation:', track.id, error);
        return EMPTY;
      }),
      finalize(() => this.isLoadingSeed.set(false))
    ).subscribe();
  }
}
