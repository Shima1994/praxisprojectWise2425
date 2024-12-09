import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-teacher-add-question',
  standalone: true,
  imports: [RouterOutlet, RouterModule, FormsModule],
  templateUrl: './teacher-add-question.component.html',
  styleUrl: './teacher-add-question.component.sass'
})
export class TeacherAddQuestionComponent  { 
  selectedDifficulty: string = '';
  selectedCategory: string = '';
  categories: string[] = ['Variable', 'Loops', 'Functions'];
  questionType: string = 'Code';
  questionData = {
    description: '',
    code: '',
    answer: '',
    feedbackCorrect: '',
    feedbackWrong: '',
    hints: ['']
  };

  constructor(private authservice: AuthService) {}

  selectDifficulty(level: string): void {
    this.selectedDifficulty = level;
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  addHint(hint: string): void {
    if (this.questionData.hints.length < 3) {
      this.questionData.hints.push(hint);
    }
  }

 
// در teacher-add-question.component.ts
submitQuestion(): void {
  if (!this.selectedDifficulty || !this.selectedCategory || !this.questionData.description) {
    alert('Please fill out all required fields.');
    return;
  }

  // تعریف متغیرها به صورت جداگانه
  const difficulty = this.selectedDifficulty;
  const category = this.selectedCategory;
  const type = this.questionType;
  const description = this.questionData.description;
  const code = this.questionData.code;
  const answer = this.questionData.answer;
  const feedbackCorrect = this.questionData.feedbackCorrect;
  const feedbackWrong = this.questionData.feedbackWrong;


  // ارسال درخواست با مقادیر تعریف شده
  this.authservice.submitQuestion(difficulty, category, type, description, code, answer, feedbackCorrect, feedbackWrong)
    .subscribe({
      next: (response) => {
        if (response) {
          console.log('Question submitted successfully:', response);
          alert('Question submitted successfully!');
      
          
        } else {
          console.error('Question submitted but no valid response received.');
          alert('Something went wrong. Please try again later.');
        }
      },
      error: (err) => {
        console.error('Error submitting question:', err);
        alert('Error occurred while submitting the question. Please try again.');
      }
    });
}

  
  resetForm(): void {
    this.selectedDifficulty = '';
    this.selectedCategory = '';
    this.questionType = 'Code';
    this.questionData = {
      description: '',
      code: '',
      answer: '',
      feedbackCorrect: '',
      feedbackWrong: '',
      hints: ['']
    };
  }
  


  // خروج از سیستم
  logout(): void {
    this.authservice.logoutTeacher();  // فراخوانی متد logout از AuthService
  }
}
