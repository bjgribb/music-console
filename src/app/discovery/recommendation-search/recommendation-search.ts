import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Track } from '@spotify/web-api-ts-sdk';
import { ReccoBeatsAudioFeatures } from '../../recco-beats/recco-beats.service';

export type RecommendationSearchRequest = {
  size: number;
  danceability: number;
};

@Component({
  selector: 'app-recommendation-search',
  imports: [ReactiveFormsModule],
  templateUrl: './recommendation-search.html',
  styleUrl: './recommendation-search.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationSearch {
  private readonly formBuilder = inject(FormBuilder);

  readonly selectedTrack = input<Track | null>(null);
  readonly selectedAudioFeatures = input<ReccoBeatsAudioFeatures | null>(null);
  readonly isSearching = input<boolean>(false);
  readonly hasSearchError = input<boolean>(false);
  readonly searchRequested = output<RecommendationSearchRequest>();

  protected readonly sliderForm = this.formBuilder.group({
    danceability: [0],
  });

  constructor() {
    // When a seed track is selected, pre-populate the slider with its danceability value.
    effect(() => {
      const features = this.selectedAudioFeatures();
      if (features) {
        this.sliderForm.patchValue({ danceability: features.danceability });
      }
    });
  }

  protected get danceabilityValue(): number {
    return +(this.sliderForm.get('danceability')?.value ?? 0);
  }

  protected onSearch(): void {
    if (!this.selectedAudioFeatures() || this.isSearching()) {
      return;
    }

    this.searchRequested.emit({
      size: 20,
      danceability: +this.sliderForm.getRawValue().danceability!,
    });
  }
}
