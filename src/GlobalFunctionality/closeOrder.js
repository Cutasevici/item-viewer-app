import React, { useState } from 'react';

const CloseOrder = ({ orderId }) => {
    const [showModal, setShowModal] = useState(false); // State for showing the modal
    const [order, setOrder] = useState(null); // State for storing the order details

    const handleOpenModal = async () => {
        const orderDetails = await fetchOrderDetails(orderId);
        setOrder(orderDetails);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handlePay = async () => {
        if (order && order.status !== 'closed') {
            await closeOrder(orderId);
        }
        handleCloseModal();
    };

    async function fetchOrderDetails(orderId) {
        // First, fetch the order details
        const orderResponse = await fetch(`http://localhost:8080/api/orders/view/${orderId}`);
        if (!orderResponse.ok) {
            throw new Error(`HTTP error! status: ${orderResponse.status}`);
        }
        const order = await orderResponse.json();
        return order;
    }

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
        <div>
            <button className="order-container" onClick={handleOpenModal}>Close Order</button>
            {showModal && (
                <div>
                    {/* Display the selected order details */}
                    <p>Order ID: {order?.orderId}</p>
                    <p>Total Price: {order?.total}</p>
                    <p>Order Items: {order?.items.map(item => <p key={item.itemId}>{item.itemName}</p>)}</p>
                    <button onClick={handlePay}>Pay</button>
                    <button onClick={handleCloseModal}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default CloseOrder;