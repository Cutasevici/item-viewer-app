import React, { useState, useEffect } from 'react';
import SendOrderButton from './Assets/SendOrderButton';
import ClearButton from './Assets/ClearButton';
import updateOrder from './GlobalFunctionality/modifyOrder';
import ItemSelector from './GlobalFunctionality/ItemSelector';
import OrderList from './GlobalFunctionality/OrderList';
import GetOrderHistory from './GlobalFunctionality/getOrderHistory';
import ServerCheck from './GlobalFunctionality/ServerCheck';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  const [order, setOrder] = useState([]);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [itemsToAdd, setItemsToAdd] = useState([]);
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [showExistingOrders, setShowExistingOrders] = useState(false);




  
  const clearEditingOrderId = () => {
    setEditingOrderId(null);
  };
  

  useEffect(() => {
    console.log(order); // Logs the updated 'order' state whenever it changes
  }, [order]);

  const addToOrder = (item) => {
    setOrder(prevOrder => [...prevOrder, item]);
  };

  const createOrder = () => {
    console.log(order);
  };

  const clearOrder = () => {
    setOrder([]);
  };

 

  const editOrder = (orderId) => {
    updateOrder(orderId, itemsToAdd)
      .then(() => {
        console.log('Order updated successfully');
        setItemsToAdd([]);
      })
      .catch(error => {
        console.error('There was an error updating the order:', error);
      });
  };


  function deleteItem(index) {
    setOrder(prevOrder => prevOrder.filter((item, i) => i !== index));
  }

  

  return (
    
      <div className="global-container">
        <ServerCheck />
        <button className="global-button existing-orders-button" onClick={() => {
          setShowExistingOrders(!showExistingOrders);
          setShowOrderHistory(false);
          setShowNewOrder(false);
        }}>
          Existing Orders
        </button>
        {showExistingOrders && (
          <>
            <OrderList editOrder={editOrder}/>

          </>
        )}
  
          <button className="global-button order-history-button" onClick={() => {
          setShowOrderHistory(!showOrderHistory);
          setShowExistingOrders(false);
          setShowNewOrder(false);
        }}>
          Order History
        </button>
        {showOrderHistory && (
          <GetOrderHistory />
        )}
  
            <button className="global-button new-order-button" onClick={() => {
            setShowNewOrder(!showNewOrder);
            setShowExistingOrders(false);
            setShowOrderHistory(false);
          }}>
            New Order
          </button>
        {showNewOrder && (
          <div>
            <ItemSelector addToOrder={addToOrder} />
            <div className="secondary-components">
              <SendOrderButton createOrder={createOrder} order={order} editingOrderId={editingOrderId} clearEditingOrderId={clearEditingOrderId} />
              <ClearButton  clearOrder={clearOrder} />
            </div>
            <div className="items-container">
              {order.map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 4 }}> {item.itemName}</div>  {/* item name */}
                  <div style={{ flex: 4 }}> {item.itemPrice}</div> {/* item price */}
                  <div style={{ flex: 1 }}>
                    <button className ="item-button clear" onClick={() => deleteItem(index)}>Delete</button> {/* delete button */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

  );
}

export default App;
