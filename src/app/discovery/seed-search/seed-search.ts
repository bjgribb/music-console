import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Track } from '@spotify/web-api-ts-sdk';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { SpotifyService } from '../../spotify/spotify-service';
import { SeedTrackSelection, TrackCard } from '../track-card/track-card';

type SeedSearchState =
  | { status: 'idle'; tracks: Track[] }
  | { status: 'loading'; tracks: Track[] }
  | { status: 'ready'; tracks: Track[] }
  | { status: 'error'; tracks: Track[] };

@Component({
  selector: 'app-seed-search',
  imports: [ReactiveFormsModule, TrackCard, AsyncPipe],
  templateUrl: './seed-search.html',
  styleUrl: './seed-search.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeedSearch {
  private readonly spotifyService = inject(SpotifyService);
  private readonly formBuilder = inject(FormBuilder);
  readonly seedSelected = output<SeedTrackSelection>();

  protected searchState$: Observable<SeedSearchState> = of({ status: 'idle', tracks: [] });

  readonly trackSearchForm = this.formBuilder.group({
    track: ['', Validators.required],
  });

  protected onSubmit(): void {
    const trackQuery = this.trackSearchForm.get('track')?.value?.toString().trim();
    if (!trackQuery) {
      return;
    }

    this.searchState$ = this.spotifyService.searchTracks(`track:${trackQuery}`).pipe(
      map(result => ({ status: 'ready', tracks: result.tracks.items }) as SeedSearchState),
      startWith({ status: 'loading', tracks: [] } as SeedSearchState),
      catchError(() => of({ status: 'error', tracks: [] } as SeedSearchState))
    );
  }

  protected onSeedSelected(selection: SeedTrackSelection): void {
    this.seedSelected.emit(selection);
  }
}
