import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
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

  protected readonly searchStatus = signal<'idle' | 'loading' | 'error'>('idle');

  protected readonly sliderForm = this.formBuilder.group({
    danceability: [0],
  });

  constructor() {
    effect(() => {
      const features = this.selectedAudioFeatures();
      if (features) {
        this.sliderForm.patchValue({ danceability: features.danceability });
        this.searchStatus.set('idle');
      }
    });

    effect(() => {
      this.searchStatus.set(this.isSearching() ? 'loading' : 'idle');
    });

    effect(() => {
      if (this.hasSearchError()) {
        this.searchStatus.set('error');
      }
    });
  }

  protected get danceabilityValue(): number {
    return +(this.sliderForm.get('danceability')?.value ?? 0);
  }

  protected onSearch(): void {
    if (!this.selectedAudioFeatures() || this.searchStatus() === 'loading') {
      return;
    }

    const values = this.sliderForm.getRawValue();
    this.searchStatus.set('loading');
    this.searchRequested.emit({
      size: 20,
      danceability: +values.danceability!,
    });
  }
}
