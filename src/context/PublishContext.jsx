import React, { createContext, useContext, useState, useEffect } from 'react';

const PublishContext = createContext();

export const PublishProvider = ({ children }) => {
  const [unpublishedIds, setUnpublishedIds] = useState(() => {
    const stored = localStorage.getItem('unpublishedProducts');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('unpublishedProducts', JSON.stringify(unpublishedIds));
  }, [unpublishedIds]);

  // Sync state across multiple tabs automatically!
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Listen to see if another tab modified our specific localStorage key
      if (e.key === 'unpublishedProducts') {
        const newUnpublished = e.newValue ? JSON.parse(e.newValue) : [];
        setUnpublishedIds(newUnpublished);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const togglePublish = (id) => {
    setUnpublishedIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const isPublished = (id) => {
    return !unpublishedIds.includes(id);
  };

  return (
    <PublishContext.Provider value={{ isPublished, togglePublish, unpublishedIds }}>
      {children}
    </PublishContext.Provider>
  );
};

export const usePublish = () => useContext(PublishContext);
