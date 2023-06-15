const Goals = ({ tasks }) => {

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
            <th style={headerCellStyle}>Goals</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td style={cellStyle}></td>
            </tr>
          ) : (
            tasks.map((task, index) => (
              <tr key={index}>
                <td style={cellStyle}>{task.timesPerWeek}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Goals;
