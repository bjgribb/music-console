import { Injectable } from '@angular/core';
import { SearchResults, SpotifyApi } from '@spotify/web-api-ts-sdk';
import { from, Observable } from 'rxjs';
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
}
