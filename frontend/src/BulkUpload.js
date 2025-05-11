import React, { useState } from 'react';
import axios from 'axios';

function BulkUpload({ fetchStudents }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a CSV file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/api/upload-csv', formData);
      alert(res.data.message);
      setFile(null);
      fetchStudents(); // Refresh student list
    } catch (error) {
      alert('Upload failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h4>📥 Bulk Upload Students (CSV)</h4>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: '10px' }}>Upload</button>
    </div>
  );
}

export default BulkUpload;
