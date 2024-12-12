import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-teacher-add-question',
  standalone: true,
  imports: [ReactiveFormsModule,RouterOutlet, RouterModule, FormsModule,CommonModule],
  templateUrl: './teacher-add-question.component.html',
  styleUrl: './teacher-add-question.component.sass'
})
export class TeacherAddQuestionComponent  { 


  selectedDifficulty: string = 'Expert';
  selectedCategory: string = 'Variable';
  questionType: string = 'Code';
  questionData = {
    description: '',
    code: '',
    answer: '',
    feedbackCorrect: '',
    feedbackWrong: '',
    hints: ['']
  };

  constructor(private authservice: AuthService,
     private fb: FormBuilder
  ) {}

  selectDifficulty(level: string): void {
    this.selectedDifficulty = level;
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  addHint(): void {
    if (this.questionData.hints.length < 3) {
      this.questionData.hints.push(''); 
    }
  }


onSubmitQuestion() {
      const description = this.questionData.description ?? '';
      const code = this.questionData.code ?? '';
      const answer = this.questionData.answer ?? '';
      const feedbackCorrect = this.questionData.feedbackCorrect ?? '';
      const feedbackWrong = this.questionData.feedbackWrong ?? '';
      const hints = this.questionData.hints.join(', ') ?? ''; // تبدیل آرایه به رشته
      const selectedDifficulty = this.selectedDifficulty ?? '';
      const questionType= this.questionType?? '';
      const selectedCategory= this.selectedCategory?? '';
      this.authservice.addQuestion(description, code,answer,feedbackCorrect,feedbackWrong,hints,questionType,selectedCategory,selectedDifficulty).subscribe({
        next: (user) => {
          if (user && user.token) {
            console.log('add Question successful');
          } else {
            console.error('add Question successful, but no token received');
          }
        },

      });
     {
      console.error('Question is missing or invalid.');
    }
  
}


  logout(): void {
    this.authservice.logoutTeacher();  
  }
}
