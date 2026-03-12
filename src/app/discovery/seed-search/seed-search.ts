import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Track } from '@spotify/web-api-ts-sdk';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { SpotifyService } from '../../spotify/spotify-service';
import { TrackCard } from '../track-card/track-card';

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
})
export class SeedSearch {
  private spotifyService = inject(SpotifyService);
  private formBuilder = inject(FormBuilder);

  searchState$: Observable<SeedSearchState> = of({ status: 'idle', tracks: [] });

  trackSearchForm = this.formBuilder.group({
    track: ['', Validators.required],
  });

  onSubmit() {
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
}
