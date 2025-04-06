interface Task {
    id: number;
    text: string;
    completed: boolean;
}

class TodoApp {
    private tasks: Task[] = [];
    private taskIdCounter: number = 1;

    constructor() {
        this.setupEventListeners();
        this.loadTasks();
        this.renderTasks();
    }

    private setupEventListeners(): void {
        const addTaskBtn = document.getElementById('addTaskBtn');
        const taskInput = document.getElementById('taskInput') as HTMLInputElement;

        addTaskBtn?.addEventListener('click', () => {
            const text = taskInput.value.trim();
            if (text) {
                this.addTask(text);
                taskInput.value = '';
            }
        });

        taskInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const text = taskInput.value.trim();
                if (text) {
                    this.addTask(text);
                    taskInput.value = '';
                }
            }
        });
    }

    private addTask(text: string): void {
        const newTask: Task = {
            id: this.taskIdCounter++,
            text,
            completed: false
        };
        this.tasks.push(newTask);
        this.saveTasks();
        this.renderTasks();
    }

    private deleteTask(id: number): void {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.renderTasks();
    }

    private toggleTaskCompletion(id: number): void {
        this.tasks = this.tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        this.saveTasks();
        this.renderTasks();
    }

    private renderTasks(): void {
        const taskList = document.getElementById('taskList');
        if (!taskList) return;

        taskList.innerHTML = '';

        this.tasks.forEach(task => {
            const li = document.createElement('li');
            
            const taskText = document.createElement('span');
            taskText.textContent = task.text;
            if (task.completed) {
                taskText.style.textDecoration = 'line-through';
                taskText.style.color = '#888';
            }

            taskText.addEventListener('click', () => this.toggleTaskCompletion(task.id));

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

            li.appendChild(taskText);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });
    }

    private saveTasks(): void {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        localStorage.setItem('taskIdCounter', this.taskIdCounter.toString());
    }

    private loadTasks(): void {
        const savedTasks = localStorage.getItem('tasks');
        const savedCounter = localStorage.getItem('taskIdCounter');

        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks);
        }

        if (savedCounter) {
            this.taskIdCounter = parseInt(savedCounter, 10);
        }
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});