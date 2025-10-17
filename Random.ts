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

  // Normalize image URLs safely
  private normalizeImages(imgs: any[]): string[] {
    if (!Array.isArray(imgs)) return [this.PLACEHOLDER];
    const valid = imgs
      .filter((u: any) => typeof u === 'string' && u.trim().length > 0)
      .map((u: string) =>
        u.startsWith('http') ? u : `https://${u.replace(/^\/+/, '')}`
      );
    return valid.length ? valid : [this.PLACEHOLDER];
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
          images: this.normalizeImages(r.images || [r.thumbnail]),
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
        images: this.normalizeImages(r.images || [r.thumbnail]),
      }))
    );
  }
}
