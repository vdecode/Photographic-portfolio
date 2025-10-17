import { Component } from '@angular/core';
import { RecipeStore } from '../stores/recipe.store';
import { Observable, map } from 'rxjs';
import { Recipe } from '../models/recipe.model';

@Component({
  selector: 'app-favorites',
  standalone: true,
  template: `
  <h4>Favorites</h4>
  <div class="row g-3">
    <div class="col-md-4" *ngFor="let r of favoriteRecipes$ | async">
      <div class="recipe-card">
        <img [src]="r.images[0] || 'https://via.placeholder.com/400x250?text=No+Image'" />
        <h5>{{ r.title }}</h5>
        <p><small>{{ r.cuisine }}</small></p>
        <button class="btn btn-sm btn-outline-danger" (click)="store.toggleFavorite(r.id)">Remove</button>
      </div>
    </div>
  </div>
  `,
})
export class FavoritesComponent {
  favoriteRecipes$: Observable<Recipe[]>;
  constructor(public store: RecipeStore){
    this.favoriteRecipes$ = this.store.favorites$.pipe(
      map(ids => this.store.recipesSubject.getValue().filter(r => ids.includes(r.id)))
    );
  }
}
