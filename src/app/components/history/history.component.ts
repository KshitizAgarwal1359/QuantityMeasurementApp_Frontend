// UC20: History Component — @Input, change detection
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuantityMeasurementDTO } from '../../models/quantity.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent {
  @Input() historyItems: QuantityMeasurementDTO[] = [];

  // Component variable — formats history display text
  getHistoryText(item: QuantityMeasurementDTO): string {
    if (item.isError) return `[Error] ${item.operation}: ${item.errorMessage}`;
    if (item.operation === 'COMPARE') {
      const eq = item.resultString === 'True' ? 'Equal' : 'Not Equal';
      return `Compared ${item.thisUnit} and ${item.thatUnit} ➔ ${eq}`;
    } else if (item.operation === 'CONVERT') {
      return `Converted ${item.thisUnit} to ${item.resultUnit} ➔ ${item.resultString}`;
    } else if (item.operation === 'DIVIDE') {
      return `Divided ${item.thisUnit} by ${item.thatUnit} ➔ Ratio: ${item.resultString}`;
    }
    return `${item.operation} ${item.thisUnit} and ${item.thatUnit} ➔ ${item.resultString} ${item.resultUnit}`;
  }
}
