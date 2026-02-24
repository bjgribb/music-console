import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RecommendationResults } from '../recommendation-results/recommendation-results';
import { RecommendationSearch } from '../recommendation-search/recommendation-search';
import { SeedSearch } from '../seed-search/seed-search';

@Component({
  selector: 'app-discovery-page',
  imports: [RecommendationSearch, RecommendationResults, CommonModule, SeedSearch],
  templateUrl: './discovery-page.html',
  styleUrl: './discovery-page.css',
})
export class DiscoveryPage {

}
