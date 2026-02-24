import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeedSearch } from './seed-search';

describe('SeedSearch', () => {
  let component: SeedSearch;
  let fixture: ComponentFixture<SeedSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeedSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeedSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
