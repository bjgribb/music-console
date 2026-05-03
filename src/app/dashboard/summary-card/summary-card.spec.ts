import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SummaryCard } from './summary-card';

describe('SummaryCard', () => {
    let fixture: ComponentFixture<SummaryCard>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SummaryCard],
        }).compileComponents();

        fixture = TestBed.createComponent(SummaryCard);
        fixture.componentRef.setInput('summary', { artistAvgPopularity: 0, trackAvgPopularity: 0 });
        fixture.componentRef.setInput('topGenres', []);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(fixture.componentInstance).toBeTruthy();
    });
});
