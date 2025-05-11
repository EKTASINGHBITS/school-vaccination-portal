import React, { useState, useMemo } from 'react';
import axios from 'axios';

function ViewStudents({ students, onEdit, fetchStudents }) {
  const [sortKey, setSortKey] = useState('');
  const [filterVaccinated, setFilterVaccinated] = useState('All');

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(`http://localhost:5000/students/${id}`);
        alert("Student deleted!");
        fetchStudents();
      } catch (error) {
        alert("Error deleting student: " + error.message);
      }
    }
  };

  const handleExportCSV = () => {
    const headers = ['Student ID', 'Name', 'Age', 'Class', 'Vaccinated'];
    const rows = filteredAndSorted.map((s) =>
      [s.studentId || 'N/A', s.name, s.age, s.studentClass, s.vaccinated ? 'Yes' : 'No']
    );
    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "students.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredAndSorted = useMemo(() => {
    let data = [...students];

    if (filterVaccinated === 'Yes') {
      data = data.filter((s) => s.vaccinated);
    } else if (filterVaccinated === 'No') {
      data = data.filter((s) => !s.vaccinated);
    }

    if (sortKey === 'name') {
      data.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortKey === 'age') {
      data.sort((a, b) => a.age - b.age);
    } else if (sortKey === 'class') {
      data.sort((a, b) => a.studentClass.localeCompare(b.studentClass));
    }

    return data;
  }, [students, sortKey, filterVaccinated]);

  return (
    <div>
      <h3>All Students</h3>

      <div style={{ marginBottom: '10px' }}>
        <label>Sort by: </label>
        <select onChange={(e) => setSortKey(e.target.value)} value={sortKey}>
          <option value="">-- Select --</option>
          <option value="name">Name</option>
          <option value="age">Age</option>
          <option value="class">Class</option>
        </select>

        <label style={{ marginLeft: '20px' }}>Filter by vaccination: </label>
        <select
          onChange={(e) => setFilterVaccinated(e.target.value)}
          value={filterVaccinated}
        >
          <option value="All">All</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        <button style={{ marginLeft: '20px' }} onClick={handleExportCSV}>
          Export to CSV
        </button>
      </div>

      <table
        border="1"
        cellPadding="5"
        style={{
          width: '100%',
          tableLayout: 'fixed',
          borderCollapse: 'collapse',
          textAlign: 'center',
          fontSize: '14px'
        }}
      >
        <thead>
          <tr>
            <th style={{ width: '10%' }}>Student ID</th>
            <th style={{ width: '20%' }}>Name</th>
            <th style={{ width: '10%' }}>Age</th>
            <th style={{ width: '15%' }}>Class</th>
            <th style={{ width: '15%' }}>Vaccinated</th>
            <th style={{ width: '20%' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSorted.map((student) => (
            <tr key={student._id}>
              <td>{student.studentId || 'N/A'}</td>
              <td>{student.name}</td>
              <td>{student.age}</td>
              <td>{student.studentClass}</td>
              <td>{student.vaccinated ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => onEdit(student)}>Edit</button>
                <button
                  onClick={() => handleDelete(student._id)}
                  style={{ marginLeft: '5px' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewStudents;
