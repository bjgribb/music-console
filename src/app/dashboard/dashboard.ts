import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    inject,
    signal,
} from '@angular/core';
import { TimeRange } from '../spotify/spotify-service';
import { DashboardService } from './dashboard.service';
import { HeroCard } from './hero-card/hero-card';
import { UserProfile } from './models/dashboard.models';
import { SummaryCard } from './summary-card/summary-card';
import { TopArtistsCard } from './top-artists-card/top-artists-card';
import { TopTracksCard } from './top-tracks-card/top-tracks-card';

type LoadState = 'loading' | 'error' | 'loaded';

@Component({
    selector: 'app-music-dashboard',
    imports: [HeroCard, SummaryCard, TopArtistsCard, TopTracksCard],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
    private readonly profileService = inject(DashboardService);

    protected readonly timeRangeOptions: { label: string; value: TimeRange }[] = [
        { label: '4 Weeks', value: 'short_term' },
        { label: '6 Months', value: 'medium_term' },
        { label: '1 Year', value: 'long_term' },
    ];

    protected readonly timeRange = signal<TimeRange>('medium_term');
    protected readonly loadState = signal<LoadState>('loading');
    protected readonly profile = signal<UserProfile | null>(null);
    protected readonly errorMessage = signal<string | null>(null);

    ngOnInit(): void {
        this.fetchProfile();
    }

    protected changeTimeRange(range: TimeRange): void {
        this.timeRange.set(range);
        this.fetchProfile();
    }

    private fetchProfile(): void {
        this.loadState.set('loading');
        this.errorMessage.set(null);

        this.profileService.loadProfile(this.timeRange()).subscribe({
            next: profile => {
                this.profile.set(profile);
                this.loadState.set('loaded');
            },
            error: (err: unknown) => {
                const message = err instanceof Error ? err.message : 'Failed to load profile.';
                this.errorMessage.set(message);
                this.loadState.set('error');
            },
        });
    }
}
