class PopularProductCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['name', 'image', 'price', 'link', 'product-id'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    render() {
        const name = this.getAttribute('name') || '상품명 없음';
        const image = this.getAttribute('image') || '';
        const price = this.getAttribute('price') || '가격 정보 없음';
        const link = this.getAttribute('link') || '#';
        const productId = this.getAttribute('product-id');

        this.shadowRoot.innerHTML = `
            <style>
                .product-card {
                    background-color: #fff;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    overflow: hidden;
                    text-align: center;
                    transition: transform 0.2s, box-shadow 0.2s;
                    text-decoration: none;
                    color: inherit;
                    display: flex; /* Use flexbox for layout */
                    flex-direction: column; /* Stack items vertically */
                    height: 100%; /* Ensure the card takes full height */
                }
                .product-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                .product-image-link {
                    display: block;
                    flex-grow: 1; /* Allow the image link to grow */
                }
                .product-card img {
                    width: 100%;
                    height: 180px;
                    object-fit: cover;
                }
                .product-info {
                    padding: 15px;
                    flex-grow: 0; /* Don't allow info to grow */
                }
                .product-info h3 {
                    margin: 0 0 10px;
                    font-size: 1rem;
                }
                .product-info p {
                    margin: 0;
                    color: #555;
                    font-weight: bold;
                }
                .review-button {
                    display: inline-block;
                    margin-top: 10px;
                    padding: 8px 16px;
                    background-color: #007bff;
                    color: white;
                    border-radius: 5px;
                    text-decoration: none;
                    font-size: 0.9rem;
                }
                
                .no-image {
                    width: 100%;
                    height: 180px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #f0f0f0;
                    color: #aaa;
                }
            </style>
            <div class="product-card" data-product-id="${productId}">
                <a href="${link}" class="product-image-link" target="_blank">
                    <img 
                        src="${image}" 
                        alt="${name}" 
                        onerror="this.onerror=null; this.outerHTML='<div class=\\'no-image\\'>NO IMAGE</div>'"
                    >
                </a>
                <div class="product-info">
                    <h3>${name}</h3>
                    <p>${price}</p>
                </div>
                <a href="#reviews?productId=${productId}" class="review-button">리뷰 보기</a>
            </div>
        `;
    }
}

customElements.define('popular-product-card', PopularProductCard);