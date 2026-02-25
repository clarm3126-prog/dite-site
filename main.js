import { renderCategories, renderProducts, renderReviews, renderPartnershipForm, getProductById } from './views.js';

const searchBar = document.getElementById('search-bar');
const modal = document.getElementById('product-detail-modal');
const closeModalButton = document.querySelector('.close-button');

// --- Modal Logic ---

// Function to open the modal and populate it with product data
function showProductDetail(product) {
    if (!product) return;

    document.getElementById('modal-product-name').textContent = product.name;
    document.getElementById('modal-product-description').textContent = product.description;
    
    const gallery = document.getElementById('modal-image-gallery');
    gallery.innerHTML = ''; // Clear previous images
    if (product.detailImages && product.detailImages.length > 0) {
        product.detailImages.forEach(imgUrl => {
            const img = document.createElement('img');
            img.src = imgUrl;
            img.alt = product.name;
            gallery.appendChild(img);
        });
    } else {
        // If no detail images, show the main product image
        const img = document.createElement('img');
        img.src = product.imageUrl;
        img.alt = product.name;
        gallery.appendChild(img);
    }

    const buyButton = document.getElementById('modal-product-link');
    if (product.productUrl) {
        buyButton.href = product.productUrl;
        buyButton.style.display = 'inline-block';
    } else {
        buyButton.style.display = 'none';
    }

    modal.style.display = 'flex';
}

// Function to close the modal
function closeProductDetail() {
    modal.style.display = 'none';
}

// Event listener for the close button
closeModalButton.addEventListener('click', closeProductDetail);

// Event listener to close the modal when clicking the overlay
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeProductDetail();
    }
});

// Event delegation for product clicks
document.getElementById('app-root').addEventListener('click', async (event) => {
    const productCard = event.target.closest('popular-product-card');
    if (productCard) {
        const productId = productCard.dataset.productId;
        if (productId) {
            // Fetch the full product object using the ID
            const product = await getProductById(parseInt(productId, 10));
            showProductDetail(product);
        }
    }
});

// --- Routing Logic ---

function router() {
    const hash = window.location.hash;
    const [path] = hash.split('?');

    switch (path) {
        case '#products':
            renderProducts();
            break;
        case '#reviews':
            renderReviews(); // Note: This might be deprecated if using modal for details
            break;
        case '#partnership':
             renderPartnershipForm();
            break;
        case '#categories':
        default:
            renderCategories();
            break;
    }
}

// --- Event Listeners ---

// Handle search input
searchBar.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const searchTerm = searchBar.value.trim();
        if (searchTerm) {
            window.location.hash = `#products?search=${encodeURIComponent(searchTerm)}`;
        } else {
            window.location.hash = '#products';
        }
    }
});

// Listen for hash changes to navigate
window.addEventListener('hashchange', router);

// Initial load
window.addEventListener('load', () => {
    if (!window.location.hash) {
        window.location.hash = '#categories';
    }
    router();
});
