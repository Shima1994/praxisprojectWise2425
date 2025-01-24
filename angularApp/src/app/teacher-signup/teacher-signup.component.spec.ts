import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherSignupComponent } from './teacher-signup.component'; // مسیر جدید کامپوننت

describe('TeacherSignupComponent', () => {
  let component: TeacherSignupComponent;
  let fixture: ComponentFixture<TeacherSignupComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherSignupComponent], 
    }).compileComponents();

    fixture = TestBed.createComponent(TeacherSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize signup form correctly', () => {
    expect(component.signupForm).toBeDefined(); 
    expect(component.signupForm.get('username')).toBeDefined(); 
    expect(component.signupForm.get('password')).toBeDefined();
  
  });

  it('should initialize login form correctly', () => {
    expect(component.loginForm).toBeDefined(); 
    expect(component.loginForm.get('username')).toBeDefined(); 
    expect(component.loginForm.get('password')).toBeDefined(); 
  });


  it('should call onSubmitRegister and signup if the form is valid', () => {

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

    component.onSubmitRegister();

    expect(component.authService.signup).toHaveBeenCalledWith('testuser', 'testpassword','testuser', 'testpassword'); // بررسی ارسال صحیح داده‌ها
  });

  it('should call onSubmitLogin and login if the form is valid', () => {

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

    component.onSubmitLogin(); 

    expect(component.authService.login).toHaveBeenCalledWith('testuser', 'testpassword'); 
  });
});
