import { renderCategories, renderProducts, renderReviews } from './views.js';

const routes = {
    '#categories': renderCategories,
    '#products': renderProducts,
    '#reviews': renderReviews
};

function router() {
    const path = window.location.hash.split('?')[0] || '#categories';
    const renderFunction = routes[path];
    if (renderFunction) {
        renderFunction();
    } else {
        document.getElementById('app-root').innerHTML = '404 - Page not found';
    }
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

const searchBar = document.getElementById('search-bar');
searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value;
    // When searching, we want to be on the products page
    window.location.hash = '#products';
    renderProducts(searchTerm);
});