import { Injectable, inject } from '@angular/core';
import { Artist } from '@spotify/web-api-ts-sdk';
import { Observable, forkJoin, map } from 'rxjs';
import { SpotifyService, TimeRange } from '../spotify/spotify-service';
import { ProfileArtist, TopGenre, UserProfile } from './models/dashboard.models';

@Injectable({
    providedIn: 'root',
})
export class DashboardService {
    private readonly spotifyService = inject(SpotifyService);

    loadProfile(timeRange: TimeRange): Observable<UserProfile> {
        return forkJoin({
            spotifyProfile: this.spotifyService.getCurrentUserProfile(),
            topArtistsPage: this.spotifyService.getTopArtists(timeRange),
        }).pipe(
            map(({ spotifyProfile, topArtistsPage }) => {
                const topArtists = this.mapArtists(topArtistsPage.items);
                const topGenres = this.deriveTopGenres(topArtistsPage.items);
                const { label, description } = this.derivePersonality(topArtists, topGenres);

                return {
                    displayName: spotifyProfile.display_name ?? 'Listener',
                    imageUrl: spotifyProfile.images?.[0]?.url ?? null,
                    topArtists,
                    topGenres,
                    personalityLabel: label,
                    personalityDescription: description,
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

    private deriveTopGenres(artists: Artist[]): TopGenre[] {
        const counts = new Map<string, number>();
        for (const artist of artists) {
            for (const genre of artist.genres) {
                counts.set(genre, (counts.get(genre) ?? 0) + 1);
            }
        }
        return [...counts.entries()]
            .map(([genre, count]) => ({ genre, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8);
    }

    private derivePersonality(
        artists: ProfileArtist[],
        topGenres: TopGenre[],
    ): { label: string; description: string } {
        const genreDiversity = topGenres.length;
        const avgPopularity = artists.length
            ? artists.reduce((sum, a) => sum + a.popularity, 0) / artists.length
            : 0;

        if (genreDiversity >= 6) {
            return {
                label: 'Explorer',
                description: 'You roam freely across genres, always chasing the next discovery.',
            };
        }

        if (avgPopularity < 45) {
            return {
                label: 'Loyalist',
                description: 'You stick to what you love — a devoted fan with a consistent taste.',
            };
        }

        return {
            label: 'Trend Chaser',
            description: 'You have your finger on the pulse of what\'s popular right now.',
        };
    }
}
