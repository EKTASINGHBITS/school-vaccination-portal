import React, { useEffect, useState } from 'react';
import axios from 'axios';

const classOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString()); // Classes 1 to 12

function AddDrive({ editingDrive, setEditingDrive, fetchDrives, onDriveChange }) {
  const [formData, setFormData] = useState({
    vaccineName: '',
    date: '',
    numberOfDoses: '',
    applicableClasses: [],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingDrive) {
      setFormData({
        vaccineName: editingDrive.vaccineName || '',
        date: editingDrive.date ? editingDrive.date.split('T')[0] : '',
        numberOfDoses: editingDrive.doses || '',
        applicableClasses: editingDrive.classes || [],
      });
    }
  }, [editingDrive]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClassChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData((prev) => ({ ...prev, applicableClasses: selected }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.vaccineName.trim()) {
      newErrors.vaccineName = 'Vaccine name is required.';
    } else if (!/^[A-Za-z\s]+$/.test(formData.vaccineName)) {
      newErrors.vaccineName = 'Vaccine name should only contain letters and spaces.';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required.';
    } else {
      const today = new Date().toISOString().split('T')[0];
      if (formData.date < today) {
        newErrors.date = 'Date cannot be in the past.';
      }
    }

    if (!formData.numberOfDoses) {
      newErrors.numberOfDoses = 'Number of doses is required.';
    } else if (isNaN(formData.numberOfDoses) || parseInt(formData.numberOfDoses) < 1) {
      newErrors.numberOfDoses = 'Please enter a valid number (min 1).';
    }

    if (!formData.applicableClasses.length) {
      newErrors.applicableClasses = 'Please select at least one class.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = {
        vaccineName: formData.vaccineName,
        date: formData.date,
        doses: parseInt(formData.numberOfDoses),
        classes: formData.applicableClasses,
      };

      if (editingDrive) {
        await axios.put(`http://localhost:5000/drives/${editingDrive._id}`, payload);
        alert('Drive updated!');
      } else {
        await axios.post('http://localhost:5000/drives', payload);
        alert('Drive added!');
      }

      setFormData({ vaccineName: '', date: '', numberOfDoses: '', applicableClasses: [] });
      setEditingDrive(null);
      fetchDrives();
      if (onDriveChange) onDriveChange();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{editingDrive ? 'Edit Drive' : 'Add Vaccination Drive'}</h2>

      <input
        type="text"
        name="vaccineName"
        placeholder="Vaccine Name"
        value={formData.vaccineName}
        onChange={handleChange}
        required
      />
      {errors.vaccineName && <p style={{ color: 'red' }}>{errors.vaccineName}</p>}

      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />
      {errors.date && <p style={{ color: 'red' }}>{errors.date}</p>}

      <input
        type="number"
        name="numberOfDoses"
        placeholder="Number of Doses"
        value={formData.numberOfDoses}
        onChange={handleChange}
        min="1"
        required
      />
      {errors.numberOfDoses && <p style={{ color: 'red' }}>{errors.numberOfDoses}</p>}

      <label>Applicable Classes (hold Ctrl/Cmd to select multiple):</label>
      <select
        multiple
        value={formData.applicableClasses}
        onChange={handleClassChange}
        required
      >
        {classOptions.map(cls => (
          <option key={cls} value={cls}>{`Class ${cls}`}</option>
        ))}
      </select>
      {errors.applicableClasses && <p style={{ color: 'red' }}>{errors.applicableClasses}</p>}

      <br />
      <button type="submit">{editingDrive ? 'Update' : 'Add'} Drive</button>
    </form>
  );
}

export default AddDrive;
