import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopTracksCard } from './top-tracks-card';

describe('TopTracksCard', () => {
    let fixture: ComponentFixture<TopTracksCard>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TopTracksCard],
        }).compileComponents();

        fixture = TestBed.createComponent(TopTracksCard);
        fixture.componentRef.setInput('tracks', []);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(fixture.componentInstance).toBeTruthy();
    });
});
