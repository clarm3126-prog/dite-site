
# Naver Brand Connect Product Showcase

## Overview

A web application to showcase Naver Brand Connect products. Users can browse product categories, view products within those categories, and read reviews for each product. The site also features a curated list of popular products.

## Project Outline

### Design and Styling

*   **Layout:** A modern, responsive single-page application layout with a visually balanced and clean spacing.
*   **Colors:** A vibrant and energetic color palette inspired by Naver's branding.
*   **Typography:** Expressive and readable fonts from Google Fonts.
*   **Components:**
    *   **Header:** Contains the application title, navigation, and a search bar.
    *   **Navigation:** Links to switch between Categories, Products, and Reviews views, and an external link to shop on Naver.
    *   **Popular Products Section:** A dedicated section on the main page to highlight best-selling or featured products.
    *   **Cards:** Custom-styled cards with hover effects for displaying categories, products, and reviews.
    *   **Footer:** Contains copyright information.
*   **Effects:** Subtle animations and transitions for a more interactive experience.

### Features

*   **Product Categories:** Display a list of product categories.
*   **Product Listing:** Display a list of products for a selected category.
*   **Product Reviews:** Display reviews for a selected product.
*   **Search:** A search bar to filter products by name.
*   **Popular Products:** Showcase a list of popular products fetched from a data source.
*   **Web Components:** Use Web Components to create reusable UI elements for categories, products, and reviews.
*   **ES Modules:** Organize JavaScript code into modules for better maintainability.
*   **Firebase Integration:** Use Firebase Firestore to store and retrieve product data.

## Current Plan

### Add "Popular Products" Section

*   **Goal:** Create a new section on the homepage to display a curated list of best-selling products.
*   **Note:** Automatic analysis of the affiliate link is not possible. The section will be built with placeholder data first. The user will provide the actual product data (names, image URLs, prices, product links) to be integrated later.

*   **Steps:**
    1.  **Update HTML (`index.html`):** Add a new `<section>` for "Popular Products" below the navigation bar, containing a grid for product cards.
    2.  **Update CSS (`style.css`):** Add styles for the new section and the product cards to ensure a visually appealing and responsive layout.
    3.  **Update JavaScript (`main.js`):** Create a new web component `popular-product-card` to render the placeholder products. This component will be designed to easily accept real data later.
    4.  **Commit to Git:** Save the changes with a clear commit message and push them to the GitHub repository.

