import React, { useState } from 'react';
import TaskModal from './task_modal';

const Tasks = ({ tasks, setTasks }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTaskCreate = (task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
    setIsModalOpen(false);
  };

  const tableStyle = {
    borderCollapse: 'collapse',
    borderRadius: '8px', // Add border radius to the table
  };

  const cellStyle = {
    height: '3em',
    minWidth: '3em',
    border: '1px solid white', // Add a border to each cell
  };

  const headerCellStyle = {
    fontWeight: 'bold',
  };

  return (
    <div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={headerCellStyle}>Tasks</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td style={cellStyle}>No tasks</td>
            </tr>
          ) : (
            tasks.map((task, index) => (
              <tr key={index}>
                <td style={cellStyle}>{task.name}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <button onClick={() => setIsModalOpen(true)}>Create Task</button>
      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onTaskCreate={handleTaskCreate} />
    </div>
  );
};

export default Tasks;
