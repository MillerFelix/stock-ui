import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { BaseLayoutComponent } from './components/base-layout/base-layout.component';

const routes: Routes = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent },
  {
    path: '',
    component: BaseLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./views/products/products.component').then(
            (x) => x.ProductsComponent
          ),
      },
      {
        path: 'suppliers',
        loadComponent: () =>
          import('./views/suppliers/suppliers.component').then(
            (x) => x.SuppliersComponent
          ),
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
