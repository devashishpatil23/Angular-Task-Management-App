import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../../model/Task';

@Component({
  selector: 'app-task-details',
  imports: [],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss'
})
export class TaskDetailsComponent {
  @Output()
  closeDetialsView = new EventEmitter();
  @Input()
  task!: Task | null;

  onCloseTaskDetials() {
    this.closeDetialsView.emit();
    this.task = null;
  }
}
