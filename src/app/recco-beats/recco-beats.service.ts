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
    trackTitle?: string;
    artists?: Array<{ name: string }>;
};

export type RecommendationParams = {
    spotifyId: string;
    size: number;
    acousticness?: number;
    danceability?: number;
    energy?: number;
    instrumentalness?: number;
    tempo?: number;
    valence?: number;
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
        let httpParams = new HttpParams()
            .set('seeds', params.spotifyId)
            .set('size', params.size);

        if (params.acousticness !== undefined) {
            httpParams = httpParams.set('acousticness', params.acousticness);
        }
        if (params.danceability !== undefined) {
            httpParams = httpParams.set('danceability', params.danceability);
        }
        if (params.energy !== undefined) {
            httpParams = httpParams.set('energy', params.energy);
        }
        if (params.instrumentalness !== undefined) {
            httpParams = httpParams.set('instrumentalness', params.instrumentalness);
        }
        if (params.tempo !== undefined) {
            httpParams = httpParams.set('tempo', params.tempo);
        }
        if (params.valence !== undefined) {
            httpParams = httpParams.set('valence', params.valence);
        }

        return this.http
            .get<ReccoBeatsRecommendationsResponse>(`${this.baseUrl}/v1/track/recommendation`, { params: httpParams })
            .pipe(map(response => response.content));
    }
}
