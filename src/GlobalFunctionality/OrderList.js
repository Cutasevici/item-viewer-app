import React, { useState, useEffect } from 'react';
import ItemSelector from './ItemSelector';
import CloseOrder from './closeOrder';
import Modal from 'react-modal';



function OrderList({editOrder}) {
    const [orders, setOrders] = useState([]);
    const [fetchedOrders, setFetchedOrders] = useState({});
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [itemsToAdd, setItemsToAdd] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [itemCommentaries, setItemCommentaries] = useState({});
    const [showCommentFields, setShowCommentFields] = useState({});
  
    
  
  

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/orders/view/');
      let data = await response.json();
      console.log(data); // log the response data
      data = data.filter(order => order.status !== 'canceled' && order.status !== 'closed');
      return data;  // Return the data
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  

  const fetchSelectedOrder = async (orderId) => {
    // If the selected order is already in the state, return early
    if (fetchedOrders[orderId]) {
      setSelectedOrderId(orderId);
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8080/api/orders/view/${orderId}`);
      const data = await response.json();
      setFetchedOrders({ [orderId]: data }); // Update fetchedOrders with the new order's data
      setSelectedOrderId(orderId);
    } catch (error) {
      console.error('There was an error fetching the order:', error);
    }
  };
  
  const handleOrderButtonClick = (orderId) => {
    setFetchedOrders({}); // Reset fetchedOrders
    fetchSelectedOrder(orderId);
  }

  
  
  useEffect(() => {
    async function fetchAndSetOrders() {
      try {
        const fetchedOrders = await fetchOrders();
        setOrders(fetchedOrders);  // Set the state here
      } catch (error) {
        console.error('There was an error fetching the orders:', error);
      }
    }
  
    fetchAndSetOrders();
}, []);



const addItemsToOrder = async (items) => {
  if (itemsToAdd.length === 0) {
    setSuccessMessage('No items to add.');
    return;
  }
  let response;
  try {
    response = await fetch(`http://localhost:8080/api/orders/edit/${selectedOrderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'add',
        items: items.map((item, index) => ({
          itemId: item.itemId,
          itemName: item.itemName,
          itemPrice: item.itemPrice,
          itemCommentary: itemCommentaries[index] || null, // Use the index here
        })),
      }),
    });
  } catch (error) {
    console.error('Server is not working', error);
    setErrorMessage('Server is not working');
    setIsErrorModalOpen(true);
    return;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const order = await response.json();
  setItemsToAdd([]); // reset itemsToAdd
  setIsModalOpen(true); // open the modal
  return order;
}

const handleAddToOrderButtonClick = (item) => {
  setItemsToAdd(prevItems => [...prevItems, { itemId: item.itemId, itemName: item.itemName, itemPrice: item.itemPrice }]);
};

const deleteItemToAdd = (index) => {
  const newItemsToAdd = [...itemsToAdd];
  newItemsToAdd.splice(index, 1);
  setItemsToAdd(newItemsToAdd);
};

function ClearButton() {
  const clearPage = () => {
    window.location.reload();
  };

  return (
    <button className="item-button clear" onClick={clearPage}>Clear</button>
  );
}

const handleCommentaryChange = (index, commentary) => {
  setItemCommentaries(prev => ({ ...prev, [index]: commentary }));
}

const handleAddCommentButtonClick = (index) => {
  setShowCommentFields(prev => ({ ...prev, [index]: !prev[index] }));
}
  
return (
  <div className="order-container">
    {Array.isArray(orders) && orders.map(order => (
      <div key={order.orderId}>
        <button className="get-order-button" onClick={() => handleOrderButtonClick(order.orderId)}>
          Get Order {order.orderId}
        </button>
        {selectedOrderId === order.orderId && fetchedOrders[selectedOrderId] && (
          <div className="order-details">
            <CloseOrder orderId={order.orderId} />
            <p>Order ID: {fetchedOrders[selectedOrderId].orderId}</p>
            <p>Total Price: {fetchedOrders[selectedOrderId].total}</p>
            <table className="order-items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(
                  fetchedOrders[selectedOrderId].items.reduce((acc, item) => {
                    acc[item.itemName] = (acc[item.itemName] || { count: 0, price: item.itemPrice });
                    acc[item.itemName].count++;
                    return acc;
                  }, {})
                ).map(([itemName, { count, price }]) => (
                  <tr key={itemName}>
                    <td>{itemName} (x{count})</td>
                    <td>${price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {successMessage && <p>{successMessage}</p>}
            <ItemSelector addToOrder={handleAddToOrderButtonClick} />
            <div className="items-to-add">
              <h4>Items to Add:</h4>
              {itemsToAdd.map((item, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ flex: 4 }}>{item.itemName} - ${item.itemPrice}</p>
                </div>
                <div>
                  <button className="item-button clear" onClick={() => deleteItemToAdd(index)}>Delete</button>
                  <button className="item-button add-comment" onClick={() => handleAddCommentButtonClick(index)}>
                    {showCommentFields[index] ? 'Hide Comment' : 'Add Comment'}
                  </button>
                </div>
                {showCommentFields[index] && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <input 
                      type="text" 
                      style={{ flex: 4 }}
                      placeholder="Add commentary"
                      value={itemCommentaries[index] || ''} 
                      onChange={e => handleCommentaryChange(index, e.target.value)} 
                    />
                  </div>
                )}
              </div>
            ))}
            <button className="item-button update" onClick={() => addItemsToOrder(itemsToAdd, itemCommentaries)}>Update Order</button>
            <ClearButton />
          </div>
        </div>
        )}
      </div>
    ))}
          <Modal 
            isOpen={isModalOpen} 
            onRequestClose={() => setIsModalOpen(false)}
            className="ReactModal__Content"
            overlayClassName="ReactModal__Overlay"
            shouldCloseOnOverlayClick={false}
          >
            <h2 className="modal-title">Order updated successfully!</h2>
            <button 
              onClick={() => { setIsModalOpen(false); window.location.reload(); }}
              className="modal-button"
            >
              OK
            </button>
          </Modal>
          <Modal 
            isOpen={isErrorModalOpen} 
            onRequestClose={() => setIsErrorModalOpen(false)}
            className="ReactModal__Content"
            overlayClassName="ReactModal__Overlay"
            shouldCloseOnOverlayClick={false}
          >
            <h2 className="modal-title">{errorMessage}</h2>
            <button 
              onClick={() => { setIsErrorModalOpen(false); }}
              className="modal-button"
            >
              OK
            </button>
          </Modal>
            </div>
          );
        }


export default OrderList;