function PatientTable({ data }) {
  if (!data || data.length === 0) {
    return <p>No results found.</p>;
  }

  return (
    <table className="w-full border-collapse border">
      <thead>
        <tr>
          {Object.keys(data[0]).map((key) => (
            <th key={key} className="border p-2">
              {key}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {Object.values(row).map((value, i) => (
              <td key={i} className="border p-2">
                {value}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PatientTable;
