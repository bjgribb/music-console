import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Track } from '@spotify/web-api-ts-sdk';
import { ReccoBeatsRecommendation } from '../../recco-beats/recco-beats.service';
import { RecommendationCard } from '../recommendation-card/recommendation-card';

@Component({
  selector: 'app-recommendation-results',
  imports: [RecommendationCard],
  templateUrl: './recommendation-results.html',
  styleUrl: './recommendation-results.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationResults {
  readonly recommendations = input<ReccoBeatsRecommendation[]>([]);
  readonly selectedTrack = input<Track | null>(null);
  readonly isLoadingSeed = input<boolean>(false);
  readonly seedRequested = output<Track>();

  protected onSeedRequested(track: Track): void {
    this.seedRequested.emit(track);
  }
}
