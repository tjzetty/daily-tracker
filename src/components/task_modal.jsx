import React, { useState } from 'react';

const TaskModal = ({ isOpen, onClose, onTaskSubmit, submitString, task }) => {
  const [taskName, setTaskName] = useState('');
  const [timesPerWeek, setTimesPerWeek] = useState('0');

  const handleTaskNameChange = (event) => {
    setTaskName(event.target.value);
  };

  const handleTimesPerWeekChange = (e) => {
    const value = e.target.value;
    if (/^[0-7]$/.test(value) || value === '') {
      setTimesPerWeek(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (submitString === "Delete") {
      onTaskSubmit(task);
      return;
    }
    let newTask = null;
    const timesPerWeekInt = parseInt(timesPerWeek, 10);
    if (task) {
      newTask = {
        name: (taskName !== task.name) && (taskName !== "") ? taskName : task.name,
        timesPerWeek: (timesPerWeekInt !== task.timesPerWeek) && (timesPerWeek !== "") ? timesPerWeekInt : task.timesPerWeek,
        id: task.id,
      };
    } else {
      newTask = {
        name: taskName,
        timesPerWeek: timesPerWeekInt,
      };
    }
    onTaskSubmit(newTask);
    setTaskName('');
    setTimesPerWeek('0');
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal" style={modalStyle}>
      <div className="modal-content">
        <h2>{submitString} Task</h2>
        <form onSubmit={handleSubmit}>
        { submitString === "Delete" ? (
        <>
          <p>Do you really want to delete this task?</p>
          <button type="submit">{submitString}</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </>
        ) : (
        <>
          <label>
            Task Name:
            <input type="text" value={taskName} onChange={handleTaskNameChange} />
          </label>
          <label>
            Weekly Goal:
            <input
              type="number"
              value={timesPerWeek}
              onChange={handleTimesPerWeekChange}
              min="0"
              max="7"
            />
          </label>
          <button type="submit">{submitString}</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </>
        )}
        </form>
      </div>
    </div>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: '3',
  backgroundColor: '#333333',
  padding: '20px',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
};

export default TaskModal;
