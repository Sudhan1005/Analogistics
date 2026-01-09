import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule   // ✅ REQUIRED for routerLink
  ],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  user = {
    name: '',
    email: '',
    password: '',
    recovery_question: '',
    recovery_answer: ''
  };

  constructor(private auth: AuthService) {}

  register() {
    this.auth.register(this.user).subscribe({
      next: () => alert('Registered Successfully'),
      error: () => alert('Error occurred')
    });
  }
}
