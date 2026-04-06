// UC20: Toast Component — for showing notifications
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ToastMessage {
  text: string;
  isError: boolean;
  id: number;
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  toasts: ToastMessage[] = [];
  private nextId = 0;

  show(message: string, isError = false): void {
    const id = this.nextId++;
    this.toasts.push({ text: message, isError, id });
    setTimeout(() => this.remove(id), 3000);
  }

  remove(id: number): void {
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }
}
