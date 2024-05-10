import React, { useState } from 'react';
import Modal from 'react-modal';

const CloseOrder = ({ orderId }) => {
    const [isCloseOrderModalOpen, setCloseOrderModalOpen] = useState(false);
    const [order, setOrder] = useState(null);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    

    const handleOpenModal = async () => {
        setCloseOrderModalOpen(true);
        const orderResponse = await fetch(`http://localhost:8080/api/orders/view/${orderId}`);
        if (!orderResponse.ok) {
            throw new Error(`HTTP error! status: ${orderResponse.status}`);
        }
        const fetchedOrder = await orderResponse.json();
        const groupedItems = fetchedOrder.items.reduce((acc, item) => {
          const foundItem = acc.find(accItem => accItem.itemName === item.itemName);
          if (foundItem) {
            foundItem.quantity += 1;
          } else {
            acc.push({ ...item, quantity: 1 });
          }
          return acc;
        }, []);
        fetchedOrder.items = groupedItems;
        setOrder(fetchedOrder);
      };

      const handleCloseModal = () => {
        setCloseOrderModalOpen(false);
    };

    const handlePay = async () => {
        if (order && order.status !== 'closed') {
            await closeOrder(orderId);
            setIsSuccessModalOpen(true); // Show the success modal
        }
        handleCloseModal();
    };



    async function closeOrder(orderId) {
        // Then, if the order status is not already "closed", change it to "closed"
        const closeResponse = await fetch(`http://localhost:8080/api/orders/view/${orderId}/close`, {
            method: 'PUT'
        });
        if (!closeResponse.ok) {
            throw new Error(`HTTP error! status: ${closeResponse.status}`);
        }
        const closedOrder = await closeResponse.json();
        return closedOrder;
    }

    

    return (
        <>   
          <button className="item-button close-order" onClick={handleOpenModal}>Close Order</button>  
          <Modal 
            isOpen={isCloseOrderModalOpen} 
            onRequestClose={() => setCloseOrderModalOpen(false)}
            className="ReactModal__Content"
            overlayClassName="ReactModal__Overlay"
            shouldCloseOnOverlayClick={false}
            >
            <h2 className="modal-title">Are you sure you want to close the order?</h2>
            <p className="total-price">Total Price: {order?.total}</p>
            <div className="modal-items">
                {order?.items.map(item => <p key={item.itemId}>{item.itemName} x{item.quantity}</p>)}
            </div>
                <div className="modal-buttons">
                <button className="modal-button" onClick={handlePay}>Pay</button>
                <button className="modal-button cancel" onClick={() => setCloseOrderModalOpen(false)}>Cancel</button>
                </div>
         </Modal>
          <Modal 
            isOpen={isSuccessModalOpen} 
            onRequestClose={() => setIsSuccessModalOpen(false)}
            className="ReactModal__Content"
            overlayClassName="ReactModal__Overlay"
            shouldCloseOnOverlayClick={false}
            >
            <h2 className="modal-title">Payment successful, order closed</h2>
            <button 
                onClick={() => { setIsSuccessModalOpen(false); window.location.reload(); }}
                className="modal-button"
            >
                OK
            </button>
            </Modal>
        </>
      );
};

export default CloseOrder;