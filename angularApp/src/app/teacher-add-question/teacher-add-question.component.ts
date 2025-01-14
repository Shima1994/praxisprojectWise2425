import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';  // add this import
interface Node {
  content: string;
  type: string;
  position: { x: number; y: number };
}  

@Component({
  selector: 'app-teacher-add-question',
  standalone: true,
  imports: [ReactiveFormsModule,RouterOutlet, FormsModule,CommonModule,RouterModule],
  templateUrl: './teacher-add-question.component.html',
  styleUrl: './teacher-add-question.component.sass'
})
export class TeacherAddQuestionComponent implements OnInit  { 

  // خواندن اطلاعات کاربر از localStorage
  currentUser: string | null = localStorage.getItem('currentUser');
  
  currentUserInfo: any = this.currentUser ? JSON.parse(this.currentUser) : null;
  
  // متغیرها برای نگهداری نام کاربر
  currentUsername: string = this.currentUserInfo?.username || '';
  selectedDifficulty: string = 'Expert';
  selectedCategory: string = 'Variable';
  questionType: string = 'Code';
  questionData = {
    description: '',
    code: '',
    answer: '',
    feedbackCorrect: '',
    feedbackWrong: '',

    hints: [''],
    selectedDifficulty: 'Expert',
    selectedCategory: 'Variable',
    questionType: 'Code',
    newNodeContent : '',
    newNodeType : 'process',
    _id: null as string | null, // شناسه سؤال در صورت ویرایش
    chartData: {
      nodes: [] as Node[], // آرایه nodes از نوع Node
      connections: [] as { from: Node; to: Node }[], // ذخیره ارتباطات بین گره‌ها
    }
  };
  chartData = {
    nodes: [] as Node[], // آرایه nodes از نوع Node
    connections: [] as { from: Node, to: Node }[], // ذخیره ارتباطات بین گره‌ها

  };

  selectedNode: Node | null = null;

  onNodeClick(node: Node): void {
    if (this.selectedNode) {
      // اضافه کردن اتصال
      this.chartData.connections.push({ from: this.selectedNode, to: node });
      this.selectedNode = null; // بازنشانی
      this.drawConnections(); // رسم خطوط
    } else {
      this.selectedNode = node;
    }
  }
  
