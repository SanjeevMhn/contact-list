import { Component, Input, Output, EventEmitter, signal } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [],
  templateUrl: './page-header.html',
  styleUrl: './page-header.css',
})
export class PageHeader {
  @Input() title = '';
  @Output() sortToggled = new EventEmitter<void>();
  @Output() favoritesViewToggled = new EventEmitter<void>();
  
  protected readonly sortAscending = signal<boolean>(true);
  protected readonly showFavoritesOnly = signal(false);

  toggleSort(): void {
    this.sortAscending.set(!this.sortAscending());
    this.sortToggled.emit();
  }

  getSortIndicator(): string {
    return this.sortAscending() ? '↑' : '↓';
  }

  toggleFavoritesView(): void {
    this.showFavoritesOnly.set(!this.showFavoritesOnly());
    this.favoritesViewToggled.emit();
  }
}
