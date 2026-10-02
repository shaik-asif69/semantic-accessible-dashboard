// API URL
const API_URL = "https://fakestoreapi.com/products";

// Get all products from the API
export async function getProducts() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        const products = await response.json();

        return products;

    } catch (error) {
        throw error;
    }
}