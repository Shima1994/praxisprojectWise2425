import { Component, NgModule, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoggingService } from '../services/log.service';
import { AuthService } from '../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-teacher-tutor',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './teacher-tutor-component.html',
  styleUrls: ['./teacher-tutor-component.sass']
})
export class TeacherTutorComponent implements OnInit {
  // خواندن اطلاعات کاربر از localStorage
  currentUser: string | null = localStorage.getItem('currentUser');
 

  currentUserInfo: any = this.currentUser ? JSON.parse(this.currentUser) : null;
  
  // متغیرها برای نگهداری نام کاربر
  currentUsername: string = this.currentUserInfo?.username || '';
  currentFirstName: string = this.currentUserInfo?.firstName || '';
  currentLastName: string = this.currentUserInfo?.lastName || '';

  constructor(
    private loggingService: LoggingService,
    private authservice: AuthService
  ) {}

  ngOnInit(): void {
    // تنظیم توابع سراسری سرویس لاگینگ
    (window as any).loggingService = this.loggingService;

    // تابعی برای بروزرسانی لاگ‌ها
    (window as any).logHelperFunction = (data: { [key: string]: any }, token: string) => {
      this.loggingService.updateLogs(data, token).subscribe(
        (response: any) => {
          console.log('Log update successful', response);
        },
        (error: any) => {
          console.error('Log update failed', error);
        }
      );
    };

    // تابعی برای بروزرسانی لیست تمرین‌های حل‌شده
    (window as any).updateSolvedExercisesList = (data: { [key: string]: any }, token: string) => {
      this.loggingService.updateSolvedExercises(data, token).subscribe(
        (response: any) => {
          console.log('Updated solved exercise list successfully', response);
        },
        (error: any) => {
          console.error('Error updating exercise list', error);
        }
      );
    };
  }

  // خروج کاربر
  logout(): void {
    this.authservice.logoutTeacher();
  }

}
