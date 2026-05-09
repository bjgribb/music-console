import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SpotifyService } from './spotify-service';

export const spotifyAuthGuard: CanActivateFn = () => {
    const spotifyService = inject(SpotifyService);
    const router = inject(Router);
    return spotifyService.authenticate().pipe(
        map(authenticated => authenticated || router.createUrlTree(['/error'])),
        catchError(() => of(router.createUrlTree(['/error'])))
    );
};
