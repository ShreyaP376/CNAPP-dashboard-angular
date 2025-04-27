import { Component, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../../shared.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})

export class HeaderComponent {
 constructor(private sharedService: SharedService){}
 onSearch(event: any){
  const searchValue = event.target.value;
  this.sharedService.setSearchText(searchValue);
 }
}
