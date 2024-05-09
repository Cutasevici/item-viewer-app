import React, { useState, useEffect } from 'react';

const GetOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  

  const getOrdersWithStatusNotPending = async () => {
    const response = await fetch('http://localhost:8080/api/orders/view/status/pending');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.text();
    if (!data) {
      return [];
    }
    const orders = JSON.parse(data);
    return orders;
  };

  useEffect(() => {
      getOrdersWithStatusNotPending().then(nonPendingOrders => {
          setOrders(nonPendingOrders);
      });
  }, []);



  return (
    <div>
      {orders.length === 0 ? (
      <p>No order history to display</p>
    ) : (
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Order Date</th>
            <th>Customer ID</th>
            <th>Status</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
             <React.Fragment key={order.orderId}>
             <tr>
                <td style={{ textAlign: 'left', verticalAlign: 'top', border: '1px solid #ddd', padding: '8px' }}>{order.orderId}</td>
                <td style={{ textAlign: 'left', verticalAlign: 'top', border: '1px solid #ddd', padding: '8px' }}>{new Date(order.orderDate).toLocaleString()}</td>
                <td style={{ textAlign: 'left', verticalAlign: 'top', border: '1px solid #ddd', padding: '8px' }}>{order.customerId}</td>
                <td style={{ textAlign: 'left', verticalAlign: 'top', border: '1px solid #ddd', padding: '8px' }}>{order.status}</td>
                <td style={{ textAlign: 'left', verticalAlign: 'top', border: '1px solid #ddd', padding: '8px' }}>{order.total}</td>
              </tr>
              <tr>
              <td colSpan="5" style={{ textAlign: 'left', verticalAlign: 'top', border: '1px solid #ddd', padding: '8px' }}>
                <details>
                    <summary>View Items</summary>
                    <table style={{ width: '100%' }}>
                    <thead>
                        <tr>
                        <th>Item Name</th>
                        <th>Unit Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(order.items.reduce((acc, item) => {
                        // If the item is already in the accumulator, increment its count
                        if (acc[item.itemName]) {
                            acc[item.itemName].count++;
                        } else {
                            // Otherwise, add the item to the accumulator
                            acc[item.itemName] = { ...item, count: 1 };
                        }
                        return acc;
                        }, {})).map((item, key) => (
                        <tr key={key}>
                            <td>{item.itemName} (x{item.count})</td>
                            <td>{item.itemPrice}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </details>
                </td>
              </tr>
              </React.Fragment>
          ))}
        </tbody>
      </table>
    )}
    </div>
  );
};

export default GetOrderHistory;