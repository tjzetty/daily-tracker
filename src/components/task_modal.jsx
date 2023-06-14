import React, { useState } from 'react';

const TaskModal = ({ isOpen, onClose, onTaskCreate }) => {
  const [taskName, setTaskName] = useState('');
  const [timesPerWeek, setTimesPerWeek] = useState('');

  const handleTaskNameChange = (event) => {
    setTaskName(event.target.value);
  };

  const handleTimesPerWeekChange = (event) => {
    setTimesPerWeek(event.target.value);
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
    <div className="modal">
      <div className="modal-content">
        <h2>Create Task</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Task Name:
            <input type="text" value={taskName} onChange={handleTaskNameChange} />
          </label>
          <label>
            Times/Week:
            <input type="number" value={timesPerWeek} onChange={handleTimesPerWeekChange} />
          </label>
          <button type="submit">Create</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
