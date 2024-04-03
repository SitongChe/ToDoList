import React, { useState } from 'react';
import { SwipeableListItem } from '@sandstreamdev/react-swipeable-list';
import '@sandstreamdev/react-swipeable-list/dist/styles.css';

const TaskItem = ({ task, onComplete, onDelete }) => {
  const [isSwiping, setIsSwiping] = useState(false); // 用于跟踪是否正在滑动
  const completedStyle = task.completed ? { textDecoration: 'line-through' } : {};

  // 处理滑动删除动作
  const handleSwipeAction = () => {
    setIsSwiping(false); // 结束滑动时重置状态
    onDelete(task.id);
  };

  return (
    <SwipeableListItem
      swipeLeft={{
        content: <div></div>, // 不在这里定义滑动提示内容
        action: handleSwipeAction
      }}
      onSwipeProgress={(progress) => setIsSwiping(progress > 2)} // 当滑动进度超过25%时显示提示
      threshold={0.15}
    >
      {/* 使用 Flexbox 来确保内容（包括删除提示和文本）居中 */}
      <div className="task-text" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', ...completedStyle }}
      onClick={() => onComplete(task.id)}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* 根据 isSwiping 的状态动态显示删除提示 */}
          {isSwiping && <div style={{backgroundColor: 'red', color: 'white', fontSize: '13px', padding: '2px', marginRight: '10px'}}>Delete</div>}
          <div> {task.text}</div>
        </div>
      </div>
    </SwipeableListItem>
  );
};

export default TaskItem;
