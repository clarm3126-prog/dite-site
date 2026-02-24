import { renderCategories, renderProducts, renderReviews } from './views.js';

// --- Router and Search ---
const routes = {
    '#categories': renderCategories,
    '#products': renderProducts,
    '#reviews': renderReviews
};

function router() {
    const path = window.location.hash.split('?')[0] || '#categories';
    const renderFunction = routes[path];
    const popularProductsSection = document.getElementById('popular-products-section');
    const appRoot = document.getElementById('app-root');

    // Default view shows popular products and hides the main app-root
    if (path === '#categories' || path === '') {
        popularProductsSection.style.display = 'block';
        appRoot.style.display = 'none';
    } else {
        // Other views hide popular products and show the main app-root
        popularProductsSection.style.display = 'none';
        appRoot.style.display = 'block'; // Use 'block' for reviews, 'grid' for products/categories
        
        if (path === '#products') {
            appRoot.style.display = 'grid';
        } else {
            appRoot.style.display = 'block';
        }
    }

    if (renderFunction) {
        renderFunction();
    }
}

window.addEventListener('hashchange', router);

const searchBar = document.getElementById('search-bar');
searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value;
    window.location.hash = '#products';
    // The router will call renderProducts, but we may need to pass the search term.
    // Let's adjust this to be cleaner.
    if (window.location.hash === '#products') {
        renderProducts(searchTerm);
    }
});


// --- Popular Product Card Web Component ---
class PopularProductCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const name = this.getAttribute('name');
        const image = this.getAttribute('image');
        const price = this.getAttribute('price');
        const link = this.getAttribute('link');

        this.shadowRoot.innerHTML = `
            <style>
                .popular-product-card { background-color: white; border-radius: 15px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); padding: 1.5rem; cursor: pointer; transition: transform 0.3s ease, box-shadow 0.3s ease; display: flex; flex-direction: column; justify-content: space-between; text-decoration: none; color: inherit; }
                .popular-product-card:hover { transform: translateY(-5px); box-shadow: 0 8px 16px rgba(0,0,0,0.2); }
                h3 { margin-top: 0; color: #03c75a; font-size: 1.5rem; }
                img { width: 100%; height: 200px; object-fit: cover; border-radius: 10px; margin-bottom: 1rem; }
                .price { font-size: 1.2rem; font-weight: bold; color: #e53935; margin: 0.5rem 0; }
                .buy-button { background-color: #03c75a; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 5px; cursor: pointer; text-decoration: none; text-align: center; transition: background-color 0.3s ease; margin-top: auto; }
                .buy-button:hover { background-color: #02b04e; }
            </style>
            <a href="${link}" target="_blank" class="popular-product-card">
                <div>
                    <img src="${image}" alt="${name}">
                    <h3>${name}</h3>
                    <p class="price">${price}</p>
                </div>
                <div class="buy-button">Buy Now</div>
            </a>
        `;
    }
}
customElements.define('popular-product-card', PopularProductCard);

// --- Render Popular Products ---
function renderPopularProducts() {
    const popularProductsGrid = document.getElementById('popular-products-grid');
    popularProductsGrid.innerHTML = '';
    const popularProducts = [
        { name: 'Stylish T-Shirt', image: 'https://via.placeholder.com/300x200.png?text=Stylish+T-Shirt', price: '₩25,000', link: '#' },
        { name: 'Modern Backpack', image: 'https://via.placeholder.com/300x200.png?text=Modern+Backpack', price: '₩78,000', link: '#' },
        { name: 'Wireless Headphones', image: 'https://via.placeholder.com/300x200.png?text=Wireless+Headphones', price: '₩150,000', link: '#' }
    ];
    popularProducts.forEach(product => {
        const productCard = document.createElement('popular-product-card');
        productCard.setAttribute('name', product.name);
        productCard.setAttribute('image', product.image);
        productCard.setAttribute('price', product.price);
        productCard.setAttribute('link', product.link);
        popularProductsGrid.appendChild(productCard);
    });
}

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    renderPopularProducts();
    router(); 
});
