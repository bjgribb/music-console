import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-auth-error',
    imports: [RouterLink],
    templateUrl: './auth-error.html',
    styleUrl: './auth-error.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthError { }
