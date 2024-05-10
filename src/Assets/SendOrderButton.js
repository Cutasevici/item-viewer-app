import React, { useState } from 'react';
import Modal from 'react-modal';
import updateOrder from '../GlobalFunctionality/modifyOrder';

function SendOrderButton({ order, editingOrderId, clearEditingOrderId, }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  
  const sendOrder = async () => {
    if (order.length === 0) {
      console.error('Cannot send an empty order!');
      return;
    }
    try {
      let response;
      if (editingOrderId) {
        response = await updateOrder(editingOrderId, order);
        clearEditingOrderId();
      } else {
        response = await fetch('http://localhost:8080/api/orders/createOrder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(order),
        });
      }

      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }
      setModalMessage('Order sent successfully');
      setIsModalOpen(true);
    } catch (error) {
      console.error('There was an error!', error);
      setModalMessage('There was an error!');
      setIsModalOpen(true);
    }
  };

  const closeModalAndRefresh = () => {
    setIsModalOpen(false);
    window.location.reload();
  };

  return (
    <>
      <button onClick={sendOrder}>Send Order</button>
      <Modal 
        isOpen={isModalOpen} 
        onRequestClose={closeModalAndRefresh}
        className="ReactModal__Content"
        overlayClassName="ReactModal__Overlay"
        shouldCloseOnOverlayClick={false}
      >
        <h2 className="modal-title">{modalMessage}</h2>
        <button 
          onClick={closeModalAndRefresh}
          className="modal-button"
        >
          OK
        </button>
      </Modal>
    </>
  );
}

export default SendOrderButton;