
# Naver Brand Connect Product Showcase

## Overview

A web application to showcase Naver Brand Connect products. Users can browse product categories, view products, read and write reviews, share products on social media, discover popular items, and submit partnership inquiries.

## Project Outline

### Design and Styling

*   **Layout:** A modern, responsive single-page application layout.
*   **Colors:** A vibrant and energetic color palette inspired by Naver's branding.
*   **Typography:** Expressive and readable fonts from Google Fonts.
*   **Components:**
    *   **Header & Navigation:** Clean header with navigation, search, and external links.
    *   **Popular Products Section:** A dedicated section on the main page for featured products.
    *   **Cards:** Custom-styled cards for categories, products, and reviews with interactive elements like sharing.
    *   **Review System:** A user-friendly interface for reading and submitting product reviews.
    *   **Social Sharing:** Intuitive icons for sharing products on major social platforms.
    *   **Partnership Form:** A dedicated form for users to submit partnership inquiries via Formspree.
    *   **Footer:** Contains copyright information.
*   **Effects:** Subtle animations and transitions for an interactive experience.

### Features

*   **Product Categories & Listings:** Browse products by category.
*   **Search:** Filter products by name.
*   **Popular Products Showcase:** A curated list of popular items.
*   **User Reviews and Ratings:** Read and submit reviews and ratings for each product.
*   **Social Media Sharing:** Share products easily on platforms like Facebook, Twitter, or by copying a direct link.
*   **Partnership Inquiry Form:** A simple and effective form that allows businesses or individuals to express interest in a partnership, with submissions managed through Formspree.
*   **Web Components:** Reusable UI elements for a modular and maintainable codebase.
*   **ES Modules:** Modern JavaScript module system.
*   **Firebase Integration:** Firestore for storing product and review data.

## Current Plan

### Implement Partnership Inquiry Form

*   **Goal:** Add a form to the website to allow users to submit partnership inquiries, which will be sent to a Formspree endpoint.
*   **Reasoning:** Providing a direct and easy-to-use contact method for potential partners is essential for business development and can open up new opportunities for collaboration and growth.

*   **Steps:**
    1.  **Update `blueprint.md`:** Document the plan for the new partnership form.
    2.  **Update `index.html`:**
        *   Add a "Partnership" link to the main navigation bar.
        *   Create a new section in the `<body>` to house the partnership form.
    3.  **Update `views.js`:**
        *   Create a `renderPartnershipForm` function that dynamically generates the HTML for the inquiry form.
        *   The form will be configured to `POST` to the specified Formspree URL (`https://formspree.io/f/xlgwabzz`).
    4.  **Update `main.js`:**
        *   Import the `renderPartnershipForm` function.
        *   Add a new route (`#partnership`) to the `routes` object that calls the `renderPartnershipForm` function.
    5.  **Update `style.css`:** Add styles for the partnership form section, including its input fields and submit button, to ensure it aligns with the site's overall design.
    6.  **Commit and Push:** Save the changes to the Git repository.
