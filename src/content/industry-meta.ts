/**
 * Plain data about each industry page — no React imports, so the build
 * (vite.config.ts) can read it to write per-page SEO tags and the sitemap.
 */
export const industryMeta = [
  {
    slug: "restaurants",
    no: "01",
    name: "Restaurants & Cafés",
    seoTitle: "Restaurant Website Design — Menus, Bookings & WhatsApp Orders | Xhibit AI",
    seoDescription:
      "See a live demo of a restaurant website: digital menu, table bookings and WhatsApp ordering. Try it with your restaurant's name.",
  },
  {
    slug: "clinics",
    no: "02",
    name: "Clinics & Hospitals",
    seoTitle: "Clinic & Hospital Website Design — Online Appointments | Xhibit AI",
    seoDescription:
      "A live demo of a clinic website: doctors and timings, online appointments with token numbers, health packages and reminders.",
  },
  {
    slug: "schools",
    no: "03",
    name: "Schools & Coaching",
    seoTitle: "School & Coaching Website Design — Admissions & Parent Portal | Xhibit AI",
    seoDescription:
      "A live demo of a school website: online admissions, notice board, results and a parent portal for attendance and fees.",
  },
  {
    slug: "salons",
    no: "04",
    name: "Salons & Spas",
    seoTitle: "Salon & Spa Website Design — Online Booking & Bridal Packages | Xhibit AI",
    seoDescription:
      "A live demo of a salon website: service menu with prices, stylist booking, bridal packages and a lookbook.",
  },
  {
    slug: "gyms",
    no: "05",
    name: "Gyms & Fitness",
    seoTitle: "Gym & Fitness Website Design — Plans, Classes & Free Trials | Xhibit AI",
    seoDescription:
      "A live demo of a gym website: membership plans, class timetable, free trial passes and a BMI calculator.",
  },
  {
    slug: "hotels",
    no: "06",
    name: "Hotels & Homestays",
    seoTitle: "Hotel & Homestay Website Design — Direct Bookings & Banquets | Xhibit AI",
    seoDescription:
      "A live demo of a hotel website: date picker, direct room bookings, banquet and wedding enquiries, and a local guide.",
  },
  {
    slug: "retail",
    no: "07",
    name: "Shops & Retail",
    seoTitle: "Retail Shop Website Design — Catalogue & WhatsApp Orders | Xhibit AI",
    seoDescription:
      "A live demo of a shop website: product catalogue with prices, WhatsApp orders, reserve-in-store and festive offers.",
  },
  {
    slug: "business",
    no: "08",
    name: "Businesses & Services",
    seoTitle: "Business Web App Development — Orders, Stock, GST & Dues | Xhibit AI",
    seoDescription:
      "A live demo of a business web app: sales dashboard, GST invoices on WhatsApp, low-stock alerts and one-tap payment reminders.",
  },
] as const;

export type IndustrySlug = (typeof industryMeta)[number]["slug"];
