# SyedCodes.UI Portfolio - Complete Setup Guide

> 📝 **Beginner-Friendly Documentation** - This guide will help you understand and recreate this premium portfolio website from scratch, even with zero prior knowledge.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Supabase Backend Setup](#supabase-backend-setup)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Deployment](#deployment)
- [Admin Dashboard](#admin-dashboard)
- [Customization Guide](#customization-guide)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

## 🎯 Project Overview

**SyedCodes.UI** is a premium, modern portfolio website built with Next.js 16, featuring:
- ✨ Glassmorphic UI design with light/dark mode
- 🎨 3D parallax tilt effects on project cards
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🚀 Optimized for Netlify and Supabase free tiers
- 🎭 Smooth animations with Framer Motion
- 📝 Dynamic content management via Supabase
- 🔐 Secure admin dashboard for content updates

---

## 🛠️ Prerequisites

Before starting, ensure you have installed:

### Required Software
```bash
# Node.js (version 18 or higher)
# Download from: https://nodejs.org/

# Git (for version control)
# Download from: https://git-scm.com/

# VS Code (recommended IDE)
# Download from: https://code.visualstudio.com/
```

### Verify Installation
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Git version
git --version
```

---

## 💻 Tech Stack

### Frontend Framework
- **Next.js 16.2.6** - React framework with App Router
- **React 19.2.4** - UI library
- **TypeScript 5** - Type-safe JavaScript

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Pre-built React components
- **next-themes** - Theme management (light/dark mode)
- **lucide-react** - Icon library

### Animations & Effects
- **Framer Motion 12.38.0** - Animation library
- **react-parallax-tilt** - 3D tilt effects
- **GSAP 3.15.0** - Advanced animations
- **Lenis 1.3.23** - Smooth scrolling

### Backend & Database
- **Supabase 2.106.0** - Backend-as-a-Service (PostgreSQL)
- **@supabase/auth-helpers-nextjs 0.15.0** - Authentication helpers

### Forms & Validation
- **react-hook-form 7.76.0** - Form management
- **zod 4.4.3** - Schema validation

### Deployment
- **Netlify** - Hosting platform
- **@netlify/plugin-nextjs 5.15.11** - Next.js Netlify plugin

---

## 📁 Project Structure

```
syedcodes/
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin dashboard
│   │   └── page.tsx            # Admin interface
│   ├── projects/                # Projects page
│   │   └── page.tsx
│   ├── layout.tsx               # Root layout with theme provider
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
├── components/                  # React components
│   ├── ui/                     # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── admin/                  # Admin-specific components
│   │   ├── AboutTab.tsx
│   │   ├── ProjectsTab.tsx
│   │   ├── ServicesTab.tsx
│   │   └── ...
│   ├── About.tsx               # About section
│   ├── Contact.tsx             # Contact section
│   ├── Footer.tsx              # Footer component
│   ├── Hero.tsx                # Hero section
│   ├── Navbar.tsx              # Navigation bar
│   ├── Projects.tsx            # Projects showcase
│   ├── Services.tsx            # Services section
│   └── ...
├── lib/                        # Utility functions
│   ├── db.ts                   # Supabase database functions
│   └── types.ts                # TypeScript types
├── public/                     # Static assets
│   └── assets/                 # Images, icons, etc.
├── package.json                # Dependencies
├── tsconfig.json              # TypeScript config
├── tailwind.config.ts         # Tailwind config
├── next.config.ts             # Next.js config
└── netlify.toml               # Netlify deployment config
```

---

## � Detailed File & Library Explanations

### Core Configuration Files

#### `package.json`
**Purpose**: Lists all project dependencies and scripts.

**What it controls**:
- Which libraries are installed
- Available npm scripts (dev, build, start, lint)
- Project metadata (name, version, description)

**Impact of changes**:
- Adding a dependency: Run `npm install` to install it
- Removing a dependency: Run `npm uninstall package-name`
- Changing scripts: Alters how you run the project
- **Critical**: Never manually edit dependencies section; use npm commands

#### `next.config.ts`
**Purpose**: Next.js framework configuration.

**What it controls**:
- Image optimization settings
- External domain whitelisting
- Build optimizations
- Plugin configurations

**Impact of changes**:
- Adding image domains: Allows Next.js Image component to load from external URLs (required for Supabase storage)
- Changing build settings: Affects production build performance
- Modifying plugins: Can break deployment if misconfigured

**Current configuration**:
```typescript
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "enmlevvmvygmmhkppmrg.supabase.co",
      pathname: "/storage/v1/object/public/**",
    },
  ],
}
```

#### `tsconfig.json`
**Purpose**: TypeScript compiler configuration.

**What it controls**:
- Type checking strictness
- Path aliases (e.g., @/ imports)
- Compiler options
- Target JavaScript version

**Impact of changes**:
- Increasing strictness: More type errors, safer code
- Adding path aliases: Changes import syntax
- Changing target: Affects browser compatibility

#### `tailwind.config.ts`
**Purpose**: Tailwind CSS framework configuration.

**What it controls**:
- Custom color palette
- Font families
- Breakpoints
- Plugin configurations

**Impact of changes**:
- Modifying colors: Changes entire site color scheme
- Adding fonts: Requires font files and CSS imports
- Changing breakpoints: Affects responsive behavior

---

### App Directory (Next.js App Router)

#### `app/layout.tsx`
**Purpose**: Root layout component that wraps all pages.

**What it controls**:
- HTML structure (head, body)
- Theme provider configuration
- Font loading
- Global scripts (Netlify Identity)
- Toast notifications
- Smooth scrolling wrapper

**Impact of changes**:
- Changing defaultTheme: Alters initial theme (light/dark)
- Removing ThemeProvider: Breaks theme switching
- Modifying fonts: Changes typography across entire site
- Removing SmoothScroll: Disables smooth scrolling
- **Critical**: This file is the foundation of the entire app

**Key settings**:
```typescript
<ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
```

#### `app/page.tsx`
**Purpose**: Home page component that assembles all sections.

**What it controls**:
- Which components appear on the home page
- Order of sections
- Data fetching (projects, about, settings)
- Social links distribution

**Impact of changes**:
- Removing a component: Hides that section from home page
- Reordering sections: Changes page layout
- Modifying data fetching: Can break content display
- **Note**: This is a server component - no interactivity here

#### `app/globals.css`
**Purpose**: Global CSS styles and CSS custom properties.

**What it controls**:
- CSS variables (colors, spacing, radius)
- Global styles
- Tailwind directives
- Theme-specific styles

**Impact of changes**:
- Modifying CSS variables: Changes entire design system
- Removing Tailwind directives: Breaks all styling
- Adding custom styles: Affects components globally
- **Critical**: This file defines the visual foundation

**Key variables**:
```css
:root {
  --primary: 190 84% 50%; /* Primary color in HSL */
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;
}
```

#### `app/admin/page.tsx`
**Purpose**: Admin dashboard interface for content management.

**What it controls**:
- Admin authentication
- Tab navigation
- Admin panel layout
- Session management

**Impact of changes**:
- Modifying authentication: Can break admin access
- Changing tabs: Affects admin functionality
- Removing session check: Security vulnerability
- **Security**: This is a client component with authentication logic

---

### Components Directory

#### `components/Navbar.tsx`
**Purpose**: Navigation bar with theme toggle and links.

**What it controls**:
- Navigation links (Home, About, Services, Projects, Policy, Contact, WhatsApp)
- Theme toggle button (light/dark mode)
- Mobile menu
- Scroll behavior
- Glassmorphic styling

**Impact of changes**:
- Adding/removing links: Changes navigation options
- Removing theme toggle: Users can't switch themes
- Modifying scroll offset: Affects smooth scroll positioning
- Changing styling: Affects navbar appearance globally

**Key features**:
- Fixed positioning with scroll detection
- External link handling (WhatsApp opens in new tab)
- Mobile responsive menu
- Glassmorphic backdrop blur

#### `components/Hero.tsx`
**Purpose**: Hero section with profile image and stats.

**What it controls**:
- Main headline and subtitle
- Profile image display
- Stats display (Projects, Years, Satisfaction)
- CTA buttons
- Background gradient effects

**Impact of changes**:
- Modifying content: Changes hero text and stats
- Removing animations: Affects visual appeal
- Changing image: Updates profile picture
- Altering stats: Changes displayed numbers

**Key features**:
- Animated entrance effects
- Gradient background blobs
- Floating badges
- Responsive image sizing

#### `components/Projects.tsx`
**Purpose**: Projects showcase with 3D flashcard carousel.

**What it controls**:
- Project display (carousel style)
- 3D tilt effects (react-parallax-tilt)
- Filter buttons
- Navigation arrows
- Project indicators
- Image lazy loading

**Impact of changes**:
- Removing tilt effect: Loses 3D interaction
- Changing carousel logic: Affects project navigation
- Modifying filters: Changes filtering behavior
- Removing lazy loading: Affects performance

**Key features**:
- 3D parallax tilt on hover
- Carousel navigation
- Filter buttons (All, Web, Mobile, Design)
- Lazy-loaded Next.js Image components
- Glassmorphic card design

#### `components/About.tsx`
**Purpose**: About section with skills and approach.

**What it controls**:
- About text content
- Skill progress bars
- Approach features
- Glassmorphic card design

**Impact of changes**:
- Modifying skills: Changes displayed technologies
- Changing skill levels: Affects progress bar animation
- Removing animations: Loses visual appeal
- Altering content: Changes about section text

**Key features**:
- Animated skill bars with Framer Motion
- Gradient progress bars
- Glassmorphic cards
- Responsive grid layout

#### `components/Services.tsx`
**Purpose**: Services section with service cards.

**What it controls**:
- Service cards display
- Icon mapping
- Hover effects
- Data fetching from Supabase

**Impact of changes**:
- Modifying icon map: Changes service icons
- Removing hover effects: Loses interactivity
- Changing card layout: Affects grid arrangement
- Altering data fetching: Can break service display

**Key features**:
- Dynamic service loading from Supabase
- Hover lift effects
- Gradient icon backgrounds
- Responsive grid

#### `components/Contact.tsx`
**Purpose**: Contact section with social links.

**What it controls**:
- Contact link cards
- Email CTA
- Social link icons
- Data fetching from Supabase

**Impact of changes**:
- Modifying email: Changes contact email
- Removing links: Hides social platforms
- Changing icons: Affects icon display
- Altering layout: Changes contact section arrangement

**Key features**:
- Dynamic contact links from Supabase
- Glassmorphic cards
- Gradient CTA button
- Responsive layout

#### `components/Footer.tsx`
**Purpose**: Footer with logo and links.

**What it controls**:
- Footer links
- Copyright text
- Logo display
- Styling

**Impact of changes**:
- Removing links: Hides footer navigation
- Changing copyright: Updates year/text
- Modifying styling: Affects footer appearance
- **Simple**: Minimal component, easy to customize

---

### Library Explanations

#### **Next.js 16.2.6**
**Purpose**: React framework for production applications.

**What it does**:
- Server-side rendering (SSR)
- Static site generation (SSG)
- File-based routing
- API routes
- Image optimization
- Automatic code splitting

**Impact of changes**:
- Upgrading: May introduce breaking changes
- Downgrading: Loses new features
- **Critical**: Core framework - changes affect entire app

#### **React 19.2.4**
**Purpose**: UI library for building user interfaces.

**What it does**:
- Component-based architecture
- Virtual DOM
- State management (useState, useEffect)
- Hooks system
- Context API

**Impact of changes**:
- Upgrading: May introduce breaking changes
- **Critical**: Core library - changes affect all components

#### **TypeScript 5**
**Purpose**: Type-safe JavaScript.

**What it does**:
- Static type checking
- Interface definitions
- Type inference
- Compile-time error detection

**Impact of changes**:
- Increasing strictness: More type errors, safer code
- Disabling checks: Loses type safety
- **Recommended**: Keep strict mode enabled for better code quality

#### **Tailwind CSS 4**
**Purpose**: Utility-first CSS framework.

**What it does**:
- Utility classes for styling
- Responsive design utilities
- Dark mode support
- Custom configuration

**Impact of changes**:
- Modifying config: Changes entire design system
- Removing directives: Breaks all styling
- **Critical**: Styling foundation - changes affect entire site

#### **Framer Motion 12.38.0**
**Purpose**: Animation library for React.

**What it does**:
- Declarative animations
- Gesture recognition
- Layout animations
- Scroll-triggered animations

**Impact of changes**:
- Removing: All animations stop working
- Upgrading: May introduce breaking changes
- **Performance**: Heavy library - use sparingly

**Usage in project**:
- Hero entrance animations
- Project card hover effects
- Section scroll animations
- Mobile menu transitions

#### **react-parallax-tilt**
**Purpose**: 3D tilt effect component.

**What it does**:
- 3D tilt on mouse move
- Glare effect
- Scale on hover
- Perspective transforms

**Impact of changes**:
- Removing: Loses 3D effect on project cards
- Modifying settings: Changes tilt intensity
- **Performance**: Lightweight GPU-accelerated

**Usage in project**:
- Project cards 3D tilt effect
- Configurable tilt angles and glare

#### **next-themes**
**Purpose**: Theme management for Next.js.

**What it does**:
- Light/dark mode switching
- System preference detection
- Theme persistence
- No flash on load

**Impact of changes**:
- Removing: Breaks theme switching
- Modifying config: Changes default theme
- **Critical**: Theme system foundation

**Usage in project**:
- Theme toggle in Navbar
- Light theme as default
- Persists user preference

#### **lucide-react**
**Purpose**: Icon library.

**What it does**:
- Consistent icon set
- Tree-shakeable
- Customizable
- TypeScript support

**Impact of changes**:
- Removing: All icons disappear
- Changing library: Requires updating all icon imports
- **Performance**: Lightweight, tree-shakeable

**Usage in project**:
- Navigation icons
- Feature icons
- UI icons throughout

#### **Supabase 2.106.0**
**Purpose**: Backend-as-a-Service (PostgreSQL).

**What it does**:
- Database hosting
- Authentication
- Real-time subscriptions
- Storage
- Edge functions

**Impact of changes**:
- Upgrading: May introduce breaking changes
- Modifying client: Affects all database operations
- **Critical**: Backend foundation - changes affect data layer

**Usage in project**:
- Content storage (projects, services, about)
- Authentication for admin
- Image storage
- Real-time updates

#### **react-hook-form 7.76.0**
**Purpose**: Form management library.

**What it does**:
- Form state management
- Validation
- Performance optimization
- TypeScript support

**Impact of changes**:
- Removing: Forms may break
- Upgrading: May introduce breaking changes
- **Performance**: Optimized for large forms

**Usage in project**:
- Admin dashboard forms
- Contact forms (if added)

#### **zod 4.4.3**
**Purpose**: Schema validation library.

**What it does**:
- Runtime type validation
- Schema definitions
- Error handling
- TypeScript integration

**Impact of changes**:
- Removing: Validation breaks
- Modifying schemas: Changes validation rules
- **Security**: Important for data validation

**Usage in project**:
- Form validation
- API request validation

---

### Library Directory

#### `lib/db.ts`
**Purpose**: Database operations and data fetching.

**What it controls**:
- All Supabase database operations
- CRUD operations for projects, services, about, contact, settings
- Image upload/delete
- Fallback data for when DB is unavailable
- Server actions (marked with "use server")

**Impact of changes**:
- Modifying queries: Can break data fetching
- Removing fallback: Site shows errors when DB is down
- Changing table names: Breaks all data operations
- **Critical**: Data layer - changes affect all content display

**Key functions**:
- `getProjects()`: Fetches all projects
- `createProject()`: Creates new project (admin only)
- `updateProject()`: Updates project (admin only)
- `deleteProject()`: Deletes project (admin only)
- Similar functions for services, about, contact, settings
- `uploadProjectImage()`: Handles image uploads to Supabase storage

**Security note**:
- Uses `supabaseAdmin` for write operations (bypasses RLS)
- Uses `supabase` for read operations (respects RLS)
- Marked with "use server" - runs server-side only

#### `lib/supabase.ts`
**Purpose**: Supabase client initialization.

**What it controls**:
- Supabase client configuration
- Admin client with service role key
- Environment variable handling
- Fallback for missing env vars

**Impact of changes**:
- Modifying client initialization: Breaks all Supabase operations
- Removing service role key: Admin operations fail
- Changing fallback logic: Affects error handling
- **Critical**: Database connection - changes affect all data operations

**Key exports**:
- `supabase`: Public client (uses anon key)
- `supabaseAdmin`: Admin client (uses service role key)

#### `lib/types.ts`
**Purpose**: TypeScript type definitions.

**What it controls**:
- Database table types
- Interface definitions
- Type safety for data operations

**Impact of changes**:
- Modifying types: Can cause type errors throughout app
- Removing types: Breaks type safety
- **Recommended**: Keep types in sync with database schema

---

### UI Components (shadcn/ui)

#### `components/ui/button.tsx`
**Purpose**: Reusable button component.

**What it controls**:
- Button variants (default, destructive, outline, etc.)
- Button sizes
- Button states (loading, disabled)

**Impact of changes**:
- Modifying variants: Affects all buttons using that variant
- Removing variants: Breaks buttons using removed variant
- **Usage**: Used throughout admin dashboard and forms

#### `components/ui/card.tsx`
**Purpose**: Reusable card component.

**What it controls**:
- Card structure
- Card variants
- Header, content, footer sections

**Impact of changes**:
- Modifying structure: Affects all cards
- Removing sections: Breaks cards using those sections
- **Usage**: Used in admin dashboard and various sections

#### Other UI components follow similar patterns for dialog, input, select, etc.

---

### Configuration Files

#### `netlify.toml`
**Purpose**: Netlify deployment configuration.

**What it controls**:
- Build command
- Publish directory
- Plugin configurations
- Redirect rules
- Environment variables

**Impact of changes**:
- Modifying build command: Can break deployment
- Changing publish directory: Deploy wrong files
- Removing plugin: Breaks Next.js on Netlify
- **Critical**: Deployment configuration - changes affect production

**Current configuration**:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

#### `.env.local`
**Purpose**: Environment variables (not in Git).

**What it controls**:
- Supabase connection details
- API keys
- Secret keys

**Impact of changes**:
- Removing variables: Breaks database connection
- Exposing service role key: Security vulnerability
- **Critical**: Never commit to Git - add to .gitignore

**Required variables**:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## 🔄 Change Impact Summary

### High-Impact Changes (Affects Entire Site)

1. **`app/layout.tsx`** - Root layout, theme provider, fonts
2. **`app/globals.css`** - Global styles, CSS variables
3. **`lib/supabase.ts`** - Database connection
4. **`next.config.ts`** - Next.js configuration
5. **`tailwind.config.ts`** - Design system
6. **`package.json`** - Dependencies

### Medium-Impact Changes (Affects Multiple Sections)

1. **`components/Navbar.tsx`** - Navigation, theme toggle
2. **`lib/db.ts`** - All data operations
3. **`lib/types.ts`** - Type definitions

### Low-Impact Changes (Affects Single Section)

1. **`components/Hero.tsx`** - Hero section only
2. **`components/Projects.tsx`** - Projects section only
3. **`components/About.tsx`** - About section only
4. **`components/Services.tsx`** - Services section only
5. **`components/Contact.tsx`** - Contact section only
6. **`components/Footer.tsx`** - Footer only

### Safe Changes (Minimal Risk)

1. **Text content** in components
2. **Image paths** in components
3. **Link URLs** in components
4. **Color values** in CSS variables
5. **Navigation links** in Navbar

### Risky Changes (Require Testing)

1. **Database schema** modifications
2. **Supabase RLS policies**
3. **Authentication logic**
4. **Environment variables**
5. **Build configuration**

---

## � Setup Instructions

### Step 1: Clone or Initialize Project

```bash
# Option A: Clone existing repository
git clone <your-repository-url>
cd syedcodes

