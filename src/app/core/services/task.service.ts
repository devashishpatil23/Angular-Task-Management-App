import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Task } from '../../model/Task';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  http: HttpClient = inject(HttpClient);

  createTask(task: Task): Observable<{ name: string }> {
    const headers = new HttpHeaders({ 'my-header': 'hello-world' });
    return this.http.post<{ name: string }>(
      `https://taskmangementapp-9a302-default-rtdb.firebaseio.com/tasks.json`,
      task,
      { headers: headers }
    );
  }

  getAllTasks(): Observable<Task[]> {
    return this.http
      .get<{ [key: string]: Task }>(
        'https://taskmangementapp-9a302-default-rtdb.firebaseio.com/tasks.json'
      )
      .pipe(
        map((response) => {
          const tasks: Task[] = [];
          for (let key in response) {
            if (response.hasOwnProperty(key)) {
              tasks.push({ ...response[key], id: key });
            }
          }
          return tasks;
        })
      );
  }

  updateTask(task: Task, id: string | undefined) {
    return this.http.put(
      `https://taskmangementapp-9a302-default-rtdb.firebaseio.com/tasks/${id}.json`,
      task
    );
  }
  deleteTask(id: string | undefined) {
    return this.http.delete(
      `https://taskmangementapp-9a302-default-rtdb.firebaseio.com/tasks/${id}.json`
    );
  }

  deleteAllTasks() {
    return this.http.delete(
      `https://taskmangementapp-9a302-default-rtdb.firebaseio.com/tasks.json`
    );
  }
}