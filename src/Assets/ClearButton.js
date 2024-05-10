import React from 'react';

function ClearButton() {
  const clearPage = () => {
    window.location.reload();
  };

  return (
    <button className ="item-button clear" onClick={clearPage}>Clear</button>
  );
}

export default ClearButton;