import { Injectable } from '@angular/core';
import { SearchResults, SpotifyApi, Track } from '@spotify/web-api-ts-sdk';
import { catchError, from, map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private sdk: SpotifyApi | null = null;

  constructor() {
    this.sdk = SpotifyApi.withUserAuthorization(environment.spotifyClientId, environment.spotifyRedirectUri, ["playlist-modify-public"]);
  }

  searchTracks(query: string): Observable<SearchResults<['track']>> {
    return from(this.sdk!.search(query, ["track"]));
  }

  searchByIsrc(isrc: string): Observable<Track | null> {
    return this.searchTracks(`isrc:${isrc}`).pipe(
      map(results => results.tracks.items[0] ?? null),
      catchError(() => of(null)),
    );
  }
}
