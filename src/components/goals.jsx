const Goals = ({ tasks }) => {

  const checksSum = tasks.reduce((sum, task) => sum + task.checks, 0);

  const tableStyle = {
    borderCollapse: 'collapse',
    borderRadius: '8px', // Add border radius to the table
  };

  const cellStyle = {
    height: 'calc(3em + 10px)',
    minWidth: '3em',
    border: '1px solid white', // Add a border to each cell
  };

  const headerCellStyle = {
    fontWeight: 'bold',
    height: 'calc(2em + 15px)',
  };

  return (
    <div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={headerCellStyle}>Goals</th>
            <th style={headerCellStyle}>Total</th>
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
                <td style={cellStyle}>{task.checks}</td>
              </tr>
            ))
          )}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td>{checksSum}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default Goals;
