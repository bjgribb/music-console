import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopArtistsCard } from './top-artists-card';

describe('TopArtistsCard', () => {
    let fixture: ComponentFixture<TopArtistsCard>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TopArtistsCard],
        }).compileComponents();

        fixture = TestBed.createComponent(TopArtistsCard);
        fixture.componentRef.setInput('artists', []);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(fixture.componentInstance).toBeTruthy();
    });
});
