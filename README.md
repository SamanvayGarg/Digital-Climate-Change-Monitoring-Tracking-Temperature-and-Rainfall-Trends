# Digital Climate Change Monitoring: Tracking Temperature and Rainfall Trends

> **College Environmental Studies CA Project**  
> **Course Code:** CHE 110 — Environmental Studies Continuous Assessment 1 (CA1)  
> **Project Type:** Interactive Educational Web Platform & Video Presentation

---

## 🌍 Project Overview

**Digital Climate Change Monitoring: Tracking Temperature and Rainfall Trends** is an interactive, scientifically grounded web platform built to demonstrate how modern digital technologies—such as Automated Weather Stations (AWS), IoT sensors, Earth observation satellites, and data visualization engines—are employed to monitor temperature anomalies and shifting precipitation regimes.

The platform bridges environmental science, meteorological physics, digital technologies, and interactive visual analytics to foster climate literacy and support evidence-based sustainability solutions.

---

## 🎨 Visual Identity & Environmental Design

The website follows an environmental nature-inspired design system:
- **Primary Color Palette:**
  - **Forest & Dark Greens (`#0b2e1b`, `#144d2d`, `#195632`):** Used for navigation, critical headers, primary action buttons, key metrics, and footer.
  - **Mint & Leaf Greens (`#f0fdf4`, `#e8f7ee`, `#10b981`, `#34d399`):** Used for section backgrounds, metric cards, active states, and highlights.
  - **Water & Rainfall Blue Accents (`#0284c7`, `#38bdf8`, `#e0f2fe`):** Used subtly for precipitation hyetographs, rainy day indicators, and atmospheric hydrological data.
- **Modern Typography:** Styled with Google Fonts (`Outfit` and `Plus Jakarta Sans`) with standard cross-platform system fallbacks.
- **Responsive Layout:** Optimized for Desktop, Laptop, Tablet, and Mobile screens with sticky blur navigation and mobile drawer menu.

---

## 📁 Project Directory Structure

```text
CHE 110 CA1/
│
├── index.html                  # Main application markup containing all 14 project sections
├── package.json                # Project manifest and standard npm scripts
├── server.py                   # Lightweight Python HTTP server with auto-launch
├── server.js                   # Lightweight Node.js HTTP server (zero dependencies)
├── README.md                   # Comprehensive project documentation & video guide
│
├── css/
│   ├── style.css               # Core design tokens, typography, hero, and education cards
│   ├── weather-effects.css     # Rain, heavy rain, and thunderstorm simulation styles
│   └── dashboard.css           # Telemetry stat cards, charts layout, stations map & quiz styles
│
├── js/
│   ├── vendor/
│   │   └── chart.umd.min.js    # Local Chart.js bundle (enables 100% offline functionality)
│   ├── data.js                 # Sample climate datasets for Global, Delhi, London, Amazon, Tokyo
│   ├── weather.js              # HTML5 Canvas physics engine for Rain, Thunderstorm & Lightning
│   ├── charts.js               # Interactive Chart.js controllers for Temperature & Rainfall
│   ├── quiz.js                 # 5-Question Climate Awareness Assessment engine
│   └── app.js                  # Main UI orchestrator, smooth scroll & navigation observer
│
└── assets/
    └── images/
        ├── hero-climate-network.jpg    # Custom isometric digital climate monitoring graphic
        └── tech-monitoring-flow.jpg    # Custom sensor-to-satellite-to-cloud architecture diagram
```

---

## ⚡ How to Run the Project

You can run this project using **any** of the following methods:

