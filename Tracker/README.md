# 💸 FamilyCash — Family Expense Tracker

**FamilyCash** is a modern, fast, and interactive family budgeting and expense tracking web application. The app has been designed with a focus on premium user experience, deep family profile customization, and clear visual analytics.

---

## 🌟 Key Features

### 🎨 Premium Design & Interface
- **Violet-Indigo Theme**: Sleek, modern design built using the premium OKLCH color space (violet and indigo tones).
- **Dark & Light Modes**: Seamless dark and light mode support with smooth transitions.
- **Micro-Animations & Hover Effects**: Responsive interactive elements, scale animations on click/active states, and a clean interface without jarring animations.

### 🏠 Family Profile Customization
- **Profile Personalization**: Customize your family nickname and select a profile icon from a curated list of emojis.
- **Member Contribution Breakdown**: Visual cards and progress bars displaying the financial and transaction contribution of each family member.
- **Real-Time Overview Stats**: Displays total family spending, transaction count, and average item cost on the profile page.

### 📊 Analytics & Interactive Charts
- **Dynamic Charts**: Interactive Category Bar Charts (`CategoryBarChart`) and Member Pie Charts (`MemberPieChart`) powered by Recharts.
- **Adaptive Tooltips**: Tooltip texts and values automatically adjust to remain fully legible in both light and dark modes.

### ⚡ Transaction Management
- **Quick Expense Log**: Add new expenses with customizable family members, categories, price tag, and automated timestamps.
- **Search & Filtering**: A smart `FilterBar` supporting real-time search, category filtering, member filtering, and advanced sorting (newest, oldest, most expensive).
- **Interactive Toasts**: Native browser `confirm()` modals have been replaced with elegant `sonner` warning toasts with embedded "Delete" and "Clear" actions.

### 🌐 Multi-Language Support
- Full localization for **Ukrainian (UA)** and **English (EN)** using `next-intl`.
- Dynamic, real-time language switching directly in the navigation bar.

### 🔒 Authorization & Data Persistence
- Secure client-side login and registration with mock latency for visual feedback.
- Private routes (e.g. `/`, `/add-expense`, `/profile`, `/diagrams`) are protected using session-based cookies via Next.js Middleware.
- Data persistence: Expenses and user records are stored directly inside the browser's `localStorage` using Zustand's Persist Middleware.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: Tailwind CSS, Vanilla CSS
- **State Management**: Zustand (with local storage persistence middleware)
- **Queries & Caching**: TanStack React Query
- **UI Components & Icons**: Radix UI, Lucide Icons, Framer Motion (via shadcn)
- **Visual Charts**: Recharts
- **Notifications**: Sonner Toasts
- **Localization**: Next-Intl

---

## 📂 Project Structure

Key files and folders:
- 📂 `messages/` — JSON translation dictionaries (`uk.json`, `en.json`)
- 📂 `src/app/` — Application pages:
  - 🏠 `/` (Dashboard / Main transaction view)
  - 🔑 `/login` (Sign in & Registration screen)
  - 👤 `/profile` (Family profile configurations)
  - 📊 `/diagrams` (Interactive analytics charts)
  - ➕ `/add-expense` (New transaction form)
- 📂 `src/components/` — Shared modular UI components, Navbar, and profile subcomponents
- 📂 `src/hooks/` — React Query custom hooks for data fetching (`useExpenses.ts`)
- 📂 `src/store/` — Zustand store for user sessions and credentials (`useAuthStore.ts`)
- 📂 `src/lib/` — API clients, helper utilities, and constants (`api.ts`, `constants.ts`)
- 📄 `src/proxy.ts` — Edge middleware protecting private paths using session cookies

---

## 🚀 Getting Started

### 1. Install Dependencies
Make sure you have Node.js installed. Clone the repository, open it, and run the following command to download all dependencies:

```bash
npm install
```

### 2. Run the Development Server
Launch the local dev environment:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the running application.

### 3. Production Build
To run TypeScript compiler checks and generate an optimized static build:

```bash
npm run build
```

To run the compiled production bundle locally:

```bash
npm run start
```
