import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Track } from '@spotify/web-api-ts-sdk';
import { EMPTY, catchError, filter, finalize, from, map, mergeMap, of, switchMap, tap, toArray } from 'rxjs';
import { NotificationService } from '../../notifications/notification.service';
import { ReccoBeatsAudioFeatures, ReccoBeatsRecommendation, ReccoBeatsService } from '../../recco-beats/recco-beats.service';
import { SpotifyService } from '../../spotify/spotify-service';
import { DisplayRecommendation } from '../display-recommendation';
import { RecommendationResults } from '../recommendation-results/recommendation-results';
import { SeedSearch } from '../seed-search/seed-search';
import { TuningPanel, TuningRequest } from '../tuning-panel/tuning-panel';

@Component({
  selector: 'app-discovery-page',
  imports: [SeedSearch, TuningPanel, RecommendationResults],
  templateUrl: './discovery-page.html',
  styleUrl: './discovery-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscoveryPage {
  private readonly maxConcurrentSpotifyLookups = 5;

  private readonly reccoBeatsService = inject(ReccoBeatsService);
  private readonly spotifyService = inject(SpotifyService);
  private readonly notificationService = inject(NotificationService);

  protected readonly selectedTrack = signal<Track | null>(null);
  protected readonly selectedAudioFeatures = signal<ReccoBeatsAudioFeatures | null>(null);
  protected readonly allRecommendations = signal<ReccoBeatsRecommendation[]>([]);
  protected readonly displayRecommendations = signal<DisplayRecommendation[]>([]);
  protected readonly isSearching = signal(false);
  protected readonly isLoadingSeed = signal(false);

  protected onSeedSelected(track: Track): void {
    this.hydrateSeedTrack(track);
  }

  protected onSearchRequested(request: TuningRequest): void {
    const spotifyId = this.selectedTrack()?.id;
    if (!spotifyId || this.isSearching()) {
      return;
    }

    this.isSearching.set(true);

    this.reccoBeatsService
      .getRecommendations({
        spotifyId,
        size: request.size,
        danceability: request.danceability,
        energy: request.energy,
        valence: request.valence,
        featureWeight: request.featureWeight,
        popularity: request.popularity,
      })
      .pipe(
        switchMap(items =>
          this.buildDisplayRecommendations(items).pipe(
            map(displayableItems => ({ items, displayableItems })),
          ),
        ),
        catchError(error => {
          console.error('[ReccoBeats] Failed to fetch recommendations:', error);
          this.notificationService.error('Recommendations are unavailable right now. Try again in a moment.');
          return EMPTY;
        }),
        finalize(() => this.isSearching.set(false)),
      )
      .subscribe(({ items, displayableItems }) => {
        this.allRecommendations.set(items);
        this.displayRecommendations.set(displayableItems);
      });
  }

  private buildDisplayRecommendations(items: ReccoBeatsRecommendation[]) {
    if (!items.length) {
      return of<DisplayRecommendation[]>([]);
    }

    return from(items).pipe(
      mergeMap(recommendation => {
        if (!recommendation.isrc) {
          console.warn('[Spotify] Skipping recommendation without ISRC:', recommendation.id);
          return of<DisplayRecommendation | null>(null);
        }

        return this.spotifyService.searchByIsrc(recommendation.isrc).pipe(
          map(spotifyTrack => {
            if (!spotifyTrack) {
              console.warn('[Spotify] No Spotify track found for recommendation ISRC:', recommendation.isrc, recommendation.id);
              return null;
            }

            return { recommendation, spotifyTrack };
          }),
        );
      }, this.maxConcurrentSpotifyLookups),
      filter((item): item is DisplayRecommendation => item !== null),
      toArray(),
    );
  }

  private hydrateSeedTrack(track: Track): void {
    if (this.isLoadingSeed()) {
      return;
    }

    this.isLoadingSeed.set(true);

    this.reccoBeatsService.getTrackBySpotifyId(track.id).pipe(
      switchMap(trackLookup => {
        const reccoId = trackLookup.content[0]?.id;

        if (!reccoId) {
          console.error('[ReccoBeats] No track mapping found for Spotify track ID:', track.id);
          this.notificationService.error('We could not find that track in our system. Try a different track.');
          return EMPTY;
        }

        return this.reccoBeatsService.getTrackAudioFeaturesByReccoId(reccoId).pipe(
          tap(audioFeatures => {
            this.selectedTrack.set(track);
            this.selectedAudioFeatures.set(audioFeatures);
            this.allRecommendations.set([]);
            this.displayRecommendations.set([]);
          })
        );
      }),
      catchError(error => {
        console.error('[ReccoBeats] Failed to hydrate seed track:', track.id, error);
        this.notificationService.error('We could not load audio details for that track. Try a different track.');
        return EMPTY;
      }),
      finalize(() => this.isLoadingSeed.set(false))
    ).subscribe();
  }
}
