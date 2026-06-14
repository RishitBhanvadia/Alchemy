import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import useLabStore from '../store/labStore';
import apiClient from '../utils/apiClient';
import './AiTutorPanel.css';

const AiTutorPanel = ({ isOpen, onClose }) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  
  const chatHistory = useLabStore(state => state.chatHistory);
  const addChatMessage = useLabStore(state => state.addChatMessage);
  const chemA = useLabStore(state => state.chemA);
  const chemB = useLabStore(state => state.chemB);
  const chemI = useLabStore(state => state.chemI);
  const chemC = useLabStore(state => state.chemC);
  const lastReactionResult = useLabStore(state => state.reactionResult);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // Handle Escape key to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleAskTutor = async () => {
    if (!question.trim() || isLoading) return;

    const currentQuestion = question;
    setQuestion('');
    setIsLoading(true);
    
    // Add student message to UI immediately
    addChatMessage('student', currentQuestion);

    try {
      const payload = {
        chemicals: { 
          chem_a: Math.round(chemA), 
          chem_b: Math.round(chemB), 
          chem_i: Math.round(chemI), 
          chem_c: Math.round(chemC) 
        },
        reaction_outcome: lastReactionResult?.outcome || 'No reaction yet',
        student_question: currentQuestion
      };

      const res = await apiClient.post('/ai/explain', payload);
      
      if (res.data && res.data.explanation) {
        addChatMessage('tutor', res.data.explanation);
      }
    } catch (error) {
      console.error('AI Tutorial error:', error);
      addChatMessage('tutor', 'I am sorry, but I am having trouble connecting to my knowledge base right now. Please try again in a moment!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskTutor();
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
          <div className="ai-tutor-header">
            <h2>Gemini Flash Tutor</h2>
            <button className="close-button" onClick={onClose}>×</button>
          </div>

          <div className="current-context">
            <h4>Current Lab State</h4>
            <div className="context-values">
              <span className="context-badge">HCl: {Math.round(chemA)}%</span>
              <span className="context-badge">NaOH: {Math.round(chemB)}%</span>
              <span className="context-badge">BTB: {Math.round(chemI)}%</span>
              <span className="context-badge">MnO₂: {Math.round(chemC)}%</span>
            </div>
            {lastReactionResult && (
              <div style={{ marginTop: '8px' }}>
                <span className="context-badge" style={{ background: 'rgba(99, 102, 241, 0.3)' }}>
                  Outcome: {lastReactionResult.outcome}
                </span>
              </div>
            )}
          </div>

          <div className="chat-history">
            {chatHistory.length === 0 ? (
              <div style={{ textAlign: 'center', opacity: 0.5, marginTop: '40px' }}>
                <p>Hello! I&apos;m your AI Chemistry Tutor.</p>
                <p>Ask me anything about the chemicals or reactions in the lab.</p>
              </div>
            ) : (
              chatHistory.map((msg, index) => (
                <div key={index} className={`chat-message ${msg.role}`}>
                  <div className="message-role">{msg.role === 'student' ? 'You' : 'Tutor'}</div>
                  <div className="message-text">{msg.message}</div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="chat-message tutor">
                <div className="message-role">Tutor</div>
                <div className="spinner"></div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="chat-input-area">
            <textarea 
              className="chat-input"
              placeholder="Ask a question about the experiment..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
            />
            <button 
              className="ask-button"
              onClick={handleAskTutor}
              disabled={isLoading || !question.trim()}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Thinking...
                </>
              ) : (
                'Ask Tutor'
              )}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AiTutorPanel;

AiTutorPanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};