# Option B: Create new Next.js project
npx create-next-app@latest syedcodes
cd syedcodes
```

### Step 2: Install Dependencies

```bash
# Install all dependencies
npm install

# If starting from scratch, install required packages:
npm install next@latest react@latest react-dom@latest
npm install typescript @types/node @types/react @types/react-dom
npm install tailwindcss postcss autoprefixer
npm install framer-motion react-parallax-tilt next-themes lucide-react
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install react-hook-form zod @hookform/resolvers
npm install clsx tailwind-merge class-variance-authority
npm install @radix-ui/react-dialog @radix-ui/react-label
npm install @radix-ui/react-select @radix-ui/react-slot
npm install @radix-ui/react-tabs
npm install sonner
npm install gsap lenis react-intersection-observer
npm install react-type-animation react-icons swiper
npm install tw-animate-css
npm install netlify-identity-widget
```

### Step 3: Initialize Tailwind CSS

```bash
# Initialize Tailwind
npx tailwindcss init -p

# Or for Tailwind CSS v4 (used in this project)
# No initialization needed, just add to package.json
```

### Step 4: Setup shadcn/ui Components

```bash
# Initialize shadcn/ui
npx shadcn@latest init

# Add required components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add select
npx shadcn@latest add separator
npx shadcn@latest add sheet
npx shadcn@latest add tabs
npx shadcn@latest add textarea
npx shadcn@latest add avatar
npx shadcn@latest add badge
npx shadcn@latest add dropdown-menu
```

---

## 🔧 Supabase Backend Setup

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up / Log in
3. Click "New Project"
4. Fill in project details:
   - **Name**: syedcodes-portfolio
   - **Database Password**: (save this securely!)
   - **Region**: Choose closest to your audience
5. Wait for project to initialize (2-3 minutes)

### Step 2: Create Database Tables

Run these SQL commands in Supabase SQL Editor:

```sql
-- Projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  link TEXT NOT NULL,
  image_url TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services table
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- About section table
CREATE TABLE about_section (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table (for hero, social links, etc.)
CREATE TABLE settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact links table
CREATE TABLE contact_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_links ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your security needs)
CREATE POLICY "Enable read access for all users" ON projects FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated" ON projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated" ON projects FOR DELETE USING (auth.role() = 'authenticated');

