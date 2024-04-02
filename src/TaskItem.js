import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';

function TaskItem({ task, onComplete, onDelete }) {
  const [isSwiping, setIsSwiping] = useState(false);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      onDelete(task.id);
      setIsSwiping(false);
    },
    onSwiping: () => setIsSwiping(true),
    onSwiped: () => setIsSwiping(false),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  // 仅当 isSwiping 为 true 时应用的样式
  const swipeStyle = isSwiping ? { backgroundColor: 'red', color: 'white', padding: '0 4px' } : {};

  return (
    <li {...handlers} onClick={() => onComplete(task.id)}
        style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
      {/* 将文本包装在 span 中，并应用条件样式 */}
      <span className="task-text" style={swipeStyle}>{task.text}</span>
    </li>
  );
}

export default TaskItem;
