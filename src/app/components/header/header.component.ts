import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] | undefined;

  authService = inject(AuthService);

  ngOnInit() {
    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-fw pi-home',
        routerLink: '/dashboard',
      },
      {
        label: 'Produtos',
        icon: 'pi pi-box',
        routerLink: '/produtos',
      },
      {
        label: 'Fornecedores',
        icon: 'pi pi-fw pi-users',
        routerLink: '/fornecedores',
      },
      {
        label: 'Sair',
        icon: 'pi pi-fw pi-power-off',
        command: () => this.authService.signOut(),
      },
    ];
  }
}