-- Repeat similar policies for other tables
```

### Step 3: Get Supabase Credentials

1. Go to Project Settings → API
2. Copy these values:
   - **Project URL** (e.g., https://xyz.supabase.co)
   - **Anon Public Key** (public API key)
   - **Service Role Key** (secret key - NEVER expose in frontend!)

---

## 🔐 Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Netlify Identity (optional)
NEXT_PUBLIC_NETLIFY_IDENTITY_URL=https://your-site.netlify.app
```

### ⚠️ Important Security Notes

- **NEVER** commit `.env.local` to Git
- **NEVER** expose Service Role Key in client-side code
- **ALWAYS** use Anon Key for frontend
- Add `.env.local` to `.gitignore`

---

## 🏃 Running the Project

### Development Mode

```bash
# Start development server
npm run dev

# Open browser to http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Linting

```bash
# Run ESLint
npm run lint
```

---

## 🌐 Deployment

### Deploy to Netlify

#### Option 1: Netlify CLI (Recommended)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize site
netlify init

# Deploy
netlify deploy --prod
```

#### Option 2: Git Integration

1. Push code to GitHub/GitLab/Bitbucket
2. Go to Netlify dashboard
3. Click "Add new site" → "Import from Git"
4. Connect your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
6. Add environment variables in Netlify dashboard
7. Deploy!

