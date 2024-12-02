import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherSignupComponent } from './teacher-signup.component'; // مسیر جدید کامپوننت

describe('TeacherSignupComponent', () => {
  let component: TeacherSignupComponent;
  let fixture: ComponentFixture<TeacherSignupComponent>;

  // تنظیمات اولیه قبل از اجرای تست‌ها
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherSignupComponent], // ماژول کامپوننت
    }).compileComponents();

    // ایجاد کامپوننت
    fixture = TestBed.createComponent(TeacherSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // اعمال تغییرات DOM
  });

  // تست اصلی: بررسی ساخت کامپوننت
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // تست اضافی: بررسی مقداردهی اولیه فرم‌ها
  it('should initialize signup form correctly', () => {
    expect(component.signupForm).toBeDefined(); // فرم ثبت‌نام تعریف‌شده است
    expect(component.signupForm.get('username')).toBeDefined(); // فیلد username تعریف‌شده است
    expect(component.signupForm.get('password')).toBeDefined(); // فیلد password تعریف‌شده است
  
  });

  // تست اضافی: بررسی مقداردهی اولیه فرم ورود
  it('should initialize login form correctly', () => {
    expect(component.loginForm).toBeDefined(); // فرم ورود تعریف‌شده است
    expect(component.loginForm.get('username')).toBeDefined(); // فیلد username تعریف‌شده است
    expect(component.loginForm.get('password')).toBeDefined(); // فیلد password تعریف‌شده است
  });

  // تست متد: بررسی عملکرد ارسال فرم ثبت‌نام
  it('should call onSubmitRegister and signup if the form is valid', () => {
    // تنظیم مقدارهای معتبر برای فرم ثبت‌نام
    component.signupForm.setValue({
      username: 'testuser',
      password: 'testpassword',
      confirmPassword: null,
      firstName: null,
      lastName: null,
    });

    spyOn(component.authService, 'signup').and.callFake(() => {
      return {
        subscribe: (callbacks: { next: Function; error: Function }) => {
          callbacks.next({ token: 'test-token' });
        },
      } as any;
    });

    component.onSubmitRegister(); // فراخوانی متد

    expect(component.authService.signup).toHaveBeenCalledWith('testuser', 'testpassword','testuser', 'testpassword'); // بررسی ارسال صحیح داده‌ها
  });

  // تست متد: بررسی عملکرد ارسال فرم ورود
  it('should call onSubmitLogin and login if the form is valid', () => {
    // تنظیم مقدارهای معتبر برای فرم ورود
    component.loginForm.setValue({
      username: 'testuser',
      password: 'testpassword',
    });

    spyOn(component.authService, 'login').and.callFake(() => {
      return {
        subscribe: (callbacks: { next: Function; error: Function }) => {
          callbacks.next({ token: 'test-token' });
        },
      } as any;
    });

    component.onSubmitLogin(); // فراخوانی متد

    expect(component.authService.login).toHaveBeenCalledWith('testuser', 'testpassword'); // بررسی ارسال صحیح داده‌ها
  });
});
