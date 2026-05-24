const BASE_URL = 'https://dummyjson.com';

export const fetchProducts = async () => {
  try {
    // Fetch a large pool of products so we can do client-side sorting/filtering easily
    const response = await fetch(`${BASE_URL}/products?limit=100`);
    if (!response.ok) throw new Error('Network response failure');
    return await response.json();
  } catch (error) {
    console.error("Failed fetching collection:", error);
    return { products: [] };
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error('Product lookup failed');
    return await response.json();
  } catch (error) {
    console.error(`Error loading product ID ${id}:`, error);
    return null;
  }
};