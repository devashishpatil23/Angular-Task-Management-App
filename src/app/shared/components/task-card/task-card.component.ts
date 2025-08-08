import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../../model/Task';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-task-card',
  imports: [NgClass],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;
  @Output() showTaskDetails = new EventEmitter<Task>();
  @Output() editTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<string>();

  onDeleteTask(taskId?: string) {
    this.deleteTask.emit(taskId);
  }
  onShowTaskDetails(task: Task) {
    this.showTaskDetails.emit(task);
  }

  onEditTask(task: Task) {
    this.editTask.emit(task);
  }
}
