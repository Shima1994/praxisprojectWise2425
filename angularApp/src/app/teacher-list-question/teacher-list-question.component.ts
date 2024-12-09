import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-teacher-list-question',
  standalone: true,
  imports: [RouterOutlet, RouterModule, FormsModule],
  templateUrl: './teacher-list-question.component.html',
  styleUrls: ['./teacher-list-question.component.sass'], // استفاده از styleUrls
})
export class TeacherListQuestionComponent {
  constructor(private authservice: AuthService) {} // داخل کلاس

  logout(): void {
    this.authservice.logoutTeacher(); // فراخوانی متد logout از AuthService
  }
}
