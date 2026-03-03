import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { Observable } from 'rxjs';

// Definiamo l'interfaccia per chiarezza
export interface ElementoSpesa {
  id: number;
  nome: string;
}

@Injectable({
  providedIn: 'root'
})
export class SpesaService {
  private http = inject(HttpClient);
  private keycloak = inject(Keycloak);

  private baseUrl = 'https://musical-space-rotary-phone-r7w4v9656pvcp4qp-5000.app.github.dev/';

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.keycloak.token}`
    });
  }

  getItems(): Observable<{ items: ElementoSpesa[] }> {
    return this.http.get<{ items: ElementoSpesa[] }>(`${this.baseUrl}/items`, { headers: this.getHeaders() });
  }

  addItem(item: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/items`, { item }, { headers: this.getHeaders() });
  }

  deleteItem(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/items/${id}`, { headers: this.getHeaders() });
  }
}