  drawConnections(): void {
    const canvas = document.querySelector('.connections') as SVGElement;
    if (!canvas) return;
  
    canvas.innerHTML = ''; // پاک کردن خطوط قبلی
  
    this.chartData.connections.forEach((connection) => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  
      // مختصات شروع و پایان خطوط
      line.setAttribute('x1', `${connection.from.position.x + 50}`); // تنظیم عرض گره (به مرکز نزدیک شوید)
      line.setAttribute('y1', `${connection.from.position.y + 25}`); // تنظیم ارتفاع گره
      line.setAttribute('x2', `${connection.to.position.x + 50}`);
      line.setAttribute('y2', `${connection.to.position.y + 25}`);
  
      // استایل خط
      line.setAttribute('stroke', 'black');
      line.setAttribute('stroke-width', '2');
      canvas.appendChild(line);
    });
  }
  
  
  addNode() {
    if (!this.questionData.newNodeContent) {
      alert('Please enter node content!');
      return;
    }

    
    const newNode: Node = {
      content: this.questionData.newNodeContent,
      type: this.questionData.newNodeType,
      position: { x: 50, y: 50 }, // Default position
    };

    this.chartData.nodes.push(newNode);
    this.questionData.newNodeContent = ''; // Reset content
    this.questionData.newNodeType = 'process'; // Reset to default type
  }

  removeNode(node: Node) {
    this.chartData.nodes = this.chartData.nodes.filter((n) => n !== node);
  }

  onNodeDragStart(event: DragEvent, node: Node) {
    const dataTransfer = event.dataTransfer;
    if (dataTransfer) {
      dataTransfer.setData('text', JSON.stringify(node));
    }
  }
  

  onNodeDragEnd(event: DragEvent, node: Node) {
    const target = event.target as HTMLElement;
    const container = document.getElementById('flowchartCanvas');
  
    if (target && container) {
      const containerRect = container.getBoundingClientRect();
  
      // محاسبه مختصات جدید با محدود کردن به محدوده مستطیل
      const newX = Math.max(
        0,
        Math.min(event.clientX - containerRect.left - target.offsetWidth / 2, containerRect.width - target.offsetWidth)
      );
      const newY = Math.max(
        0,
        Math.min(event.clientY - containerRect.top - target.offsetHeight / 2, containerRect.height - target.offsetHeight)
      );
  
      node.position.x = newX;
      node.position.y = newY;
    }
  }
  

  get answerLabel(): string {
    switch (this.questionType) {
      case 'Code':
        return 'Answer Code';
      case 'text':
        return 'Answer Text';
      default:
        return 'Answer';
    }
    

  }
  constructor(private authService: AuthService,
     private router:Router
  ) {}


  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadEditQuestionData();

  }
  
  private loadCurrentUser(): void {
    this.currentUser = localStorage.getItem('currentUser');
    this.currentUserInfo = this.currentUser ? JSON.parse(this.currentUser) : null;
    this.currentUsername = this.currentUserInfo?.username || '';
  }
  private loadEditQuestionData(): void {
    const editQuestion = localStorage.getItem('editQuestion');
    if (editQuestion) {
      this.questionData = JSON.parse(editQuestion);
      this.selectedDifficulty = this.questionData.selectedDifficulty || 'Expert';
      this.selectedCategory = this.questionData.selectedCategory || 'Variable';
      this.questionType = this.questionData.questionType || 'Code';
      this.chartData = this.questionData.chartData || { nodes: [], connections: [] };
      this.drawConnections(); // رسم مجدد خطوط
    }
  }
  selectDifficulty(level: string): void {
    this.selectedDifficulty = level;
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  addHint(): void {
    if (this.questionData.hints.length < 3) {
      this.questionData.hints.push(''); 
    }
  }

  onSubmitQuestion(event: Event): void {
    event.preventDefault();
    debugger;
    const questionPayload = {
      description: this.questionData.description || '',
      code: this.questionData.code || '',
      answer: this.questionData.answer || '',
      feedbackCorrect: this.questionData.feedbackCorrect || '',
      feedbackWrong: this.questionData.feedbackWrong || '',
      hints: this.questionData.hints || [],
      selectedDifficulty: this.selectedDifficulty || '',
      questionType: this.questionType || '',
      selectedCategory: this.selectedCategory || '',
      currentUsername: this.currentUsername || '',
      chartData: {
        nodes: this.chartData.nodes,
        connections: this.chartData.connections
      },
    };
    
    if (this.questionData['_id']) {
      // ویرایش سؤال
      this.authService.updateQuestion(this.questionData['_id'], questionPayload).subscribe({
        next: () => {
          console.log('Question updated successfully');
          alert('Question updated successfully.');
          localStorage.removeItem('editQuestion');
          //  window.location.reload();
          this.router.navigate(['/teacher-list-question']); // بازگشت به لیست سؤالات

        },
        error: (err) => {
        console.error('Error updating question:', err);
        alert('ٍQuestion updated successfully.')
      },

      });
    } else {
      // اضافه کردن سؤال جدید
      debugger;
      this.authService.addQuestion(questionPayload).subscribe({
        
        next: () => {
          console.log('Question added successfully');
          alert('Question added successfully.');
          this.router.navigate(['/teacher-add-question'])
        },
        error: (err) => {
        console.error('Error adding question:', err);
        alert('ٍQuestion added successfully.')
      },
      });


    }
    this.loadCurrentUser();
  }
  
  logout(): void {
    this.authService.logoutTeacher();  
  }
}
