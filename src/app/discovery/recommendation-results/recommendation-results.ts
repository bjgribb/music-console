import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReccoBeatsRecommendation } from '../../recco-beats/recco-beats.service';

@Component({
  selector: 'app-recommendation-results',
  imports: [],
  templateUrl: './recommendation-results.html',
  styleUrl: './recommendation-results.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationResults {
  readonly recommendations = input<ReccoBeatsRecommendation[]>([]);
}
