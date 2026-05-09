import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { AuthError } from './spotify/auth-error';
import { spotifyAuthGuard } from './spotify/spotify-auth.guard';

export const routes: Routes = [
    { path: '', component: Dashboard, canActivate: [spotifyAuthGuard] },
    { path: 'error', component: AuthError },
    { path: '**', redirectTo: '' }
];
