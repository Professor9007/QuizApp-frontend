import React, { useState } from 'react';
import './AiChat.css';

export default function AIChat() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: "Hello! I'm your AI study assistant. How can I help you today?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const formatAIText = (text) => {
    let formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n+/g, '</p><p>')
      .replace(/\n/g, '<br />');
    return `<p>${formattedText}</p>`;
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const userMessage = { id: messages.length + 1, sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch('https://quizapp-backend-bqes.onrender.com/aichat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputValue })
      });

      const data = await response.json();
      const aiMessage = {
        id: userMessage.id + 1,
        sender: 'ai',
        text: data.aianswer || "Sorry, I couldn't understand that."
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error communicating with backend:', error);
      setMessages(prev => [...prev, {
        id: userMessage.id + 1,
        sender: 'ai',
        text: "Oops! There was an error connecting to the server."
      }]);
    } finally {
      setLoading(false);
    }

    setInputValue('');
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3 className="header-title">AI Study Assistant</h3>
        <p className="header-description">Ask questions about your studies or get help with difficult concepts</p>
      </div>

      <div className="messages-container">
        {messages.map(message => (
          <div
            key={message.id}
            className={`message-wrapper ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
          >
            <div className={`message ${message.sender === 'user' ? 'user' : 'ai'}`}>
              {message.sender === 'ai' ? (
                <div 
                  className="formatted-content"
                  dangerouslySetInnerHTML={{ __html: formatAIText(message.text) }}
                />
              ) : (
                message.text
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message-wrapper ai-message">
            <div className="message ai">Typing...</div>
          </div>
        )}
      </div>

      <div className="input-container">
        <div className="input-wrapper">
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your question here..."
            className="message-input"
            disabled={loading}
          />
          <button
            onClick={handleSendMessage}
            className="send-button"
            disabled={loading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}