import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000';
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

  getQuestions(user: string): Observable<{status: string, data: any[], message: string}> {
    return this.http.get<{status: string, data: any[], message: string}>(`${this.apiUrl}/getquestions/${user}`);
}


updateQuestion(id: string, questionPayload: any): Observable<any> {
  debugger;
  return this.http.put(`${this.apiUrl}/updatequestions/${id}`, questionPayload).pipe(
    catchError((error) => {
      console.error('Error updating question:', error);
      return (error);  
    })
  );
}



deleteQuestion(questionId: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/questions/${questionId}`);
}


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



   
  addQuestion(
    questionPayload: {
      description: string;
      code: string;
      codePart1: string;
      codePart2: string;
      answer: string;
      feedbackCorrect: string;
      feedbackWrong: string;
      hints: string[];
      questionType: string;
      selectedCategory: string;
      selectedDifficulty: string;
      currentUsername: string;
      chartData: {
        nodes: { content: string; type: string; position: { x: number; y: number } }[];
        connections: { from: { content: string }; to: { content: string } }[];
      };
    }
  ) {
    debugger;
    return this.http.post<any>('http://localhost:5000/addQuestion', questionPayload)
      .pipe(
        map(response => {
          if (response && response.data.token, response.data.answer) {
            const answer = response.data.answer
            const token  = response.data.token;
            const currentUsername= response.data.currentUsername;
           
            this.currentUserSubject.next({ answer, token,currentUsername});
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


submitQuestion(
  firstname: string,
  lastname: string) {
  console.log('Sending data:', { firstname, lastname });
  debugger;
  return this.http.post<any>('http://localhost:5000/login', {firstname,lastname})
  .pipe(
    map(response => {
      console.log('Question submitted successfully:', response);
      if (response && response.success) {
        return response;
      } else {
        throw new Error('Question submission failed without a valid response.');
      }
    }),
    catchError(error => {
      console.error('Error submitting question:', error);
      return throwError(() => new Error(error.message || 'Unknown error occurred'));
    })
  );
}



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





