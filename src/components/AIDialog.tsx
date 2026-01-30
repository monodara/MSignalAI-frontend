// frontend/src/components/AIDialog.tsx
import React, { useState, useEffect, useRef } from 'react';
import styles from './AIDialog.module.css';

interface AIDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const AIDialog: React.FC<AIDialogProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userMessage, setUserMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial AI greeting message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { sender: 'ai', text: "Hello! I'm MSignalAI. I can help you analyze the stock market, but I don't give you buy or sell advice." }
      ]);
    }
  }, [isOpen, messages.length]);

  // Scroll to the bottom of the chat history
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSendMessage = () => {
    if (userMessage.trim()) {
      setMessages(prevMessages => [...prevMessages, { sender: 'user', text: userMessage }]);
      // TODO: Send userMessage to AI backend and get response
      // For now, simulate an AI response
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { sender: 'ai', text: `You said: "${userMessage}". I'm still learning how to respond!` }]);
      }, 1000);
      setUserMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <div className={styles.header}>
          <h2>Ask MSignalAI</h2>
          <button onClick={onClose} className={styles.closeButton}>X</button>
        </div>
        <div className={styles.content}>
          <div className={styles.messages}>
            {messages.map((msg, index) => (
              <div key={index} className={`${styles.message} ${styles[msg.sender]}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} /> {/* Scroll anchor */}
          </div>
        </div>
        <div className={styles.footer}>
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className={styles.inputBox}
          />
          <button onClick={handleSendMessage} className={styles.sendButton}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default AIDialog;