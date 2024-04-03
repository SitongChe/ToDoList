import React, { useState } from 'react';
import { SwipeableListItem } from '@sandstreamdev/react-swipeable-list';

const RecycledTaskList = ({ tasks, onRestore }) => {
  // 假设添加了状态来追踪当前滑动的任务ID
  const [swipingTaskId, setSwipingTaskId] = useState(null);

  return (
    <div style={{ borderTop: '1px solid #ccc', marginTop: '20px' }}>
      <h3>Recycle Bin</h3>
      {tasks.map(task => (
        <SwipeableListItem
          key={task.id}
          swipeRight={{
            content: <div></div>, // 实际的"恢复"操作反馈在组件内部处理
            action: () => onRestore(task.id)
          }}
          onSwipeStart={() => setSwipingTaskId(task.id)}
          onSwipeEnd={() => setSwipingTaskId(null)}
          threshold={0.15}
        >
          <div className="task-text" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            {/* 当前滑动的任务显示"恢复"提示 */}
            {swipingTaskId === task.id && (
              <div style={{ backgroundColor: 'green', color: 'white', fontSize: '13px', padding: '2px', marginRight: '10px' }}>
                Restore
              </div>
            )}
            {task.text}
          </div>
        </SwipeableListItem>
      ))}
    </div>
  );
};

export default RecycledTaskList;
