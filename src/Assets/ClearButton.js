import React from 'react';

function ClearButton() {
  const clearPage = () => {
    window.location.reload();
  };

  return (
    <button className ="secondary-components" onClick={clearPage}>Clear</button>
  );
}

export default ClearButton;