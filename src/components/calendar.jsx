import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, subWeeks, addWeeks, differenceInDays, startOfDay, isSameDay } from 'date-fns';

const Calendar = ({ analytics, tasks, dbcal, user, tasksRef, calendarRef }) => {
  const [cellColors, setCellColors] = useState(Array(7 * 3).fill('')); // Initialize cell colors as an array of empty strings
  const [startOfWeekDate, setStartOfWeekDate] = useState(startOfWeek(new Date())); // Calculate the start date of the current week

  useEffect(() => {
    if (dbcal) {
      const updatedColors = Array(7 * 3).fill('');
      dbcal.forEach((doc) => {
        const day = doc.day.toDate();
        const diffInDays = differenceInDays(day, startOfWeekDate);

        if (diffInDays >= 0 && diffInDays < 7) {
          const colIndex = diffInDays;

          doc.tids.forEach((tid) => {
            const rowIndex = tasks.findIndex((task) => task.id === tid);
            if (rowIndex !== -1) {
              const cellIndex = rowIndex * 7 + colIndex;
              updatedColors[cellIndex] = '#26a641';
            }
          });
        }
      });

      setCellColors(updatedColors);
      updateMissedTasks(updatedColors);
    }
  }, [dbcal, tasks, startOfWeekDate]);

  const updateMissedTasks = (greenCellColors) => {
    const updatedColors = [...greenCellColors];

    tasks.forEach((task, rowIndex) => {
      const createdAt = task.createdAt ? task.createdAt.toDate() : new Date(); // Handle case of new task

      for (let colIndex = 0; colIndex < 7; colIndex++) {
        const cellIndex = rowIndex * 7 + colIndex;
        const currentDate = addDays(startOfWeekDate, colIndex);

        if (currentDate > createdAt && updatedColors[cellIndex] !== '#26a641' && currentDate < startOfDay(new Date())) {
          updatedColors[cellIndex] = '#e44949';
        }
      }
    });

    setCellColors(updatedColors);;
  };

  const updateCalendarDocument = async (user, calendarRef, docDate, tid) => {
    const matchingDoc = dbcal.find((doc) => {
      const docDateObj = doc.day.toDate();
      return (
        doc.uid === user &&
        docDateObj.getFullYear() === docDate.getFullYear() &&
        docDateObj.getMonth() === docDate.getMonth() &&
        docDateObj.getDate() === docDate.getDate()
      );
    });
  
    if (!matchingDoc) {
      // Document doesn't exist, create a new one
      await calendarRef.add({
        uid: user,
        day: docDate,
        tids: [tid],
      });
    } else {
      // Document exists, update the tids field
      const docRef = calendarRef.doc(matchingDoc.id);
      const updatedTids = [...matchingDoc.tids];
  
      if (updatedTids.includes(tid)) {
        // Remove tid from the list
        const tidIndex = updatedTids.indexOf(tid);
        updatedTids.splice(tidIndex, 1);
      } else {
        // Add tid to the list
        updatedTids.push(tid);
      }
  
      await docRef.update({ tids: updatedTids });
    }
  };

  const handleClick = async (index) => {
    const updatedColors = [...cellColors]; // Create a copy of cellColors array
    const wasGreen = updatedColors[index] === '#26a641';
    updatedColors[index] = wasGreen ? '' : '#26a641'; // Toggle the clicked cell's color
  
    const colIndex = index % 7;
    const rowIndex = Math.floor(index / 7);
    const date = addDays(startOfWeekDate, colIndex);
    const docDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const tid = tasks[rowIndex].id;

    let newChecks = wasGreen ? -1 : 1;
    newChecks = newChecks + tasks[rowIndex].checks;
  
    try {
      await updateCalendarDocument(user, calendarRef, docDate, tid);
      await tasksRef.doc(tid).update({checks: newChecks});
      setCellColors(updatedColors); // Update the state with the new array of colors
    } catch (error) {
      console.error(`Error in updating task completion: ${error}`);
    } finally {
      analytics.logEvent('taskUpdated', {tid: tid, check: wasGreen ? 'unchecked' : 'checked'});
    }
  };

  const tableStyle = {
    borderCollapse: 'separate',
    borderSpacing: '10px',
    borderRadius: '8px', // Add border radius to the table
    marginLeft: '0.5em',
    marginRight: '0.5em',
    marginBottom: '0.5em',
  };

  const isCurrentDateColumn = (colIndex) => {
    const currentDate = addDays(startOfWeekDate, colIndex);
    const today = startOfDay(new Date());
    return isSameDay(currentDate, today);
  };

  // CSS styles for the current date column
  const currentDateColumnStyle = {
    position: 'relative',
    zIndex: 1,
  };

  const currentDateGlowStyle = {
    content: '',
    position: 'absolute',
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    background: 'skyblue',
    borderRadius: '8px',
    opacity: '0.7',
    zIndex: '-1',
  };

  const getHeaderCellStyle = (colIndex) => {
    if (isCurrentDateColumn(colIndex)) {
      return {
        ...headerCellStyle,
        ...currentDateColumnStyle,
      };
    }
    return headerCellStyle;
  };

  const cellStyle = {
    height: '3em',
    width: '3em',
    border: '0.5px solid white', // Add a border to each cell
    borderRadius: '10%',
  };

  const emptyCellStyle = {
    height: '2em',
    width: '3em',
    maxWidth: '3em',
    border: '0.5px solid rgba(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  };

  const headerCellStyle = {
    fontWeight: 'bold',
    height: '2em',
  };

  const navButtonStyle = {
    backgroundColor: 'rgba(255, 255, 255, .3)',
    color: 'white',
    width: '2em',
    height: '2em',
    fontSize: 'calc(10px + 2vmin)',
    fontWeight: 'bold',
    borderRadius: '8px',
    boxShadow: '0px 8px 15px rgba(255, 255, 255, 0.2)',
  };
  

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const previousWeek = () => {
    const newStartOfWeekDate = subWeeks(startOfWeekDate, 1);
    setCellColors(Array(7 * 3).fill(''));
    setStartOfWeekDate(newStartOfWeekDate);
  };

  const nextWeek = () => {
    const newStartOfWeekDate = addWeeks(startOfWeekDate, 1);
    setCellColors(Array(7 * 3).fill(''));
    setStartOfWeekDate(newStartOfWeekDate);
  };

  useEffect(() => {
    const currentDate = new Date();
    const currentWeekStart = startOfWeek(currentDate);
    setStartOfWeekDate(currentWeekStart);
  }, []);

  return (
    <div>
      <table style={tableStyle}>
        <thead>
          <tr>
            {daysOfWeek.map((day, index) => (
              <th
                key={index}
                style={getHeaderCellStyle(index)}
              >
                {isCurrentDateColumn(index) && <span style={currentDateGlowStyle}></span>}
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
              <tr>
                {[...Array(7)].map((_, index) => {
                return (
                  <td
                    key={index}
                    style={{
                      ...emptyCellStyle,
                      ...(index === 0 && { borderLeft: '1px solid white' }),
                      ...(index === 6 && { borderRight: '1px solid white' }),
                    }}
                  >
                    {index === 0 && 'Create your first task today!'}
                  </td>
                );
              })}
              </tr>
          ) : ([...Array(tasks.length)].map((_, rowIndex) => (
            <tr key={rowIndex}>
              {[...Array(7)].map((_, colIndex) => {
                const cellIndex = rowIndex * 7 + colIndex; // Calculate the index of the cell in the flat array
                const cellColor = cellColors[cellIndex];
                const cellStyleWithColor = {
                  ...cellStyle,
                  backgroundColor: cellColor,
                  cursor: 'pointer' // Add cursor pointer to indicate clickable cells
                };
                return (
                  <td
                    key={colIndex}
                    style={cellStyleWithColor}
                    onClick={() => handleClick(cellIndex)}
                  />
                );
              })}
            </tr>
          )))}
        </tbody>
        <tfoot>
          <tr>
            {[...Array(7)].map((_, colIndex) => {
              const date = addDays(startOfWeekDate, colIndex);
              const dayOfMonth = format(date, 'd');
              return (
                <td key={colIndex} style={getHeaderCellStyle(colIndex)}>
                  {isCurrentDateColumn(colIndex) && <span style={currentDateGlowStyle}></span>}
                  {dayOfMonth}
                </td>
              );
            })}
          </tr>
        </tfoot>
      </table>

      <div>
        <button style={navButtonStyle} onClick={previousWeek}>{'<'}</button>
        <button style={navButtonStyle} onClick={nextWeek}>{'>'}</button>
      </div>
    </div>
  );
};

export default Calendar;
