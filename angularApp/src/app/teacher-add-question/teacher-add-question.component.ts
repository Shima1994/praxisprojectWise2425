import { Component, OnInit } from '@angular/core';
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
export class TeacherAddQuestionComponent implements OnInit  { 

  // خواندن اطلاعات کاربر از localStorage
  currentUser: string | null = localStorage.getItem('currentUser');
  
  currentUserInfo: any = this.currentUser ? JSON.parse(this.currentUser) : null;
  
  // متغیرها برای نگهداری نام کاربر
  currentUsername: string = this.currentUserInfo?.username || '';
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


  ngOnInit(): void {
    this.currentUser = localStorage.getItem('currentUser');
    this.currentUserInfo = this.currentUser ? JSON.parse(this.currentUser) : null;
    this.currentUsername = this.currentUserInfo?.username || '';
    debugger;
    const editQuestion = localStorage.getItem('editQuestion');
    if (editQuestion) {
      this.questionData = JSON.parse(editQuestion);
      this.questionData.answer = this.questionData.answer ;
      this.questionData.feedbackCorrect = this.questionData.feedbackCorrect ;
      this.questionData.description = this.questionData.description;
      this.questionData.feedbackWrong = this.questionData.feedbackWrong;
      this.questionData.code = this.questionData.code;
      this.questionData.hints = this.questionData.hints;
     

    }



  }
  
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
      const currentUsername= this.currentUsername?? '';


      
      debugger;
      this.authservice.addQuestion(description, code,answer,feedbackCorrect,feedbackWrong,hints,questionType,selectedCategory,selectedDifficulty,currentUsername).subscribe({
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
