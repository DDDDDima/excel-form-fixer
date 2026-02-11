# Stellar CRM 🍓

A professional, streamlined inventory management and sales tool for small businesses, designed with a premium "Stellar" aesthetic.

## Features
- **Stock Monitoring (Склад)**: Real-time tracking of ingredients and critical residue levels.
- **Transaction Processing (Операції)**:
  - **Arrivals (Прихід)**: Easy restocking of ingredients.
  - **Sales (Продаж)**: Automatic ingredient write-offs via Google Apps Script.
- **Directory Management (Довідник)**: Standardized lists of categories and items.
- **Premium UI**: Glassmorphism, vibrant red/pink theme, and fully responsive layout.

## Deployment Guide

### 1. Frontend (GitHub & Vercel)
1.  **Create a GitHub Repo**: Go to [github.com/new](https://github.com/new) and create a repository named `stellar-crm`.
2.  **Upload Files**:
    - Download this project folder.
    - Upload the files to your repository.
3.  **Deploy to Vercel**:
    - Sign in to [Vercel](https://vercel.com).
    - Import your GitHub repository.
    - Set the framework to **Vite** and click **Deploy**.

### 2. Backend (Google Apps Script)
1.  Open your [Google Sheet](https://docs.google.com/spreadsheets).
2.  Go to **Extensions** > **Apps Script**.
3.  Copy the code from the local file `StellarCRM-GAS-Backend.js` (created in your Documents folder) and paste it into the script editor.
4.  Replace `YOUR_SPREADSHEET_ID_HERE` with your actual Spreadsheet ID.
5.  Click **Deploy** > **New Deployment** > **Web App**.
    - **Execute as**: Me
    - **Who has access**: Anyone (crucial for API access).
6.  Copy the **Web App URL** and paste it into `src/services/googleSheetsApi.ts` in your frontend code.

## Tech Stack
- React, Vite, Tailwind CSS, shadcn/ui.
- TanStack Query (React Query).
- Google Apps Script.
