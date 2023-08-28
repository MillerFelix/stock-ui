import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthService } from './../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule],
})
export class SignInComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);

  ngOnInit(): void {}

  onSignIn(email: string, password: string) {
    this.authService.signIn(email, password).then(() => {
      this.router.navigate(['/dashboard']); // Ou a rota desejada após o login
    });
  }
}
