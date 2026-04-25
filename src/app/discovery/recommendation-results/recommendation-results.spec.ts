import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { Track } from '@spotify/web-api-ts-sdk';

import { RecommendationResults } from './recommendation-results';

describe('RecommendationResults', () => {
  let component: RecommendationResults;
  let fixture: ComponentFixture<RecommendationResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendationResults]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RecommendationResults);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the display edge-case message when raw recommendations exist but none are displayable', () => {
    fixture.componentRef.setInput('selectedTrack', { id: 'seed-id' } as Track);
    fixture.componentRef.setInput('rawRecommendationCount', 3);
    fixture.componentRef.setInput('displayRecommendations', []);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'Unable to find recommendations to display for this seed right now. Please try a different track.'
    );
  });
});
