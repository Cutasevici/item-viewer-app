import React from 'react';
import updateOrder from '../GlobalFunctionality/modifyOrder';

function SendOrderButton({ createOrder, order, editingOrderId, clearEditingOrderId, clearOrder }) {
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

      // Refresh the page after sending the order
      window.location.reload();
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  return (
    <>
       <button onClick={sendOrder}>Send Order</button>
    </>
  );
}

export default SendOrderButton;