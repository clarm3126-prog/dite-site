import { products } from './products.js';

async function router() {
    const path = window.location.hash.split('?')[0] || '#categories';
    const popularProductsSection = document.getElementById('popular-products-section');
    const heroSection = document.getElementById('hero-section');
    const appRoot = document.getElementById('app-root');

    // Show/hide sections based on the current path
    const isHomePage = path === '#categories' || path === '';
    heroSection.style.display = isHomePage ? 'block' : 'none';
    popularProductsSection.style.display = 'none'; // Always hide popular products on initial load
    appRoot.style.display = 'grid'; // Always show the app-root

    // Dynamic import for code splitting
    try {
        const views = await import('./views.js');
        let renderFunction;
        switch (path) {
            case '#categories':
            case '':
                renderFunction = views.renderCategories;
                break;
            case '#products':
                renderFunction = views.renderProducts;
                break;
            case '#reviews':
                renderFunction = views.renderReviews;
                break;
            case '#partnership':
                renderFunction = views.renderPartnershipForm;
                break;
        }

        if (renderFunction) {
            await renderFunction();
        }
    } catch (error) {
        console.error("Failed to load the view module", error);
        appRoot.innerHTML = '<p>Error loading page. Please try again.</p>';
    }
}

window.addEventListener('hashchange', router);

// --- Search Bar ---
document.getElementById('search-bar').addEventListener('input', async (e) => {
    const searchTerm = e.target.value;
    window.location.hash = '#products';
    try {
        const views = await import('./views.js');
        views.renderProducts(searchTerm);
    } catch (error) {
        console.error("Failed to load products for search", error);
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
        const productId = this.getAttribute('product-id');

        this.shadowRoot.innerHTML = `
            <style>
                :host { text-decoration: none; color: inherit; }
                .popular-product-card {
                    background-color: var(--white);
                    border-radius: 15px;
                    box-shadow: var(--shadow);
                    padding: 1.5rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 100%;
                }
                .popular-product-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-hover); }
                h3 { margin: 1rem 0 0.5rem 0; color: var(--primary-color); font-size: 1.5rem; }
                img { width: 100%; height: 200px; object-fit: cover; border-radius: 10px; }
                .price { font-size: 1.2rem; font-weight: bold; color: #e53935; margin: 0.5rem 0; }
                .actions { display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; }
                .buy-button { background-color: var(--primary-color); color: var(--white); border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; text-decoration: none; text-align: center; }
                .share-button { background: #eee; border: 1px solid #ddd; padding: 0.5rem; border-radius: 8px; cursor: pointer; }
                .social-icons { display: none; margin-top: 0.5rem; background: #f9f9f9; padding: 0.5rem; border-radius: 8px; }
                .social-icons a { margin: 0 0.5rem; }
            </style>
            <div class="popular-product-card">
                <div class="card-content">
                    <img src="${image}" alt="${name}" loading="lazy">
                    <h3>${name}</h3>
                    <p class="price">${price}</p>
                </div>
                <div class="actions">
                    <a href="${link}" target="_blank" class="buy-button">Buy Now</a>
                    <button class="share-button"><i class="fas fa-share-alt"></i></button>
                </div>
                <div class="social-icons">
                    <a href="#" class="share-fb"><i class="fab fa-facebook"></i></a>
                    <a href="#" class="share-tw"><i class="fab fa-twitter"></i></a>
                    <a href="#" class="copy-link"><i class="fas fa-link"></i></a>
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

        // Social sharing logic...
    }
}
customElements.define('popular-product-card', PopularProductCard);

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    router(); 
});
