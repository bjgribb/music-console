import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dashboard } from './dashboard';

describe('Dashboard', () => {
    let fixture: ComponentFixture<Dashboard>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Dashboard],
        }).compileComponents();

        fixture = TestBed.createComponent(Dashboard);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(fixture.componentInstance).toBeTruthy();
    });
});
