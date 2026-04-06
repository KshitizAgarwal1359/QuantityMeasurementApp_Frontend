// UC20: Action Tabs — @Input/@Output
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-action-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action-tabs.component.html',
  styleUrls: ['./action-tabs.component.scss'],
})
export class ActionTabsComponent {
  @Input() selectedAction = 'comparison';
  @Output() actionChanged = new EventEmitter<string>();

  actions = [
    { key: 'comparison', label: 'Comparison' },
    { key: 'conversion', label: 'Conversion' },
    { key: 'arithmetic', label: 'Arithmetic' },
  ];

  selectAction(action: string): void {
    this.actionChanged.emit(action);
  }
}
