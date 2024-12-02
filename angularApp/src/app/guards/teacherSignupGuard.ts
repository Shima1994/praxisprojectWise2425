import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

//الان استفاده نمیشه باید درستش کنیم ولی!! واسه اینه ک چک کنه طرف لاگین هست یا نه توکنش انگار
export const teacherSignupGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const  currentUsername = inject(AuthService).getCurrentUser();
  if (currentUsername !== null) {
    const logIn = false
    return logIn || router.navigate(['teacher-tutor']);
  }
  else {
    const logIn= true
    return logIn || router.navigate(['welcome']);
  }
}