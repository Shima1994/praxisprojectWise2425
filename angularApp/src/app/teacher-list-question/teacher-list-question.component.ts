import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teacher-list-question',
  standalone: true,
  imports: [CommonModule,RouterOutlet, RouterModule],
  templateUrl: './teacher-list-question.component.html',
  styleUrls: ['./teacher-list-question.component.sass'],
})
export class TeacherListQuestionComponent implements OnInit {
  questionList: any[] = [];

  constructor(private authservice: AuthService) {}

  ngOnInit(): void {
    this.fetchQuestions();
  }

  fetchQuestions(): void {
    this.authservice.getQuestions().subscribe({
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
}
  // editQuestion(questionId: string): void {
  //   console.log('Editing question with ID:', questionId);
    // Add logic to navigate to edit page or open an edit modal
  // }





