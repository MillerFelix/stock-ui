import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      { label: 'Inicio', icon: 'pi pi-fw pi-home' },
      { label: 'Fornecedores', icon: 'pi pi-fw pi-calendar' },
      { label: 'Marcas', icon: 'pi pi-fw pi-pencil' },
      { label: 'Produtos', icon: 'pi pi-fw pi-file' },
      { label: 'Login', icon: 'pi pi-fw pi-cog' },
    ];
  }
}
