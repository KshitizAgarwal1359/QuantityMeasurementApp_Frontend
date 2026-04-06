// UC20: Type Selector — @Input/@Output for props passing
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-type-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './type-selector.component.html',
  styleUrls: ['./type-selector.component.scss'],
})
export class TypeSelectorComponent {
  // @Input — receiving data from parent
  @Input() selectedType = 'LENGTH';
  // @Output — emitting events to parent
  @Output() typeChanged = new EventEmitter<string>();

  types = [
    { key: 'LENGTH', icon: '📏', label: 'Length' },
    { key: 'WEIGHT', icon: '⚖️', label: 'Weight' },
    { key: 'TEMPERATURE', icon: '🌡️', label: 'Temperature' },
    { key: 'VOLUME', icon: '🥛', label: 'Volume' },
  ];

  selectType(type: string): void {
    this.typeChanged.emit(type);
  }
}
