import React, { useState } from 'react';
import TaskModal from './task_modal';

const Tasks = ({ analytics, tasks, user, tasksRef, firebase }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleTaskCreate = (task) => {
    const createTask = async () => {  
      try {
        await tasksRef.add({
          name: task.name,
          timesPerWeek: task.timesPerWeek === NaN ? 0 : task.timesPerWeek,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          checks: 0,
          uid: user,
        })
      } catch (error) {
        console.error('Error creating task: ', error);
      } finally {
        analytics.logEvent('createdTask', {tid: task.id});
      }
    };
    createTask();
    setIsCreateModalOpen(false);
  };

  const handleDeleteTask = (task) => {
    
    const deleteTask = async () => {
      const deletedName = task.name;
      try {
        await tasksRef.doc(task.id).delete();
        console.log(`Task, ${deletedName}, deleted successfully!`);
      } catch (error) {
        console.error('Error deleting task:', error);
      } finally {
        analytics.logEvent('deletedTask', {tid: task.id});
      }
    };
    deleteTask();
  };

  const handleEditTask = async (editedTask) => {
    try {
      console.log(editedTask.id);
      await tasksRef.doc(editedTask.id).update({
        name: editedTask.name,
        timesPerWeek: editedTask.timesPerWeek,
      });
    } catch (error) {
      console.error('Error editing task:', error);
    } finally {
      analytics.logEvent('editedTask', {tid: editedTask.id});
    }
    setIsEditModalOpen(false);
  };

  const tableStyle = {
    paddingTop: '10px',
    borderCollapse: 'collapse',
    borderRadius: '8px',
  };

  const cellStyle = {
    position: 'relative',
    height: 'calc(3em + 10px)',
    minWidth: '3em',
    border: '1px solid white',
    cursor: 'default',
  };

  const headerCellStyle = {
    fontWeight: 'bold',
    height: 'calc(2em + 15px)',
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

  const createStyle = {
    marginTop: '0.5em',
    height: 'calc(3em + 10px)',
    minWidth: '3em',
    backgroundColor: 'rgba(255, 255, 255, .3)',
    color: 'white',
    fontSize: 'calc(10px + 2vmin)',
    borderRadius: '8px',
    cursor: 'pointer',
    boxShadow: '0px 8px 15px rgba(255, 255, 255, 0.2)',
  }

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
                        onClick={() => handleDeleteTask(task)}
                      >
                        X
                      </button>
                      <button
                        style={{ ...buttonStyle, top: '65%', backgroundColor: 'orange' }}
                        onClick={() => setIsEditModalOpen(true)}
                      >
                        ~
                      </button>
                    </div>
                  )}
                </td>
                <TaskModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onTaskSubmit={handleEditTask} submitString="Edit" task={task} />
              </tr>
            ))
          )}
        </tbody>
      </table>
      <button style={createStyle} onClick={() => setIsCreateModalOpen(true)}>Create<br />Task</button>
      <TaskModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onTaskSubmit={handleTaskCreate} submitString="Create" />
    </div>
  );
};

export default Tasks;
