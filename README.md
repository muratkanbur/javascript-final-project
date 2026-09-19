# 🥗 Calorie & Daily Nutrient Tracker

A modern, responsive, and interactive web application designed to help users track their daily calorie intake, water consumption, and macronutrient distribution (Protein, Carbs, Fat) in real time.

---

## 🌟 Key Features

* **🔍 Food Search with USDA API:** Dynamic food search integrated with the **USDA FoodData Central API**, backed by a local snacks database fallback.
* **🍽️ Meal Management:** Easily add foods to specific meal categories (*Breakfast, Lunch, Dinner, Snacks*) and remove them as needed.
* **📊 Real-Time Calorie & Macro Calculations:** Instant updates to consumed calories, remaining daily goals, and dynamic progress bar indicators for macronutrients.
* **💧 Water Intake Tracking:** Dedicated interactive module to log daily water consumption (+250ml, +500ml, Reset).
* **📱 Fully Responsive Design:** Clean UI/UX optimized for Mobile, Tablet, and Desktop displays using modular CSS layouts.
* **⚡ Modular Architecture:** Structured, maintainable vanilla JavaScript codebase (`water.js`, `api.js`, `summary.js`, `calorie.js`, `snacksDatabase.js`).

---

## 🛠️ Tech Stack & Architecture

* **Frontend:** HTML5, CSS3 (Flexbox/Grid, Responsive Breakpoints), Vanilla JavaScript (ES6+)
* **API:** [USDA FoodData Central Search API](https://fdc.nal.usda.gov/)
* **Deployment:** Hosted on Netlify with continuous deployment from GitHub.

---

## 📁 Project Structure

```text
├── assets/             # Images, profile icons, and static assets
├── css/                # Style sheets (style.css, md.css, lg.css)
├── js/
│   ├── api.js          # Handles USDA API calls & fallback filtering
│   ├── calorie.js      # Modal, meal adding/deleting DOM logic
│   ├── snacksDatabase.js# Custom local snacks library
│   ├── summary.js      # Calorie/Macro updates & progress bars
│   └── water.js        # Water tracking functionality
├── index.html          # Main HTML structure
└── README.md           # Documentation
