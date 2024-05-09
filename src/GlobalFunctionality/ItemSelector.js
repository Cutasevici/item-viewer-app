import React, { useState, useEffect } from 'react';
import getAllItems from './getAllItems';
import fetchItem from './fetchItem';
import '../App.css';

function ItemSelector(props) {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  

  

  useEffect(() => {
    async function fetchAndSetItems() {
      try {
        const fetchedItems = await getAllItems();
        setItems(fetchedItems);
      } catch (error) {
        console.error('There was an error fetching the items:', error);
      }
    }
  
    fetchAndSetItems();
  }, []);

  async function handleSelectChange(itemId) {
    const selectedItem = await fetchItem(itemId);
    if (selectedItem) {
      setSelectedItem(selectedItem);
      props.addToOrder(selectedItem);  // Add the selected item to the order
    }
  }

  


  const groupItemsByType = (items) => {
    return items.reduce((groupedItems, item) => {
      (groupedItems[item.itemType] = groupedItems[item.itemType] || []).push(item);
      return groupedItems;
    }, {});
  };
  
  const groupedItems = groupItemsByType([...items]);
  
  return (
    <div className="container-dynamic-button">
      {Object.entries(groupedItems).map(([type, items]) => (
      <div key={type} className="group">
      <div className="category-name">{type}</div> {/* Add a class here */}
      {items.map(item => (
        <button 
          key={item.itemId}
          className={`item-button ${selectedItem && selectedItem.itemId === item.itemId ? 'selected' : ''}`} 
          onClick={() => handleSelectChange(item.itemId)}
        >
          {item.itemName}
        </button>
      ))}
        </div>
      ))}
    </div>
  );
}

export default ItemSelector;