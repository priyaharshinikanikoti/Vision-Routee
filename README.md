# SMART TRANSIT COMMAND
> **Connected Intelligence for Safer, Faster and Smarter Transportation**  
> *Prototype for Smart India Hackathon 2026 (Problem Statement ID: SIH26222 — Transportation & Logistics)*

---

## 1. Project Overview

**SMART TRANSIT COMMAND** is a unified transportation and logistics infrastructure platform. It addresses urban and highway mobility bottlenecks by interconnecting emergency vehicles, roadside IoT sensors, traffic signals, fleet vehicles, transit buses, trauma hospitals, and travelling citizens into a single real-time operational grid.

### The Real-World Problem
Modern urban cities face acute transportation crises:
- **Ambulances and emergency tenders trapped in gridlocks**, resulting in critical loss of the medical "Golden Hour".
- **Unreported potholes, submerged underpasses, and closed railway gates** triggering severe highway accidents.
- **Heavy commercial haulers suffering from blind spot collisions, cargo tampering, cold-chain temperature spoilage, and driver micro-sleep fatigue.**
- **Overcrowded public transit buses and student safety risks** such as children accidentally left behind in parked school buses.
- **Siloed municipal, police, hospital, and logistics departments** operating without unified coordination.

### The Proposed Solution: Connected Architecture
SMART TRANSIT COMMAND functions as the **Central Nervous System** of urban mobility by executing the autonomous sequence:
$$\text{DETECT} \longrightarrow \text{PREDICT} \longrightarrow \text{OPTIMIZE} \longrightarrow \text{COORDINATE} \longrightarrow \text{ALERT} \longrightarrow \text{RESPOND} \longrightarrow \text{ANALYZE}$$

- **Autonomous V2I Signal Preemption (Dynamic Green Corridor):** Emergency vehicles broadcast high-priority encrypted V2X beacons to upcoming traffic signals (`RED → PRIORITY → GREEN`), saving **13+ minutes (54% transit time reduction)**.
- **Multimodal Road Health Intelligence:** Vehicle-mounted IMUs and computer vision cameras detect pothole craters; ultrasonic depth gauges monitor flooded underpasses; Doppler radar detects inbound freight trains at level crossings.
- **End-to-End Fleet & Hazardous Cargo Telematics:** BLE magnetic container seals detect tampering; PT100 temperature sensors monitor vaccine cold-chains; 77GHz millimeter-wave blind-spot radar protects vulnerable road users; DMS infrared cameras track driver alertness.
- **School Bus mmWave Interior Radar:** 60GHz vital-sign radar flags children left in vehicle after engine shutdown, triggering exterior hazard beacons and SMS dispatch.
- **Citizen-Centric Navigation & Reporting:** Route facilities discovery (restrooms, EV chargers, food, repair), emergency vehicle approaching alerts, and direct crowd-sourced hazard ticketing into the Central Command queue.

---

## 2. Technology Stack

This project uses modern, production-grade technologies installed and configured within the repository:

- **Frontend Core:** React 18 (`react`, `react-dom`) with modern Functional Components & Hooks
- **Bundler & Build Tool:** Vite 5 (`vite`, `@vitejs/plugin-react`)
- **Styling & Design System:** Tailwind CSS 3 (`tailwindcss`, `postcss`, `autoprefixer`)
  - Custom cyber-command dark palette (`#070c18`, `#0c1527`, `#121f38`, glowing neon cyan/emerald/amber/rose borders)
  - Responsive layout for desktop command consoles and mobile traveller views
- **Iconography:** Lucide React (`lucide-react`)
- **Audio Feedback Engine:** Web Audio API Native Synthesizer (`src/services/audioService.js`)
  - Multi-frequency emergency siren sweeps
  - Radar blind-spot proximity square-wave beeps
  - Dual-tone alert chimes
  - *100% offline, requires 0 external audio files*
- **Mapping & GIS Visualization:** High-performance SVG Tactical GIS Canvas (`src/components/map/InteractiveMap.jsx`) with 24 toggleable layer filters, animated green corridor, and clickable telemetry drawers.

---

## 3. Project Structure

