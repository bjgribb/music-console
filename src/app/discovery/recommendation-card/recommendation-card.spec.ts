import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SpotifyService } from '../../spotify/spotify-service';

import { RecommendationCard } from './recommendation-card';

describe('RecommendationCard', () => {
    let component: RecommendationCard;
    let fixture: ComponentFixture<RecommendationCard>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RecommendationCard],
            providers: [
                {
                    provide: SpotifyService,
                    useValue: {
                        searchByIsrc: () => of(null),
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
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
