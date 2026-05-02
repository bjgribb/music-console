import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserProfile } from '../models/dashboard.models';
import { HeroCard } from './hero-card';

const mockProfile: UserProfile = {
    displayName: 'Test User',
    imageUrl: null,
    topArtists: [],
    topGenres: [],
    personalityLabel: '',
    personalityDescription: '',
};

describe('HeroCard', () => {
    let fixture: ComponentFixture<HeroCard>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HeroCard],
        }).compileComponents();

        fixture = TestBed.createComponent(HeroCard);
        fixture.componentRef.setInput('profile', mockProfile);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(fixture.componentInstance).toBeTruthy();
    });
});
