import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Track } from '@spotify/web-api-ts-sdk';
import { ReccoBeatsAudioFeatures } from '../../recco-beats/recco-beats.service';

export type TuningRequest = {
  size: number;
  acousticness: number;
  danceability: number;
  energy: number;
  instrumentalness: number;
  tempo: number;
  valence: number;
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
    acousticness: [0],
    danceability: [0],
    energy: [0],
    instrumentalness: [0],
    tempo: [120],
    valence: [0],
  });

  constructor() {
    // Hydrate controls from the selected seed track audio features.
    effect(() => {
      const features = this.selectedAudioFeatures();
      if (features) {
        this.sliderForm.patchValue({
          acousticness: features.acousticness,
          danceability: features.danceability,
          energy: features.energy,
          instrumentalness: features.instrumentalness,
          tempo: features.tempo,
          valence: features.valence,
        });
      }
    });
  }

  protected get acousticnessValue(): number {
    return +(this.sliderForm.get('acousticness')?.value ?? 0);
  }

  protected get danceabilityValue(): number {
    return +(this.sliderForm.get('danceability')?.value ?? 0);
  }

  protected get energyValue(): number {
    return +(this.sliderForm.get('energy')?.value ?? 0);
  }

  protected get instrumentalnessValue(): number {
    return +(this.sliderForm.get('instrumentalness')?.value ?? 0);
  }

  protected get tempoValue(): number {
    return +(this.sliderForm.get('tempo')?.value ?? 120);
  }

  protected get valenceValue(): number {
    return +(this.sliderForm.get('valence')?.value ?? 0);
  }

  protected onSearch(): void {
    if (!this.selectedAudioFeatures() || this.isSearching()) {
      return;
    }

    const values = this.sliderForm.getRawValue();

    this.searchRequested.emit({
      size: 20,
      acousticness: +(values.acousticness ?? 0),
      danceability: +(values.danceability ?? 0),
      energy: +(values.energy ?? 0),
      instrumentalness: +(values.instrumentalness ?? 0),
      tempo: +(values.tempo ?? 120),
      valence: +(values.valence ?? 0),
    });
  }
}
