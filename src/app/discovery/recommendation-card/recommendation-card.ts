import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import type { Track } from '@spotify/web-api-ts-sdk';
import { catchError, finalize, of } from 'rxjs';
import type { ReccoBeatsAudioFeatures, ReccoBeatsRecommendation } from '../../recco-beats/recco-beats.service';
import { ReccoBeatsService } from '../../recco-beats/recco-beats.service';

@Component({
    selector: 'app-recommendation-card',
    imports: [],
    templateUrl: './recommendation-card.html',
    styleUrl: './recommendation-card.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendationCard implements OnInit {
    private readonly reccoBeatsService = inject(ReccoBeatsService);

    readonly recommendation = input.required<ReccoBeatsRecommendation>();
    readonly spotifyTrack = input.required<Track>();

    protected readonly recommendationAudioFeatures = signal<ReccoBeatsAudioFeatures | null>(null);
    protected readonly isLoadingAudioFeatures = signal(false);

    ngOnInit(): void {
        this.loadRecommendationAudioFeatures();
    }

    protected displayTitle(): string {
        return this.spotifyTrack().name ?? this.recommendation().trackTitle ?? this.recommendation().isrc;
    }

    protected displayArtists(): string {
        if (this.spotifyTrack().artists.length) {
            return this.spotifyTrack().artists.map(artist => artist.name).join(', ');
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