#### Option 3: Drag & Drop

```bash
# Build the project
npm run build

# Export static files (if using static export)
npm run export

# Drag the 'out' or '.next' folder to Netlify dashboard
```

### Netlify Configuration

The `netlify.toml` file is already configured:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

---

## 👨‍💼 Admin Dashboard

### Accessing Admin Panel

1. Navigate to `/admin` on your deployed site
2. Netlify Identity will prompt for login
3. Create an account or log in
4. Access the admin dashboard

### Admin Features

- **Projects Tab**: Add, edit, delete projects
- **Services Tab**: Manage service offerings
- **About Tab**: Update about section content
- **Contact Tab**: Manage contact links
- **Settings Tab**: Configure hero section, social links

### Content Management

All content is stored in Supabase tables. Changes made in the admin dashboard are:
- Immediately reflected on the live site
- Stored securely in PostgreSQL
- Backed up by Supabase

---

## 🎨 Customization Guide

### Changing Colors

Edit `app/globals.css`:

```css
:root {
  --primary: 190 84% 50%; /* HSL values */
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222 47% 11%;
  /* ... more variables */
}
```

### Updating Theme

The project uses `next-themes` for light/dark mode:

- Default theme: **Light** (set in `app/layout.tsx`)
- Toggle button in Navbar
- Persists user preference

