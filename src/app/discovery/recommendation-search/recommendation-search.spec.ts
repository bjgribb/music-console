import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendationSearch } from './recommendation-search';

describe('RecommendationSearch', () => {
  let component: RecommendationSearch;
  let fixture: ComponentFixture<RecommendationSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendationSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecommendationSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
