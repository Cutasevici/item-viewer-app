
async function getAllItems() {
    const response = await fetch('http://localhost:8080/items');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const items = await response.json();
    return items;
}

export default getAllItems;