import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public currentUser: Observable<any> = this.currentUserSubject.asObservable();
  public isLoggedIn: Observable<boolean> = this.currentUser.pipe(map(user => !!user));

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<any>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
    this.isLoggedIn = this.currentUser.pipe(map(user => !!user));
  }

  getCurrentUser(): string | null {
    const currentUser = this.currentUserSubject.value;
    return currentUser ? currentUser.username : null;
  }  

  getCurrentUserToken(): string | null {
    return this.currentUserSubject.value ? this.currentUserSubject.value.token : null;
  }
 /*I change this method*/
  signup(firstName: string, lastName: string,username: string, password: string) {
    debugger;
    return this.http.post<any>('http://localhost:5000/signup', { firstName, lastName,username, password })
      .pipe(
        map(response => {
          if (response && response.data.token, response.data.experienceLevel, response.data.username, response.data.solvedTasks) {
            const username = response.data.username
            const token  = response.data.token;
            const experienceLevel = response.data.experienceLevel;
            const solvedTasks = response.data.solvedTasks;
            localStorage.setItem('currentUser', JSON.stringify({ username, token, experienceLevel,solvedTasks,firstName, lastName }));
            this.currentUserSubject.next({ username, token, experienceLevel,solvedTasks,firstName, lastName});
            return {  token };
          } else {
            throw new Error('No token received');
          }
        }),
        catchError(error => {
          console.error('Signup error', error);
          return throwError(()=> new Error(error));
        })
      );
  }
 /*I change this method*/
  login(username: string, password: string) {
    return this.http.post<any>('http://localhost:5000/login', { username, password })
      .pipe(
        map(response => {
          console.log("Response from server:", response); 
          console.log("Response from server:", response.data); 
          if (response && response.data.user_id && response.data.token, response.data.experienceLevel, response.data.username, response.data.solvedTasks) {
            const username = response.data.username
            const token  = response.data.token;
            const experienceLevel = response.data.experienceLevel;
            const solvedTasks = response.data.solvedTasks;
            const firstName= response.data.firstName;
            const lastName= response.data.lastName;
            localStorage.setItem('currentUser', JSON.stringify({  username, token, experienceLevel,solvedTasks ,firstName, lastName}));
            this.currentUserSubject.next({  username, token, experienceLevel,solvedTasks,firstName, lastName});
            return { token };
          } else {
            throw new Error('No token received');
          }
        }),
        catchError(error => {
          console.error('Login failed', error);
          return throwError(()=> new Error(error));
        })
      );
  }

  logout() {
    console.log("test")
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/signup']);
    console.log("Logged out");
  }


  logoutTeacher() {
    console.log("test")
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/teacher-signup']);
    console.log("Logged out");
  }
  changeExperienceLevel(username: string,token: string,experienceLevel: string){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const options = {headers: headers};
    let currentUserJSON = localStorage.getItem("currentUser");
    if (currentUserJSON) {
      let currentUserObj = JSON.parse(currentUserJSON)
      currentUserObj.experienceLevel=experienceLevel
      localStorage.setItem("currentUser",JSON.stringify(currentUserObj))
      return this.http.post<any>('http://localhost:5000/changeExpLevel', { username,experienceLevel }, options)
      .pipe(
        catchError(error => {
          console.error('Signup error', error);
          return throwError(()=> new Error(error));
      })
    );
} else {
  let error="Issue"
  console.error('Signup error', error);
  return throwError(()=> new Error(error));
}
}
  }





