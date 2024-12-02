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
  categories: string[] = ['Math', 'Science', 'History', 'Programming'];
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

  submitQuestion(): void {
    if (!this.selectedDifficulty || !this.selectedCategory || !this.questionData.description) {
      alert('Please fill out all required fields.');
      return;
    }

    // ارسال سوال
    console.log('Question submitted:', {
      difficulty: this.selectedDifficulty,
      category: this.selectedCategory,
      type: this.questionType,
      data: this.questionData
    });

    this.resetForm();
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
