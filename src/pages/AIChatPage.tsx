// frontend/src/pages/AIChatPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import styles from './AIChatPage.module.css';
import appStyles from '../App.module.css';
import { sendChatMessage } from '../services/api';
import { v4 as uuidv4 } from 'uuid';
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const AIChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userMessage, setUserMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string>(uuidv4());

  // Initial AI greeting message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        { sender: 'ai', text: "Hello! I'm MSignalAI. I can help you analyze the stock market. But please notice:I cannot provide any advice about buy or sell." }
      ]);
    }
  }, [messages.length]);

  // Scroll to the bottom of the chat history
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (userMessage.trim()) {
      const newUserMessage = userMessage;
      setMessages(prevMessages => [...prevMessages, { sender: 'user', text: newUserMessage }]);
      setUserMessage('');

      setIsLoading(true);

      try {
        const aiResponse = await sendChatMessage(newUserMessage, sessionIdRef.current);
        setMessages(prevMessages => [...prevMessages, { sender: 'ai', text: aiResponse }]);
      } catch (error) {
        console.error("Error sending message to AI:", error);
        setMessages(prevMessages => [...prevMessages, { sender: 'ai', text: "I'm sorry, I couldn't get a response from the AI." }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };

  return (
    <div className={`${appStyles.App} ${styles.chatPageContainer}`}>
      <div className={styles.chatBox}>
        <div className={styles.header}>
          <h2>Ask MSignalAI</h2>
        </div>
        <div className={styles.content}>
          <div className={styles.messages}>
            {messages.map((msg, index) => (
              <div key={index} className={`${styles.message} ${styles[msg.sender]}`}>
                {msg.sender === 'ai' ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text} {/* Use ReactMarkdown for AI messages */}
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.message} ${styles.ai}`}>
                <span className={styles.loadingDots}>. . .</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className={styles.footer}>
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isLoading ? "Waiting for AI..." : "Type your message..."}
            className={styles.inputBox}
            disabled={isLoading}
          />
          <button onClick={handleSendMessage} className={styles.sendButton} disabled={isLoading}>
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;