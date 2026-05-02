import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  error = '';




  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
    role: new FormControl('', Validators.required)
  })

  constructor(private auth: AuthService, private router: Router) { }

  signup() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password, role } = this.form.value;

    this.auth.checkEmailExists(email!).subscribe(exists => {
      if (exists) {
        this.error = 'Email already exists';
        return;
      }


      this.auth.signup({ email: email!, password: password!, role: role! })
        .subscribe(() => {
          alert('Signup successful');
          this.router.navigate(['/login']);
        })
    })
  }

}
