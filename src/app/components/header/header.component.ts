import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { trigger, state, style } from '@angular/animations';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, SharedModule, BrowserAnimationsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [trigger('overlayAnimation', [state('start', style({}))])],
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] | undefined;

  authService = inject(AuthService);

  ngOnInit() {
    this.items = [
      {
        label: 'Sair',
        icon: 'pi pi-power-off',
        command: () => this.logout(),
      },
    ];
  }

  logout() {
    this.authService.signOut();
  }
}