```
Vision Route/
├── index.html                               # HTML entry point with Google Fonts & meta
├── package.json                             # Dependencies, scripts, and build metadata
├── postcss.config.js                        # PostCSS Tailwind plugins
├── tailwind.config.js                       # Tailwind custom color & animation extensions
├── vite.config.js                           # Vite dev server port 3000 configuration
├── README.md                                # Complete system documentation
└── src/
    ├── App.jsx                              # Master Root Component: role & module coordinator
    ├── index.css                            # Global CSS, glowing utilities, scrollbars, animations
    ├── main.jsx                             # React DOM entry point
    ├── data/
    │   └── mockData.js                      # High-fidelity realistic dataset (sensors, fleet, signals, routes)
    ├── services/
    │   └── audioService.js                  # Synthesized Web Audio API sound alerts
    └── components/
        ├── common/
        │   ├── Header.jsx                   # Universal header, role switcher, sound toggle, clock
        │   ├── Navbar.jsx                   # 12 primary navigation modules with status badges
        │   ├── MetricCard.jsx               # Glowing metric card with deltas & trends
        │   └── StatusBadge.jsx              # Status indicator badge (Online, Warning, Critical)
        ├── map/
        │   └── InteractiveMap.jsx           # 24-layer interactive tactical transportation canvas
        ├── overview/
        │   └── OverviewModule.jsx           # Landing dashboard: 8 live metrics, map preview, SIH matrix
        ├── emergency/
        │   ├── EmergencyModule.jsx          # HERO: Dynamic Green Corridor & Hospital coordination
        │   └── EmergencySimulationLab.jsx   # 10-step interactive SIH demonstration simulator
        ├── traffic/
        │   └── TrafficSignalsModule.jsx     # Signal grid (SIG-101 to 108), adaptive AI & manual override
        ├── road/
        │   └── RoadIntelligenceModule.jsx   # Pothole detection, flood slider, railway level crossing
        ├── fleet/
        │   └── FleetLogisticsModule.jsx     # Cargo tamper, cold chain, WIM overload, blind spot radar
        ├── traveller/
        │   └── TravellerServicesModule.jsx  # Smart routes, facilities discovery, SOS, citizen reports
        ├── publictransport/
        │   └── PublicTransportModule.jsx    # City buses APC crowd % & School bus child alert
        ├── hardware/
        │   └── HardwareIoTModule.jsx        # 15+ IoT hardware nodes, specs, raw JSON & ping
        ├── digitaltwin/
        │   └── DigitalTwinModule.jsx        # Network twin: Before vs After Green Corridor comparison
        ├── command/
        │   └── CommandCenterModule.jsx      # Central incident triage & automated response workflows
        └── analytics/
            └── AnalyticsModule.jsx          # KPIs, response time curves, hourly congestion graphs
```

---

## 4. Prerequisites

To run this application from a fresh Windows 11 + VS Code environment, ensure you have:

1. **Node.js:** v18.0.0 or higher (v20.x or v22.x LTS recommended). Check with:
   ```powershell
   node -v
   ```
2. **npm:** v9.x or v10.x. Check with:
   ```powershell
   npm -v
   # On Windows systems with PowerShell script restrictions, use:
   npm.cmd -v
   ```
3. **Web Browser:** Google Chrome, Microsoft Edge, Brave, or Mozilla Firefox.
4. **Code Editor (Optional):** Visual Studio Code.

---

## 5. Installation

Open **PowerShell** or **Command Prompt** in Windows:

```powershell
# 1. Navigate to the project directory
cd "C:\Users\priya\OneDrive\Desktop\Vision Route"

# 2. Install all dependencies
npm install

# Note: If PowerShell displays a script execution policy error for npm, run:
npm.cmd install
```

---

## 6. How to Run

### Method 1: 1-Click Launcher (Recommended for Windows)
Simply double-click the included launcher batch file in your folder:
```powershell
start_app.bat
```
This automatically starts the local Vite server and launches Google Chrome/Edge directly to `http://localhost:3000`.

### Method 2: Command Line (PowerShell / Command Prompt)
Launch the local development server manually:
```powershell
npm.cmd run dev
# Or:
npm run dev
```

The console will output:
```
  VITE v5.4.21  ready in 517 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.31.226:3000/
```

Open your browser and navigate to:
**`http://localhost:3000/`**

> ⚠️ **Important:** Do NOT open `index.html` by double-clicking it as a `file:///` link in File Explorer. Modern React + Vite applications use ES modules that require an HTTP server (`http://localhost:3000`). If opened via `file:///`, the browser security CORS policy blocks script execution, resulting in a black screen. Always access via `http://localhost:3000` or double-click `start_app.bat`.

---

## 7. Groq AI Integration (Real LLM Intelligence)

