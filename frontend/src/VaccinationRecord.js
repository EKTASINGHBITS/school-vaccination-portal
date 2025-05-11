import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function VaccinationRecord() {
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [vaccineName, setVaccineName] = useState('');
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [drives, setDrives] = useState([]);
  const [filterVaccine, setFilterVaccine] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const fetchRecords = async () => {
    try {
      const url = filterVaccine
        ? `http://localhost:5000/vaccination/records?vaccineName=${filterVaccine}`
        : `http://localhost:5000/vaccination/records`;
      const res = await axios.get(url);
      setRecords(res.data);
    } catch (err) {
      alert('Error fetching records: ' + err.message);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const studentRes = await axios.get('http://localhost:5000/students');
      setStudents(studentRes.data);
      const driveRes = await axios.get('http://localhost:5000/drives');
      setDrives(driveRes.data);
    } catch (err) {
      alert('Error loading dropdown data: ' + err.message);
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchDropdownData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterVaccine]);

  const handleSubmit = async () => {
    if (!studentId || !studentName || !vaccineName) {
      alert('Please fill all fields');
      return;
    }

    const selectedDrive = drives.find((d) => d.vaccineName === vaccineName);
    const selectedDate = selectedDrive ? selectedDrive.date : '';

    const duplicate = records.find(
      (r) => r.studentId === studentId && r.vaccineName === vaccineName
    );
    if (duplicate) {
      alert('This student is already vaccinated with this vaccine.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/vaccination/records', {
        studentId,
        studentName,
        vaccineName,
        vaccinationDate: selectedDate,
      });

      alert('Vaccination recorded!');
      setStudentId('');
      setStudentName('');
      setVaccineName('');
      fetchRecords();
    } catch (err) {
      alert('Error recording vaccination: ' + err.message);
    }
  };

  const handleStudentSelect = (e) => {
    const id = e.target.value;
    const selected = students.find((s) => s.studentId === id);
    if (selected) {
      setStudentId(selected.studentId);
      setStudentName(selected.name);
    } else {
      setStudentId('');
      setStudentName('');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/vaccination/records/${id}`);
      alert('Record deleted successfully');
      fetchRecords();
    } catch (err) {
      alert('Error deleting record: ' + err.message);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Student ID', 'Student Name', 'Vaccine Name', 'Vaccination Date'];
    const rows = records.map((record) => [
      record.studentId,
      record.studentName,
      record.vaccineName,
      new Date(record.vaccinationDate).toLocaleDateString(),
    ]);
    const csvContent = [headers, ...rows].map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'vaccination_records.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Vaccination Records', 14, 15);
    const tableColumn = ['Student ID', 'Student Name', 'Vaccine Name', 'Vaccination Date'];
    const tableRows = records.map((record) => [
      record.studentId,
      record.studentName,
      record.vaccineName,
      new Date(record.vaccinationDate).toLocaleDateString(),
    ]);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save('vaccination_records.pdf');
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(records.length / recordsPerPage);

  return (
    <div>
      <h3>Vaccination Records</h3>
      <h4>Record Vaccination</h4>

      <div style={{ margin: '10px 0' }}>
        <label>Student: </label>
        <select value={studentId} onChange={handleStudentSelect}>
          <option value="">Select Student</option>
          {students.map((s) => (
            <option key={s._id} value={s.studentId}>
              {s.name} (Class {s.studentClass})
            </option>
          ))}
        </select>
      </div>

      <div style={{ margin: '10px 0' }}>
        <label>Vaccine Drive: </label>
        <select value={vaccineName} onChange={(e) => setVaccineName(e.target.value)}>
          <option value="">Select Vaccine</option>
          {drives.map((d) => (
            <option key={d._id} value={d.vaccineName}>
              {d.vaccineName} ({new Date(d.date).toLocaleDateString()})
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleSubmit}>Record Vaccination</button>

      <div style={{ marginTop: '30px' }}>
        <label><strong>Filter by Vaccine:</strong> </label>
        <select value={filterVaccine} onChange={(e) => setFilterVaccine(e.target.value)}>
          <option value="">All Vaccines</option>
          {drives.map((d) => (
            <option key={d._id} value={d.vaccineName}>
              {d.vaccineName}
            </option>
          ))}
        </select>

        <button style={{ marginLeft: '10px' }} onClick={handleExportCSV}>Export to CSV</button>
        <button style={{ marginLeft: '10px' }} onClick={handleExportPDF}>Download as PDF</button>
      </div>

      <h4 style={{ marginTop: '20px' }}>All Vaccination Records</h4>
      {currentRecords.length === 0 ? (
        <p>No vaccination records found.</p>
      ) : (
        <>
          <table border="1" cellPadding="8" style={{ marginTop: '10px', width: '100%' }}>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Vaccine Name</th>
                <th>Vaccination Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((record, index) => (
                <tr key={index}>
                  <td>{record.studentId}</td>
                  <td>{record.studentName}</td>
                  <td>{record.vaccineName}</td>
                  <td>{new Date(record.vaccinationDate).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleDelete(record._id)} style={{ color: 'red' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '10px' }}>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                style={{
                  marginRight: '5px',
                  backgroundColor: currentPage === index + 1 ? '#ddd' : 'white',
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default VaccinationRecord;
