# 🎨 Rental Listing Platform - Frontend Web Application

[English](#) | [🇻🇳 Bản Tiếng Việt (Vietnamese)](./README.vi.md)

---

> **Description:** A high-performance, modern web interface for the rental platform, built with Next.js 16 and Tailwind CSS 4.

---

## 🚀 Overview

The frontend layer of the **Rental Listing Platform** is designed for a seamless user discovery experience. It connects with the [Backend API Gateway](https://github.com/DaoDuck3008/BE-Rental-Listing-Platform) to offer dynamic searching, real-time property management, and intuitive analytics.

Focus areas: **Responsive Design**, **Optimized Fetching (SWR)**, and **Interactive Maps**.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16+ (App Router)
- **State Management:** **Zustand** (Global UI & Auth states)
- **Data Fetching:** **SWR** (Optimistic updates & caching)
- **Styling:** **Tailwind CSS 4**
- **Charts:** **Recharts** (Visualizing listing statistics)
- **Maps:** **@react-google-maps/api**
- **Rich Text:** **Tiptap** (For property description editing)
- **Components:** **Lucide Icons**, **React Dropzone** (File uploads), **React Toastify**.
- **Real-time:** **Socket.io-client**.

---

## ✨ Key Features

### 1. Intuitive Search & Discovery
- **Advanced Filtering:** Location-based search with distance radius (Interactive Map).
- **Infinite Scrolling:** Smooth browsing experience for property listings.
- **Dynamic Pricing:** Interactive range sliders to filter listings by budget.

### 2. Powerful Listing Management (Host Dashboard)
- **Analytics:** Visualize listing views and performance trends with interactive charts.
- **Listing Editor:** WYSIWYG editor for descriptions and drag-and-drop image uploads.
- **State Persistence:** Automatic draft saving for listing creation.

### 3. Integrated Auth & User Experience
- **Authentication:** Unified login for Email/Password and Google OAuth.
- **Dark Mode Support:** Built-in theme switching via `next-themes`.
- **Toast Notifications:** Real-time feedback for all user actions.

---

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- Backend API up and running

### Installation

#### 🐳 Option 1: Using Docker (Recommended)
*(The project is being containerized. Docker scripts will be available soon.)*

#### 🛠️ Option 2: Manual Setup
1.  **Clone the project:** 
    ```bash
    git clone https://github.com/DaoDuck3008/FE-Rental-Listing-Platform.git
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Setup:**
    - Copy `.env.example` to `.env.local`.
    - Provide your Backend API URL and Google Maps API Key.
4.  **Run Dev Server:**
    ```bash
    npm run dev
    ```

---

## 🏗️ Project Structure

```text
app/          # App Router (Pages, Layouts, API routes)
components/   # Reusable UI components
hooks/        # Custom React hooks (auth, maps, etc.)
lib/          # Shared utility libraries (axios, socket)
services/     # API service definitions (SWR fetchers)
store/        # Zustand global state stores
styles/       # Global CSS & Tailwind configuration
public/       # Static assets (images, icons)
```

---

## 🤝 Contact
- **Author:** Duc Dao
- **GitHub:** [@DaoDuck3008](https://github.com/DaoDuck3008)
- **Project Goal:** Internship Project and Portfolio Showcase.
