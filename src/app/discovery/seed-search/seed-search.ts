import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Track } from '@spotify/web-api-ts-sdk';
import { map, Observable } from 'rxjs';
import { SpotifyService } from '../../spotify/spotify-service';

@Component({
  selector: 'app-seed-search',
  imports: [CommonModule],
  templateUrl: './seed-search.html',
  styleUrl: './seed-search.css',
})
export class SeedSearch {
  spotifyService = inject(SpotifyService);

  seedTrack$: Observable<Track[]> = this.spotifyService.searchTracks('track:Master of Puppets').pipe(
    map(result => result.tracks.items)
  );
}
