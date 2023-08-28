import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { BrowserModule } from '@angular/platform-browser';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { ProductsComponent } from './views/products/products.component';
import { AuthService } from './shared/services/auth.service';
import { SharedModule } from './shared/shared.module';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SuppliersComponent } from './views/suppliers/suppliers.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BaseLayoutComponent } from './components/base-layout/base-layout.component';

@NgModule({
  declarations: [AppComponent, BaseLayoutComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    HeaderComponent,
    ProductsComponent,
    FooterComponent,
    DashboardComponent,
    HeaderComponent,
    SuppliersComponent,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    SharedModule,
    HttpClientModule,
  ],
  providers: [importProvidersFrom(HttpClientModule), AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
