const https = require('https');

/**
 * Fetch products with pagination
 * @param {number} offset - Starting position
 * @param {number} limit - Number of items to fetch
 * @returns {Promise<Array>} Array of products
 */
function fetchProducts(offset = 0, limit = 10) {
  return new Promise((resolve, reject) => {
    const url = `https://api.escuelajs.co/api/v1/products?offset=${offset}&limit=${limit}`;
    
    https.get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          const products = JSON.parse(data);
          resolve(products);
        } catch (error) {
          reject(new Error('Failed to parse response: ' + error.message));
        }
      });
      
    }).on('error', (error) => {
      reject(new Error('Request failed: ' + error.message));
    });
  });
}

/**
 * Get all products from the API (with pagination)
 * @returns {Promise<Array>} Array of all products
 */
async function getAll() {
  let allProducts = [];
  let offset = 0;
  const limit = 50; // Fetch 50 items per request
  let hasMore = true;

  try {
    while (hasMore) {
      const products = await fetchProducts(offset, limit);
      
      if (products.length === 0) {
        hasMore = false;
      } else {
        allProducts = allProducts.concat(products);
        offset += limit;
        
        // Stop if we got fewer items than the limit
        if (products.length < limit) {
          hasMore = false;
        }
      }
    }
    
    return allProducts;
  } catch (error) {
    throw error;
  }
}

// Example usage
async function main() {
  try {
    const products = await getAll();
    console.log(`Total products: ${products.length}`);
    
    // Display all products
    if (products.length > 0) {
      console.log('\nAll products:');
      products.forEach((product, index) => {
        console.log(`\n${index + 1}. ${product.title} - $${product.price}`);
        console.log(`   ID: ${product.id}, Category: ${product.category.name}`);
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Export for use in other modules
module.exports = { getAll };

// Run example if executed directly
if (require.main === module) {
  main();
}
