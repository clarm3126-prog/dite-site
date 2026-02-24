import { db } from './firebase.js';
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


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

class ProductReview extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <div class="card">
                <h4>${this.getAttribute('author')}</h4>
                <p>${this.getAttribute('comment')}</p>
            </div>
        `;
    }
}

customElements.define('product-category', ProductCategory);
customElements.define('product-card', ProductCard);
customElements.define('product-review', ProductReview);

const appRoot = document.getElementById('app-root');

export async function renderCategories() {
    appRoot.innerHTML = '';
    const querySnapshot = await getDocs(collection(db, "categories"));
    querySnapshot.forEach((doc) => {
        const category = doc.data();
        const el = document.createElement('product-category');
        el.setAttribute('name', category.name);
        el.setAttribute('image', category.image);
        el.addEventListener('click', () => {
            window.location.hash = `#products?categoryId=${category.id}`
        })
        appRoot.appendChild(el);
    });
}

export async function renderProducts(searchTerm = '') {
    const categoryId = new URLSearchParams(window.location.hash.split('?')[1])?.get('categoryId');
    appRoot.innerHTML = '';
    
    let productQuery;
    if (categoryId) {
        productQuery = query(collection(db, "products"), where("categoryId", "==", parseInt(categoryId)));
    } else {
        productQuery = query(collection(db, "products"));
    }

    const querySnapshot = await getDocs(productQuery);
    let products = [];
    querySnapshot.forEach((doc) => {
        products.push(doc.data());
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
    appRoot.innerHTML = '';
    if (!productId) return;

    const reviewQuery = query(collection(db, "reviews"), where("productId", "==", parseInt(productId)));
    const querySnapshot = await getDocs(reviewQuery);

    querySnapshot.forEach((doc) => {
        const review = doc.data();
        const el = document.createElement('product-review');
        el.setAttribute('author', review.author);
        el.setAttribute('comment', review.comment);
        appRoot.appendChild(el);
    });
}
