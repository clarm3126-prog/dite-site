import { db } from './firebase.js';
import { collection, getDocs, query, where, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- Web Components for Categories and Products (Existing Code) ---

class ProductCategory extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <div class="card">
                <img src="${this.getAttribute('image')}" alt="${this.getAttribute('name')}">
                <h3>${this.getAttribute('name')}</h3>
            </div>
        `;
    }
}

class ProductCard extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <div class="card">
                <img src="${this.getAttribute('image')}" alt="${this.getAttribute('name')}">
                <h3>${this.getAttribute('name')}</h3>
                <p>${this.getAttribute('description')}</p>
            </div>
        `;
    }
}

// --- NEW/UPDATED Web Components for Reviews ---

class ProductReview extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const author = this.getAttribute('author');
        const comment = this.getAttribute('comment');
        const rating = parseInt(this.getAttribute('rating') || 0);
        
        const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);

        this.shadowRoot.innerHTML = `
            <style>
                /* Encapsulated styles for the review card */
                :host {
                    display: block; /* Ensures the component takes up space */
                    margin-bottom: 1rem;
                }
                .review-card {
                    background-color: #fff;
                    border-radius: 10px;
                    padding: 1.5rem;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                .author {
                    font-weight: bold;
                    margin-bottom: 0.5rem;
                }
                .rating {
                    color: #ffc107; /* Gold color for stars */
                    margin-bottom: 0.75rem;
                }
                .comment {
                    font-size: 1rem;
                    line-height: 1.5;
                }
            </style>
            <div class="review-card">
                <div class="author">${author}</div>
                <div class="rating">${stars}</div>
                <div class="comment">${comment}</div>
            </div>
        `;
    }
}

class ReviewForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.rating = 0;
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                /* Encapsulated styles for the review form */
                .review-form-container {
                    background-color: #f0f2f5;
                    padding: 2rem;
                    border-radius: 10px;
                    margin-top: 2rem;
                }
                h3 { color: #333; }
                .star-rating {
                    font-size: 2rem;
                    cursor: pointer;
                }
                .star-rating span:hover {
                    color: #ffc107;
                }
                textarea {
                    width: 100%;
                    padding: 0.5rem;
                    margin: 1rem 0;
                    border-radius: 5px;
                    border: 1px solid #ccc;
                    min-height: 80px;
                }
                button {
                    background-color: #03c75a;
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }
                button:hover { background-color: #02b04e; }
            </style>
            <div class="review-form-container">
                <h3>Write a Review</h3>
                <div class="star-rating">
                    ${[...Array(5)].map((_, i) => `<span data-value="${i + 1}">☆</span>`).join('')}
                </div>
                <textarea id="comment" placeholder="Share your thoughts..."></textarea>
                <button id="submit-review">Submit Review</button>
            </div>
        `;

        this.shadowRoot.querySelectorAll('.star-rating span').forEach(star => {
            star.addEventListener('click', (e) => this.setRating(e.target.dataset.value));
        });

        this.shadowRoot.getElementById('submit-review').addEventListener('click', () => this.submitReview());
    }

    setRating(value) {
        this.rating = value;
        this.shadowRoot.querySelectorAll('.star-rating span').forEach((star, index) => {
            star.textContent = index < value ? '★' : '☆';
            star.style.color = index < value ? '#ffc107' : '#ccc';
        });
    }

    async submitReview() {
        const productId = new URLSearchParams(window.location.hash.split('?')[1])?.get('productId');
        const comment = this.shadowRoot.getElementById('comment').value;

        if (!productId || !comment || this.rating === 0) {
            alert('Please select a rating and write a comment.');
            return;
        }

        try {
            await addDoc(collection(db, "reviews"), {
                productId: parseInt(productId),
                author: "Anonymous User", // In a real app, you'd get the logged-in user's name
                comment: comment,
                rating: this.rating,
                createdAt: serverTimestamp()
            });
            renderReviews(); // Re-render reviews to show the new one
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    }
}

customElements.define('product-category', ProductCategory);
customElements.define('product-card', ProductCard);
customElements.define('product-review', ProductReview);
customElements.define('review-form', ReviewForm);

const appRoot = document.getElementById('app-root');

// --- Rendering Functions (Updated renderReviews) ---

export async function renderCategories() {
    appRoot.innerHTML = '';
    const querySnapshot = await getDocs(collection(db, "categories"));
    querySnapshot.forEach((doc) => {
        const category = doc.data();
        const el = document.createElement('product-category');
        el.setAttribute('name', category.name);
        el.setAttribute('image', category.image);
        el.addEventListener('click', () => {
            window.location.hash = `#products?categoryId=${doc.id}`
        })
        appRoot.appendChild(el);
    });
}

export async function renderProducts(searchTerm = '') {
    const categoryId = new URLSearchParams(window.location.hash.split('?')[1])?.get('categoryId');
    appRoot.innerHTML = '';
    
    let productQuery = categoryId 
        ? query(collection(db, "products"), where("categoryId", "==", categoryId))
        : collection(db, "products");

    const querySnapshot = await getDocs(productQuery);
    let products = [];
    querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
    });

    if (searchTerm) {
        products = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    products.forEach(product => {
        const el = document.createElement('product-card');
        el.setAttribute('name', product.name);
        el.setAttribute('description', product.description);
        el.setAttribute('image', product.image);
        el.addEventListener('click', () => {
            window.location.hash = `#reviews?productId=${product.id}`
        })
        appRoot.appendChild(el);
    });
}

export async function renderReviews() {
    const productId = new URLSearchParams(window.location.hash.split('?')[1])?.get('productId');
    appRoot.innerHTML = '<div class="reviews-container"></div>'; // Use a container
    const reviewsContainer = appRoot.querySelector('.reviews-container');

    if (!productId) {
        reviewsContainer.innerHTML = '<p>Select a product to see its reviews.</p>';
        return;
    }

    const reviewQuery = query(collection(db, "reviews"), where("productId", "==", productId));
    const querySnapshot = await getDocs(reviewQuery);

    if (querySnapshot.empty) {
        reviewsContainer.innerHTML += '<p>Be the first to review this product!</p>';
    } else {
        querySnapshot.forEach((doc) => {
            const review = doc.data();
            const el = document.createElement('product-review');
            el.setAttribute('author', review.author);
            el.setAttribute('comment', review.comment);
            el.setAttribute('rating', review.rating);
            reviewsContainer.appendChild(el);
        });
    }
    
    // Always append the form
    const reviewForm = document.createElement('review-form');
    reviewsContainer.appendChild(reviewForm);
}
