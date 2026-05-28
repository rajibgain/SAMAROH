import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, X, Lightbulb, Zap } from 'lucide-react';
import styles from '../styles/aibot.module.css';
import { getAISuggestions, generateSmartIdeas } from '../utils/eventAIHelper';

export function AIBot({ event, stats, expenses = [], tasks = [], guests = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "🤖 Hi! I'm your AI Event Planning Assistant. I can help you with budget optimization, guest management, scheduling, decoration ideas, and much more. What would you like help with?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  const quickSuggestions = [
    { icon: '💰', label: 'Budget Tips', action: 'budget' },
    { icon: '📋', label: 'Task Ideas', action: 'tasks' },
    { icon: '🎨', label: 'Decor Ideas', action: 'decoration' },
    { icon: '👥', label: 'Guest Tips', action: 'guests' },
    { icon: '📅', label: 'Timeline', action: 'timeline' },
    { icon: '🍽️', label: 'Menu Ideas', action: 'menu' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuickSuggestion = async (action) => {
    setSelectedSuggestion(action);
    await processUserMessage(`I need help with ${action}`, action);
  };

  const processUserMessage = async (message, action = null) => {
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: message,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Get AI suggestions
      const response = await getAISuggestions({
        action: action,
        message: message,
        event: event,
        stats: stats,
        expenses: expenses,
        tasks: tasks,
        guests: guests
      });

      // Simulate typing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: response,
        timestamp: new Date(),
        actionable: true
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting AI suggestion:', error);
      const errorMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: '❌ Oops! I had trouble generating suggestions. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    await processUserMessage(inputValue.trim());
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className={styles.floatingButton}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={isOpen ? { scale: 0 } : { scale: 1 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <MessageCircle size={24} />
        </motion.div>
        <span className={styles.badge}>AI</span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.chatContainer}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className={styles.chatHeader}>
              <div className={styles.headerContent}>
                <div className={styles.headerTitle}>
                  <Zap size={20} className={styles.icon} />
                  <div>
                    <h3>Event AI Assistant</h3>
                    <p>Your smart planning companion</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className={styles.closeBtn}
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Suggestions */}
            {messages.length === 1 && (
              <div className={styles.suggestionsPanel}>
                <p className={styles.suggestionsTitle}>
                  <Lightbulb size={16} /> Quick Help
                </p>
                <div className={styles.suggestionsGrid}>
                  {quickSuggestions.map((suggestion, idx) => (
                    <motion.button
                      key={idx}
                      className={styles.suggestionBtn}
                      onClick={() => handleQuickSuggestion(suggestion.action)}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className={styles.suggestionIcon}>{suggestion.icon}</span>
                      <span className={styles.suggestionLabel}>{suggestion.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className={styles.messagesContainer}>
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  className={`${styles.message} ${styles[msg.type]}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                >
                  {msg.type === 'bot' && (
                    <div className={styles.botAvatar}>🤖</div>
                  )}
                  <div className={styles.messageContent}>
                    <p>{msg.text}</p>
                    <span className={styles.timestamp}>
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  className={`${styles.message} ${styles.bot}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className={styles.botAvatar}>🤖</div>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className={styles.inputForm}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything about your event..."
                className={styles.input}
                disabled={isLoading}
              />
              <motion.button
                type="submit"
                className={styles.sendBtn}
                disabled={!inputValue.trim() || isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send size={18} />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
