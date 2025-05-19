import { useState, useEffect } from "react";
import PatientRegistrationForm from "./components/PatientRegistrationForm";
import QueryExecutor from "./components/QueryExecutor";
import { db } from "./utils/pgliteConfig";

const channel = new BroadcastChannel("patient_data_channel");

function App() {
  const [dataChanged, setDataChanged] = useState(0);

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
            address TEXT
          );
        `);
      } catch (error) {
        console.error("Database initialization failed:", error);
      }
    }
    initializeDatabase();
  }, []);

  useEffect(() => {
    const handleMessage = (e) => {
      console.log("BroadcastChannel message received:", e.data); // Debug log
      if (e.data.type === "data_updated") {
        setDataChanged((prev) => prev + 1);
      }
    };
    channel.addEventListener("message", handleMessage);
    return () => channel.removeEventListener("message", handleMessage);
  }, []);

  const handleDataChange = () => {
    console.log("Data change triggered"); // Debug log
    setDataChanged((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Patient Registration App</h1>
      <PatientRegistrationForm onDataChange={handleDataChange} />
      <QueryExecutor key={dataChanged} />
    </div>
  );
}

export default App;
