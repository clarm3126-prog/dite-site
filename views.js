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
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const name = this.getAttribute('name');
        const description = this.getAttribute('description');
        const image = this.getAttribute('image');
        const productId = this.getAttribute('product-id');

        this.shadowRoot.innerHTML = `
            <style>
                .card {
                    background-color: white; border-radius: 15px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    padding: 1.5rem; margin-bottom: 1rem; cursor: pointer; transition: all 0.3s ease;
                    display: flex; flex-direction: column; justify-content: space-between;
                }
                .card:hover { transform: translateY(-5px); box-shadow: 0 8px 16px rgba(0,0,0,0.2); }
                h3 { margin-top: 0; color: #03c75a; font-size: 1.5rem; }
                img { width: 100%; height: 200px; object-fit: cover; border-radius: 10px; margin-bottom: 1rem; }
                .share-button { background: #eee; border: none; padding: 0.5rem; border-radius: 5px; cursor: pointer; }
                .social-icons { display: none; margin-top: 1rem; } 
                .social-icons a { margin-right: 0.5rem; color: #333; text-decoration: none; font-size: 1.2rem; }
            </style>
            <div class="card">
                <div>
                    <img src="${image}" alt="${name}">
                    <h3>${name}</h3>
                    <p>${description}</p>
                </div>
                <div>
                    <button class="share-button">Share</button>
                    <div class="social-icons">
                        <a href="#" class="share-fb"><i class="fab fa-facebook"></i></a>
                        <a href="#" class="share-tw"><i class="fab fa-twitter"></i></a>
                        <a href="#" class="copy-link"><i class="fas fa-link"></i></a>
                    </div>
                </div>
            </div>
        `;

        const card = this.shadowRoot.querySelector('.card');
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.share-button') && !e.target.closest('.social-icons')) {
                window.location.hash = `#reviews?productId=${productId}`;
            }
        });

        const shareButton = this.shadowRoot.querySelector('.share-button');
        const socialIcons = this.shadowRoot.querySelector('.social-icons');
        shareButton.addEventListener('click', () => {
            socialIcons.style.display = socialIcons.style.display === 'block' ? 'none' : 'block';
        });

        const productUrl = `${window.location.origin}#reviews?productId=${productId}`;
        const shareText = `Check out this product: ${name}`;

        this.shadowRoot.querySelector('.share-fb').href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
        this.shadowRoot.querySelector('.share-tw').href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(shareText)}`;
        this.shadowRoot.querySelector('.copy-link').addEventListener('click', (e) => {
            e.preventDefault();
            navigator.clipboard.writeText(productUrl).then(() => alert('Link copied to clipboard!'));
        });
    }
}

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
                :host { display: block; margin-bottom: 1rem; }
                .review-card { background-color: #fff; border-radius: 10px; padding: 1.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
                .author { font-weight: bold; margin-bottom: 0.5rem; }
                .rating { color: #ffc107; margin-bottom: 0.75rem; }
                .comment { font-size: 1rem; line-height: 1.5; }
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
                .review-form-container { background-color: #f0f2f5; padding: 2rem; border-radius: 10px; margin-top: 2rem; }
                h3 { color: #333; }
                .star-rating { font-size: 2rem; cursor: pointer; }
                .star-rating span:hover { color: #ffc107; }
                textarea { width: 100%; padding: 0.5rem; margin: 1rem 0; border-radius: 5px; border: 1px solid #ccc; min-height: 80px; }
                button { background-color: #03c75a; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 5px; cursor: pointer; transition: background-color 0.3s ease; }
                button:hover { background-color: #02b04e; }
            </style>
            <div class="review-form-container">
                <h3>Write a Review</h3>
                <div class="star-rating">${[...Array(5)].map((_, i) => `<span data-value="${i + 1}">☆</span>`).join('')}</div>
                <textarea id="comment" placeholder="Share your thoughts..."></textarea>
                <button id="submit-review">Submit Review</button>
            </div>
        `;
        this.shadowRoot.querySelectorAll('.star-rating span').forEach(star => star.addEventListener('click', (e) => this.setRating(e.target.dataset.value)));
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
            await addDoc(collection(db, "reviews"), { productId: parseInt(productId), author: "Anonymous User", comment: comment, rating: this.rating, createdAt: serverTimestamp() });
            renderReviews();
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

export async function renderCategories() {
    appRoot.innerHTML = '';
    const querySnapshot = await getDocs(collection(db, "categories"));
    querySnapshot.forEach((doc) => {
        const category = doc.data();
        const el = document.createElement('product-category');
        el.setAttribute('name', category.name);
        el.setAttribute('image', category.image);
        el.addEventListener('click', () => { window.location.hash = `#products?categoryId=${doc.id}` });
        appRoot.appendChild(el);
    });
}

export async function renderProducts(searchTerm = '') {
    const categoryId = new URLSearchParams(window.location.hash.split('?')[1])?.get('categoryId');
    appRoot.innerHTML = '';
    let productQuery = categoryId ? query(collection(db, "products"), where("categoryId", "==", categoryId)) : collection(db, "products");
    const querySnapshot = await getDocs(productQuery);
    let products = [];
    querySnapshot.forEach((doc) => { products.push({ id: doc.id, ...doc.data() }); });
    if (searchTerm) {
        products = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    products.forEach(product => {
        const el = document.createElement('product-card');
        el.setAttribute('name', product.name);
        el.setAttribute('description', product.description);
        el.setAttribute('image', product.image);
        el.setAttribute('product-id', product.id);
        appRoot.appendChild(el);
    });
}

export async function renderReviews() {
    const productId = new URLSearchParams(window.location.hash.split('?')[1])?.get('productId');
    appRoot.innerHTML = '<div class="reviews-container"></div>';
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
    const reviewForm = document.createElement('review-form');
    reviewsContainer.appendChild(reviewForm);
}

export function renderPartnershipForm() {
    appRoot.innerHTML = `
        <div class="partnership-form-container">
            <h2>Partnership Inquiry</h2>
            <p>Interested in partnering with us? Fill out the form below and we'll get back to you soon.</p>
            <form action="https://formspree.io/f/xlgwabzz" method="POST">
                <div class="form-group">
                    <label for="name">Your Name</label>
                    <input type="text" id="name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="email">Your Email</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="company">Company Name</label>
                    <input type="text" id="company" name="company">
                </div>
                <div class="form-group">
                    <label for="message">Message</label>
                    <textarea id="message" name="message" rows="6" required></textarea>
                </div>
                <button type="submit">Send Inquiry</button>
            </form>
        </div>
    `;
}
