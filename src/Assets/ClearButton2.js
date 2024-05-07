import React from 'react';

function ClearButton2({ clearOrders }) {
  return (
    <button className ="container-dynamic-button" onClick={clearOrders}>
      Clear
    </button>
  );
}

export default ClearButton2;