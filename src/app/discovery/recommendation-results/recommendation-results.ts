import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { Track } from '@spotify/web-api-ts-sdk';
import type { ReccoBeatsRecommendation } from '../../recco-beats/recco-beats.service';
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
}
