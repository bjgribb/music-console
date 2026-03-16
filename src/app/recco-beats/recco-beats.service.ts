import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

type ReccoBeatsTrackLookupResponse = {
    content: Array<{
        id: string;
        href: string;
    }>;
};

export type ReccoBeatsAudioFeatures = {
    id: string;
    href: string;
    isrc: string;
    acousticness: number;
    danceability: number;
    energy: number;
    instrumentalness: number;
    key: number;
    liveness: number;
    loudness: number;
    mode: number;
    speechiness: number;
    tempo: number;
    valence: number;
};

export type ReccoBeatsRecommendation = {
    id: string;
    href: string;
    isrc: string;
};

export type RecommendationParams = {
    seedReccoId: string;
    size: number;
    danceability: number;
};

type ReccoBeatsRecommendationsResponse = {
    content: ReccoBeatsRecommendation[];
};

@Injectable({
    providedIn: 'root',
})
export class ReccoBeatsService {
    private http = inject(HttpClient);
    private readonly baseUrl = 'https://api.reccobeats.com';

    getTrackBySpotifyId(spotifyId: string): Observable<ReccoBeatsTrackLookupResponse> {
        const params = new HttpParams().set('ids', spotifyId);
        return this.http.get<ReccoBeatsTrackLookupResponse>(`${this.baseUrl}/v1/track`, { params });
    }

    getTrackAudioFeaturesByReccoId(reccoId: string): Observable<ReccoBeatsAudioFeatures> {
        return this.http.get<ReccoBeatsAudioFeatures>(`${this.baseUrl}/v1/track/${reccoId}/audio-features`);
    }

    getRecommendations(params: RecommendationParams): Observable<ReccoBeatsRecommendation[]> {
        const httpParams = new HttpParams()
            .set('seeds', params.seedReccoId)
            .set('size', params.size)
            .set('danceability', params.danceability);

        return this.http
            .get<ReccoBeatsRecommendationsResponse>(`${this.baseUrl}/v1/track/recommendation`, { params: httpParams })
            .pipe(map(response => response.content));
    }
}
