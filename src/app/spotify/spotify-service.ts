import { Injectable } from '@angular/core';
import { Artist, Page, SpotifyApi, UserProfile } from '@spotify/web-api-ts-sdk';
import { Observable, from } from 'rxjs';
import { environment } from '../../environments/environment';

export type TimeRange = 'short_term' | 'medium_term' | 'long_term';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private sdk: SpotifyApi;

  constructor() {
    this.sdk = SpotifyApi.withUserAuthorization(
      environment.spotifyClientId,
      environment.spotifyRedirectUri,
      ['user-top-read', 'user-read-private'],
    );
  }

  getTopArtists(timeRange: TimeRange): Observable<Page<Artist>> {
    return from(this.sdk.currentUser.topItems('artists', timeRange, 10));
  }

  getCurrentUserProfile(): Observable<UserProfile> {
    return from(this.sdk.currentUser.profile());
  }
}
