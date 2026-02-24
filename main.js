document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const productGrid = document.getElementById('product-grid');
    const productGridSection = document.getElementById('product-grid-section');
    const productDetailSection = document.getElementById('product-detail-section');
    const searchInput = document.getElementById('search-input');
    const cartIcon = document.getElementById('cart-icon');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartItemCount = document.getElementById('cart-item-count');
    const cartTotalPrice = document.getElementById('cart-total-price');

    // --- State Management ---
    let allProducts = [];
    let cart = [];

    // --- Web Component Definition ---
    if (!customElements.get('product-card')) {
        class ProductCard extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
                this.handleCardClick = this.handleCardClick.bind(this);
                this.handleAddToCart = this.handleAddToCart.bind(this);
            }

            static get observedAttributes() {
                return ['rank', 'name', 'image', 'description', 'price', 'id'];
            }

            connectedCallback() {
                this.render();
                this.shadowRoot.querySelector('.card-wrapper').addEventListener('click', this.handleCardClick);
                this.shadowRoot.querySelector('.add-to-cart-btn').addEventListener('click', this.handleAddToCart);
            }

            disconnectedCallback() {
                this.shadowRoot.querySelector('.card-wrapper').removeEventListener('click', this.handleCardClick);
                this.shadowRoot.querySelector('.add-to-cart-btn').removeEventListener('click', this.handleAddToCart);
            }

            handleCardClick(event) {
                if (event.target.closest('.add-to-cart-btn')) return; // Ignore clicks on the cart button
                const productId = this.getAttribute('id');
                this.dispatchEvent(new CustomEvent('product-view', { bubbles: true, composed: true, detail: { productId } }));
            }

            handleAddToCart(event) {
                event.stopPropagation(); // Prevent card click event
                const productId = this.getAttribute('id');
                this.dispatchEvent(new CustomEvent('add-to-cart', { bubbles: true, composed: true, detail: { productId } }));
            }

            render() {
                // CSS is now mostly global, but we keep some component-specific styles
                this.shadowRoot.innerHTML = `
                <style>
                    :host { display: block; cursor: pointer; }
                    /* Component-specific styles can go here if needed */
                    .card-wrapper { background: #fff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); overflow: hidden; transition: all 0.3s ease; height: 100%; display: flex; flex-direction: column; position: relative; }
                    .card-wrapper:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); }
                    .rank-badge { position: absolute; top: 0; left: 0; background: var(--secondary-color, #FF9800); color: #fff; font-family: var(--font-heading, sans-serif); font-weight: 700; padding: .5rem .8rem; border-bottom-right-radius: 12px; z-index: 2; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
                    .card-image { width: 100%; height: 200px; object-fit: cover; }
                    .card-content { padding: 1.5rem; flex-grow: 1; display: flex; flex-direction: column; }
                    h3 { font-family: var(--font-heading, sans-serif); margin: 0 0 .5rem; font-size: 1.3rem; }
                    p { margin: 0 0 1rem; flex-grow: 1; }
                    .card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
                    .price { font-size: 1.5rem; font-weight: 500; font-family: var(--font-heading, sans-serif); }
                    .add-to-cart-btn { background: var(--primary-color, #4CAF50); color: white; border: none; padding: .75rem 1.25rem; font-family: var(--font-body, sans-serif); font-weight: 500; font-size: 1rem; border-radius: 8px; cursor: pointer; transition: all 0.3s; }
                    .add-to-cart-btn:hover { background: #45a049; transform: scale(1.05); }
                </style>
                <div class="card-wrapper">
                    <div class="rank-badge">#${this.getAttribute('rank')}</div>
                    <img class="card-image" src="${this.getAttribute('image')}" alt="${this.getAttribute('name')}">
                    <div class="card-content">
                        <h3>${this.getAttribute('name')}</h3>
                        <p>${this.getAttribute('description').substring(0, 100)}...</p>
                        <div class="card-footer">
                            <span class="price">${this.getAttribute('price')}</span>
                            <button class="add-to-cart-btn">Add to Cart</button>
                        </div>
                    </div>
                </div>
            `;
            }
        }
        customElements.define('product-card', ProductCard);
    }

    // --- Data Fetching & Initializing ---
    async function initializeApp() {
        // In a real app, you would fetch this from an API
        allProducts = [
            { id: 'p1', rank: 1, name: 'Pro-NRG Protein Shake', description: 'A premium whey protein shake for muscle recovery and growth. Contains 25g of high-quality protein per serving with a complete amino acid profile.', price: 45.99, image: 'https://images.unsplash.com/photo-1594498653385-d5172c532c00?q=80&w=800&auto=format&fit=crop' },
            { id: 'p2', rank: 2, name: 'GreenLife Superfood Mix', description: 'A powerful blend of organic greens, fruits, and antioxidants to boost your daily energy and support your immune system. Just one scoop a day!', price: 32.50, image: 'https://images.unsplash.com/photo-1627822459390-3165215af159?q=80&w=800&auto=format&fit=crop' },
            { id: 'p3', rank: 3, name: 'Keto-Fit Snack Bars', description: 'Delicious and satisfying low-carb, high-fat snack bars perfect for a ketogenic diet. Packed with healthy fats and only 2g of net carbs.', price: 24.99, image: 'https://images.unsplash.com/photo-1558552399-31e43884b244?q=80&w=800&auto=format&fit=crop' },
            { id: 'p4', rank: 4, name: 'Vegan Omega-3 Capsules', description: 'Sustainably sourced, plant-based Omega-3 derived from algae oil. Supports brain function, heart health, and joint mobility without any fishy aftertaste.', price: 29.99, image: 'https://images.unsplash.com/photo-1607958994353-619a93a54d5b?q=80&w=800&auto=format&fit=crop' },
            { id: 'p5', rank: 5, name: 'ZenMind Herbal Tea', description: 'A calming and aromatic blend of organic chamomile, lavender, and passionflower to help you relax, de-stress, and prepare for a restful night\'s sleep.', price: 15.00, image: 'https://images.unsplash.com/photo-1574609214959-693454b69c67?q=80&w=800&auto=format&fit=crop' },
            { id: 'p6', rank: 6, name: 'Pure Hydration Electrolytes', description: 'A sugar-free electrolyte powder designed to replenish essential minerals, improve hydration, and boost performance during workouts or daily activities.', price: 22.00, image: 'https://images.unsplash.com/photo-1554228477-d03a11679803?q=80&w=800&auto=format&fit=crop' },
        ];
        renderProductGrid(allProducts);
        setupEventListeners();
    }

    // --- Rendering Functions ---
    function renderProductGrid(products) {
        productGrid.innerHTML = '';
        products.forEach(product => {
            const productElement = document.createElement('product-card');
            Object.keys(product).forEach(key => {
                productElement.setAttribute(key.toLowerCase(), product[key]);
            });
            productGrid.appendChild(productElement);
        });
    }

    function renderProductDetail(productId) {
        const product = allProducts.find(p => p.id === productId);
        if (!product) return;

        productDetailSection.innerHTML = `
            <button class="back-to-grid-btn">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                Back to Products
            </button>
            <div style="display: flex; gap: 2rem;">
                <img src="${product.image}" alt="${product.name}" style="width: 50%; max-width: 400px; border-radius: 12px;">
                <div>
                    <h2 style="font-family: var(--font-heading); font-size: 2.5rem; margin-top: 0;">${product.name}</h2>
                    <p style="font-size: 1.2rem; line-height: 1.7;">${product.description}</p>
                    <p style="font-family: var(--font-heading); font-size: 2rem; color: var(--primary-color);">$${product.price.toFixed(2)}</p>
                    <button class="add-to-cart-btn-detail" data-product-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;

        // Add event listeners for the new elements
        productDetailSection.querySelector('.back-to-grid-btn').addEventListener('click', showProductGrid);
        productDetailSection.querySelector('.add-to-cart-btn-detail').addEventListener('click', (e) => {
            addToCart(e.target.dataset.productId);
        });

        showProductDetail();
    }

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            cart.forEach(item => {
                const product = allProducts.find(p => p.id === item.id);
                const itemElement = document.createElement('div');
                itemElement.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <div>
                            <h4 style="margin: 0;">${product.name}</h4>
                            <p style="margin: 0; font-size: 0.9rem;">Quantity: ${item.quantity} - $${(product.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <button class="remove-from-cart-btn" data-product-id="${product.id}" style="background: #ff4d4d; color: white; border: none; padding: .3rem .6rem; cursor: pointer; border-radius: 4px;">Remove</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemElement);
            });
        }

        // Add event listeners for remove buttons
        cartItemsContainer.querySelectorAll('.remove-from-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => removeFromCart(e.target.dataset.productId));
        });

        updateCartSummary();
    }

    function updateCartSummary() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => {
            const product = allProducts.find(p => p.id === item.id);
            return sum + (product.price * item.quantity);
        }, 0);

        cartItemCount.textContent = totalItems;
        cartTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
    }

    // --- UI Navigation ---
    function showProductGrid() {
        productDetailSection.classList.add('hidden');
        productGridSection.classList.remove('hidden');
    }

    function showProductDetail() {
        productGridSection.classList.add('hidden');
        productDetailSection.classList.remove('hidden');
    }

    function toggleCartModal(show = true) {
        cartModal.classList.toggle('hidden', !show);
        if(show) renderCart();
    }

    // --- Event Logic ---
    function handleSearch(event) {
        const searchTerm = event.target.value.toLowerCase();
        const filteredProducts = allProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm)
        );
        renderProductGrid(filteredProducts);
    }

    function addToCart(productId) {
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ id: productId, quantity: 1 });
        }
        updateCartSummary();
        // Optional: give user feedback
        console.log(`Added ${productId} to cart.`, cart);
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        renderCart(); // Re-render the cart UI
    }

    // --- Event Listeners Setup ---
    function setupEventListeners() {
        searchInput.addEventListener('input', handleSearch);
        cartIcon.addEventListener('click', () => toggleCartModal(true));
        closeCartBtn.addEventListener('click', () => toggleCartModal(false));
        cartModal.addEventListener('click', (e) => {
            if(e.target === cartModal) toggleCartModal(false);
        });

        // Listen for custom events from web components
        document.addEventListener('product-view', (e) => renderProductDetail(e.detail.productId));
        document.addEventListener('add-to-cart', (e) => addToCart(e.detail.productId));
    }

    // --- App Initialization ---
    initializeApp();
});
