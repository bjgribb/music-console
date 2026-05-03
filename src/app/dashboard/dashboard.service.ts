import { Injectable, inject } from '@angular/core';
import { Artist, Track } from '@spotify/web-api-ts-sdk';
import { Observable, forkJoin, map } from 'rxjs';
import { SpotifyService, TimeRange } from '../spotify/spotify-service';
import {
    ProfileArtist,
    ProfileSummary,
    ProfileTrack,
    TopGenre,
    UserProfile,
} from './models/dashboard.models';

@Injectable({
    providedIn: 'root',
})
export class DashboardService {
    private readonly spotifyService = inject(SpotifyService);

    loadProfile(timeRange: TimeRange): Observable<UserProfile> {
        return forkJoin({
            spotifyProfile: this.spotifyService.getCurrentUserProfile(),
            topArtistsPage: this.spotifyService.getTopArtists(timeRange),
            topTracksPage: this.spotifyService.getTopTracks(timeRange),
        }).pipe(
            map(({ spotifyProfile, topArtistsPage, topTracksPage }) => {
                const topArtists = this.mapArtists(topArtistsPage.items);
                const topTracks = this.mapTracks(topTracksPage.items);
                const topGenres = this.deriveTopGenres(topArtistsPage.items);
                const summary = this.deriveSummary(topArtistsPage.items, topTracksPage.items);

                return {
                    displayName: spotifyProfile.display_name ?? 'Listener',
                    imageUrl: spotifyProfile.images?.[0]?.url ?? null,
                    topArtists,
                    topTracks,
                    topGenres,
                    summary,
                };
            }),
        );
    }

    private mapArtists(artists: Artist[]): ProfileArtist[] {
        return artists.map(a => ({
            id: a.id,
            name: a.name,
            imageUrl: a.images?.[0]?.url ?? null,
            genres: a.genres,
            popularity: a.popularity,
        }));
    }

    private mapTracks(tracks: Track[]): ProfileTrack[] {
        return tracks.map(t => ({
            id: t.id,
            name: t.name,
            artistNames: t.artists.map(a => a.name),
            albumImageUrl: t.album.images?.[0]?.url ?? null,
            popularity: t.popularity,
        }));
    }

    private deriveTopGenres(artists: Artist[]): TopGenre[] {
        const counts = new Map<string, number>();
        for (const artist of artists) {
            for (const genre of artist.genres) {
                counts.set(genre, (counts.get(genre) ?? 0) + 1);
            }
        }

        return [...counts.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([genre, count]) => ({ genre, count }));
    }

    private deriveSummary(artists: Artist[], tracks: Track[]): ProfileSummary {
        const artistAvgPopularity = artists.length
            ? Math.round(artists.reduce((sum, a) => sum + a.popularity, 0) / artists.length)
            : 0;

        const trackAvgPopularity = tracks.length
            ? Math.round(tracks.reduce((sum, t) => sum + t.popularity, 0) / tracks.length)
            : 0;

        return {
            artistAvgPopularity,
            trackAvgPopularity,
        };
    }
}
