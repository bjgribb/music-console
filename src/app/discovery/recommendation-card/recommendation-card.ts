import { ChangeDetectionStrategy, Component, OnInit, inject, input, output, signal } from '@angular/core';
import { Track } from '@spotify/web-api-ts-sdk';
import { catchError, finalize, of } from 'rxjs';
import { ReccoBeatsRecommendation } from '../../recco-beats/recco-beats.service';
import { SpotifyService } from '../../spotify/spotify-service';

@Component({
    selector: 'app-recommendation-card',
    imports: [],
    templateUrl: './recommendation-card.html',
    styleUrl: './recommendation-card.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationCard implements OnInit {
    private readonly spotifyService = inject(SpotifyService);

    readonly recommendation = input.required<ReccoBeatsRecommendation>();
    readonly isLoadingSeed = input<boolean>(false);
    readonly seedRequested = output<Track>();

    protected readonly spotifyTrack = signal<Track | null>(null);
    protected readonly isLoading = signal(false);
    protected readonly hasLookupError = signal(false);

    ngOnInit(): void {
        this.loadSpotifyTrack();
    }

    protected displayTitle(): string {
        return this.spotifyTrack()?.name ?? this.recommendation().trackTitle ?? this.recommendation().isrc;
    }

    protected displayArtists(): string {
        if (this.spotifyTrack()) {
            return this.spotifyTrack()!.artists.map(artist => artist.name).join(', ');
        }

        const recommendationArtists = this.recommendation().artists ?? [];
        if (!recommendationArtists.length) {
            return 'Artist unavailable';
        }

        return recommendationArtists.map(artist => artist.name).join(', ');
    }

    protected spotifyLink(): string {
        const recommendationLink = this.recommendation().href;
        if (recommendationLink) {
            return recommendationLink;
        }

        return `https://open.spotify.com/search/isrc%3A${this.recommendation().isrc}`;
    }

    protected onUseAsSeed(): void {
        const track = this.spotifyTrack();
        if (!track || this.isLoadingSeed()) {
            return;
        }

        this.seedRequested.emit(track);
    }

    private loadSpotifyTrack(): void {
        const recommendation = this.recommendation();
        if (!recommendation.isrc) {
            return;
        }

        this.isLoading.set(true);
        this.hasLookupError.set(false);

        this.spotifyService.searchByIsrc(recommendation.isrc).pipe(
            catchError(() => {
                this.hasLookupError.set(true);
                return of(null);
            }),
            finalize(() => this.isLoading.set(false)),
        ).subscribe(track => {
            this.spotifyTrack.set(track);
            if (!track) {
                this.hasLookupError.set(true);
            }
        });
    }
}
