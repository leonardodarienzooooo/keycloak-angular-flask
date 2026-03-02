import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SpesaService {
  private http = inject(HttpClient);
  private keycloak = inject(Keycloak);

  // IMPORTANTE: Metti l'URL della tua porta 5000 di Codespaces SENZA / finale
  private baseUrl = 'https://musical-space-rotary-phone-r7w4v9656pvcp4qp-5000.app.github.dev'; 

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.keycloak.token}`
    });
  }

  getItems(): Observable<{ items: string[]; user: string }> {
    return this.http.get<{ items: string[]; user: string }>(
      `${this.baseUrl}/items`,
      { headers: this.getHeaders() }
    );
  }

  addItem(item: string): Observable<{ items: string[] }> {
    return this.http.post<{ items: string[] }>(
      `${this.baseUrl}/items`,
      { item },
      { headers: this.getHeaders() }
    );
  }
  // Aggiungi questo metodo sotto quello di addItem
deleteItem(index: number): Observable<any> {
  return this.http.delete(
    `${this.baseUrl}/items/${index}`, 
    { headers: this.getHeaders() }
  );
}
}