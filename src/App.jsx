import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import PatientRegistrationForm from "./components/PatientRegistrationForm";
import QueryExecutor from "./components/QueryExecutor";
import { db } from "./utils/pgliteConfig";

const channel = new BroadcastChannel("patient_data_channel");

function App() {
  const [dataChanged, setDataChanged] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initializeDatabase() {
      try {
        await db.query(`
          CREATE TABLE IF NOT EXISTS patients (
            id SERIAL PRIMARY KEY,
            full_name TEXT NOT NULL,
            age INTEGER NOT NULL,
            gender TEXT NOT NULL,
            contact_info TEXT,
            address TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `);
      } catch (error) {
        console.error("Database initialization failed:", error);
      } finally {
        setIsLoading(false);
      }
    }
    initializeDatabase();
  }, []);

  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data.type === "data_updated") {
        setDataChanged((prev) => prev + 1);
      }
    };
    channel.addEventListener("message", handleMessage);
    return () => channel.removeEventListener("message", handleMessage);
  }, []);

  const handleDataChange = () => {
    setDataChanged((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Patient Registration App
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PatientRegistrationForm onDataChange={handleDataChange} />
          <QueryExecutor key={dataChanged} />
        </div>
      </div>
    </div>
  );
}

export default App;