import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';

function ReportDashboard({ refreshKey }) {
  const [summary, setSummary] = useState(null);
  const [upcomingDrives, setUpcomingDrives] = useState([]);
  const [sortKey, setSortKey] = useState('date');
  const [filterClass, setFilterClass] = useState('All');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const summaryRes = await axios.get('http://localhost:5000/report/summary');
        const drivesRes = await axios.get('http://localhost:5000/report/upcoming-drives');
        setSummary(summaryRes.data);
        setUpcomingDrives(drivesRes.data);
      } catch (err) {
        alert('Failed to fetch report data: ' + err.message);
      }
    };
    fetchReport();
  }, [refreshKey]);

  const allClasses = useMemo(() => {
    const classSet = new Set();
    upcomingDrives.forEach((d) => d.classes.forEach((cls) => classSet.add(cls)));
    return ['All', ...Array.from(classSet).sort()];
  }, [upcomingDrives]);

  const filteredAndSorted = useMemo(() => {
    let data = [...upcomingDrives];
    if (filterClass !== 'All') {
      data = data.filter((d) => d.classes.includes(filterClass));
    }
    if (sortKey === 'name') {
      data.sort((a, b) => a.vaccineName.localeCompare(b.vaccineName));
    } else if (sortKey === 'date') {
      data.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    return data;
  }, [upcomingDrives, sortKey, filterClass]);

  const handleExportCSV = () => {
    const headers = ['Vaccine Name', 'Date', 'Doses', 'Applicable Classes'];
    const rows = filteredAndSorted.map((d) => [
      d.vaccineName,
      new Date(d.date).toLocaleDateString(),
      d.doses,
      d.classes.join(', ')
    ]);
    const csvContent = [headers, ...rows].map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'upcoming_drives.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '20px', marginTop: '30px', borderRadius: '10px' }}>
      <h2 style={{ marginBottom: '20px' }}>📊 Vaccination Summary & Upcoming Drives</h2>

      {summary ? (
        <div style={{ marginBottom: '20px', padding: '10px', background: '#f9f9f9', borderRadius: '5px' }}>
          <h3>Vaccination Summary Report</h3>
          <ul>
            <li><strong>Total Students:</strong> {summary.totalStudents}</li>
            <li><strong>Vaccinated Students:</strong> {summary.vaccinatedStudents}</li>
            <li><strong>Pending Vaccinations:</strong> {summary.pendingVaccination}</li>
            <li><strong>Vaccination Rate:</strong> {summary.vaccinationPercentage}%</li>
            <li><strong>Total Drives:</strong> {summary.totalDrives}</li>
          </ul>
        </div>
      ) : (
        <p>Loading summary...</p>
      )}

      <div style={{ marginBottom: '10px' }}>
        <h3>Upcoming Drives</h3>
        <label>Sort by: </label>
        <select onChange={(e) => setSortKey(e.target.value)} value={sortKey}>
          <option value="">-- Select --</option>
          <option value="name">Name</option>
          <option value="date">Date</option>
        </select>

        <label style={{ marginLeft: '20px' }}>Filter by Class: </label>
        <select onChange={(e) => setFilterClass(e.target.value)} value={filterClass}>
          {allClasses.map((cls) => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>

        <button style={{ marginLeft: '20px' }} onClick={handleExportCSV}>
          Export to CSV
        </button>
      </div>

      {filteredAndSorted.length > 0 ? (
        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Vaccine Name</th>
              <th>Date</th>
              <th>Doses</th>
              <th>Applicable Classes</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.map((drive) => (
              <tr key={drive._id}>
                <td>{drive.vaccineName}</td>
                <td>{new Date(drive.date).toLocaleDateString()}</td>
                <td>{drive.doses}</td>
                <td>{drive.classes.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p><em>No upcoming drives.</em></p>
      )}
    </div>
  );
}

export default ReportDashboard;
