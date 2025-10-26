# Pages Directory

This directory contains the main page components for the application.

## Structure

- Home Page (`Home.jsx`)
- About Page (`About.jsx`)
- Dashboard Page (`Dashboard.jsx`)
- DSA Pages (`DSA.jsx` and `DSA/Visualization.jsx`)
- Development Resources Page (`Development.jsx`)
- Ideas Pages (`Ideas.jsx` and `Ideas/Detail.jsx`)
- References Page (`References.jsx`)
- Profile Page (`Profile.jsx`)
- Payment Page (`Payment.jsx`)
- 404 Not Found Page (`NotFound.jsx`)

## Routing

All pages are routed through `src/routes.jsx` with authentication guards implemented via `ProtectedRoute.jsx`.

## Features

- Lazy loading for all route components
- Responsive design for all pages
- Consistent styling using Tailwind CSS
- Smooth transitions with Framer Motion
- Authentication protection for private routes