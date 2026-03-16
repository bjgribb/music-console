import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SpotifyService } from '../../spotify/spotify-service';

import { SeedSearch } from './seed-search';

describe('SeedSearch', () => {
  let component: SeedSearch;
  let fixture: ComponentFixture<SeedSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeedSearch],
      providers: [
        {
          provide: SpotifyService,
          useValue: {
            searchTracks: () => of({ tracks: { items: [] } }),
          },
        },
      ],
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
