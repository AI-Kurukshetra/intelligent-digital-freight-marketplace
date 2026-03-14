# AGENT.md

## Project Name
FreightFlow – Intelligent Digital Freight Marketplace

## Project Goal
Build a SaaS MVP platform where **Shippers can post freight loads** and **Carriers can browse and bid on them**.

The goal is to demonstrate a working digital freight marketplace similar to Transfix or Uber Freight.

This is an MVP for a hackathon and must focus on **working functionality and clean UI**, not enterprise complexity.

---

# Tech Stack

Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS

Backend
- Supabase
  - Auth
  - Postgres Database
  - Realtime support

Deployment
- Vercel

---

# Core Features

## Authentication
Use Supabase Auth.

Users can:
- Sign Up
- Login
- Logout

Two roles exist:
- shipper
- carrier

The role is stored in the database.

---

# Main User Flows

## Shipper Flow

1. Register/Login
2. Access Dashboard
3. Post Freight Load
4. View Loads Posted
5. View Bids from Carriers

---

## Carrier Flow

1. Register/Login
2. Access Dashboard
3. Browse Load Board
4. View Load Details
5. Submit Bid

---

# Pages

Landing Page
- Product intro
- Features
- Login / Signup CTA

Auth Pages
- Login
- Signup

Dashboard
- Role-based UI

Load Board
- Browse loads
- Filter loads
- View details

Post Load
- Shipper creates new load

Load Details
- Show load information
- Allow carriers to submit bids

---

# Database Schema (Supabase)

## users
id
email
role (shipper | carrier)
created_at

## loads
id
shipper_id
title
pickup_location
delivery_location
cargo_type
weight
price_estimate
pickup_date
created_at

## bids
id
load_id
carrier_id
bid_price
message
created_at

---

# Folder Structure

/app
  /dashboard
  /loads
  /post-load
  /login
  /signup

/components
  /ui
  /navbar
  /load-card
  /dashboard-layout

/lib
  supabaseClient.ts

/types
  database.ts

---

# UI Guidelines

Use Tailwind CSS.

Design should follow modern SaaS dashboard patterns.

Include:
- Navbar
- Sidebar dashboard layout
- Card-based UI
- Responsive design

Keep UI simple and clean.

---

# Coding Guidelines

Use:
- Functional components
- TypeScript
- Reusable components
- Clean separation of concerns

Prefer:
- Server Actions or API routes
- Async/await
- Modular code

Avoid:
- Over-engineering
- Complex state libraries

---

# MVP Scope (Hackathon)

Focus only on:

✔ Authentication  
✔ Role-based dashboards  
✔ Load posting  
✔ Load board marketplace  
✔ Bid submission  

Do NOT build advanced features like:
- AI pricing
- GPS tracking
- Blockchain
- IoT integrations

---

# Deployment

Project must be deployable on **Vercel**.

Environment variables required:

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

---

# Success Criteria

A working SaaS app where:

- Users can sign up and log in
- Shippers can post loads
- Carriers can browse loads
- Carriers can submit bids
- Shippers can see bids

UI must be responsive and deploy successfully on Vercel.