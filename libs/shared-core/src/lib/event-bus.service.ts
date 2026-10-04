import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface AppEvent {
  type: string;
  payload?: unknown;
}

@Injectable({ providedIn: 'root' })
export class EventBusService {
  private readonly events$ = new Subject<AppEvent>();

  emit(event: AppEvent): void {
    this.events$.next(event);
  }

  on<T = unknown>(type: string) {
    return this.events$.pipe(
      filter((event) => event.type === type),
    );
  }
}