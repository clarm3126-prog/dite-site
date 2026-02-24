import { db } from './firebase.js';
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- Web Components for Categories and Products ---

class ProductCategory extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <div class="card">
                <img src="${this.getAttribute('image')}" alt="${this.getAttribute('name')}" loading="lazy">
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
                    <img src="${image}" alt="${name}" loading="lazy">
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

customElements.define('product-category', ProductCategory);
customElements.define('product-card', ProductCard);

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

export function renderReviews() {
    const productId = new URLSearchParams(window.location.hash.split('?')[1])?.get('productId');
    appRoot.innerHTML = ''; // Clear previous content

    if (!productId) {
        appRoot.innerHTML = '<p style="text-align: center; margin-top: 2rem;">Product not found. Please select a product to see the comments.</p>';
        return;
    }

    // Add a title for the comments section
    const title = document.createElement('h2');
    title.textContent = 'Comments & Reviews';
    title.style.textAlign = 'center';
    title.style.marginTop = '2rem';
    title.style.fontSize = '2.5rem';
    title.style.color = '#333';

    const disqusContainer = document.createElement('div');
    disqusContainer.id = 'disqus_thread';
    disqusContainer.style.maxWidth = '800px';
    disqusContainer.style.margin = '2rem auto';
    disqusContainer.style.padding = '0 1rem';

    const disqusScript = document.createElement('script');
    const disqusConfig = `
        var disqus_config = function () {
            this.page.url = window.location.href;
            this.page.identifier = '${productId}';
        };
    `;

    const disqusEmbed = `
        (function() {
            var d = document, s = d.createElement('script');
            s.src = 'https://brand-connect.disqus.com/embed.js';
            s.setAttribute('data-timestamp', +new Date());
            (d.head || d.body).appendChild(s);
        })();
    `;

    disqusScript.textContent = disqusConfig + disqusEmbed;

    const noscript = document.createElement('noscript');
    noscript.innerHTML = 'Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a>';

    // Clean up previous Disqus instances if any
    const oldScript = document.querySelector('script[src*="disqus.com"]');
    if (oldScript) {
        oldScript.remove();
    }
    if (window.DISQUS) {
         window.DISQUS.reset({
             reload: true,
             config: function () {
                 this.page.url = window.location.href;
                 this.page.identifier = productId;
             }
         });
    } else {
        appRoot.appendChild(title);
        appRoot.appendChild(disqusContainer);
        appRoot.appendChild(disqusScript);
        appRoot.appendChild(noscript);
    }
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
