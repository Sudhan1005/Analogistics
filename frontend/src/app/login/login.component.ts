import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule   // ✅ REQUIRED for routerLink
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  user = {
    email: '',
    password: ''
  };

  constructor(
  private auth: AuthService,
  private router: Router
) {}

  login() {
  this.auth.login(this.user).subscribe({
    next: () => {
      this.router.navigate(['/dashboard/warehouses']);
    },
    error: () => alert('Invalid email or password')
  });
}
}
