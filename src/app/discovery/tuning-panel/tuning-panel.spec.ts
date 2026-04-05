import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TuningPanel } from './tuning-panel';

describe('TuningPanel', () => {
  let component: TuningPanel;
  let fixture: ComponentFixture<TuningPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TuningPanel]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TuningPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