Your **Groq API Key** is already pre-configured and active:
- **API Key:** `YOUR_GROQ_API_KEY``
- **Active Model:** `qwen/qwen3.8-27b` (high-speed Groq tensor core inference)
- **Features:**
  - **AI Copilot Button:** Click **"GROQ AI COPILOT"** in the top navigation or the floating blue button at the bottom-right of any screen.
  - **Autonomous Traffic Analysis:** Instant AI responses for emergency corridor green waves, hazardous LPG leaks, underpass flooding, and citizen hazard reports.
  - **Custom Key Configuration:** Click the key icon in the AI modal to update or check API keys anytime.

---

## 8. Demo Walkthroughs for Hackathon Judges

### Demo 1 — Ambulance Emergency & Dynamic Green Corridor (Hero Demo)
1. Open the application.
2. In the top navigation, click on **Emergency Response** (or click the glowing red **"Green Corridor Hero"** button).
3. Observe the hero comparison metrics:
   - **Normal Highway ETA:** 24 min
   - **Emergency Priority ETA:** 11 min
   - **Life-Critical Time Saved:** **13 min (54% faster)**
4. In the **Dynamic Green Corridor Sequence Simulation**, click **"Advance Ambulance (Step 1/4)"**.
5. Watch the sequence transition:
   - **Ambulance AMB-104** moves towards **Signal 01 (Sector 18)** $\rightarrow$ State switches from `RED` to `PRIORITY (GREEN)`.
   - As it moves through **Signal 02** and **Signal 03**, signals turn green sequentially.
6. Click **"ACTIVATE EMERGENCY CORRIDOR"**:
   - Hear the synthesized emergency siren sound effect.
   - Watch all four corridor signals force-preempt to Green.
7. Switch to the **Hospital Control** tab:
   - View inbound patient telemetry (Heart Rate: 122 bpm, BP: 155/95, SpO2: 92%).
   - Click **"NOTIFY HOSPITAL (BROADCAST INBOUND)"** to simulate the trauma team activation and ICU Bed 04-A reservation.

### Demo 2 — Road Hazard & Autonomous Sensor Response
1. Click the **Road Intelligence** tab in the navbar.
2. Under **Ultrasonic Flood Level Sensor (WL-309)**, drag the water level slider from `15 cm` up to `52 cm`:
   - Notice the status immediately switch from `SAFE` to `CAUTION` and then to `ROAD CLOSED`.
   - The system announces the automatic lowering of subway gates and pushes a route diversion.
3. Under **Railway Level Crossing Sensor (RC-101)**, adjust the train proximity slider to `1.2 km`:
   - Gate status switches to `GATE CLOSED` with automated traffic alerts.
4. Click **"SIMULATE VEHICLE-MOUNTED POTHOLE DETECTION"**:
   - A new pothole (`HAZ-XXX`) is detected by vehicle accelerometer spikes (2.1g).
   - An alert appears and automatically logs a Municipal PWD repair ticket.
5. Click **"MARK AS RESOLVED / REPAIRED"** to complete the incident lifecycle.

### Demo 3 — Logistics Fleet, Cold Chain, Overload & Blind Spot Radar
1. Click the **Fleet & Logistics** tab in the navbar.
2. Select vehicle **TRUCK-204** (Heavy Hauler carrying pharmaceuticals):
   - **Smart Cargo Monitoring:** Click **"Simulate Unexpected Cargo Door Open"**. The magnetic seal triggers an immediate audible **TAMPERING ALERT** and transmits coordinates to Central Command.
   - **Cold Chain Telemetry:** Drag the temperature slider past `8.0°C` to trigger a **TEMPERATURE ALERT**, simulating vaccine thermal threshold protection.
   - **Weigh-In-Motion Axle Sensor:** Drag the weight slider to `18.4 T` to display the **OVERLOADED (+2.4 T)** warning and automatic e-challan notification.
   - **77GHz Blind Spot Radar:** Click the **"RIGHT"** zone on the vehicle graphic. A proximity hazard triggers with audio alert tones.
   - **Driver Fatigue DMS:** View the `MODERATE FATIGUE` status (3h 12m non-stop) and recommended **Rest Area 12 km Ahead**.
3. Select **TRUCK-312 (LPG Hazmat Tanker)**:
   - Click **"Simulate LPG Gas Leak Detection"** to trigger a **CRITICAL HAZARD** multi-agency evacuation cordon.
4. Test the **Smart Fuel & EV Range Intelligence Assistant** at the bottom by adjusting vehicle type, fuel percentage, and trip distance.

### Demo 4 — Traveller Services, Facilities & Public Safety
1. Click the **Traveller Services** tab in the navbar.
2. Select origin, destination, and vehicle type.
3. Compare the multi-criteria routes:
   - **Route A (Fastest - 2h 15m - Recommended)**
   - **Route B (Safest - 2h 25m)**
   - **Route C (Economical - 2h 55m)**
4. In **Discovered Facilities Along Route**, filter by **EV Charging**, **Restrooms**, **Food**, or **Vehicle Repair**.
5. Observe the proactive banner: **"EMERGENCY VEHICLE APPROACHING: 350 m BEHIND — PLEASE GIVE WAY"**.
6. Click **"REPORT ROAD HAZARD"** to open the citizen reporting modal, select category (e.g. Pothole), severity, and click **Submit**. The report instantly logs into the Central Command queue.

---

## 9. Hardware Prototype Architecture (SIH26222)

Problem statement **SIH26222 is hardware-focused**. SMART TRANSIT COMMAND is structured to seamlessly interface with physical microcontrollers, roadside edge devices, and in-vehicle telematics units via industry-standard protocols:

| Hardware Component | Microcontroller / Chipset | Protocol / Interface | Current Prototype Implementation | Physical Hardware Target |
| :--- | :--- | :--- | :--- | :--- |
| **Smart Signal Controller** | STM32H7 / ESP32-S3 | MQTT / V2X DSRC (IEEE 802.11p) | Interactive Signal Array (`SIG-101` to `SIG-108`) with manual and automated green override | Solid-state relay drivers controlling 230V AC signal heads via RS-485 / CAN-bus |
| **Emergency RTK-GPS Gateway** | u-blox ZED-F9P + Quectel 4G/5G | MQTT / NMEA 0183 / TCP | High-precision position stream (`±12cm`), heading and speed tracking | Vehicle OBD-II / J1939 CAN-bus gateway with external active GNSS antenna |
| **Pothole Road Sensor** | Bosch BMI088 IMU + OV9281 CV Camera | MQTT over 4G LTE | Dynamic accelerometer z-axis spike calculation ($>1.8g$) | Vehicle suspension-mounted 6-DOF IMU connected to Raspberry Pi CM4 running edge CV |
| **Flood Ultrasonic Gauge** | MaxBotix MB7389 Weatherproof Sensor | LoRaWAN 865 MHz / CoAP | Real-time water depth slider ($5\text{cm} - 65\text{cm}$) with threshold gate triggers | Underpass-mounted IP68 ultrasonic transducer connected to Semtech SX1262 transceiver |
| **Weigh-In-Motion (WIM)** | Kistler Linea Piezoelectric Quartz Sensor Strip | Modbus TCP / Fiber Optic | Axle load telemetry with threshold violation calculation ($18.4\text{ T} > 16.0\text{ T}$) | Roadway pavement embedded piezoelectric strips paired with charge amplifier |
| **Blind Spot Radar** | Texas Instruments AWR1843 77GHz mmWave Radar | ISO 11898 CAN-bus | Interactive Left / Right / Rear zone visualizer with audio warning beeps | Side-mirror mounted radar modules broadcasting CAN frames to cabin display |
| **Driver Monitoring DMS** | Ambarella CV28 + 940nm IR Camera | CAN-bus / Edge AI | Eye-closure ($420\text{ms}$) & yawn frequency tracking | Dashboard-mounted NIR camera running MediaPipe / OpenCV facial landmark models |
| **Cold-Chain Probe** | PT100 Class A RTD Platinum Element | RS-485 Modbus RTU | Temperature telemetry with $8.0^\circ\text{C}$ threshold alarms | Reefer compartment stainless steel probe connected to digital transmitter |
| **Cargo Tamper Seal** | Hall-Effect Sensor + ST LSM6DSO IMU | BLE 5.2 Mesh | Magnetic door lock status toggle triggering anti-theft alerts | Battery-powered BLE tamper beacon mounted on container doors |
| **School Bus Interior Radar**| TI IWR6843 60GHz mmWave Radar | GPIO / Cellular Telematics | "Child Presence Detected After Engine Off" alert with horn simulation | Ceiling-mounted mmWave sensor detecting sub-millimeter chest movements of sleeping infants |
| **Railway Track Radar** | Doppler Rail Radar Sensor | Fail-Safe Dual Fiber / GSM-R | Proximity slider ($0.2 - 5\text{ km}$) with automatic gate boom interlock | Trackside radar unit connected to SIL-4 railway interlocking systems |

---

## 10. Problem $\rightarrow$ Solution Mapping Table

| No. | SIH26222 Real-World Problem | Implemented Module & Feature | Impact & Resolution |
| :--- | :--- | :--- | :--- |
| **1** | Ambulances stuck in traffic | `EmergencyModule.jsx` & `InteractiveMap.jsx` | Dynamic Green Corridor preemption (Normal ETA 24m $\rightarrow$ Priority 11m, 13m saved) |
| **2** | Potholes causing accidents | `RoadIntelligenceModule.jsx` (PH-204) | Vehicle IMU spike detection auto-broadcasts warning & logs Municipal PWD repair ticket |
| **3** | Blind spots near heavy vehicles | `FleetLogisticsModule.jsx` (BSR-602) | 77GHz mmWave radar covers Left, Right and Rear zones with audible proximity warnings |
| **4** | School bus safety | `PublicTransportModule.jsx` (SB-091) | 60GHz mmWave radar flags sleeping children left behind after engine off |
| **5** | Goods theft / cargo tampering | `FleetLogisticsModule.jsx` (CG-808) | BLE magnetic container seal detects unauthorized opening, pushing geo-alert to Command Center |
| **6** | Truck driver fatigue | `FleetLogisticsModule.jsx` (DMS-104) | Infrared DMS camera tracks eye-closure/yawning; recommends mandatory Rest Area 12 km ahead |
| **7** | Overloaded trucks | `FleetLogisticsModule.jsx` (WIM-401) | Weigh-In-Motion sensors flag excess axle loads ($18.4\text{T} > 16.0\text{T}$) for automatic e-challan |
| **8** | Illegal parking / road blockage | `RoadIntelligenceModule.jsx` (HAZ-305) | Automated traffic police patrol dispatch and tow truck coordination |
| **9** | Cold-chain failure | `FleetLogisticsModule.jsx` (CC-303) | PT100 probe triggers alarm when perishable medicine exceeds $8.0^\circ\text{C}$ safe threshold |
| **10**| Last-mile delivery problems | `FleetLogisticsModule.jsx` (VAN-55) | Smart loading zone allocation and EV range planning |
| **11**| Railway crossing accidents | `RoadIntelligenceModule.jsx` (RC-101) | Doppler radar tracks train proximity ($1.2\text{km}$), locks gates, and diverts highway traffic |
| **12**| Flooded roads / underpasses | `RoadIntelligenceModule.jsx` (WL-309) | Ultrasonic water depth gauge ($>50\text{cm}$) closes subway gates and reroutes traffic |
| **13**| Damaged / poorly visible signs | `RoadIntelligenceModule.jsx` (HAZ-304) | Citizen photo reporting and maintenance crew dispatch |
| **14**| Public bus overcrowding | `PublicTransportModule.jsx` (PC-202) | Overhead 3D ToF passenger counter displays live crowd percentage ($90\%$ full) |
| **15**| LPG / fuel transport safety | `FleetLogisticsModule.jsx` (GS-701) | Optical hydrocarbon sensor detects gas leaks, triggering multi-agency 500m evacuation cordon |

---

## 11. Troubleshooting Guide

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **`npm : File cannot be loaded because running scripts is disabled`** | Windows PowerShell ExecutionPolicy restriction | Run using the Windows command wrapper: `npm.cmd install` and `npm.cmd run dev`, or run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` in PowerShell. |
| **Port 3000 already in use** | Another local dev server or app is occupying port 3000 | Vite will automatically prompt to use the next available port (e.g. `3001`), or stop the occupying process via Task Manager. |
| **Blank Screen in Browser** | Modern JavaScript syntax blocked by very old browser | Use an updated version of Chrome, Edge, Brave, or Firefox with ES2020+ module support. |
| **Audio alerts are silent** | Browser Web Audio policy requires user gesture | Click any button in the app (e.g. sound toggle icon in the header) to initialize the AudioContext. Ensure sound toggle in header is enabled. |
| **Build error during `npm run build`** | Cache inconsistency | Delete `node_modules` and run `npm.cmd install` afresh. |

---

## 12. Future Roadmap

1. **Physical Hardware Demonstration Unit:** Connect an ESP32 microcontroller with LED traffic light diodes to receive preemption commands from this dashboard via local MQTT broker.
2. **AI Predictive Congestion Engine:** Long Short-Term Memory (LSTM) neural network predicting bottleneck formation 30 minutes before peak rush hours.
3. **Emergency Vehicle C-V2X PC5 Direct Sidelink:** Direct peer-to-peer radio frequency communication between emergency vehicles and traffic signals bypassing public cellular networks.
4. **Integration with State Emergency Services (ERSS 112) & FASTag API.**

---

*SMART TRANSIT COMMAND — Smart India Hackathon 2026 Prototype.*
