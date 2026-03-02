import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SpesaService } from '../../services/spesa';

@Component({
  selector: 'app-lista-spesa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-spesa.html'
})
export class ListaSpesaComponent implements OnInit {
  private spesaService = inject(SpesaService);
  items = signal<string[]>([]);
  newItem = signal('');
  error = signal('');

  ngOnInit(): void {
    this.spesaService.getItems().subscribe({
      next: (res: any) => {
        this.items.set(res.items);
      },
      error: (err: any) => {
        this.error.set('Errore nel caricamento della lista');
      }
    });
  }

  addItem(): void {
    if (!this.newItem().trim()) return;
    this.spesaService.addItem(this.newItem().trim()).subscribe({
      next: (res: any) => {
        this.items.set(res.items);
        this.newItem.set('');
        this.error.set('');
      },
      error: (err: any) => {
        this.error.set("Errore durante l'aggiunta");
      }
    });
  }
  // Aggiungi questo metodo sotto quello di addItem
deleteItem(index: number): void {
  this.spesaService.deleteItem(index).subscribe({
    next: (res: any) => {
      // Aggiorniamo la lista con quella nuova mandata dal server
      this.items.set(res.items);
    },
    error: (err: any) => {
      this.error.set("Errore durante l'eliminazione");
    }
  });
}
}