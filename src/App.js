import React, { useState, useEffect } from 'react';
import TaskItem from './TaskItem'; // 确保正确导入 TaskItem 组件
import RecycledTaskList from './RecycledTaskList'; // 回收站任务列表组件
import './App.css';

function App() {
  const [taskText, setTaskText] = useState('');
  const [tasks, setTasks] = useState([]);
  const [recycledTasks, setRecycledTasks] = useState([]); // 回收站中的任务

  // 同步ToDo项到DynamoDB
  const syncToDynamoDB = () => {
    tasks.forEach((task) => {
      // 假设每个todo项都是一个对象，有id和content属性
      fetch('/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: task.id, text: task.text, completed: task.completed }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(data => {
        console.log('ToDo synced:', data);
      })
      .catch(error => {
        console.error('Error syncing todo:', error);
      });
    });
  };
  
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    const storedRecycledTasks = localStorage.getItem('recycledTasks');
    if (storedRecycledTasks) {
      setRecycledTasks(JSON.parse(storedRecycledTasks));
    }
  }, []);

  const saveTasks = (newTasks) => {
    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  const saveToRecycleBin = (recycledTasks) => {
    localStorage.setItem('recycledTasks', JSON.stringify(recycledTasks));
  };


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
    saveTasks([newTask, ...tasks]);
    setTaskText('');
  };

  const handleComplete = (id) => {
    saveTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const handleDelete = (taskId) => {
    const newTasks = tasks.filter(task => task.id !== taskId);
    const recycledTask = tasks.find(task => task.id === taskId);
    //setTasks(newTasks);
    saveTasks(newTasks);
    //setRecycledTasks([...recycledTasks, recycledTask]); 
    const updatedRecycledTasks = [...recycledTasks, recycledTask];
    setRecycledTasks(updatedRecycledTasks);
    saveToRecycleBin(updatedRecycledTasks); // 更新LocalStorage中的回收站数据
  };

    // 从回收站恢复任务
    const handleRestore = (taskId) => {
      const newRecycledTasks = recycledTasks.filter(task => task.id !== taskId);
      const restoredTask = recycledTasks.find(task => task.id === taskId);
      setTasks([...tasks, restoredTask]);
      saveTasks([...tasks, restoredTask]);
      setRecycledTasks(newRecycledTasks);
      
      saveToRecycleBin(newRecycledTasks); // 更新LocalStorage中的回收站数据
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
        <button onClick={syncToDynamoDB}>Sync To DynamoDB</button>
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
      <RecycledTaskList tasks={recycledTasks} onRestore={handleRestore} />
    </div>
  );
}

export default App;
