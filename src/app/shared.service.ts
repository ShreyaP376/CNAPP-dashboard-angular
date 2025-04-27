import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private searchSubject = new BehaviorSubject<string>('');
  searchText = this.searchSubject.asObservable();

  setSearchText(text: string){
    this.searchSubject.next(text);
  }
}
