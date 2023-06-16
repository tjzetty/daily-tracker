import React, { useState } from 'react';
import TaskModal from './task_modal';

const Tasks = ({ tasks, setTasks, user, db, firebase }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleTaskCreate = (task) => {
    const createTask = async () => {  
      await db.add({
        name: task.name,
        timesPerWeek: task.timesPerWeek,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid: user,
      })
    }
    createTask();
    // setTasks((prevTasks) => [...prevTasks, task]);
    setIsModalOpen(false);
  };

  const handleDeleteTask = (index) => {
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];
      updatedTasks.splice(index, 1);
      return updatedTasks;
    });
  };

  const handleRenameTask = (index) => {
    const newName = prompt('Enter a new name for the task:');
    if (newName) {
      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks];
        updatedTasks[index].name = newName;
        return updatedTasks;
      });
    }
  };

  const tableStyle = {
    borderCollapse: 'collapse',
    borderRadius: '8px',
  };

  const cellStyle = {
    position: 'relative',
    height: '3em',
    minWidth: '3em',
    border: '1px solid white',
    cursor: 'default',
  };

  const headerCellStyle = {
    fontWeight: 'bold',
  };

  const buttonStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: '1',
    display: 'block', // Updated to 'block' instead of 'none'
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    textAlign: 'center',
    lineHeight: '24px',
    cursor: 'pointer',
  };

  const handleCellHover = (index) => {
    setHoveredIndex(index);
  };

  const handleCellLeave = () => {
    setHoveredIndex(null);
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
                <td
                  style={cellStyle}
                  onMouseEnter={() => handleCellHover(index)}
                  onMouseLeave={handleCellLeave}
                >
                  {task.name}
                  {hoveredIndex === index && (
                    <div>
                      <button
                        style={{ ...buttonStyle, top: '35%', backgroundColor: 'red' }}
                        onClick={() => handleDeleteTask(index)}
                      >
                        X
                      </button>
                      <button
                        style={{ ...buttonStyle, top: '65%', backgroundColor: 'orange' }}
                        onClick={() => handleRenameTask(index)}
                      >
                        ~
                      </button>
                    </div>
                  )}
                </td>
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
