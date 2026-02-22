import { Component } from '@angular/core';
import { RecommendationResults } from '../recommendation-results/recommendation-results';
import { RecommendationSearch } from '../recommendation-search/recommendation-search';

@Component({
  selector: 'app-discovery-page',
  imports: [RecommendationSearch, RecommendationResults],
  templateUrl: './discovery-page.html',
  styleUrl: './discovery-page.css',
})
export class DiscoveryPage {

}
