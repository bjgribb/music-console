import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DiscoveryPage } from './discovery/discovery-page/discovery-page';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DiscoveryPage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
