import { Routes } from '@angular/router';
import { DiscoveryPage } from './discovery/discovery-page/discovery-page';

export const routes: Routes = [
    { path: '', component: DiscoveryPage },
    { path: '**', redirectTo: '' }
];
