import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-container',
  standalone: true,
  imports: [],
  templateUrl: './search-container.html',
  styleUrl: './search-container.css',
})
export class SearchContainer {
  @Output() inputChanged = new EventEmitter<string>();

  onInput(value: string): void {
    this.inputChanged.emit(value);
  }
}
