import React, { useState } from 'react';
import TaskItem from './TaskItem'; // 确保正确导入 TaskItem 组件
import './App.css';

function App() {
  const [taskText, setTaskText] = useState('');
  const [tasks, setTasks] = useState([]);

  const handleChange = (e) => {
    setTaskText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskText.trim()) return;
    const newTask = {
      id: Date.now(),
      text: taskText,
      date: new Date().toISOString().split('T')[0],
      completed: false,
    };
    setTasks([newTask, ...tasks]);
    setTaskText('');
  };

  const handleComplete = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // 按日期分组任务
  const tasksByDate = tasks.reduce((acc, task) => {
    acc[task.date] = acc[task.date] ? [...acc[task.date], task] : [task];
    return acc;
  }, {});

  return (
    <div className="App">
      <h1>ToDo List</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={taskText} onChange={handleChange} />
        <button type="submit">Add Task</button>
      </form>
      {Object.keys(tasksByDate).sort().map((date) => (
        <div key={date}>
          <h2 className="date-heading">{date}</h2>
          <ul>
            {tasksByDate[date].map((task) => (
              <TaskItem key={task.id} 
                        task={task} 
                        onComplete={handleComplete} 
                        onDelete={handleDelete} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default App;
