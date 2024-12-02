import { Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-teacher-add-question',
  standalone: true,
  imports: [RouterOutlet,RouterModule, FormsModule],
  templateUrl: './teacher-add-question.component.html',
  styleUrl: './teacher-add-question.component.sass'
})
export class TeacherAddQuestionComponent  { 
  selectedDifficulty: string = '';
  // انتخاب دسته‌بندی
  selectedCategory: string = '';
  // لیست دسته‌بندی‌ها (می‌توانید این لیست را تغییر دهید)
  categories: string[] = ['Math', 'Science', 'History', 'Programming'];

  // نوع سوال
  questionType: string = 'Code';

  // داده‌های سوال
  questionData = {
    description: '',
    code: '',
    answer: '',
    feedbackCorrect: '',
    feedbackWrong: '',
    hints: ['']
  }

  // متد برای انتخاب سطح سختی
  selectDifficulty(level: string): void {
    this.selectedDifficulty = level;
  }

  // متد برای انتخاب دسته‌بندی
  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  // اضافه کردن یک راهنمای جدید
  addHint(hint: string): void {
    if (this.questionData.hints.length < 3) {
      this.questionData.hints.push(hint);
    }
  }

  // ارسال سوال
  submitQuestion(): void {
    // اعتبارسنجی داده‌ها (در صورت نیاز می‌توانید قوانین بیشتری اضافه کنید)
    if (!this.selectedDifficulty || !this.selectedCategory || !this.questionData.description) {
      alert('Please fill out all required fields.');
      return;
    }

    // داده‌ها را پردازش کنید یا به سرور ارسال کنید
    console.log('Question submitted:', {
      difficulty: this.selectedDifficulty,
      category: this.selectedCategory,
      type: this.questionType,
      data: this.questionData
    });

    // بازنشانی فرم پس از ارسال موفق
    this.resetForm();
  }

  // بازنشانی فرم
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
}
