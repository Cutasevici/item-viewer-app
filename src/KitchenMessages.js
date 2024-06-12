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

  const closeTicket = (ticketId) => {
    fetch('http://localhost:8080/tickets/close', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId, closingTimestamp: new Date() }),
    }).then(response => {
      if (!response.ok) {
        console.error(`Network response was not ok: ${response.statusText}`);
      }
    }).catch(error => {
      console.error('Failed to close ticket:', error);
    });
  
    // Apply closing animation immediately without waiting for the fetch call to complete
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
  };

  // Function to calculate elapsed time in seconds
  const formatElapsedTime = (creationTimestamp) => {
    const creationDate = new Date(creationTimestamp);
    const now = new Date();
    const differenceInSeconds = Math.floor((now - creationDate) / 1000);
    const hours = Math.floor(differenceInSeconds / 3600);
    const minutes = Math.floor((differenceInSeconds % 3600) / 60);
    const seconds = differenceInSeconds % 60;
  
    // Conditionally include the hours and minutes part
    const formattedTime = `${hours >= 1 ? `${hours}h ` : ''}${minutes > 0 ? `${minutes}m ` : ''}${seconds}s`;
    return formattedTime;
  };

 
  
  // Update the MessageItem component to use formatElapsedTime
  const MessageItem = ({ msg }) => {
    const [elapsedTime, setElapsedTime] = useState(formatElapsedTime(msg.creationTimestamp));
  
    useEffect(() => {
      const interval = setInterval(() => {
        setElapsedTime(formatElapsedTime(msg.creationTimestamp));
      }, 1000);
  
      return () => clearInterval(interval);
    }, [msg.creationTimestamp]);

    return (
      <div key={msg.id} className={`message-item ${msg.isClosing ? 'closing' : ''}`}>
      
        <div><strong>Ticket: {msg.id}</strong></div>
        <div>
      <strong>Ordered Items:</strong>
      {(() => {
        const itemMap = new Map();
        msg.itemsText.split(', ').forEach((item) => {
          // Remove "(Comment: null)" for counting, but keep unique items with comments separate
          const processedItem = item.includes("(Comment: null)") ? item.replace(" (Comment: null)", "") : item;
          const count = itemMap.get(processedItem) || 0;
          itemMap.set(processedItem, count + 1);
        });

        return Array.from(itemMap, ([item, count]) => (
          <div key={item}>
            {`${item}${count > 1 ? ` (x${count})` : ''}`}
          </div>
        ));
      })()}
    </div>
        <div><strong>Preparation time</strong> {elapsedTime} seconds</div>
        <button onClick={() => closeTicket(msg.id)}>Close Ticket</button>
      </div>
    );
  };

  return (
    <div className="global-container">
      <button className="global-button kitchen-button" onClick={toggleShowMessages}>
        Kitchen
      </button>
      {showMessages && (
        <div className="message-display">
          {messages.length > 0 ? (
            messages.map((msg) => <MessageItem key={msg.id} msg={msg} />)
          ) : (
            <div>No messages</div>
          )}
        </div>
      )}
    </div>
  );
};

export default KitchenMessages;
