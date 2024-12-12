import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher-list-question',
  standalone: true,
  imports: [ReactiveFormsModule,RouterOutlet, RouterModule, FormsModule],
  templateUrl: './teacher-list-question.component.html',
  styleUrls: ['./teacher-list-question.component.sass'], // استفاده از styleUrls
})
export class TeacherListQuestionComponent  {

  // فرم ثبت‌نام
  signupForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: ['', [Validators.required]],
    password: ['', Validators.required]
  });
  constructor(private authservice: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {} // داخل کلاس



  onSubmitRegister() {
    if (this.signupForm.valid) {
      const { firstName, lastName,username} = this.signupForm.value;
      if (typeof username === 'string' 
        && typeof firstName === 'string'&& typeof lastName === 'string'
      ) {
        this.authservice.test(firstName,lastName,username).subscribe({
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


  logout(): void {
    this.authservice.logoutTeacher(); // فراخوانی متد logout از AuthService
  }
}
