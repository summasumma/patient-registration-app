/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import PatientTable from "./PatientTable";
import { db } from "../utils/pgliteConfig";

function QueryExecutor() {
  const [query, setQuery] = useState("SELECT * FROM patients");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const executeQuery = async () => {
    try {
      const res = await db.query(query);
      setResults(res.rows || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setResults([]);
    }
  };

  useEffect(() => {
    executeQuery();
  }, [executeQuery]);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleExecute = () => {
    executeQuery();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Query Patient Records</h2>
      <textarea
        value={query}
        onChange={handleQueryChange}
        className="w-full p-2 border rounded mb-4"
        rows="4"
      ></textarea>
      <button
        onClick={handleExecute}
        className="bg-green-500 text-white p-2 rounded mb-4"
      >
        Execute Query
      </button>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <PatientTable data={results} />
    </div>
  );
}

export default QueryExecutor;
