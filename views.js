import { products } from './products.js';
import { categories } from './categories.js';

const appRoot = document.getElementById('app-root');

// --- Data Accessor ---

// Find a product by its ID
export async function getProductById(id) {
    return products.find(p => p.id === id);
}

// --- View Rendering ---

// Render the list of categories
export function renderCategories() {
    appRoot.innerHTML = `
        <section id="categories-section">
            <h2>카테고리</h2>
            <div class="category-grid"></div>
        </section>
    `;

    const categoryGrid = appRoot.querySelector('.category-grid');
    categories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        categoryCard.innerHTML = `
            <img src="${category.imageUrl}" alt="${category.name}">
            <h3>${category.name}</h3>
        `;
        categoryCard.addEventListener('click', () => {
            window.location.hash = `#products?category=${category.id}`;
        });
        categoryGrid.appendChild(categoryCard);
    });
}

// Render products, with optional filtering by category or search term
export function renderProducts() {
    const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
    const categoryId = params.get('category');
    const searchTerm = params.get('search') || '';

    let filteredProducts = products;

    if (categoryId) {
        filteredProducts = products.filter(p => p.categoryId === categoryId);
    }
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            p.brand.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    const categoryName = categoryId ? categories.find(c => c.id === categoryId)?.name : (searchTerm ? `'${searchTerm}' 검색 결과` : '전체 상품');

    appRoot.innerHTML = `
        <section id="product-list-section">
            <h2>${categoryName}</h2>
            <div class="product-grid"></div>
        </section>
    `;

    const productGrid = appRoot.querySelector('.product-grid');
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = '<p>해당 조건의 상품이 없습니다.</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const productCard = document.createElement('popular-product-card');
        productCard.setAttribute('name', product.name);
        productCard.setAttribute('image', product.imageUrl);
        productCard.setAttribute('price', product.price);
        // The `product-id` attribute is now used by main.js to trigger the modal
        productCard.dataset.productId = product.id; 
        productGrid.appendChild(productCard);
    });
}

// Deprecated: Kept for reference, but functionality is replaced by the modal.
export function renderReviews() {
    appRoot.innerHTML = '<p>리뷰 기능이 업데이트 되었습니다. 제품 상세 보기에서 확인하세요.</p>';
}

// Render the partnership inquiry form
export function renderPartnershipForm() {
    appRoot.innerHTML = `
        <section id="partnership-section" class="partnership-content">
            <h2>파트너가 되어주세요</h2>
            <p>네이버 브랜드 커넥트와 함께 브랜드를 성장시키고 새로운 고객과 만나보세요.</p>
            <form id="partnership-form" class="partnership-form" action="https://formspree.io/f/YOUR_FORMSPREE_ID" method="POST">
                <input type="text" name="name" placeholder="이름" required>
                <input type="email" name="email" placeholder="이메일" required>
                <textarea name="message" rows="4" placeholder="문의 내용" required></textarea>
                <button type="submit" class="cta-button">문의하기</button>
            </form>
        </section>
    `;
}
