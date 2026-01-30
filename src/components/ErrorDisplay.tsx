// frontend/src/components/ErrorDisplay.tsx
import React from 'react';
import styles from './ErrorDisplay.module.css'; // Import as CSS module

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  if (!message) return null;
  return (
    <div className={styles['error-message']}>
      <p>{message}</p>
    </div>
  );
};

export default ErrorDisplay;