### Method 1: Direct File Open (Zero Setup)
Simply double-click [`index.html`](file:///c:/Users/hp/OneDrive/Desktop/CHE%20110%20CA1/index.html) or right-click and choose **Open with Browser** (Chrome, Edge, Firefox, Safari).

### Method 2: Python Local Server (Recommended for Evaluation)
Run the included Python server script from the terminal:
```bash
python server.py
```
Open your browser at `http://localhost:3000`.

### Method 3: Node.js Server
Run the included Node.js server script:
```bash
node server.js
# Or using npm:
npm start
```
Open your browser at `http://localhost:3000`.

---

## 🖥️ Complete Sections Breakdown

| Section # | Section Title | Key Features & Interactions |
| :--- | :--- | :--- |
| **Header** | **Navigation Bar** | Sticky glassmorphism header, shortened visual title `Digital Climate Monitoring`, mobile hamburger menu, active section highlighting. |
| **1** | **Hero Section** | Full official title: `Digital Climate Change Monitoring: Tracking Temperature and Rainfall Trends`, subtitle, CTA buttons (`Explore Climate Data`, `Learn About Climate Change`), isometric environmental visual. |
| **2** | **About Climate Change** | Student-friendly explanations of climate change, the greenhouse effect, causes of climate change, a structured **Weather vs. Climate** comparison card, and reasons for climate observation. |
| **3** | **Temperature Monitoring** | Interactive Line Chart (Chart.js), Average/Max/Min/Anomaly stat cards, multi-location selector (13 locations: New Delhi, London, Tokyo, Amazon Basin, Global Mean, Maharashtra, Rajasthan, Assam, Uttarakhand, Punjab, Kerala, Tamil Nadu, Himachal Pradesh), Year filter (all 27 years: 2000–2026), and Monthly/Multi-Year toggle. |
| **4 & 5** | **Rainfall Monitoring & Weather Simulator** | Hyetograph Bar/Line combination chart, precipitation stat cards, plus the **Canvas-based Weather Simulator**: Normal Rain (continuous gentle rain sound), Heavy Rain (continuous intense rain sound with dedicated blue active button), Thunderstorm (heavy rain + synchronized lightning sound and rolling thunder rumble), audio toggle, and dynamic status badges (`☀️ Clear`, `🌦 Light Rain`, `🌧 Heavy Rain`, `⛈ Thunderstorm`). |
| **6** | **Central Monitoring Dashboard** | Synthesized overview with animated counters, 13 interactive station map selector cards (coordinates, elevation, telemetry status), and multi-decadal trajectory comparison chart (2000–2026). |
| **7 & 8** | **Digital Architecture & Key Tech** | 6-stage end-to-end process flow (Sensors & Satellites → Data Collection → Cloud Storage → Data Analysis → Visualization → Climate Decisions) + key technology cards (IoT, Satellites, Cloud, Big Data, AI). |
| **9** | **Climate Change Impacts** | 8 cards detailing rising temperatures, erratic precipitation, floods, droughts, water scarcity, agricultural disruptions, ecosystem damage, and human settlement impacts. |
| **10** | **Solutions & Sustainability** | Mitigation strategies (Renewable energy, Afforestation, Conservation, Efficiency, etc.) + **"What Can We Do?"** student action tips. |
| **11** | **Interactive Climate Quiz** | 5 multiple-choice questions with instant scoring, feedback review for each question, percentage badge, and **Restart Quiz** button. |
| **12** | **Sample Data Disclaimer** | Clearly visible yellow notice box emphasizing that displayed values are educational sample data. |
| **13** | **About Project** | Academic course credentials (CHE 110 Environmental Studies CA1), student metadata, institution details, and methodology. |
| **14** | **Footer** | Dark-green aesthetic footer with project links, course metadata, and the official quote: *"Understanding our climate today helps us protect our environment tomorrow."* |

---

## 🎙️ CA Video Presentation Script & Talking Points

Use this guide when recording your Continuous Assessment (CA) demonstration video:

### 1. Introduction (0:00 – 0:45)
- **Greeting:** *"Good day, respected professor and evaluators. My name is [Your Name], presenting my Environmental Studies CA1 project titled: **Digital Climate Change Monitoring: Tracking Temperature and Rainfall Trends**."*
- **Purpose:** *"The core objective of this project is to showcase how modern digital infrastructure—specifically IoT weather stations, remote sensing satellites, and automated cloud analytics—empowers scientists to track changing temperature and rainfall patterns."*

### 2. Scientific Background: Weather vs Climate (0:45 – 1:30)
- Scroll to **About Climate Change**.
- Point out the **Weather vs. Climate** comparison:
  - *Weather* describes day-to-day atmospheric variability (e.g., today's temperature or storm).
  - *Climate* represents statistical baselines, typically measured over 30-year epochs as standardized by the World Meteorological Organization (WMO).
- Highlight the major anthropogenic greenhouse gas drivers: fossil fuels, deforestation, and agriculture.

### 3. Demonstrating Temperature Monitoring (1:30 – 2:30)
- Scroll to **Temperature Monitoring**.
- Demonstrate the dropdowns:
  - Switch from **Global Mean** to **New Delhi, India**. Show how the average, maximum (45.8°C), and minimum (5.4°C) dynamically update.
  - Toggle between **Monthly View** and **10-Year Trend** to illustrate decadal warming (+1.65°C anomaly).
- Read the trend explanation callout below the chart to highlight scientific interpretation.

### 4. Demonstrating Rainfall Monitoring & Weather Simulator (2:30 – 4:00)
- Scroll to **Rainfall Monitoring & Weather Simulation**.
- Explain the hyetograph: Bar chart represents precipitation volume in millimeters, and the line represents the count of rainy days.
- **Demonstrate Weather Controls (Key Visual Highlight):**
  1. Click **Activate Rain Mode** — show raindrops falling gently across the screen, soft clouds, and the status badge switching to `🌦 Light Rain (2.4 - 5.0 mm/hr)`.
  2. Click **Heavy Rain** — show increased particle velocity and volume.
  3. Click **Thunderstorm Mode** — point out the darkening storm atmosphere, intense rain squalls, occasional realistic lightning strikes flashing on canvas, and the status badge updating to `⛈ Thunderstorm (35.0+ mm/hr)`.
  4. (Optional) Toggle sound to demonstrate the Web Audio thunder rumble.
  5. Click **Stop Weather Effect** to restore calm clear skies.

### 5. Demonstrating Central Dashboard & Stations (4:00 – 4:45)
- Scroll to **Central Dashboard**.
- Click the interactive **Amazon Rainforest (Manaus)** or **London Met Observatory** station cards to show real-time synchronization across telemetry metrics.
- Point out the 10-year comparative chart displaying annual temperature against total rainfall.

### 6. Digital Technologies & Environmental Solutions (4:45 – 5:30)
- Scroll to **Digital Architecture**: Explain the 6 steps from sensors to cloud analytics and decision making.
- Highlight **Solutions & Sustainability**: Discuss renewable energy, afforestation, and practical student actions under *"What Can We Do?"*.

### 7. Interactive Quiz & Academic Conclusion (5:30 – 6:15)
- Scroll to the **Climate Awareness Quiz**:
  - Answer the 5 multiple choice questions on screen.
  - Click **Submit Assessment**.
  - Show the calculated score (e.g., 5/5) and the scientific explanations provided for each question.
- Conclude by highlighting the **Sample Data Disclaimer** and referencing the project metadata under **About Project**.
- Final closing quote: *"Understanding our climate today helps us protect our environment tomorrow."*

---

## 📌 Sample Data Disclaimer

> **“The temperature and rainfall values displayed in this project are sample/demo data created for educational visualization. They do not represent live meteorological measurements unless connected to an actual data source.”**

---

## 📄 License & Attribution

- Built as an open academic project for **CHE 110 — Environmental Studies**.
- Chart visualizations powered by **Chart.js**.
- Weather physics generated natively via **HTML5 Canvas & Vanilla JavaScript**.