### Modifying Components

Key components to customize:

1. **Hero Section** (`components/Hero.tsx`)
   - Change title, subtitle
   - Update profile image
   - Modify stats

2. **Projects** (`components/Projects.tsx`)
   - Adjust 3D tilt effect
   - Change carousel behavior
   - Modify card styling

3. **Navbar** (`components/Navbar.tsx`)
   - Update navigation links
   - Change WhatsApp CTA
   - Modify theme toggle

### Adding New Sections

1. Create component in `components/`
2. Import in `app/page.tsx`
3. Add to layout

---

## 🐛 Troubleshooting

### Common Issues

#### Issue: Build fails on Netlify

**Solution**:
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

#### Issue: Supabase connection error

**Solution**:
- Verify environment variables are set
- Check Supabase project is active
- Ensure RLS policies allow access
- Test connection in Supabase dashboard

#### Issue: Images not loading

**Solution**:
- Ensure images are in `public/` folder
- Check image paths in components
- Use Next.js Image component for optimization
- Verify Supabase storage permissions (if using Supabase storage)

#### Issue: Theme not persisting

**Solution**:
- Check `next-themes` configuration in `layout.tsx`
- Ensure `suppressHydrationWarning` is on html tag
- Clear browser cache

#### Issue: Animations not smooth

