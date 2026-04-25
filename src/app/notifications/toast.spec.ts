import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { Toast } from './toast';

describe('Toast', () => {
    let fixture: ComponentFixture<Toast>;
    let notificationService: NotificationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Toast],
        }).compileComponents();

        fixture = TestBed.createComponent(Toast);
        notificationService = TestBed.inject(NotificationService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(fixture.componentInstance).toBeTruthy();
    });

    it('renders the aria-live section regardless of notification state', () => {
        const section = fixture.nativeElement.querySelector('section[aria-live="polite"]');
        expect(section).not.toBeNull();
    });

    it('does not render the article when there is no notification', () => {
        const article = fixture.nativeElement.querySelector('article');
        expect(article).toBeNull();
    });

    it('renders the article when a notification is set', () => {
        notificationService.success('Loaded 5 recommendations.');
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('article')).not.toBeNull();
    });

    it('renders the message text when a notification is set', () => {
        notificationService.success('Loaded 5 recommendations.');
        fixture.detectChanges();

        const message = fixture.nativeElement.querySelector('article p:last-child');
        expect(message.textContent).toContain('Loaded 5 recommendations.');
    });

    it('applies error classes when level is error', () => {
        notificationService.error('Something went wrong.');
        fixture.detectChanges();

        const article = fixture.nativeElement.querySelector('article');
        expect(article.classList).toContain('border-red-400/60');
        expect(article.classList).toContain('bg-red-950/85');
    });

    it('applies success classes when level is success', () => {
        notificationService.success('Done!');
        fixture.detectChanges();

        const article = fixture.nativeElement.querySelector('article');
        expect(article.classList).toContain('border-emerald-400/60');
        expect(article.classList).toContain('bg-emerald-950/85');
    });
});
