# Omega Admin Portal 🚀

A high-performance, minimalist SaaS administrative interface built to optimize e-commerce collection management, inventory tracking, and distribution analytics. This architecture balances premium design aesthetics inspired by modern streetwear digital platforms with rigid front-end execution parameters.

**Live Deployment:** [View Live Application (Vercel)](https://ecommerce-trial-ashy.vercel.app/)  
**Source Code:** [GitHub Repository](https://github.com/nikhilyt01/ecommerce_trial)

---

## 🎨 Design System & Visual Strategy
The visual framework prioritizes data clarity and modern structural layouts over cluttered enterprise interfaces, pulling inspiration from premium minimal digital storefronts.

* **Typography:** Set globally to `Plus Jakarta Sans` for clean, high-legibility typographic hierarchy across dense data metrics.
* **Color Palette:**
    * `Primary Background (#FFFFFF)`: Applied strictly across interactive work canvases.
    * `Secondary Background (#F9FAFB)`: Utilized for layout structures (Sidebar, Top navigation headers, table borders).
    * `Primary Text / Active Elements (#111111)`: High-contrast deep charcoal text values ensuring accessible tracking states.
    * `Accent Alerts (#DC2626)`: High-visibility crimson red allocated for critical indicators like data mutations and low stock thresholds.
* **Iconography:** Rendered exclusively using the clean, linear design patterns of `lucide-react`.

---

## 🛠️ Technical Stack & Dependency Landscape
* **Core Engine:** React 18 / 19 (via Vite for optimized build streaming and ultra-fast HMR)
* **Routing System:** `react-router-dom` (v6 Engine managing declarative application flows)
* **Style Processing:** Tailwind CSS (Modern functional utility architecture utilizing design configuration maps)
* **Data Visualization:** `recharts` (Declarative SVG analytics generation container)
* **Utility Helper Kits:** `clsx` & `tailwind-merge` (Dynamic conditional utility string resolution)

---

## 🏗️ Architectural Directory Structure
The workspace structure enforces a strict feature-by-feature pattern to separate global application shells, common visual nodes, state management hooks, and localized network interfaces:

```text
src/
 ├── components/
 │    ├── layout/      # Core Application Shell framework (Sidebar, Topbar, MainLayout)
 │    ├── common/      # System Design UI primitives (Button, Badge, Card components)
 │    └── products/    # Localized product list visual tables and filtration grids
 ├── hooks/            # Modular state sync models (useUrlState, useDebounce)
 ├── pages/            # View managers (Dashboard, ProductList, ProductDetail)
 ├── services/         # Isolated abstraction layer handling external REST endpoints
 └── utils/            # Pure JavaScript text/value format helper scripts