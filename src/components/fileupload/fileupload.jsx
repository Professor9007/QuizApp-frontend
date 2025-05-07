import React, { useState } from 'react';
import './fileupload.css';

const FileUploadScreen = ({ handleQuestionsInput }) => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    // Reset error state
    setFileError('');
    
    // Check if file is selected
    if (!selectedFile) {
      setFile(null);
      return;
    }
    
    // Validate file type
    if (selectedFile.type !== 'application/pdf') {
      setFileError('Please select only PDF files.');
      setFile(null);
      e.target.value = null; // Reset file input
      return;
    }
    
    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    if (!file) {
      setFileError('Please select a PDF file');
      return;
    }
    
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('https://quizapp-backend-bqes.onrender.com/fileuploading', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setResult(data.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(data));
    } catch (error) {
      console.error('Upload failed:', error);
      setFileError('Failed to upload file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!result) return;
    
    setLoading(true);
    
    try {
      const res = await fetch('https://quizapp-backend-bqes.onrender.com/questionnaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: result }),
      });

      const data = await res.json();
      handleQuestionsInput(data.questionsText);
    } catch (error) {
      console.error('Failed to generate questions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="file-upload-container">
      <h1>Upload File to Gemini</h1>
      
      <div className="file-input-wrapper">
        <label htmlFor="pdf-upload" className="file-input-label">
          {file ? file.name : 'Choose PDF file'}
        </label>
        <input 
          id="pdf-upload"
          type="file" 
          onChange={handleFileChange}
          className="file-input" 
          accept="application/pdf"
        />
      </div>
      
      {fileError && <p className="file-error">{fileError}</p>}
      
      <button 
        onClick={handleSubmit} 
        disabled={loading || !file} 
        className="file-upload-button"
      >
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