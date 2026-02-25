
# Naver Brand Connect Product Showcase

## Overview

A web application to showcase Naver Brand Connect products. Users can browse product categories, view products, see detailed product information within the app, engage in discussions via Disqus, share products on social media, discover popular items, and submit partnership inquiries.

## Project Outline

### Design and Styling

*   **Layout:** A modern, responsive single-page application layout.
*   **Colors:** A vibrant and energetic color palette inspired by Naver's branding.
*   **Typography:** Expressive and readable fonts from Google Fonts.
*   **Components:**
    *   **Header & Navigation:** Clean header with navigation, search, and external links.
    *   **Hero Section:** A visually appealing hero section to welcome users.
    *   **Popular Products Section:** A dedicated section on the main page for featured products.
    *   **Cards:** Custom-styled cards for categories and products with interactive elements like sharing.
    *   **Product Detail Modal:** A modal window to display detailed product information, including a gallery of images and a full description, without leaving the site.
    *   **Disqus Integration:** A robust commenting system powered by Disqus for user discussions.
    *   **Social Sharing:** Intuitive icons for sharing products on major social platforms.
    *   **Partnership Form:** A dedicated form for users to submit partnership inquiries via Formspree.
    *   **Footer:** Contains copyright information.
*   **Effects:** Subtle animations and transitions for an interactive experience.

### Features

*   **Product Categories & Listings:** Browse products by category.
*   **Product Detail View:** View detailed product descriptions and image galleries in a modal window.
*   **Search:** Filter products by name.
*   **Popular Products Showcase:** A curated list of popular items.
*   **Disqus for Comments:** Replaced the native review system with Disqus to facilitate richer user discussions and community engagement.
*   **Social Media Sharing:** Share products easily on platforms like Facebook, Twitter, or by copying a direct link.
*   **Partnership Inquiry Form:** A simple and effective form that allows businesses or individuals to express interest in a partnership, with submissions managed through Formspree.
*   **Web Components:** Reusable UI elements for a modular and maintainable codebase.
*   **ES Modules:** Modern JavaScript module system.
*   **Firebase Integration:** Firestore for storing product and category data.
*   **Performance Optimization:** Lazy loading for images and code splitting for faster initial page loads.

## Current Plan

### Task Summary: Implement In-App Product Detail View

*   **Goal:** Instead of redirecting to an external link, display product details (description and images) in a modal window when a user clicks on a product.
*   **Reasoning:** To enhance the user experience by keeping users within the application and providing a seamless way to view product information.
*   **Status:** **In Progress**.

*   **Steps:**
    1.  **Extract Content:** Manually gather product descriptions and image URLs from the 'Gagarin Zero Blast' Naver Shopping page.
    2.  **Update `products.js`:** Add the extracted detailed information (description text, an array of detail images) to the Gagarin product object.
    3.  **Create Product Detail Modal UI:**
        *   Modify `index.html` to include the HTML structure for a modal dialog.
        *   Update `style.css` to add styles for the modal overlay, content, image gallery, and close button.
    4.  **Implement Modal Logic:**
        *   In `main.js`, create functions to show/hide the modal.
        *   Create a function to dynamically populate the modal with the selected product's details (name, description, images).
        *   Update the event listener on product cards to trigger the modal instead of opening an external link.
    5.  **Deploy:** Commit and push all changes to the repository to deploy the new feature.
