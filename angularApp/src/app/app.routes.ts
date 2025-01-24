import { Routes } from '@angular/router';
import { TeacherSignupComponent } from './teacher-signup/teacher-signup.component';
import { TeacherTutorComponent } from './teacher-tutor/teacher-tutor-component';
import { TeacherAddQuestionComponent } from './teacher-add-question/teacher-add-question.component';
import { TeacherListQuestionComponent } from './teacher-list-question/teacher-list-question.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { signupGuard } from './guards/signupGuard';

export const routes: Routes = [
    {path: '',   redirectTo: '/welcome', pathMatch: 'full'},


     {path: 'teacher-signup', component: TeacherSignupComponent,
        canActivate: [signupGuard],
     },
     {path: 'teacher-tutor', component: TeacherTutorComponent},
     {path: 'teacher-add-question', component: TeacherAddQuestionComponent},
     {path: 'teacher-list-question', component: TeacherListQuestionComponent},
    {path: 'welcome', component: WelcomeComponent },
];