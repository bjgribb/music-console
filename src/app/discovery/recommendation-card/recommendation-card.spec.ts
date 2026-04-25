import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { Track } from '@spotify/web-api-ts-sdk';
import { of } from 'rxjs';
import { ReccoBeatsService } from '../../recco-beats/recco-beats.service';

import { RecommendationCard } from './recommendation-card';

describe('RecommendationCard', () => {
    let component: RecommendationCard;
    let fixture: ComponentFixture<RecommendationCard>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RecommendationCard],
            providers: [
                {
                    provide: ReccoBeatsService,
                    useValue: {
                        getTrackAudioFeaturesByReccoId: () => of(null),
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(RecommendationCard);
        fixture.componentRef.setInput('recommendation', {
            id: 'recco-1',
            href: 'https://open.spotify.com/track/123',
            isrc: 'USUM71703861',
        });
        fixture.componentRef.setInput('spotifyTrack', {
            id: 'spotify-track-1',
            name: 'Track title',
            artists: [{ id: 'artist-1', name: 'Artist name' }],
            album: {
                images: [],
            },
            external_urls: {
                spotify: 'https://open.spotify.com/track/123',
            },
        } as unknown as Track);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
