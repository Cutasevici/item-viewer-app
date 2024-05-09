import React from 'react';

function ClearButton2({ clearOrders }) {
  return (
    <button className ="secondary-components" onClick={clearOrders}>
      Clear
    </button>
  );
}

export default ClearButton2;