import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SpesaService, ElementoSpesa } from '../../services/spesa';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-lista-spesa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-spesa.html'
})
export class ListaSpesaComponent implements OnInit {
  private spesaService = inject(SpesaService);
  public authService = inject(AuthService); // Lo rendiamo pubblico per usarlo nell'HTML

  items = signal<ElementoSpesa[]>([]);
  newItem = signal('');
  error = signal('');

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.spesaService.getItems().subscribe({
      next: (res) => this.items.set(res.items),
      error: () => this.error.set('Errore nel caricamento della lista')
    });
  }

  addItem(): void {
    if (!this.newItem().trim()) return;
    this.spesaService.addItem(this.newItem().trim()).subscribe({
      next: (res) => {
        this.items.set(res.items);
        this.newItem.set('');
        this.error.set('');
      },
      error: () => this.error.set("Errore: non hai i permessi per aggiungere!")
    });
  }

  deleteItem(id: number): void {
    this.spesaService.deleteItem(id).subscribe({
      next: () => {
        // Rimuoviamo l'elemento localmente per velocità
        this.items.update(items => items.filter(i => i.id !== id));
      },
      error: () => this.error.set("Errore: non hai i permessi per eliminare!")
    });
  }
}