import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher-list-question',
  standalone: true,
  imports: [CommonModule,RouterOutlet, RouterModule],
  templateUrl: './teacher-list-question.component.html',
  styleUrls: ['./teacher-list-question.component.sass'],
})
export class TeacherListQuestionComponent implements OnInit {
  questionList: any[] = [];

    // خواندن اطلاعات کاربر از localStorage
    currentUser: string | null = localStorage.getItem('currentUser');
    currentUserInfo: any = this.currentUser ? JSON.parse(this.currentUser) : null;
    // متغیرها برای نگهداری نام کاربر
    currentUsername: string = this.currentUserInfo?.username || '';

  constructor(private authservice: AuthService,
    private router: Router

  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.fetchQuestions();
  }
  private loadCurrentUser(): void {
    const currentUser = localStorage.getItem('currentUser');
    this.currentUserInfo = currentUser ? JSON.parse(currentUser) : null;
    this.currentUsername = this.currentUserInfo?.username || '';
  }
  fetchQuestions(): void {
    const currentUserInfo = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const currentUsername = currentUserInfo.username || '';
    this.authservice.getQuestions(currentUsername).subscribe({
        next: (response) => {
            if (response && response.data && Array.isArray(response.data)) {
                this.questionList = response.data; 
                console.log('Questions fetched successfully:', response.data);
            } else {
                console.error('Invalid response format:', response);
            }
        },
        error: (error) => {
            console.error('Error fetching questions:', error);
        },
    });
}


   removeQuestion(questionId: string): void {
    this.authservice.deleteQuestion(questionId).subscribe({
       next: () => {
      console.log('Question deleted successfully');
        this.questionList = this.questionList.filter(
           (question) => question._id !== questionId
         );
       },
       error: (error) => {
         console.error('Error deleting question:', error);
      },
    });
   }
  logout(): void {
    this.authservice.logoutTeacher();
  }

editQuestion(question: any): void {
  debugger;
  localStorage.setItem('editQuestion', JSON.stringify(question));
  debugger;
  this.router.navigate(['/teacher-add-question']);
}

}




