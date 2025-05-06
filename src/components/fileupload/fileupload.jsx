import React, { useState } from 'react';
import './fileupload.css';  // ✅ Import CSS file

const FileUploadScreen = ({ handleQuestionsInput }) => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async () => {
    if (!file) return alert('Please select a file');
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('http://localhost:3001/fileuploading', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setResult(data.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(data));
    setLoading(false);
  };

  const handleGenerateQuestions = async () => {
    if (!result) return;
    setLoading(true);
    const res = await fetch('http://localhost:3001/questionnaire', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: result }),
    });

    const data = await res.json();
    handleQuestionsInput(data.questionsText);
    setLoading(false);
  };

  return (
    <div className="file-upload-container">
      <h1>Upload File to Gemini</h1>
      <input type="file" onChange={handleFileChange} className="file-input" />
      <button onClick={handleSubmit} disabled={loading} className="file-upload-button">
        {loading ? 'Processing...' : 'Upload & Extract Text'}
      </button>

      {result && (
        <>
          <div className="result-box">{result}</div>
          <button
            onClick={handleGenerateQuestions}
            disabled={loading}
            className="generate-button"
          >
            {loading ? 'Generating...' : 'Generate Questions'}
          </button>
        </>
      )}
    </div>
  );
};

export default FileUploadScreen;
