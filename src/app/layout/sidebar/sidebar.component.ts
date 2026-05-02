import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { NavHoverDirective } from '../../shared/directives/nav-hover.directive';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NavHoverDirective],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

}
