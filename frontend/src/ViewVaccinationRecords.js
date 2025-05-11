import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ViewVaccinationRecords() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await axios.get('http://localhost:5000/vaccination/records');
        setRecords(res.data);
      } catch (err) {
        alert('Error fetching records: ' + err.message);
      }
    };

    fetchRecords();
  }, []);

  if (records.length === 0) {
    return <p>No vaccination records found.</p>;
  }

  return (
    <table border="1" cellPadding="8">
      <thead>
        <tr>
          <th>Student ID</th>
          <th>Vaccine Name</th>
          <th>Vaccination Date</th>
        </tr>
      </thead>
      <tbody>
        {records.map((record, index) => (
          <tr key={index}>
            <td>{record.studentId}</td>
            <td>{record.vaccineName}</td>
            <td>{new Date(record.vaccinationDate).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ViewVaccinationRecords;
