import { renderCategories, renderProducts, renderReviews } from './views.js';

// --- Router and Search (Existing Code) ---
const routes = {
    '#categories': renderCategories,
    '#products': renderProducts,
    '#reviews': renderReviews
};

function router() {
    const path = window.location.hash.split('?')[0] || '#categories';
    const renderFunction = routes[path];
    
    // Hide popular products section if we are navigating to a specific view
    const popularProductsSection = document.getElementById('popular-products-section');
    if (path !== '#categories') { // Or whichever is your default/home view
        popularProductsSection.style.display = 'none';
        document.getElementById('app-root').style.display = 'grid';

    } else {
        popularProductsSection.style.display = 'block';
        document.getElementById('app-root').style.display = 'none';
    }

    if (renderFunction) {
        renderFunction();
    }
}

window.addEventListener('hashchange', router);
// Ensure the router is also called on load to set the initial state
// window.addEventListener('load', router); // This will be called after the popular products are rendered

const searchBar = document.getElementById('search-bar');
searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value;
    window.location.hash = '#products';
    renderProducts(searchTerm);
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
                /* Reusing styles from the main stylesheet for encapsulation */
                .popular-product-card {
                    background-color: white;
                    border-radius: 15px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    padding: 1.5rem;
                    cursor: pointer;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    text-decoration: none;
                    color: inherit;
                }
                .popular-product-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
                }
                h3 {
                    margin-top: 0;
                    color: #03c75a;
                    font-size: 1.5rem;
                }
                img {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                    border-radius: 10px;
                    margin-bottom: 1rem;
                }
                .price {
                    font-size: 1.2rem;
                    font-weight: bold;
                    color: #e53935;
                    margin: 0.5rem 0;
                }
                .buy-button {
                    background-color: #03c75a;
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 5px;
                    cursor: pointer;
                    text-decoration: none;
                    text-align: center;
                    transition: background-color 0.3s ease;
                    margin-top: auto; /* Pushes the button to the bottom */
                }
                .buy-button:hover {
                    background-color: #02b04e;
                }
            </style>
            <div class="popular-product-card">
                <div>
                    <img src="${image}" alt="${name}">
                    <h3>${name}</h3>
                    <p class="price">${price}</p>
                </div>
                <a href="${link}" target="_blank" class="buy-button">Buy Now</a>
            </div>
        `;
    }
}
customElements.define('popular-product-card', PopularProductCard);

// --- Render Popular Products ---
function renderPopularProducts() {
    const popularProductsGrid = document.getElementById('popular-products-grid');
    // Clear existing content
    popularProductsGrid.innerHTML = '';

    // Placeholder data - replace with your actual data
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
    router(); // Call router after popular products are rendered
});
