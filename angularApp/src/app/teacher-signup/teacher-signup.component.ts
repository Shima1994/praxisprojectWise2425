import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teacher-signup',
  templateUrl: './teacher-signup.component.html',
  styleUrls: ['./teacher-signup.component.sass'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class  TeacherSignupComponent {
  // فرم ثبت‌نام
  signupForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: ['', [Validators.required]],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  });

  // فرم ورود
  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private router: Router
  ) {}

  // ثبت‌نام کاربر
  onSubmitRegister() {
    if (this.signupForm.valid) {
      const { firstName, lastName,username, password } = this.signupForm.value;
      if (typeof username === 'string' && typeof password === 'string'
        && typeof firstName === 'string'&& typeof lastName === 'string'
      ) {
        this.authService.signup(firstName,lastName,username, password).subscribe({
          next: (user) => {
            if (user && user.token) {
              console.log('Signup successful');
            //    window.location.reload();
              this.router.navigateByUrl('/teacher-tutor');
            } else {
              console.error('Signup successful, but no token received');
            }
          },
          error: (error) => {
            alert('Username already existed.');
            console.error('Signup failed: Username already existed.', error);
          }
        });
      } else {
        console.error('Username or password is missing or invalid.');
      }
    }
  }

  // ورود کاربر
  onSubmitLogin() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      if (typeof username === 'string' && typeof password === 'string') {
        this.authService.login(username, password).subscribe({
          next: (user) => {
            if (user && user.token) {
              console.log('Login successful.');
             //   window.location.reload();
              this.router.navigateByUrl('/teacher-tutor');
            } else {
              console.error('Login successful, but no token received');
            }
          },
          error: (err) => {
            alert('Wrong username or password.');
            console.error('Login failed', err);
          }
        });
      }
    }
  }

  // خروج کاربر
  logOut() {
    this.authService.logout();
  }
}
