import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoveryPage } from './discovery-page';

describe('DiscoveryPage', () => {
  let component: DiscoveryPage;
  let fixture: ComponentFixture<DiscoveryPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscoveryPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscoveryPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
