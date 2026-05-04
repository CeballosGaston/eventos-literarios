# 📚 LitEvents

LitEvents is a web application designed to create, manage, and explore literary events in real time. Users can discover events through an interactive map or calendar view, making it easy to stay connected with the literary scene.

Currently focused on Barcelona, the platform is designed with scalability in mind and can be extended to support events worldwide.

---

## 🚀 Live Demo

👉(https://eventos-literarios.vercel.app/login)

---

## ✨ Features

* 📌 **CRUD Functionality**
  Create, edit, and delete literary events 

* 🗺️ **Interactive Map (Leaflet)**
  Explore events geographically.

* 📅 **Dynamic Calendar (FullCalendar)**
  Browse events by date with an intuitive interface.

* 🔐 **Authentication (Supabase)**
  Secure user authentication system.

* 📊 **Event Statistics (Recharts)**

  * Events per month
  * Events by category

* ⚡ **Real-time-ready architecture**
  Built with scalability in mind.

* 🔎 **Advanced Filtering**
  Filter by category, date, and location.


---

## 🧱 Tech Stack

* **Frontend**: Next.js, React
* **Styling**: Tailwind CSS, shadcn/ui
* **Backend / DB**: Supabase
* **Maps**: Leaflet
* **Calendar**: FullCalendar
* **Charts**: Recharts
* **Testing**: Vitest

---

## 📸 Screenshots

<img width="1475" height="337" alt="Captura de pantalla 2026-05-04 151535" src="https://github.com/user-attachments/assets/8bab31af-9fcf-42c9-908a-500f5d87b006" />


### Map View

<img width="692" height="711" alt="Captura de pantalla 2026-05-04 151507" src="https://github.com/user-attachments/assets/71b8e902-22a1-4f57-92eb-552bfe483744" />


### Calendar View

<img width="704" height="773" alt="Captura de pantalla 2026-05-04 151523" src="https://github.com/user-attachments/assets/97c49a9e-1291-4995-90e0-757e986affdd" />


### Dashboard / Stats

<img width="1459" height="738" alt="Captura de pantalla 2026-05-04 151557" src="https://github.com/user-attachments/assets/57520784-3109-4a29-b1f1-c584d4f4cb26" />


---

## 🧪 Testing

Unit tests are implemented using **Vitest**, focusing on core business logic.

* ✅ Pure logic testing
* ❌ No UI testing (by design)

<img width="1916" height="641" alt="Captura de pantalla 2026-05-04 132459" src="https://github.com/user-attachments/assets/a1a8a1c7-710a-4541-9b86-a9dede7db11c" />


---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
(https://github.com/CeballosGaston/eventos-literarios.git)
cd eventos-literarios
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

---

## 🔑 Environment Variables

This project uses Supabase, so you'll need to configure environment variables.

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://yhvwzmfuxgpjenhpnecd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlodnd6bWZ1eGdwamVuaHBuZWNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMzc2MjUsImV4cCI6MjA5MTkxMzYyNX0.MjOeuj1xxK6OhlgzwC8uIdx6m5B2NBSL4URFbhdMhbs
```



---

## 🧠 Architecture Notes

* Frontend-driven architecture using Next.js
* Supabase handles:

  * Authentication
  * Database
* Modular component structure with reusable UI (shadcn)
* Separation between UI and business logic (tested with Vitest)

---


## ♿ Accessibility

LitEvents is built with accessibility in mind and currently achieves a Lighthouse accessibility score of **85**. 
Ongoing improvements are focused on reaching full compliance, ensuring the platform is usable for all users.

---

## 🛣️ Roadmap

* ♿ **100% Accessibility (WCAG compliance)**
  Improve contrast, keyboard navigation, and screen reader support.

* 🔔 **Event Reminders**
  Notifications for upcoming events.

* 📝 **Event Registration**
  Allow users to sign up for events.

* 📊 **Attendance & Capacity Analytics**
  Track event capacity and attendance insights.

* 🌐 **Multi-language Support (i18n)**
  Support multiple languages beyond Spanish.

* ❤️ **Favorites / Saved Events**
  Let users bookmark events.

* 👥 **User Profiles**
  Personal dashboards with activity history.

