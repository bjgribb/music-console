import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import {
    ReccoBeatsAudioFeatures,
    ReccoBeatsService
} from './recco-beats.service';

describe('ReccoBeatsService', () => {
    let service: ReccoBeatsService;
    let httpTesting: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });

        service = TestBed.inject(ReccoBeatsService);
        httpTesting = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTesting.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should send a GET request with ids query param in getTrackBySpotifyId', async () => {
        const spotifyId = '3n3Ppam7vgaVa1iaRUc9Lp';
        const expectedResponse = {
            content: [
                {
                    id: 'recco-123',
                    href: 'https://api.reccobeats.com/v1/track/recco-123',
                },
            ],
        };

        const responsePromise = firstValueFrom(service.getTrackBySpotifyId(spotifyId));

        const request = httpTesting.expectOne(
            (req) =>
                req.method === 'GET' &&
                req.url === `https://api.reccobeats.com/v1/track` &&
                req.params.get('ids') === spotifyId,
        );

        request.flush(expectedResponse);

        expect(await responsePromise).toEqual(expectedResponse);
    });

    it('should send a GET request to track audio features endpoint in getTrackAudioFeaturesByReccoId', async () => {
        const reccoId = 'recco-123';
        const expectedResponse: ReccoBeatsAudioFeatures = {
            id: reccoId,
            href: `https://api.reccobeats.com/v1/track/${reccoId}`,
            isrc: 'USUM71703861',
            acousticness: 0.514,
            danceability: 0.735,
            energy: 0.578,
            instrumentalness: 0,
            key: 10,
            liveness: 0.159,
            loudness: -11.84,
            mode: 0,
            speechiness: 0.0461,
            tempo: 98.002,
            valence: 0.624,
        };

        const responsePromise = firstValueFrom(service.getTrackAudioFeaturesByReccoId(reccoId));

        const request = httpTesting.expectOne({
            method: 'GET',
            url: `https://api.reccobeats.com/v1/track/${reccoId}/audio-features`,
        });

        request.flush(expectedResponse);

        expect(await responsePromise).toEqual(expectedResponse);
    });
});