**Solution**:
- Reduce animation complexity on mobile
- Use `will-change` CSS property sparingly
- Test on lower-end devices
- Consider using `prefers-reduced-motion` media query

---

## 💡 Best Practices

### Performance Optimization

1. **Image Optimization**
   - Use Next.js `<Image>` component
   - Implement lazy loading
   - Use WebP format when possible
   - Compress images before upload

2. **Code Splitting**
   - Next.js automatically splits code
   - Use dynamic imports for heavy components
   - Lazy load admin dashboard

3. **Animation Performance**
   - Use CSS transforms (GPU-accelerated)
   - Avoid animating layout properties
   - Reduce motion on mobile devices
   - Use `will-change` sparingly

### Security

1. **Environment Variables**
   - Never commit `.env.local`
   - Rotate API keys regularly
   - Use different keys for dev/prod

2. **Supabase RLS**
   - Always enable Row Level Security
   - Create specific policies
   - Test policies thoroughly

3. **Authentication**
   - Use Netlify Identity for admin access
   - Implement proper session management
   - Log out securely

### SEO

1. **Meta Tags**
   - Update metadata in `app/layout.tsx`
   - Add Open Graph tags
   - Include Twitter Card tags

2. **Sitemap**
   - Generate sitemap.xml
   - Submit to Google Search Console

