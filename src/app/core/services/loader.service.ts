import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  loading$ = new BehaviorSubject<Boolean>(false);

  show() {
    this.loading$.next(true);
  }

  hide() {
    this.loading$.next(false);
  }

}
