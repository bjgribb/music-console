import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { Track } from '@spotify/web-api-ts-sdk';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { NotificationService } from '../../notifications/notification.service';
import type { ReccoBeatsRecommendation } from '../../recco-beats/recco-beats.service';
import { ReccoBeatsService } from '../../recco-beats/recco-beats.service';
import { SpotifyService } from '../../spotify/spotify-service';

import { DiscoveryPage } from './discovery-page';

describe('DiscoveryPage', () => {
  let component: DiscoveryPage;
  let fixture: ComponentFixture<DiscoveryPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscoveryPage],
      providers: [
        {
          provide: ReccoBeatsService,
          useValue: {
            getRecommendations: vi.fn().mockReturnValue(of([{ id: 'recco-1', href: 'https://open.spotify.com/track/1', isrc: 'ISRC-1' },
            { id: 'recco-2', href: 'https://open.spotify.com/track/2', isrc: 'ISRC-2' },])),
            getTrackBySpotifyId: vi.fn().mockReturnValue(of({ content: [] })),
            getTrackAudioFeaturesByReccoId: vi.fn().mockReturnValue(of({})),
          },
        },
        {
          provide: SpotifyService,
          useValue: {
            searchByIsrc: vi.fn().mockReturnValue(of(null)),
          }
        },
        {
          provide: NotificationService,
          useValue: {
            success: vi.fn(),
            error: vi.fn(),
          },
        },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(DiscoveryPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should only keep displayable recommendations after Spotify lookups', () => {
    const spotifySpy = vi.spyOn(TestBed.inject(SpotifyService), 'searchByIsrc');
    spotifySpy.mockImplementation((isrc: string) => {
      if (isrc === 'ISRC-1') {
        return of({ id: 'spotify-1', artists: [], album: { images: [] }, name: 'Resolved Track' } as unknown as Track);
      }

      return of(null);
    });

    (component as never as { selectedTrack: { set: (value: Track) => void } }).selectedTrack.set({ id: 'seed-id' } as Track);
    (component as never as { onSearchRequested: (value: { size: number }) => void }).onSearchRequested({ size: 5 });

    expect((component as never as { allRecommendations: () => ReccoBeatsRecommendation[] }).allRecommendations().length).toBe(2);
    expect((component as never as { displayRecommendations: () => Array<{ recommendation: ReccoBeatsRecommendation }> }).displayRecommendations().length).toBe(1);
  });
});
