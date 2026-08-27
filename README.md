# Cloud Trip Gallery - Frontend

## Overview
The **Frontend** application serves as the user interface for the Cloud Trip Gallery system. It provides an intuitive, responsive, and dynamic experience for users to manage their trips, document travel logs, and upload photos.

## Technical Details
* **Technology Stack**: React, TypeScript, Vite, Node.js
* **Styling**: Modern CSS / Tailwind (depending on configuration)
* **API Integration**: Uses Axios to communicate with the backend microservices through the centralized API Gateway.

## Key Responsibilities
* **User Interface**: Renders trip dashboards, log entry forms, and media upload interfaces.
* **Client-Side Routing**: Manages navigation seamlessly without page reloads.
* **State Management**: Handles UI state and asynchronous API data fetching.

## Deployment Context
In the GCP production environment, the frontend is built into static assets (HTML/CSS/JS) and hosted on a **Google Cloud Storage Bucket**. It is served globally via a dedicated **Global External Application Load Balancer** (`34.95.86.121`), ensuring high availability, caching, and low latency for users worldwide. It securely communicates with the backend APIs via CORS-enabled Load Balancer routing.
