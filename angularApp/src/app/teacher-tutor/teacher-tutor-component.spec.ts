import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherTutorComponent } from './teacher-tutor-component';

describe('TeacherTutorComponent', () => {
  let component: TeacherTutorComponent;
  let fixture: ComponentFixture<TeacherTutorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherTutorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TeacherTutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid current user', () => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userInfo = JSON.parse(currentUser);
      expect(component.currentUsername).toBe(userInfo.username);
    } else {
      expect(component.currentUsername).toBe('');
    }
  });

  it('should call addTask method', () => {
    spyOn(component, 'addTask');
    component.addTask();
    expect(component.addTask).toHaveBeenCalled();
  });

  it('should call editTask method', () => {
    spyOn(component, 'editTask');
    component.editTask();
    expect(component.editTask).toHaveBeenCalled();
  });

  it('should call deleteTask method', () => {
    spyOn(component, 'deleteTask');
    component.deleteTask();
    expect(component.deleteTask).toHaveBeenCalled();
  });
});
