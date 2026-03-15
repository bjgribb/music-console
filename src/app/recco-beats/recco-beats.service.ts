import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

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
}
