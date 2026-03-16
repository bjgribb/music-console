import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackCard } from './track-card';

const MOCK_TRACK = {
  id: 'track-id-1',
  name: 'Sample Song',
  artists: [{ id: 'artist-id-1', name: 'Sample Artist', href: '', type: 'artist', uri: '', external_urls: { spotify: '' } }],
  album: {
    album_type: 'album',
    artists: [{ id: 'artist-id-1', name: 'Sample Artist', href: '', type: 'artist', uri: '', external_urls: { spotify: '' } }],
    available_markets: [],
    external_urls: { spotify: '' },
    href: '',
    id: 'album-id-1',
    images: [{ url: 'https://example.com/cover.jpg', height: 300, width: 300 }],
    name: 'Sample Album',
    release_date: '2024-01-01',
    release_date_precision: 'day',
    total_tracks: 1,
    type: 'album',
    uri: '',
  },
  available_markets: [],
  disc_number: 1,
  duration_ms: 120000,
  explicit: false,
  external_ids: { isrc: 'TEST12345678', ean: '0000000000000', upc: '000000000000' },
  external_urls: { spotify: '' },
  href: '',
  is_local: false,
  popularity: 0,
  preview_url: null,
  track_number: 1,
  type: 'track',
  uri: '',
} as unknown as Parameters<ComponentFixture<TrackCard>['componentRef']['setInput']>[1];

describe('TrackCard', () => {
  let component: TrackCard;
  let fixture: ComponentFixture<TrackCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackCard],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackCard);
    fixture.componentRef.setInput('track', MOCK_TRACK);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
