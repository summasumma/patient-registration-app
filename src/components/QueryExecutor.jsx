import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import PatientTable from "./PatientTable";
import { db } from "../utils/pgliteConfig";

function QueryExecutor() {
  const [query, setQuery] = useState("SELECT * FROM patients;");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const executeQuery = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await db.query(query);
      setResults(res.rows || []);
    } catch (err) {
      setError(err.message);
      setResults([]);
      toast.error("Query execution failed");
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    executeQuery();
  }, [executeQuery]);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Query Patient Records
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SQL Query
          </label>
          <textarea
            value={query}
            onChange={handleQueryChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="4"
            placeholder="Enter your SQL query here..."
          ></textarea>
        </div>

        <button
          onClick={executeQuery}
          disabled={isLoading}
          className={`px-4 py-2 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isLoading
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isLoading ? "Executing..." : "Execute Query"}
        </button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <PatientTable data={results} />
          )}
        </div>
      </div>
    </div>
  );
}

export default QueryExecutor;