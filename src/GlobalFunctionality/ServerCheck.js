import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

const ServerCheck = () => {
  const [isServerOnline, setIsServerOnline] = useState(true);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/ping');
        if (!response.ok) {
          setIsServerOnline(false);
          setIsErrorModalOpen(true);
        }
      } catch (error) {
        setIsServerOnline(false);
        setIsErrorModalOpen(true);
      }
    };

    checkServer();
  }, []);

  return (
    <Modal 
      isOpen={!isServerOnline && isErrorModalOpen} 
      onRequestClose={() => setIsErrorModalOpen(false)}
      className="ReactModal__Content"
      overlayClassName="ReactModal__Overlay"
      shouldCloseOnOverlayClick={false}
    >
      <h2 className="modal-title">Server is not working</h2>
      <button 
        onClick={() => { setIsErrorModalOpen(false); }}
        className="modal-button"
      >
        OK
      </button>
    </Modal>
  );
};

export default ServerCheck;