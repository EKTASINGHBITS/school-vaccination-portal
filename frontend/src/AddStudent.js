import React, { useEffect, useState } from 'react';
import axios from 'axios';

const classOptions = Array.from({ length: 12 }, (_, i) => `${i + 1}`);

function AddStudent({ editingStudent, setEditingStudent, fetchStudents }) {
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    age: '',
    studentClass: '',
    vaccinated: false,
  });

  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudentsList();
    if (editingStudent) {
      setFormData(editingStudent);
    }
  }, [editingStudent]);

  const fetchStudentsList = async () => {
    try {
      const res = await axios.get('http://localhost:5000/students');
      setStudents(res.data);
    } catch (error) {
      alert('Error fetching students: ' + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim and validate
    const trimmedId = formData.studentId.trim();
    const trimmedName = formData.name.trim();
    const trimmedClass = formData.studentClass.trim();
    const ageValue = parseInt(formData.age);

    if (!trimmedId || !trimmedName || !trimmedClass || isNaN(ageValue)) {
      alert('All fields are required and must be valid.');
      return;
    }

    if (ageValue < 3 || ageValue > 25) {
      alert('Age must be between 3 and 25.');
      return;
    }

    const isDuplicate = students.some(
      (s) =>
        s.studentId === trimmedId &&
        (!editingStudent || s._id !== editingStudent._id)
    );

    if (isDuplicate) {
      alert('Student ID already exists. Please use a unique one.');
      return;
    }

    const payload = {
      ...formData,
      studentId: trimmedId,
      name: trimmedName,
      age: ageValue,
      studentClass: trimmedClass,
    };

    try {
      if (editingStudent) {
        await axios.put(`http://localhost:5000/students/${editingStudent._id}`, payload);
        alert('Student updated successfully!');
      } else {
        await axios.post('http://localhost:5000/students', payload);
        alert('Student added successfully!');
      }

      setFormData({ studentId: '', name: '', age: '', studentClass: '', vaccinated: false });
      setEditingStudent(null);
      fetchStudents();
      fetchStudentsList();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{editingStudent ? 'Edit Student' : 'Add Student'}</h2>

      <input
        type="text"
        name="studentId"
        placeholder="Student ID"
        value={formData.studentId}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="age"
        placeholder="Age"
        value={formData.age}
        onChange={handleChange}
        required
      />

      <select
        name="studentClass"
        value={formData.studentClass}
        onChange={handleChange}
        required
      >
        <option value="">-- Select Class --</option>
        {classOptions.map((cls) => (
          <option key={cls} value={cls}>{`Class ${cls}`}</option>
        ))}
      </select>

      <label style={{ marginLeft: '10px' }}>
        Vaccinated:
        <input
          type="checkbox"
          name="vaccinated"
          checked={formData.vaccinated}
          onChange={handleChange}
        />
      </label>

      <button type="submit" style={{ marginLeft: '10px' }}>
        {editingStudent ? 'Update Student' : 'Add Student'}
      </button>
    </form>
  );
}

export default AddStudent;
