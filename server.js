const express = require('express');
const { getAll } = require('./dashboard');

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static('public'));

// Route to display products
app.get('/', async (req, res) => {
  try {
    const products = await getAll();
    
    let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Dashboard - All Products</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f5f5f5;
          padding: 20px;
        }
        
        h1 {
          text-align: center;
          color: #333;
          margin-bottom: 30px;
        }
        
        .search-container {
          display: flex;
          justify-content: center;
          margin-bottom: 30px;
          gap: 10px;
        }
        
        .search-input {
          width: 300px;
          padding: 12px 15px;
          border: 2px solid #ddd;
          border-radius: 6px;
          font-size: 1em;
          transition: border-color 0.3s ease;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #0277bd;
          box-shadow: 0 0 8px rgba(2, 119, 189, 0.2);
        }
        
        .search-results {
          text-align: center;
          color: #666;
          font-size: 0.95em;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .pagination-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 20px 0;
          padding: 15px;
          background: white;
          border-radius: 6px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .sorting-buttons {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .sort-btn {
          padding: 10px 16px;
          border: 2px solid #27ae60;
          background: white;
          color: #27ae60;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          font-size: 0.95em;
        }
        
        .sort-btn:hover {
          background: #27ae60;
          color: white;
        }
        
        .sort-btn.active {
          background: #27ae60;
          color: white;
        }
        
        .items-per-page {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .items-per-page select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.95em;
          cursor: pointer;
        }
        
        .pagination-buttons {
          display: flex;
          gap: 5px;
        }
        
        .pagination-buttons button {
          padding: 8px 12px;
          border: 1px solid #0277bd;
          background: white;
          color: #0277bd;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .pagination-buttons button:hover {
          background: #0277bd;
          color: white;
        }
        
        .pagination-buttons button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .page-info {
          text-align: center;
          color: #333;
          font-weight: 500;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          overflow: hidden;
        }
        
        thead {
          background: #333;
          color: white;
          position: sticky;
          top: 0;
        }
        
        th {
          padding: 15px;
          text-align: left;
          font-weight: 600;
          border-right: 1px solid #555;
        }
        
        th:last-child {
          border-right: none;
        }
        
        td {
          padding: 15px;
          border-right: 1px solid #ddd;
          vertical-align: middle;
        }
        
        td:last-child {
          border-right: none;
        }
        
        /* Striped rows - black and white alternating */
        tbody tr:nth-child(odd) {
          background-color: #f9f9f9;
        }
        
        tbody tr:nth-child(even) {
          background-color: #ffffff;
        }
        
        tbody tr:hover {
          background-color: #f0f0f0 !important;
          transition: background-color 0.3s ease;
        }
        
        .product-id {
          font-weight: 600;
          color: #333;
        }
        
        .product-title {
          font-weight: 500;
          color: #222;
        }
        
        .price {
          color: #27ae60;
          font-weight: 600;
          font-size: 1.1em;
        }
        
        .category {
          background: #e8f4f8;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 0.9em;
          color: #0277bd;
        }
        
        .images-container {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .product-image {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 4px;
          border: 1px solid #ddd;
          cursor: pointer;
          transition: transform 0.3s ease;
        }
        
        .product-image:hover {
          transform: scale(1.1);
        }
        
        .detail-btn {
          padding: 6px 12px;
          background: #0277bd;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          text-decoration: none;
          font-size: 0.9em;
          transition: background 0.3s ease;
        }
        
        .detail-btn:hover {
          background: #01579b;
        }
        
        .summary {
          text-align: center;
          margin-top: 20px;
          font-size: 1.1em;
          color: #333;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>📦 Dashboard - All Products</h1>
        
        <div class="search-container">
          <input 
            type="text" 
            id="searchInput" 
            class="search-input" 
            placeholder="🔍 Tìm kiếm sản phẩm..."
            onkeyup="searchProducts()"
          >
          <div class="search-results">
            <span id="resultCount">Tổng: ${products.length} sản phẩm</span>
          </div>
        </div>
        
        <div class="sorting-buttons">
          <button class="sort-btn" onclick="sortByName('asc')">📛 Tên (A-Z)</button>
          <button class="sort-btn" onclick="sortByName('desc')">📛 Tên (Z-A)</button>
          <button class="sort-btn" onclick="sortByPrice('asc')">💰 Giá (Thấp - Cao)</button>
          <button class="sort-btn" onclick="sortByPrice('desc')">💰 Giá (Cao - Thấp)</button>
          <button class="sort-btn" onclick="resetSort()">🔄 Khôi phục</button>
        </div>
        
        <div class="pagination-controls">
          <div class="items-per-page">
            <label>Hiển thị:</label>
            <select id="itemsPerPage" onchange="changeItemsPerPage()">
              <option value="5">5 sản phẩm</option>
              <option value="10" selected>10 sản phẩm</option>
              <option value="20">20 sản phẩm</option>
            </select>
          </div>
          
          <div class="page-info">
            <span id="pageInfo">Trang 1</span>
          </div>
          
          <div class="pagination-buttons">
            <button onclick="goToPage(1)">«</button>
            <button onclick="previousPage()">‹</button>
            <span id="currentPage" style="padding: 8px 12px;">1</span>
            <button onclick="nextPage()">›</button>
            <button onclick="lastPage()">»</button>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th style="width: 60px;">ID</th>
              <th style="width: 200px;">Title</th>
              <th style="width: 100px;">Price</th>
              <th style="width: 120px;">Category</th>
              <th style="width: 400px;">Images</th>
              <th style="width: 100px;">Chi tiết</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    // Add product rows
    products.forEach((product, index) => {
      let imagesHtml = '';
      if (product.images && product.images.length > 0) {
        product.images.forEach(img => {
          imagesHtml += `<img src="${img}" alt="${product.title}" class="product-image" title="${product.title}">`;
        });
      } else {
        imagesHtml = '<span class="no-images">No images</span>';
      }
      
      html += `
        <tr>
          <td class="product-id">${product.id}</td>
          <td class="product-title">${product.title}</td>
          <td class="price">$${product.price}</td>
          <td><span class="category">${product.category.name}</span></td>
          <td>
            <div class="images-container">
              ${imagesHtml}
            </div>
          </td>
        </tr>
      `;
    });
    
    html += `
          </tbody>
        </table>
        
        <div class="summary">
          <strong>Total Products: ${products.length}</strong>
        </div>
      </div>
      
      <script>
        let allProducts = ${JSON.stringify(products)};
        let currentPage = 1;
        let itemsPerPage = 10;
        let sortBy = null;
        let sortOrder = null;
        
        function getFilteredAndSortedProducts() {
          const searchInput = document.getElementById('searchInput').value.toLowerCase();
          let filtered = allProducts.filter(product => 
            product.title.toLowerCase().includes(searchInput)
          );
          
          // Apply sorting
          if (sortBy && sortOrder) {
            filtered = filtered.sort((a, b) => {
              let aValue, bValue;
              
              if (sortBy === 'name') {
                aValue = a.title.toLowerCase();
                bValue = b.title.toLowerCase();
              } else if (sortBy === 'price') {
                aValue = a.price;
                bValue = b.price;
              }
              
              if (sortOrder === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
              } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
              }
            });
          }
          
          return filtered;
        }
        
        function displayProducts() {
          const filteredProducts = getFilteredAndSortedProducts();
          const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
          
          // Validate page number
          if (currentPage > totalPages && totalPages > 0) {
            currentPage = totalPages;
          } else if (currentPage < 1) {
            currentPage = 1;
          }
          
          const startIndex = (currentPage - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
          
          const tableBody = document.querySelector('tbody');
          tableBody.innerHTML = '';
          
          paginatedProducts.forEach(product => {
            let imagesHtml = '';
            if (product.images && product.images.length > 0) {
              product.images.forEach(img => {
                imagesHtml += \`<img src="\${img}" alt="\${product.title}" class="product-image" title="\${product.title}">\`;
              });
            } else {
              imagesHtml = '<span class="no-images">Không có hình</span>';
            }
            
            const row = \`
              <tr>
                <td class="product-id">\${product.id}</td>
                <td class="product-title">\${product.title}</td>
                <td class="price">$\${product.price}</td>
                <td><span class="category">\${product.category.name}</span></td>
                <td>
                  <div class="images-container">
                    \${imagesHtml}
                  </div>
                </td>
                <td>
                  <a href="/product/\${product.slug}" class="detail-btn">Xem chi tiết</a>
                </td>
              </tr>
            \`;
            tableBody.innerHTML += row;
          });
          
          // Update pagination info
          document.getElementById('currentPage').textContent = currentPage;
          document.getElementById('pageInfo').textContent = \`Trang \${currentPage} / \${totalPages || 1}\`;
          
          // Update button states
          document.querySelector('.pagination-buttons button:nth-child(1)').disabled = currentPage === 1;
          document.querySelector('.pagination-buttons button:nth-child(2)').disabled = currentPage === 1;
          document.querySelector('.pagination-buttons button:nth-child(4)').disabled = currentPage === totalPages || totalPages === 0;
          document.querySelector('.pagination-buttons button:nth-child(5)').disabled = currentPage === totalPages || totalPages === 0;
        }
        
        function searchProducts() {
          currentPage = 1;
          const filteredProducts = getFilteredAndSortedProducts();
          const resultCount = document.getElementById('resultCount');
          const searchInput = document.getElementById('searchInput').value;
          
          if (searchInput === '') {
            resultCount.textContent = \`Tổng: \${allProducts.length} sản phẩm\`;
          } else {
            resultCount.textContent = \`Tìm thấy: \${filteredProducts.length} sản phẩm\`;
          }
          
          displayProducts();
        }
        
        function sortByName(order) {
          currentPage = 1;
          sortBy = 'name';
          sortOrder = order;
          updateSortButtons('name', order);
          displayProducts();
        }
        
        function sortByPrice(order) {
          currentPage = 1;
          sortBy = 'price';
          sortOrder = order;
          updateSortButtons('price', order);
          displayProducts();
        }
        
        function resetSort() {
          currentPage = 1;
          sortBy = null;
          sortOrder = null;
          updateSortButtons(null, null);
          displayProducts();
        }
        
        function updateSortButtons(type, order) {
          const buttons = document.querySelectorAll('.sort-btn');
          buttons.forEach(btn => btn.classList.remove('active'));
          
          if (type === 'name' && order === 'asc') {
            buttons[0].classList.add('active');
          } else if (type === 'name' && order === 'desc') {
            buttons[1].classList.add('active');
          } else if (type === 'price' && order === 'asc') {
            buttons[2].classList.add('active');
          } else if (type === 'price' && order === 'desc') {
            buttons[3].classList.add('active');
          }
        }
        
        function changeItemsPerPage() {
          itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
          currentPage = 1;
          displayProducts();
        }
        
        function nextPage() {
          const filteredProducts = getFilteredAndSortedProducts();
          const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
          if (currentPage < totalPages) {
            currentPage++;
            displayProducts();
          }
        }
        
        function previousPage() {
          if (currentPage > 1) {
            currentPage--;
            displayProducts();
          }
        }
        
        function goToPage(page) {
          currentPage = page;
          displayProducts();
        }
        
        function lastPage() {
          const filteredProducts = getFilteredAndSortedProducts();
          const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
          currentPage = totalPages;
          displayProducts();
        }
        
        // Initialize
        displayProducts();
      </script>
    </body>
    </html>
    `;
    
    res.send(html);
  } catch (error) {
    res.status(500).send(`<h1>Error</h1><p>${error.message}</p>`);
  }
});

// Route to display product detail
app.get('/product/:slug', async (req, res) => {
  try {
    const products = await getAll();
    const product = products.find(p => p.slug === req.params.slug);
    
    if (!product) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head><title>Not Found</title></head>
        <body style="font-family: Arial; text-align: center; padding: 50px;">
          <h1>❌ Sản phẩm không tìm thấy</h1>
          <a href="/" style="color: #0277bd; text-decoration: none; font-size: 1.1em;">← Quay lại trang chính</a>
        </body>
        </html>
      `);
    }
    
    let imagesHtml = '';
    if (product.images && product.images.length > 0) {
      imagesHtml = product.images.map(img => 
        `<div style="margin-bottom: 20px;"><img src="${img}" style="max-width: 100%; height: auto; border-radius: 8px; border: 1px solid #ddd;"></div>`
      ).join('');
    } else {
      imagesHtml = '<p style="color: #999;">Không có hình ảnh</p>';
    }
    
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${product.title}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #f5f5f5;
          padding: 20px;
        }
        
        .container {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .back-btn {
          display: inline-block;
          margin-bottom: 20px;
          padding: 10px 20px;
          background: #27ae60;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          transition: background 0.3s ease;
        }
        
        .back-btn:hover {
          background: #229954;
        }
        
        .product-header {
          display: flex;
          gap: 30px;
          margin-bottom: 30px;
        }
        
        .product-images {
          flex: 1;
          min-width: 300px;
        }
        
        .product-info {
          flex: 1;
        }
        
        h1 {
          color: #333;
          font-size: 2em;
          margin-bottom: 15px;
        }
        
        .price {
          font-size: 1.8em;
          color: #27ae60;
          font-weight: bold;
          margin-bottom: 15px;
        }
        
        .category-badge {
          display: inline-block;
          background: #e8f4f8;
          color: #0277bd;
          padding: 8px 15px;
          border-radius: 20px;
          margin-bottom: 20px;
          font-weight: 500;
        }
        
        .product-id {
          color: #666;
          font-size: 0.95em;
          margin-bottom: 15px;
        }
        
        .description {
          color: #555;
          line-height: 1.6;
          font-size: 1.05em;
          margin-bottom: 20px;
        }
        
        .meta-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
        }
        
        .meta-item {
          padding: 10px;
          background: #f9f9f9;
          border-radius: 4px;
        }
        
        .meta-label {
          font-weight: 600;
          color: #333;
          font-size: 0.9em;
        }
        
        .meta-value {
          color: #0277bd;
          margin-top: 5px;
        }
        
        @media (max-width: 600px) {
          .product-header {
            flex-direction: column;
          }
          
          .meta-info {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <a href="/" class="back-btn">← Quay lại</a>
        
        <div class="product-header">
          <div class="product-images">
            ${imagesHtml}
          </div>
          
          <div class="product-info">
            <h1>${product.title}</h1>
            
            <div class="price">$${product.price}</div>
            
            <span class="category-badge">${product.category.name}</span>
            
            <div class="product-id">ID: ${product.id}</div>
            
            <div class="description">
              ${product.description}
            </div>
            
            <div class="meta-info">
              <div class="meta-item">
                <div class="meta-label">Slug</div>
                <div class="meta-value">${product.slug}</div>
              </div>
              
              <div class="meta-item">
                <div class="meta-label">Số hình ảnh</div>
                <div class="meta-value">${product.images ? product.images.length : 0}</div>
              </div>
              
              <div class="meta-item">
                <div class="meta-label">Tạo lúc</div>
                <div class="meta-value">${new Date(product.creationAt).toLocaleDateString('vi-VN')}</div>
              </div>
              
              <div class="meta-item">
                <div class="meta-label">Cập nhật lúc</div>
                <div class="meta-value">${new Date(product.updatedAt).toLocaleDateString('vi-VN')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;
    
    res.send(html);
  } catch (error) {
    res.status(500).send(`<h1>Error</h1><p>${error.message}</p>`);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
