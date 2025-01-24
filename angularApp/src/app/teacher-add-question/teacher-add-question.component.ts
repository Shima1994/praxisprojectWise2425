import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router'; 
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

  currentUser: string | null = localStorage.getItem('currentUser');
  
  currentUserInfo: any = this.currentUser ? JSON.parse(this.currentUser) : null;
  
  
  currentUsername: string = this.currentUserInfo?.username || '';
  selectedDifficulty: string = 'Expert';
  selectedCategory: string = 'Variable';
  questionType: string = 'Code';
  questionData = {
    description: '',
    code: '',
    codePart1: '', 
    codePart2: '', 
    answer: '',
    feedbackCorrect: '',
    feedbackWrong: '',
    hints: [''],
    selectedDifficulty: 'Expert',
    selectedCategory: 'Variable',
    questionType: 'Code',
    newNodeContent : '',
    newNodeType : 'process',
    _id: null as string | null, 
    chartData: {
      nodes: [] as Node[], 
      connections: [] as { from: Node; to: Node }[], 
    }
  };
  chartData = {
    nodes: [] as Node[], 
    connections: [] as { from: Node, to: Node }[], 

  };

  selectedNode: Node | null = null;

  onNodeClick(node: Node): void {
    if (this.selectedNode) {
      
      this.chartData.connections.push({ from: this.selectedNode, to: node });
      this.selectedNode = null; 
      this.drawConnections(); 
    } else {
      this.selectedNode = node;
    }
  }
  

 drawConnections(): void {
  
  const canvas = document.querySelector('.connections') as SVGElement;
  if (!canvas) return;

  
  canvas.innerHTML = '';

 
  this.chartData.connections.forEach((connection) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');

   
    line.setAttribute('x1', `${connection.from.position.x + 50}`);
    line.setAttribute('y1', `${connection.from.position.y + 25}`);
    line.setAttribute('x2', `${connection.to.position.x + 50}`); 
    line.setAttribute('y2', `${connection.to.position.y + 25}`);

    
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
      position: { x: 50, y: 50 }, 
    };

    this.chartData.nodes.push(newNode);
    this.questionData.newNodeContent = ''; 
    this.questionData.newNodeType = 'process'; 
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
    this.drawConnections(); 

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
      this.drawConnections(); 
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
      codePart1: this.questionData.codePart1 || '', 
      codePart2: this.questionData.codePart2 || '', 
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
      
      this.authService.updateQuestion(this.questionData['_id'], questionPayload).subscribe({
        next: () => {
          console.log('Question updated successfully');
          alert('Question updated successfully.');
          localStorage.removeItem('editQuestion');
          
          this.router.navigate(['/teacher-list-question']); 

        },
        error: (err) => {
        console.error('Error updating question:', err);
        alert('ٍQuestion updated successfully.')
      },

      });
    } else {
     
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
      this.resetForm(); 

      this.loadCurrentUser();

    }
    this.loadCurrentUser();
  }

  private resetForm(): void {

    this.questionData = {
      description: '',
      code: '',
      codePart1: '',
      codePart2: '',
      answer: '',
      feedbackCorrect: '',
      feedbackWrong: '',
      hints: [''],
      selectedDifficulty: 'Expert',
      selectedCategory: 'Variable',
      questionType: 'Code',
      newNodeContent: '',
      newNodeType: 'process',
      _id: null,
      chartData: {
        nodes: [],
        connections: []
      }
    };
  
    this.selectedDifficulty = 'Expert';
    this.selectedCategory = 'Variable';
    this.questionType = 'Code';
    this.chartData = {
      nodes: [],
      connections: []
    };
    this.selectedNode = null; 
  }
  
  logout(): void {
    this.authService.logoutTeacher();  
  }
}
