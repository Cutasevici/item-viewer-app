import updateOrder from './modifyOrders.js';

function AddItemButton({ item, orderId }) {
  const addItem = async () => {
    try {
      const response = await updateOrder(orderId, { items: [item] });

      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }

      // Refresh the page after adding the item
      window.location.reload();
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  return (
    <button onClick={addItem}>Add {item.name}</button>
  );
}

export default AddItemButton;