3. **Performance**
   - Monitor Lighthouse scores
   - Optimize Core Web Vitals
   - Use proper heading hierarchy

---

## 📚 Additional Resources

### Documentation Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [shadcn/ui Documentation](https://ui.shadcn.com)

### Learning Resources

- [Next.js Learn Course](https://nextjs.org/learn)
- [Tailwind CSS Tutorial](https://tailwindcss.com/docs/installation)
- [React Tutorial](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Community

- [Next.js Discord](https://discord.gg/nextjs)
- [Supabase Discord](https://discord.gg/supabase)
- [Tailwind CSS Discord](https://discord.gg/tailwindcss)

---

## 🎯 Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Lint code
npm run lint

# Deploy to Netlify
netlify deploy --prod
```

---

## 📝 Pre-Deployment Checklist

- [ ] All environment variables set
- [ ] Supabase tables created and populated
- [ ] RLS policies configured
- [ ] Images optimized
- [ ] Tested on mobile devices
- [ ] Tested dark/light mode
- [ ] Admin dashboard functional
- [ ] Contact links working
- [ ] SEO metadata updated
- [ ] Build runs successfully locally
- [ ] Lighthouse score acceptable (>90)
- [ ] Backed up database
- [ ] Documentation updated

---

## 🆘 Getting Help

If you encounter issues:

1. Check this documentation first
2. Review error messages in browser console
3. Check Netlify build logs
4. Review Supabase dashboard logs
5. Search GitHub issues for similar problems
6. Ask in community Discord channels

---

## 📄 License

This project is open source. Feel free to use it as a template for your own portfolio.

---

**Last Updated**: 2026-05-22
**Version**: 2.0.0 (Premium Redesign)
