import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../models/recipe.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private readonly API = 'https://dummyjson.com/recipes';
  private readonly PLACEHOLDER = 'https://via.placeholder.com/400x250?text=No+Image';

  constructor(private http: HttpClient) {}

  private fixImageUrls(images: any[], fallback?: string): string[] {
    if (!images || !Array.isArray(images) || !images.length) {
      return [fallback || this.PLACEHOLDER];
    }

    return images.map((url: any) => {
      if (typeof url !== 'string' || !url.trim()) {
        return fallback || this.PLACEHOLDER;
      }
      // Force HTTPS if missing
      if (!url.startsWith('http')) {
        return `https://dummyjson.com/${url.replace(/^\\/*/, '')}`;
      }
      // Replace invalid localhost or relative
      if (url.includes('localhost') || url.includes('dummyjson')) {
        return url.startsWith('https://') ? url : url.replace('http://', 'https://');
      }
      return url;
    });
  }

  fetchAll(limit = 100): Observable<Recipe[]> {
    return this.http.get<any>(`${this.API}?limit=${limit}`).pipe(
      map(res =>
        (res?.recipes || []).map((r: any) => ({
          id: r.id,
          title: r.title || r.name || 'Unknown Recipe',
          cuisine: r.cuisine || 'Unknown',
          ingredients: Array.isArray(r.ingredients)
            ? r.ingredients
            : [String(r.ingredients || '')],
          instructions: r.instructions || r.steps || '',
          images: this.fixImageUrls(r.images || [r.thumbnail], this.PLACEHOLDER),
        }))
      )
    );
  }

  fetchById(id: number): Observable<Recipe> {
    return this.http.get<any>(`${this.API}/${id}`).pipe(
      map(r => ({
        id: r.id,
        title: r.title || r.name || 'Unknown Recipe',
        cuisine: r.cuisine || 'Unknown',
        ingredients: Array.isArray(r.ingredients)
          ? r.ingredients
          : [String(r.ingredients || '')],
        instructions: r.instructions || r.steps || '',
        images: this.fixImageUrls(r.images || [r.thumbnail], this.PLACEHOLDER),
      }))
    );
  }
}
