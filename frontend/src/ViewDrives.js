import React, { useMemo, useState } from 'react';
import axios from 'axios';

function ViewDrives({ fetchDrives, drives, onEdit }) {
  const [sortKey, setSortKey] = useState('date');
  const [filterClass, setFilterClass] = useState('All');

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this drive?")) {
      try {
        await axios.delete(`http://localhost:5000/drives/${id}`);
        alert("Drive deleted!");
        fetchDrives();
      } catch (error) {
        alert("Error deleting drive: " + error.message);
      }
    }
  };

  const handleExportCSV = () => {
    const headers = ['Vaccine Name', 'Date', 'Doses', 'Applicable Classes'];
    const rows = filteredAndSorted.map(d =>
      [d.vaccineName, new Date(d.date).toLocaleDateString(), d.doses, d.classes.join(', ')]
    );
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "vaccination_drives.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const allClasses = useMemo(() => {
    const classSet = new Set();
    drives.forEach((d) => d.classes.forEach((cls) => classSet.add(cls)));
    return ['All', ...Array.from(classSet).sort((a, b) => parseInt(a) - parseInt(b))];
  }, [drives]);

  const filteredAndSorted = useMemo(() => {
    let data = [...drives];

    if (filterClass !== 'All') {
      data = data.filter((d) => d.classes.includes(filterClass));
    }

    if (sortKey === 'name') {
      data.sort((a, b) => a.vaccineName.localeCompare(b.vaccineName));
    } else if (sortKey === 'date') {
      data.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    return data;
  }, [drives, sortKey, filterClass]);

  return (
    <div>
      <h3>All Vaccination Drives</h3>

      <div style={{ marginBottom: '10px' }}>
        <label>Sort by: </label>
        <select onChange={(e) => setSortKey(e.target.value)} value={sortKey}>
          <option value="">-- Select --</option>
          <option value="name">Name</option>
          <option value="date">Date</option>
        </select>

        <label style={{ marginLeft: '20px' }}>Filter by Class: </label>
        <select onChange={(e) => setFilterClass(e.target.value)} value={filterClass}>
          {allClasses.map((cls) => (
            <option key={cls} value={cls}>
              {cls === 'All' ? 'All Classes' : `Class ${cls}`}
            </option>
          ))}
        </select>

        <button style={{ marginLeft: '20px' }} onClick={handleExportCSV}>
          Export to CSV
        </button>
      </div>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Vaccine Name</th>
            <th>Date</th>
            <th>Doses</th>
            <th>Applicable Classes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSorted.map((drive) => (
            <tr key={drive._id}>
              <td>{drive.vaccineName}</td>
              <td>{new Date(drive.date).toLocaleDateString()}</td>
              <td>{drive.doses}</td>
              <td>{drive.classes.join(', ')}</td>
              <td>
                <button onClick={() => onEdit(drive)}>Edit</button>
                <button onClick={() => handleDelete(drive._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewDrives;
