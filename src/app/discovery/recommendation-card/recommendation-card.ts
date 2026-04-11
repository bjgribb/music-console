import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import type { Track } from '@spotify/web-api-ts-sdk';
import { catchError, finalize, of } from 'rxjs';
import type { ReccoBeatsAudioFeatures, ReccoBeatsRecommendation } from '../../recco-beats/recco-beats.service';
import { ReccoBeatsService } from '../../recco-beats/recco-beats.service';
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
    private readonly reccoBeatsService = inject(ReccoBeatsService);

    readonly recommendation = input.required<ReccoBeatsRecommendation>();

    protected readonly spotifyTrack = signal<Track | null>(null);
    protected readonly recommendationAudioFeatures = signal<ReccoBeatsAudioFeatures | null>(null);
    protected readonly isLoading = signal(false);
    protected readonly isLoadingAudioFeatures = signal(false);
    protected readonly hasLookupError = signal(false);

    ngOnInit(): void {
        this.loadSpotifyTrack();
        this.loadRecommendationAudioFeatures();
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

    protected formatFeatureValue(value: number): string {
        return value.toFixed(2);
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

    private loadRecommendationAudioFeatures(): void {
        const recommendationId = this.recommendation().id;
        if (!recommendationId) {
            return;
        }

        this.isLoadingAudioFeatures.set(true);

        this.reccoBeatsService.getTrackAudioFeaturesByReccoId(recommendationId).pipe(
            catchError(() => of(null)),
            finalize(() => this.isLoadingAudioFeatures.set(false)),
        ).subscribe(features => {
            this.recommendationAudioFeatures.set(features);
        });
    }

}
