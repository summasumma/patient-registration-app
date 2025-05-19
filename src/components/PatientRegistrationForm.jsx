import { useState, useCallback } from "react";
import { db } from "../utils/pgliteConfig";
import debounce from "lodash.debounce";

const channel = new BroadcastChannel("patient_data_channel");

function PatientRegistrationForm({ onDataChange }) {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    contactInfo: "",
    address: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.age || isNaN(formData.age) || formData.age <= 0)
      newErrors.age = "Valid age is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    return newErrors;
  };

  const debouncedSetFormData = useCallback(
    debounce((newData) => {
      console.log("Updating formData:", newData); // Debug log
      setFormData(newData);
    }, 300),
    []
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    debouncedSetFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      console.log("Submitting to PGlite:", formData); // Debug log
      await db.query(
        `
        INSERT INTO patients (full_name, age, gender, contact_info, address)
        VALUES ($1, $2, $3, $4, $5)
      `,
        [
          formData.fullName,
          parseInt(formData.age),
          formData.gender,
          formData.contactInfo,
          formData.address,
        ]
      );
      setFormData({
        fullName: "",
        age: "",
        gender: "",
        contactInfo: "",
        address: "",
      });
      setErrors({});
      onDataChange();
      channel.postMessage({ type: "data_updated" });
      alert("Patient registered successfully!");
    } catch (error) {
      console.error("Error saving patient:", error);
      alert("Error registering patient.");
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Register Patient</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.fullName && <p className="text-red-500">{errors.fullName}</p>}
        </div>
        <div>
          <label className="block">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {errors.age && <p className="text-red-500">{errors.age}</p>}
        </div>
        <div>
          <label className="block">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <p className="text-red-500">{errors.gender}</p>}
        </div>
        <div>
          <label className="block">Contact Information</label>
          <input
            type="text"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          ></textarea>
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}

export default PatientRegistrationForm;
