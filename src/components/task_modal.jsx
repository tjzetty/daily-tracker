import React, { useState } from 'react';

const TaskModal = ({ isOpen, onClose, onTaskCreate }) => {
  const [taskName, setTaskName] = useState('');
  const [timesPerWeek, setTimesPerWeek] = useState('');

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
    const task = {
      name: taskName,
      timesPerWeek: parseInt(timesPerWeek, 10),
    };
    onTaskCreate(task);
    setTaskName('');
    setTimesPerWeek('');
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal" style={modalStyle}>
      <div className="modal-content">
        <h2>Create Task</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Task Name:
            <input type="text" value={taskName} onChange={handleTaskNameChange} />
          </label>
          <label>
            Times/Week:
            <input
              type="number"
              value={timesPerWeek}
              onChange={handleTimesPerWeekChange}
              min="0"
              max="7"
            />
          </label>
          <button type="submit">Create</button>
          <button type="button" onClick={onClose}>Cancel</button>
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
