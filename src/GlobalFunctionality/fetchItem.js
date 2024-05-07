async function fetchItem(id) {
  try {
    const response = await fetch(`http://localhost:8080/item/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There was an error fetching the item:', error);
    throw error;  // Re-throw to let the caller handle it.
  }
}

export default fetchItem;