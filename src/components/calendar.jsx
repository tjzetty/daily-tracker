import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, subWeeks, addWeeks } from 'date-fns';

const MyTable = () => {
  const [cellColors, setCellColors] = useState(Array(7 * 3).fill('')); // Initialize cell colors as an array of empty strings
  const [startOfWeekDate, setStartOfWeekDate] = useState(startOfWeek(new Date())); // Calculate the start date of the current week

  const handleClick = (index) => {
    const updatedColors = [...cellColors]; // Create a copy of cellColors array
    updatedColors[index] = updatedColors[index] === 'green' ? "" : 'green'; // Set the clicked cell's color to green
    setCellColors(updatedColors); // Update the state with the new array of colors
  };

  const tableStyle = {
    borderCollapse: 'collapse',
    borderRadius: '8px', // Add border radius to the table
    marginLeft: '0.5em',
    marginRight: '0.5em',
  };

  const cellStyle = {
    height: '3em',
    width: '3em',
    border: '1px solid white', // Add a border to each cell
  };

  const headerCellStyle = {
    fontWeight: 'bold',
  };

  const daysOfWeek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

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
              <th key={index} style={headerCellStyle}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(3)].map((_, rowIndex) => (
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
          ))}
        </tbody>
        <tfoot>
          <tr>
            {[...Array(7)].map((_, colIndex) => {
              const date = addDays(startOfWeekDate, colIndex);
              const dayOfMonth = format(date, 'd');
              return (
                <td key={colIndex}>{dayOfMonth}</td>
              );
            })}
          </tr>
        </tfoot>
      </table>

      <div>
        <button onClick={previousWeek}>{'<'}</button>
        <button onClick={nextWeek}>{'>'}</button>
      </div>
    </div>
  );
};

export default MyTable;
