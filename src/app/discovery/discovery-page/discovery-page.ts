import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Track } from '@spotify/web-api-ts-sdk';
import { EMPTY, catchError, finalize } from 'rxjs';
import { ReccoBeatsAudioFeatures, ReccoBeatsRecommendation, ReccoBeatsService } from '../../recco-beats/recco-beats.service';
import { RecommendationResults } from '../recommendation-results/recommendation-results';
import { RecommendationSearch, RecommendationSearchRequest } from '../recommendation-search/recommendation-search';
import { SeedSearch } from '../seed-search/seed-search';
import { SeedTrackSelection } from '../track-card/track-card';

@Component({
  selector: 'app-discovery-page',
  imports: [RecommendationSearch, RecommendationResults, CommonModule, SeedSearch],
  templateUrl: './discovery-page.html',
  styleUrl: './discovery-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscoveryPage {
  private readonly reccoBeatsService = inject(ReccoBeatsService);

  protected readonly selectedTrack = signal<Track | null>(null);
  protected readonly selectedAudioFeatures = signal<ReccoBeatsAudioFeatures | null>(null);
  protected readonly seedReccoId = signal<string | null>(null);
  protected readonly recommendations = signal<ReccoBeatsRecommendation[]>([]);
  protected readonly isSearching = signal(false);
  protected readonly hasSearchError = signal(false);

  protected onSeedSelected(selection: SeedTrackSelection): void {
    this.selectedTrack.set(selection.track);
    this.selectedAudioFeatures.set(selection.audioFeatures);
    this.seedReccoId.set(selection.reccoId);
    this.recommendations.set([]);
    this.hasSearchError.set(false);
  }

  protected onSearchRequested(request: RecommendationSearchRequest): void {
    const seedReccoId = this.seedReccoId();
    if (!seedReccoId || this.isSearching()) {
      return;
    }

    this.isSearching.set(true);
    this.hasSearchError.set(false);

    this.reccoBeatsService
      .getRecommendations({
        seedReccoId,
        size: request.size,
        danceability: request.danceability,
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

}
