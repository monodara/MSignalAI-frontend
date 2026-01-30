// frontend/src/components/Header.tsx
import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar'; // Import SearchBar
import { SearchResult } from '../types'; // Import SearchResult type
import styles from './Header.module.css'; // Import as CSS module

interface HeaderProps {
  title: string;
  slogan: string;
  children?: ReactNode; // Allow any children to be passed
  // Removed setShowAIDialog from props
}

const Header: React.FC<HeaderProps> = ({
  title,
  slogan,
  children, // Destructure children prop
  // Removed setShowAIDialog from destructuring
}) => {
  const navigate = useNavigate();

  const handleAskMeClick = () => {
    navigate('/ai-chat'); // Navigate to the new AI chat page
  };

  const handleTitleClick = () => {
    navigate('/'); // Navigate to home page
  };

  return (
    <header className={styles.header}>
      <div className={styles['header-left']}>
        {children} {/* Render children here */}
      </div>
      <div className={styles['header-center-content']}> {/* New div for title and slogan */}
        <h1 className={`${styles.title} ${styles.clickableTitle}`} onClick={handleTitleClick}>{title}</h1> {/* Added onClick and class */}
        <p className={styles['slogan-text']}>{slogan}</p> {/* New class for slogan */}
        <button className={styles['ask-me-dialog-button']} onClick={handleAskMeClick}>Ask Me</button> {/* New dialog button */}
      </div>
      <div className={styles['header-right']}>
        <button className={styles['home-button']} onClick={() => navigate('/')}>Home</button>
        <button className={styles['my-list-button']} onClick={() => navigate('/mylist')}>My List</button>
      </div>
    </header>
  );
};

export default Header;
