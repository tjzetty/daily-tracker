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

  const inputStyle = {
    height: '100%',
  };

  if (!isOpen) {
    return null;
  }

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: 'calc(10px + 2vmin)',
    zIndex: '3',
    backgroundColor: '#333333',
    padding: '20px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
  };
  
  const modalContentStyle = {
    display: 'flex',
    flexDirection: 'column',
  };
  
  const formStyle = {
    display: 'flex',
    flex: '7',
    flexDirection: 'column',
    alignItems: 'center',
  };
  
  const rowStyle = {
    display: 'flex',
    width: '100%',
  };
  
  const labelContainer = {
    flex: '6',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    textAlign: 'left',
  };
  
  const inputContainer = {
    flex: '4',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };
  
  return (
    <div style={modalStyle}>
      <div style={modalContentStyle}>
        <h2 style={{flex: '3',}}>{submitString} Task</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          {submitString === 'Delete' ? (
            <>
              <p>Do you really want <br /> to delete this task?</p>
              <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <button type="button" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit">{submitString}</button>
              </div>
            </>
          ) : (
            <>
              <div style={rowStyle}>
                <div style={{ ...labelContainer}}>
                  <label>Task Name:</label>
                </div>
                <div style={{ ...inputContainer}}>
                  <input style={inputStyle} type="text" value={taskName} onChange={handleTaskNameChange} />
                </div>
              </div>
              <div style={rowStyle}>
                <div style={{ ...labelContainer, flex: '6' }}>
                  <label>Weekly Goal:</label>
                </div>
                <div style={{ ...inputContainer, flex: '4' }}>
                  <input
                    style={inputStyle}
                    type="number"
                    value={timesPerWeek}
                    onChange={handleTimesPerWeekChange}
                    min="0"
                    max="7"
                  />
                </div>
              </div>
              <div>
                <button type="button" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit">{submitString}</button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
