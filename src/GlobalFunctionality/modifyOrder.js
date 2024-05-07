function updateOrder(orderId, newOrderDetails) {
    const url = `/api/orders/edit/${orderId}`;

    return fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOrderDetails),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Order updated successfully:', data);
    })
    .catch(error => {
        console.error('There was an error updating the order:', error);
    });
}

export default updateOrder;