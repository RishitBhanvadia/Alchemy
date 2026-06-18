import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useLabStore from '../store/labStore';
import apiClient from '../utils/apiClient';
import PropTypes from 'prop-types';
import './AiTutorPanel.css';

const AiTutorPanel = ({ isOpen, onClose }) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  
  const chatHistory = useLabStore(state => state.chatHistory);
  const addChatMessage = useLabStore(state => state.addChatMessage);
  const clearChatHistory = useLabStore(state => state.clearChatHistory);

  // Use deriveThermalState for current context context
  const temperature = useLabStore(state => state.temperature);
  const currentTemperature = temperature !== undefined && temperature !== null ? temperature : 25;
  const isHeaterOn = useLabStore(state => state.isHeaterOn) || false;

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    // Add user question to history
    addChatMessage('user', question);
    const currentQ = question;
    setQuestion('');
    setIsLoading(true);

    try {
      // Build context string based on current lab state
      const labContext = `
        Current Environment:
        Temperature: ${currentTemperature}°C
        Heater: ${isHeaterOn ? 'ON' : 'OFF'}
      `.trim();

      // Pass context + question to AI API
      const res = await apiClient.post('/ai/explain', {
        context: labContext,
        concept: currentQ
      });
      
      if (res.data && res.data.explanation) {
        addChatMessage('tutor', res.data.explanation);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('AI Tutorial error:', error);
      addChatMessage('tutor', 'I am sorry, but I am having trouble connecting to my knowledge base right now. Please try again in a moment!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="ai-tutor-panel"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          <div className="ai-header">
            <h3>🧪 AI Lab Assistant</h3>
            <div className="ai-header-actions">
              <button
                type="button"
                className="clear-chat-btn"
                onClick={clearChatHistory}
                title="Clear Chat History"
              >
                🗑️
              </button>
              <button type="button" className="close-btn" onClick={onClose}>×</button>
            </div>
          </div>

          <div className="ai-chat-history">
            {chatHistory.length === 0 ? (
              <div className="ai-welcome-msg">
                <p>Hello! I am your AI Lab Assistant.</p>
                <p>Ask me questions about the current experiment, chemical reactions, or how to use the lab equipment.</p>
              </div>
            ) : (
              chatHistory.map((msg, idx) => (
                <div key={idx} className={`chat-bubble ${msg.role}`}>
                  <span className="chat-avatar">{msg.role === 'tutor' ? '🤖' : '🧑‍🔬'}</span>
                  <div className="chat-content">
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="chat-bubble tutor loading">
                <span className="chat-avatar">🤖</span>
                <div className="chat-content typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form className="ai-input-area" onSubmit={handleSubmit}>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !question.trim()}>
              Send
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

AiTutorPanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AiTutorPanel;
