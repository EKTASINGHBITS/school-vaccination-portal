import React, { useState, useEffect } from 'react';
import AddStudent from './AddStudent';
import ViewStudents from './ViewStudents';
import AddDrive from './AddDrive';
import ViewDrives from './ViewDrives';
import ReportDashboard from './ReportDashboard';
import BulkUpload from './BulkUpload';
import VaccinationRecord from './VaccinationRecord';
import axios from 'axios';

function App() {
  const [editingStudent, setEditingStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [editingDrive, setEditingDrive] = useState(null);
  const [drives, setDrives] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/students');
      setStudents(res.data);
    } catch (error) {
      alert('Error fetching students: ' + error.message);
    }
  };

  const fetchDrives = async () => {
    try {
      const res = await axios.get('http://localhost:5000/drives');
      setDrives(res.data);
    } catch (error) {
      alert('Error fetching drives: ' + error.message);
    }
  };

  const handleDriveChange = () => {
    setRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    fetchStudents();
    fetchDrives();
  }, []);

  return (
    <div className="App">
      <h1>School Vaccination Portal</h1>

      {/* Student Section */}
      <h2>👩‍🎓 Student Management</h2>
      <AddStudent
        editingStudent={editingStudent}
        setEditingStudent={setEditingStudent}
        fetchStudents={fetchStudents}
      />
      <BulkUpload fetchStudents={fetchStudents} />
      <ViewStudents
        students={students}
        onEdit={setEditingStudent}
        fetchStudents={fetchStudents}
      />

      <hr />

      {/* Drive Section */}
      <h2>💉 Vaccination Drive Management</h2>
      <AddDrive
        editingDrive={editingDrive}
        setEditingDrive={setEditingDrive}
        fetchDrives={fetchDrives}
        onDriveChange={handleDriveChange}
      />
      <ViewDrives
        drives={drives}
        onEdit={setEditingDrive}
        fetchDrives={fetchDrives}
      />

      <hr />

      {/* Vaccination Records */}
      <h2>📋 Vaccination Records</h2>
      <VaccinationRecord />

      <hr />

      {/* Summary Dashboard */}
      {/* Header removed from here because it's inside ReportDashboard now */}
      <ReportDashboard refreshKey={refreshKey} />
    </div>
  );
}

export default App;
