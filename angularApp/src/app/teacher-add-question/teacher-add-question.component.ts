import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';  // add this import


@Component({
  selector: 'app-teacher-add-question',
  standalone: true,
  imports: [ReactiveFormsModule,RouterOutlet, FormsModule,CommonModule,RouterModule],
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
    hints: [''],
    selectedDifficulty: 'Expert',
    selectedCategory: 'Variable',
    questionType: 'Code',
    _id: null as string | null // شناسه سؤال در صورت ویرایش
  };

  isLoading: boolean = false; // وضعیت بارگذاری (Loading)
  message: string | null = null; // پیام موفقیت یا خطا

  constructor(private authService: AuthService,
     private router:Router
  ) {}


  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadEditQuestionData();

  }
  
  private loadCurrentUser(): void {
    this.currentUser = localStorage.getItem('currentUser');
    this.currentUserInfo = this.currentUser ? JSON.parse(this.currentUser) : null;
    this.currentUsername = this.currentUserInfo?.username || '';
  }
  private loadEditQuestionData(): void {
    const editQuestion = localStorage.getItem('editQuestion');
    if (editQuestion) {
      this.questionData = JSON.parse(editQuestion);
      this.selectedDifficulty = this.questionData.selectedDifficulty || 'Expert';
      this.selectedCategory = this.questionData.selectedCategory || 'Variable';
      this.questionType = this.questionData.questionType || 'Code';
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

  onSubmitQuestion(): void {
    debugger;
    const questionPayload = {
      description: this.questionData.description || '',
      code: this.questionData.code || '',
      answer: this.questionData.answer || '',
      feedbackCorrect: this.questionData.feedbackCorrect || '',
      feedbackWrong: this.questionData.feedbackWrong || '',
      hints: this.questionData.hints || [],
      selectedDifficulty: this.selectedDifficulty || '',
      questionType: this.questionType || '',
      selectedCategory: this.selectedCategory || '',
      currentUsername: this.currentUsername || ''
    };
    
    if (this.questionData['_id']) {
      // ویرایش سؤال
      this.authService.updateQuestion(this.questionData['_id'], questionPayload).subscribe({
        next: () => {
         //   console.log('Question updated successfully');
          this.message = 'Question updated successfully';
          localStorage.removeItem('editQuestion');
          //  window.location.reload();
          this.router.navigate(['/teacher-list-question']); // بازگشت به لیست سؤالات

        },
        error: (err) => console.error('Error updating question:', err)
      });
    } else {
      // اضافه کردن سؤال جدید
      debugger;
      this.authService.addQuestion(questionPayload).subscribe({
        
        next: () => {
          //  console.log('Question added successfully');
          this.message = 'Question added successfully';
          this.router.navigate(['/teacher-add-question'])
        },
        error: (err) => console.error('Error adding question:', err)
      });


    }
    this.loadCurrentUser();
  }
  
  logout(): void {
    this.authService.logoutTeacher();  
  }
}
