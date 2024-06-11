import React, { useState, useEffect } from 'react';
import { connect, disconnect } from './GlobalFunctionality/WebSocketService';
import './KitchenMessages.css'; // Ensure to create this CSS file or use inline styles

function KitchenMessages() {
  const [showMessages, setShowMessages] = useState(false);
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('messages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  const fetchPendingTickets = async () => {
    try {
      console.log('Sending GET request to fetch pending tickets...');
      const response = await fetch('http://localhost:8080/api/pending-tickets', {
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
      const pendingTickets = await response.json();
      console.log('Received pending tickets:', pendingTickets);
      setMessages(pendingTickets);
      localStorage.setItem('messages', JSON.stringify(pendingTickets));
    } catch (error) {
      console.error('Failed to fetch pending tickets:', error);
    }
  };

  useEffect(() => {
    if (showMessages) {
      fetchPendingTickets();
    }

    const onMessageReceived = (ticket) => {
      console.log('Received WebSocket message:', ticket);
      if (showMessages) {
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages, ticket];
          localStorage.setItem('messages', JSON.stringify(newMessages));
          return newMessages;
        });
      }
    };

    connect(onMessageReceived);

    return () => {
      disconnect();
    };
  }, [showMessages]);

  useEffect(() => {
    console.log('Messages state updated:', messages);
  }, [messages]);

  const toggleShowMessages = () => {
    if (!showMessages) {
      fetchPendingTickets();
    }
    setShowMessages(!showMessages);
  };

  const closeTicket = async (ticketId) => {
    try {
      const response = await fetch('http://localhost:8080/tickets/close', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, closingTimestamp: new Date() }),
      });
      if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
      console.log('Ticket closed successfully:', ticketId);

      // Apply closing animation
      setMessages(prevMessages => {
        const newMessages = prevMessages.map(msg => 
          msg.id === ticketId ? { ...msg, isClosing: true } : msg
        );
        console.log('Messages after marking for closing:', newMessages);
        return newMessages;
      });

      // Remove the ticket after the animation completes and toggle showMessages
      setTimeout(() => {
        setMessages(prevMessages => {
          const filteredMessages = prevMessages.filter(msg => msg.id !== ticketId);
          console.log('Messages after removing closed ticket:', filteredMessages);
          return filteredMessages;
        });
      }, 500); // Duration of the CSS animation
    } catch (error) {
      console.error('Failed to close ticket:', error);
    }
  };

  return (
    <div className="global-container">
      <button className="global-button kitchen-button" onClick={toggleShowMessages}>
        Kitchen
      </button>
      {showMessages && (
        <div className="message-display">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div key={msg.id} className={`message-item ${msg.isClosing ? 'closing' : ''}`}>
                <strong>Message:</strong>
                <div><strong>ID:</strong> {msg.id}</div>
                <div><strong>Items:</strong> {msg.itemsText}</div>
                <div><strong>Creation Timestamp:</strong> {msg.creationTimestamp}</div>
                <div><strong>Status:</strong> {msg.status}</div>
                <div><strong>Closing Timestamp:</strong> {msg.closingTimestamp ? msg.closingTimestamp : 'Not closed yet'}</div>
                <button onClick={() => closeTicket(msg.id)}>Close Ticket</button>
              </div>
            ))
          ) : (
            <div>No messages</div>
          )}
        </div>
      )}
    </div>
  );
}

export default KitchenMessages;
