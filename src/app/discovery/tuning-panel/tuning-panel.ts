import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Track } from '@spotify/web-api-ts-sdk';
import { ReccoBeatsAudioFeatures } from '../../recco-beats/recco-beats.service';

export type TuningRequest = {
  size: number;
  danceability: number;
  energy: number;
  valence: number;
  featureWeight: number;
  popularity: number;
};

@Component({
  selector: 'app-tuning-panel',
  imports: [ReactiveFormsModule],
  templateUrl: './tuning-panel.html',
  styleUrl: './tuning-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TuningPanel {
  private readonly formBuilder = inject(FormBuilder);

  readonly selectedTrack = input<Track | null>(null);
  readonly selectedAudioFeatures = input<ReccoBeatsAudioFeatures | null>(null);
  readonly isSearching = input<boolean>(false);
  readonly hasSearchError = input<boolean>(false);
  readonly searchRequested = output<TuningRequest>();

  protected readonly sliderForm = this.formBuilder.group({
    danceability: [0],
    energy: [0],
    valence: [0],
    featureWeight: [3],
    popularity: [50],
  });

  constructor() {
    // Hydrate controls from the selected seed track audio features.
    effect(() => {
      const features = this.selectedAudioFeatures();
      if (features) {
        this.sliderForm.patchValue({
          danceability: features.danceability,
          energy: features.energy,
          valence: features.valence,
        });
      }
    });
  }

  protected get danceabilityValue(): number {
    return +(this.sliderForm.get('danceability')?.value ?? 0);
  }

  protected get energyValue(): number {
    return +(this.sliderForm.get('energy')?.value ?? 0);
  }

  protected get valenceValue(): number {
    return +(this.sliderForm.get('valence')?.value ?? 0);
  }

  protected get featureWeightValue(): number {
    return +(this.sliderForm.get('featureWeight')?.value ?? 3);
  }

  protected get popularityValue(): number {
    return +(this.sliderForm.get('popularity')?.value ?? 50);
  }

  protected featureWeightButtonClass(weight: number): string {
    const isActive = this.featureWeightValue === weight;
    return isActive
      ? 'h-8 flex-1 rounded-md text-xs font-semibold bg-[var(--app-primary)] text-slate-950 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-ring)]'
      : 'h-8 flex-1 rounded-md text-xs text-[var(--app-text-muted)] transition hover:text-[var(--app-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-ring)]';
  }

  protected setFeatureWeight(weight: number): void {
    this.sliderForm.patchValue({ featureWeight: weight });
  }

  protected onSearch(): void {
    if (!this.selectedAudioFeatures() || this.isSearching()) {
      return;
    }

    const values = this.sliderForm.getRawValue();

    this.searchRequested.emit({
      size: 5,
      danceability: +(values.danceability ?? 0),
      energy: +(values.energy ?? 0),
      valence: +(values.valence ?? 0),
      featureWeight: +(values.featureWeight ?? 3),
      popularity: +(values.popularity ?? 50),
    });
  }
}
