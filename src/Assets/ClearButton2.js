import React from 'react';

function ClearButton2({ clearOrders }) {
  return (
    <button className ="item-button clear" onClick={clearOrders}>
      Clear
    </button>
  );
}

export default ClearButton2;