import { renderCategories, renderProducts, renderReviews, renderPartnershipForm } from './views.js';

// --- Router and Search ---
const routes = {
    '#categories': renderCategories,
    '#products': renderProducts,
    '#reviews': renderReviews,
    '#partnership': renderPartnershipForm
};

function router() {
    const path = window.location.hash.split('?')[0] || '#categories';
    const renderFunction = routes[path];
    const popularProductsSection = document.getElementById('popular-products-section');
    const appRoot = document.getElementById('app-root');

    if (path === '#categories' || path === '') {
        popularProductsSection.style.display = 'block';
        appRoot.style.display = 'none';
    } else {
        popularProducts-section.style.display = 'none';
        appRoot.style.display = path === '#products' ? 'grid' : 'block';
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
    if (window.location.hash === '#products') {
        renderProducts(searchTerm);
    }
});

// --- Popular Product Card Web Component (with Share functionality) ---
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
        const productId = this.getAttribute('product-id');

        this.shadowRoot.innerHTML = `
            <style>
                .popular-product-card {
                    background-color: white; border-radius: 15px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    padding: 1.5rem; cursor: pointer; transition: all 0.3s ease; display: flex;
                    flex-direction: column; justify-content: space-between; text-decoration: none; color: inherit;
                }
                .popular-product-card:hover { transform: translateY(-5px); box-shadow: 0 8px 16px rgba(0,0,0,0.2); }
                h3 { margin-top: 0; color: #03c75a; font-size: 1.5rem; }
                img { width: 100%; height: 200px; object-fit: cover; border-radius: 10px; margin-bottom: 1rem; }
                .price { font-size: 1.2rem; font-weight: bold; color: #e53935; margin: 0.5rem 0; }
                .buy-button { background-color: #03c75a; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 5px; cursor: pointer; text-decoration: none; text-align: center; display: block; margin-top: 1rem; }
                .share-button { background: #eee; border: none; padding: 0.5rem; border-radius: 5px; cursor: pointer; width: 100%; margin-top: 1rem; }
                .social-icons { display: none; margin-top: 1rem; text-align: center; }
                .social-icons a { margin: 0 0.5rem; color: #333; font-size: 1.2rem; }
            </style>
            <div class="popular-product-card">
                 <div class="card-content">
                    <img src="${image}" alt="${name}">
                    <h3>${name}</h3>
                    <p class="price">${price}</p>
                </div>
                <div class="card-actions">
                    <button class="share-button">Share</button>
                    <div class="social-icons">
                        <a href="#" class="share-fb"><i class="fab fa-facebook"></i></a>
                        <a href="#" class="share-tw"><i class="fab fa-twitter"></i></a>
                        <a href="#" class="copy-link"><i class="fas fa-link"></i></a>
                    </div>
                    <a href="${link}" target="_blank" class="buy-button">Buy Now</a>
                </div>
            </div>
        `;

        this.shadowRoot.querySelector('.card-content').addEventListener('click', () => {
            window.location.hash = `#reviews?productId=${productId}`;
        });

        const shareButton = this.shadowRoot.querySelector('.share-button');
        const socialIcons = this.shadowRoot.querySelector('.social-icons');
        shareButton.addEventListener('click', (e) => {
            e.stopPropagation();
            socialIcons.style.display = socialIcons.style.display === 'block' ? 'none' : 'block';
        });

        const productUrl = `${window.location.origin}/#reviews?productId=${productId}`;
        const shareText = `Check out this great product: ${name}`;

        this.shadowRoot.querySelector('.share-fb').href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
        this.shadowRoot.querySelector('.share-tw').href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(shareText)}`;
        this.shadowRoot.querySelector('.copy-link').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            navigator.clipboard.writeText(productUrl).then(() => alert('Link copied!'));
        });
    }
}
customElements.define('popular-product-card', PopularProductCard);

// --- Render Popular Products ---
function renderPopularProducts() {
    const popularProductsGrid = document.getElementById('popular-products-grid');
    popularProductsGrid.innerHTML = '';
    const popularProducts = [
        { id: 'p1', name: 'Stylish T-Shirt', image: 'https://via.placeholder.com/300x200.png?text=Stylish+T-Shirt', price: '₩25,000', link: '#' },
        { id: 'p2', name: 'Modern Backpack', image: 'https://via.placeholder.com/300x200.png?text=Modern+Backpack', price: '₩78,000', link: '#' },
        { id: 'p3', name: 'Wireless Headphones', image: 'https://via.placeholder.com/300x200.png?text=Wireless+Headphones', price: '₩150,000', link: '#' }
    ];
    popularProducts.forEach(product => {
        const productCard = document.createElement('popular-product-card');
        productCard.setAttribute('product-id', product.id);
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
