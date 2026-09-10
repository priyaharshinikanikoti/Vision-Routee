import React from 'react';
import { 
  Siren, Cpu, Activity, AlertTriangle, TrafficCone, Bus, 
  Truck, ShieldAlert, Sparkles, Zap, ArrowRight, CheckCircle2, 
  Navigation, Building2, Flame, Layers, ShieldCheck, Box, 
  Network, Radio, BarChart3, MapPin, Crosshair, Compass
} from 'lucide-react';
import MetricCard from '../common/MetricCard';
import InteractiveMap from '../map/InteractiveMap';
import audio from '../../services/audioService';

export default function OverviewModule({ 
  onNavigate, 
  onOpenSimulationLab,
  signals = [],
  emergencies = [],
  fleet = [],
  hazards = [],
  hospitals = [],
  facilities = [],
  iotDevices = [],
  isCorridorActive = true,
  onActivateCorridor,
  onNotifyHospital,
  onViewLiveLocation
}) {

  // 12 Primary Integrated Transportation Modules with SIH problem-solution capabilities
  const primaryModulesList = [
    {
      id: 'emergency',
      name: 'Emergency Response',
      icon: Siren,
      category: 'Golden Hour Priority',
      badgeColor: 'rose',
      metric: '4 Active • 13 min Saved',
      metricLabel: 'Corridor Transit Time',
      status: isCorridorActive ? 'CORRIDOR ACTIVE (PREEMPTED)' : 'STANDBY (READY)',
      statusActive: isCorridorActive,
      description: 'V2I dynamic green corridor signal preemption, priority golden-hour route calculation, hospital bed readiness, and multi-agency dispatch.',
      features: [
        'Ambulance emergency & Priority Route',
        'Dynamic Green Corridor (Zero-Stop Wave)',
        'Traffic signal coordination (SC-501 to SC-504)',
        'Hospital coordination & trauma bed readiness',
        'Fire & Police patrol rapid response'
      ],
      liveLocation: {
        id: 'AMB-104',
        name: 'Advanced Life Support Ambulance AMB-104',
        title: 'Ambulance AMB-104 (Cardiac Transfer)',
        location: 'Sector 18 Ring Road Corridor',
        lat: '28.6139',
        lng: '77.2090',
        speedKmh: 68,
        heading: '42° NE',
        accuracy: '±12 cm (RTK Locked)',
        category: 'Emergency Response',
        driver: 'Rajesh Kumar (EMT Lead: Dr. Anita)',
        details: 'Priority corridor engaged towards City Central Trauma Hospital. All 4 signals preempted green.',
        actionTaken: 'Trauma Team Alpha alerted. ICU Bed 04-A reserved.'
      }
    },
    {
      id: 'traffic-signals',
      name: 'Traffic & Signals',
      icon: TrafficCone,
      category: 'Adaptive AI & V2X',
      badgeColor: 'amber',
      metric: '96% Online • 32% Congestion',
      metricLabel: 'City Arterial Flow',
      status: 'ADAPTIVE AI SYNCHRONIZED',
      statusActive: true,
      description: 'Connected V2X traffic light preemption, AI diurnal congestion prediction, arterial queue balancing, and CV illegal parking enforcement.',
      features: [
        'Traffic monitoring & live queue lengths',
        'AI congestion prediction & heat forecasting',
        'Signal monitoring & dynamic preemption',
        'Dynamic Green Corridor master override',
        'Road blockage detours & CV illegal parking'
      ],
      liveLocation: {
        id: 'SIG-101',
        name: 'Smart Signal SC-501 (Sector 18)',
        title: 'Sector 18 / Ring Road Junction Signal',
        location: 'Sector 18 / Ring Road Intersection',
        lat: '28.6145',
        lng: '77.2082',
        speedKmh: 0,
        heading: '0° N',
        accuracy: '±8 cm (Stationary Controller)',
        category: 'Traffic Infrastructure',
        details: 'STM32H7 dual-core controller with NXP RoadLINK V2X modem. Active Emergency Preemption.',
        actionTaken: 'Phase green extended for approaching emergency convoy.'
      }
    },
    {
      id: 'road-intelligence',
      name: 'Road Intelligence',
      icon: AlertTriangle,
      category: 'Potholes & Hazards',
      badgeColor: 'yellow',
      metric: `${hazards.length} Hazards • 8 Fixed Today`,
      metricLabel: 'Municipal Triage Queue',
      status: 'IMU & CV SENSORS SCANNING',
      statusActive: true,
      description: 'Continuous road health monitoring via vehicle-mounted accelerometer spikes, ultrasonic water-level flood gauges, and rail radar.',
      features: [
        'Pothole detection via accelerometer IMU & CV',
        'Ultrasonic flood gauges & subway barriers',
        'Acoustic crash sensors & impact triage',
        'Railway crossing radar & gate interlocks',
        'Damaged signs, broken signals & road IRI'
      ],
      liveLocation: {
        id: 'HAZ-301',
        name: 'Outer Ring Road Pothole Crater (14cm)',
        title: 'Pothole HAZ-301 @ Km 14/2',
        location: 'NH-48 Outer Ring Road (Km 14/2)',
        lat: '28.6152',
        lng: '77.2075',
        speedKmh: 0,
        heading: '270° W',
        accuracy: '±15 cm (IMU GPS)',
        category: 'Road Hazard',
        details: '14cm deep crater detected by Transit Bus #102 accelerometer spike (2.1g). Transmitted via 4G MQTT.',
        actionTaken: 'Warning broadcasted to nearby vehicles; PWD Repair Ticket #PWD-8812 logged.'
      }
    },
    {
      id: 'fleet-logistics',
      name: 'Fleet & Logistics',
      icon: Truck,
      category: 'Freight & Overload',
      badgeColor: 'blue',
      metric: `${fleet.length} Trucks • 92% On-Time`,
      metricLabel: 'Freight Telematics',
      status: 'WIM AXLE SENSORS ACTIVE',
      statusActive: true,
      description: 'Heavy vehicle freight tracking, Piezoelectric Weigh-In-Motion overload prevention, driver fatigue DMS, and fuel intelligence.',
      features: [
        'Real-time fleet tracking & GPS telemetry',
        'Driver fatigue DMS & rest stop advisory',
        'Weigh-In-Motion (WIM) overload enforcement',
        'Fuel intelligence & EV range computation',
        'Delivery tracking & vehicle maintenance'
      ],
      liveLocation: {
        id: 'TRUCK-204',
        name: 'Logistics Freight Carrier TRUCK-204',
        title: 'Volvo FH16 Heavy Logistics Carrier',
        location: 'Expressway Interchange Toll Approach',
        lat: '28.6160',
        lng: '77.2060',
        speedKmh: 62,
        heading: '180° S',
        accuracy: '±14 cm (CAN Telematics)',
        category: 'Logistics Fleet',
        driver: 'Harpreet Singh (ID: DRV-8821)',
        details: 'Gross weight: 18.4 tons (WIM Overload +15%). Driver DMS fatigue score: Normal.',
        actionTaken: 'Toll plaza bypass lane locked. Safe weighing verification in progress.'
      }
    },
    {
      id: 'vehicle-safety',
      name: 'Vehicle Safety',
      icon: ShieldCheck,
      category: 'Radar & Cabin Safety',
      badgeColor: 'emerald',
      metric: '99.2% Safety Score • 0 Fatalities',
      metricLabel: 'Collision Avoidance',
      status: '77GHz mmWAVE SHIELD ARMED',
      statusActive: true,
      description: '77GHz mmWave blind-spot radar detection, cabin NIR driver fatigue monitoring, and 60GHz school-bus child safety radar.',
      features: [
        '77GHz mmWave blind-spot radar (flanks/rear)',
        'Driver fatigue DMS (eye closure & yawns)',
        'School-bus safety radar (unattended child)',
        'Audible & HUD cabin collision alerts',
        'Active vehicle proximity warning system'
      ],
      liveLocation: {
        id: 'SCH-09',
        name: 'School Bus Safety Unit SCH-09',
        title: 'Ashok Leyland School Bus #09',
        location: 'St. Xavier School Campus Depot',
        lat: '28.6120',
        lng: '77.2105',
        speedKmh: 0,
        heading: '90° E',
        accuracy: '±10 cm (Depot Hub)',
        category: 'Vehicle Safety',
        driver: 'Mahesh Sharma',
        details: '60GHz vital-sign radar active. Engine ignition is OFF. Door locked.',
        actionTaken: 'Child presence detection protocol armed with external horn beacon.'
      }
    },
    {
      id: 'cargo-coldchain',
      name: 'Smart Cargo & Cold Chain',
      icon: Box,
      category: 'Anti-Tamper & Hazmat',
      badgeColor: 'cyan',
      metric: '4.2°C Cold-Chain • 0 Thefts',
      metricLabel: 'Pharmaceutical Integrity',
      status: 'BLE MAGNETIC SEAL SECURE',
      statusActive: true,
      description: 'BLE anti-tamper container seals, precision PT100 temperature/humidity monitoring for pharmaceuticals, and LPG tanker gas leak cordons.',
      features: [
        'BLE & magnetic cargo tamper seal alerts',
        'Cold-chain temperature & humidity telemetry',
        'Excursion threshold breach notifications',
        'LPG fuel transport safety monitoring',
        'Optical hydrocarbon gas leak cordons'
      ],
      liveLocation: {
        id: 'TRUCK-312',
        name: 'Bharat Petroleum LPG Hazmat Tanker',
        title: 'LPG Pressurized Tanker TRUCK-312',
        location: 'Freight Toll Plaza Hazmat Corridor',
        lat: '28.6175',
        lng: '77.2040',
        speedKmh: 52,
        heading: '135° SE',
        accuracy: '±12 cm (ATEX Ex-d Unit)',
        category: 'Smart Cargo & Hazmat',
        driver: 'Vikram Singh (Hazmat Certified)',
        details: 'Hydrocarbon sensor: 12 ppm (Normal). Pressure valves integrity: 100%.',
        actionTaken: 'Automated 500m evacuation cordon protocol standby.'
      }
    },
    {
      id: 'public-transport',
      name: 'Public Transport',
      icon: Bus,
      category: 'Passenger Telematics',
      badgeColor: 'purple',
      metric: '42 Buses • 64% Avg Occupancy',
      metricLabel: 'Live Transit Fleet',
      status: '3D ToF APC SENSORS ONLINE',
      statusActive: true,
      description: 'Automated Passenger Counting (APC) via 3D Time-of-Flight sensors, live timetable arrivals, crowd forecasting, and school bus monitoring.',
      features: [
        'Live city bus tracking & dynamic arrival ETAs',
        '3D ToF automated passenger counting (APC)',
        'Overcrowding detection & auxiliary bus dispatch',
        'School-bus tracking & student boarding safety',
        'Multi-modal public timetable synchronization'
      ],
      liveLocation: {
        id: 'BUS-102',
        name: 'Transit Starbus Unit BUS-102',
        title: 'Route 714: Central Stn ⇄ Cyber City',
        location: 'Metro Station North Gate Stop',
        lat: '28.6130',
        lng: '77.2095',
        speedKmh: 28,
        heading: '45° NE',
        accuracy: '±16 cm (Transit GPS)',
        category: 'Public Transport',
        driver: 'Kishore N.',
        details: 'Passenger Count: 54 / 60 (90% Crowded). Next Stop: Medical College.',
        actionTaken: 'Auxiliary backup feeder bus dispatched to relieve bottleneck.'
      }
    },
    {
      id: 'traveller-services',
      name: 'Traveller Services',
      icon: Navigation,
      category: 'Public Navigation & SOS',
      badgeColor: 'sky',
      metric: '58 Facilities • SOS Lifeline Active',
      metricLabel: 'Citizen Safe Transit',
      status: 'DYNAMIC NAVIGATION ENGAGED',
      statusActive: true,
      description: 'Multi-criteria route guidance, real-time road hazards along route, EV/fuel stations, rest areas, SOS emergency lifeline, and citizen reporting.',
      features: [
        'Multi-criteria route planning (fastest & safe)',
        'Live traffic & hazard alerts along route',
        'EV charging hubs, fuel, rest areas & food',
        'Hospitals, police/fire stations & parking',
        'Emergency SOS lifeline & citizen hazard reporting'
      ],
      liveLocation: {
        id: 'TS-001',
        name: 'Sector 18 Multi-Modal Waypoint',
        title: 'Sector 18 Central Transit Waypoint',
        location: 'Sector 18 Multi-Modal Hub',
        lat: '28.6140',
        lng: '77.2085',
        speedKmh: 0,
        heading: '0° N',
        accuracy: '±10 cm (Fixed Hub)',
        category: 'Traveller Amenity',
        details: 'Connected facility with 6 EV fast chargers, 24/7 rest area, emergency SOS beacon.',
        actionTaken: 'Route guidance broadcasting priority give-way for ambulance transfer.'
      }
    },
    {
      id: 'hardware-iot',
      name: 'Hardware / IoT',
      icon: Cpu,
      category: '15+ Edge Sensor Nodes',
      badgeColor: 'teal',
      metric: `${iotDevices.length} Connected Nodes • 98.4%`,
      metricLabel: 'Hardware Reliability',
      status: 'MQTT & LoRaWAN MESH ONLINE',
      statusActive: true,
      description: 'Connected transportation sensor array: traffic LiDAR, pothole IMU, ultrasonic flood gauge, crash detection, and V2X Roadside Units.',
      features: [
        'Traffic density LiDAR & camera sensors',
        'Pothole accelerometer & ultrasonic water gauges',
        'Acoustic impact sensors & RTK-GPS receivers',
        'Piezoelectric WIM & 77GHz mmWave radars',
        'NIR driver monitoring & BLE tamper seals'
      ],
      liveLocation: {
        id: 'TD-801',
        name: 'Traffic Density LiDAR & Camera TD-801',
        title: 'Traffic Density LiDAR & Camera Pole 14',
        location: 'Outer Ring Rd - Pole 14 RSU Gateway',
        lat: '28.6150',
        lng: '77.2070',
        speedKmh: 0,
        heading: '180° S',
        accuracy: '±5 cm (Pole Fixed)',
        category: 'Hardware & IoT',
        details: 'Sony IMX385 + Solid-state LiDAR, Jetson Orin Nano edge processor. MQTT 5G stream.',
        actionTaken: 'Telemetry streaming at 42 vehicles/min with 34% queue density.'
      }
    },
    {
      id: 'digital-twin',
      name: 'Digital Twin',
      icon: Network,
      category: 'Simulation & Physics',
      badgeColor: 'indigo',
      metric: '1,420 Nodes • 12ms Latency',
      metricLabel: 'Physics Synchronization',
      status: 'REAL-TIME NETWORK TWIN ACTIVE',
      statusActive: true,
      description: 'High-fidelity simulation of roads, vehicles, signals, and sensors. Models before-and-after emergency corridor propagation.',
      features: [
        'Transportation network physics simulation',
        'Road closures & traffic density dynamic sliders',
        'Before vs After corridor comparison modeling',
        'Emergency vehicle preemption propagation',
        'Urban node stress & bottleneck forecasting'
      ],
      liveLocation: {
        id: 'TWIN-NODE-42',
        name: 'Digital Twin Central Grid Nexus #42',
        title: 'Sector 18 Simulation Cross-Nexus',
        location: 'Sector 18 Simulation Node #42',
        lat: '28.6135',
        lng: '77.2080',
        speedKmh: 42,
        heading: '90° E',
        accuracy: '±1 cm (Simulated Precision)',
        category: 'Digital Twin',
        details: 'Continuous physics-based dynamic traffic model running with 12ms synchronization.',
        actionTaken: 'Corridor preemption green wave propagated across 4 signal phases.'
      }
    },
    {
      id: 'command-center',
      name: 'Command Center',
      icon: Radio,
      category: 'Brain of System',
      badgeColor: 'rose',
      metric: '100% Agency Sync • 5 Rules',
      metricLabel: 'Automated Response Rules',
      status: 'CROSS-MODULE EVENT ENGINE ARMED',
      statusActive: true,
      description: 'Central nerve center consolidating all active emergencies, traffic incidents, signals, fleet, buses, hospitals, and cross-module rules.',
      features: [
        'Cross-agency emergency incident triage',
        'Autonomous rule-based incident execution',
        'Traffic, signal, IoT, fleet & bus monitoring',
        'Hospital trauma bed reservation sync',
        'Real-time cross-module event stream'
      ],
      liveLocation: {
        id: 'CC-HQ-01',
        name: 'Integrated Command & Control Center (ICCC)',
        title: 'Central Command & Dispatch Room',
        location: 'Central Smart City Operations HQ',
        lat: '28.6148',
        lng: '77.2092',
        speedKmh: 0,
        heading: '0° N',
        accuracy: '±2 cm (Command Operations Hub)',
        category: 'Command Center',
        details: 'Unified console linking Police, Ambulance, Fire, PWD and Municipal Transport Authority.',
        actionTaken: 'Coordinated green corridor active. Emergency priority route cleared.'
      }
    },
    {
      id: 'analytics',
      name: 'Analytics & KPIs',
      icon: BarChart3,
      category: 'SIH Performance Audit',
      badgeColor: 'emerald',
      metric: '54% Time Cut • 14,280L Fuel',
      metricLabel: 'City Efficiency Impact',
      status: 'SYSTEM AUDIT BENCHMARKS LIVE',
      statusActive: true,
      description: 'System-wide performance audit tracking emergency response time, minutes saved, coordinated signals, accidents avoided, and fuel conserved.',
      features: [
        'Emergency response time comparison (Normal vs Priority)',
        'Time saved & survival rate optimization',
        'Coordinated signal preemption efficiency',
        'Accidents & road hazards resolution metrics',
        'Fleet utilization, fuel savings & bus occupancy'
      ],
      liveLocation: {
        id: 'ANALYTICS-SRV-01',
        name: 'Transportation Telemetry Cloud Center',
        title: 'Cyber City Data Operations Center',
        location: 'Cyber City Cloud Operations Facility',
        lat: '28.6125',
        lng: '77.2065',
        speedKmh: 0,
        heading: '0° N',
        accuracy: '±5 cm (Server Cluster)',
        category: 'Analytics Engine',
        details: 'Aggregation engine ingesting 120,000 telemetry packets/sec across 248 IoT nodes.',
        actionTaken: 'Audited 54% reduction in critical ambulance transit time today.'
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0c1830] via-[#0f2142] to-[#0a1224] border border-cyan-700/50 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                SMART INDIA HACKATHON 2026 • SIH26222
              </span>
              <span className="flex items-center space-x-1 text-[11px] text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>INTELLIGENCE ACTIVE</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-wide">
              SMART TRANSIT COMMAND PLATFORM
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              A unified transportation and logistics ecosystem connecting emergency services, roadside IoT devices, traffic signals, fleet vehicles, hospitals and citizens for safer, faster mobility.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={onOpenSimulationLab}
              className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs rounded-xl shadow-lg shadow-red-950 border border-red-400/40 transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>START EMERGENCY SIMULATION LAB</span>
            </button>
            <button
              onClick={() => onNavigate('emergency')}
              className="flex items-center space-x-2 px-3.5 py-2.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-200 font-bold text-xs rounded-xl transition-all"
            >
              <Siren className="w-4 h-4 text-rose-400" />
              <span>Green Corridor Hero</span>
            </button>
          </div>
        </div>
      </div>

      {/* 8 Live-Style Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard
          title="Active Emergencies"
          value="04"
          subtext="1 Critical Golden-Hour Transfer"
          icon={Siren}
          accentColor="rose"
          isHero={true}
          badge="Priority Live"
          onClick={() => onNavigate('emergency')}
        />
        <MetricCard
          title="Connected Devices"
          value="248"
          subtext="15+ Hardware Sensor Types"
          icon={Cpu}
          accentColor="cyan"
          badge="MQTT / LoRa"
          onClick={() => onNavigate('hardware-iot')}
        />
        <MetricCard
          title="Traffic Congestion"
          value="32%"
          subtext="Peak Reduced from 58%"
          icon={Activity}
          accentColor="amber"
          trend="-26% AI Balanced"
          onClick={() => onNavigate('traffic-signals')}
        />
        <MetricCard
          title="Emergency Vehicles"
          value="18"
          subtext="Ambulances, Fire, Police"
          icon={ShieldAlert}
          accentColor="blue"
          badge="RTK GPS"
          onClick={() => onNavigate('emergency')}
        />
        <MetricCard
          title="Road Hazards"
          value={hazards.length.toString().padStart(2, '0')}
          subtext="Potholes, Floods, Closures"
          icon={AlertTriangle}
          accentColor="amber"
          trend="8 Resolved Today"
          onClick={() => onNavigate('road-intelligence')}
        />
        <MetricCard
          title="Signals Online"
          value="96%"
          subtext="24 of 25 Coordinated"
          icon={TrafficCone}
          accentColor="emerald"
          badge="V2I Active"
          onClick={() => onNavigate('traffic-signals')}
        />
        <MetricCard
          title="Public Transit Units"
          value="42"
          subtext="Buses & School Transits"
          icon={Bus}
          accentColor="purple"
          badge="APC Sensors"
          onClick={() => onNavigate('public-transport')}
        />
        <MetricCard
          title="Active Deliveries"
          value="86"
          subtext="Cold-Chain & Heavy Haul"
          icon={Truck}
          accentColor="cyan"
          badge="WIM Overload"
          onClick={() => onNavigate('fleet-logistics')}
        />
      </div>

      {/* Central Large Transportation Map Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-black text-white tracking-wide uppercase">
              LIVE UNIFIED TRANSPORTATION MAP PREVIEW
            </h3>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              Interactive 24-Layer Feed
            </span>
          </div>
          <button
            onClick={() => onNavigate('live-map')}
            className="text-xs text-cyan-300 hover:text-white flex items-center space-x-1 font-semibold transition-colors"
          >
            <span>Expand Full Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <InteractiveMap 
          signals={signals}
          emergencies={emergencies}
          fleet={fleet}
          hazards={hazards}
          hospitals={hospitals}
          facilities={facilities}
          iotDevices={iotDevices}
          isCorridorActive={isCorridorActive}
          onActivateCorridor={onActivateCorridor}
          onNotifyHospital={onNotifyHospital}
        />
      </div>

      {/* OPERATIONAL TRANSPORTATION MODULES SECTION (Replaces old SIH alignment box) */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-cyan-900/40">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-black text-white uppercase tracking-wider">
                CORE TRANSPORTATION MODULES
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700">
                12 ACTIVE SUBSYSTEMS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any module to open its complete functional interface with live controls, spatial intelligence, and cross-system automation.
            </p>
          </div>
          <div className="text-xs font-mono text-cyan-300">
            Click card to open full module interface
          </div>
        </div>

        {/* Clean Responsive Grid: Desktop 3-4 per row, Tablet 2 per row, Mobile 1 per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {primaryModulesList.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                onClick={() => onNavigate(mod.id)}
                className="group relative bg-gradient-to-b from-[#0c162b] to-[#081020] hover:from-[#112042] hover:to-[#0c162b] border border-cyan-900/60 hover:border-cyan-400/80 rounded-2xl p-5 shadow-xl hover:shadow-2xl hover:shadow-cyan-950/60 transition-all duration-200 transform hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
              >
                {/* Top Row: Icon & Status Badge */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="p-3 bg-[#0a1224] border border-cyan-800/80 group-hover:border-cyan-400 group-hover:bg-cyan-950/80 rounded-xl text-cyan-400 transition-colors shadow-md">
                      <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-slate-900 text-slate-300 border border-slate-800">
                        {mod.category}
                      </span>
                      <span className={`text-[10px] font-mono font-bold mt-1 ${
                        mod.statusActive ? 'text-emerald-400' : 'text-slate-400'
                      }`}>
                        {mod.status}
                      </span>
                    </div>
                  </div>

                  {/* Module Name & Description */}
                  <div className="mt-4">
                    <h4 className="text-base font-black text-white group-hover:text-cyan-200 transition-colors flex items-center justify-between">
                      <span>{mod.name}</span>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                    </h4>
                    <p className="text-xs text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                      {mod.description}
                    </p>
                  </div>

                  {/* Important Live Metric Box */}
                  <div className="mt-4 p-2.5 bg-[#070e1d] rounded-xl border border-cyan-950 group-hover:border-cyan-800/60 transition-colors">
                    <span className="text-[10px] uppercase font-mono font-semibold text-slate-400 block">
                      {mod.metricLabel}
                    </span>
                    <span className="text-sm font-black font-mono text-cyan-300 block mt-0.5">
                      {mod.metric}
                    </span>
                  </div>

                  {/* Live Location Pill with Quick Track Button */}
                  <div className="mt-3 p-2 bg-[#091325] rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1.5 overflow-hidden">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <div className="truncate">
                        <span className="text-[10px] font-mono text-slate-400 block truncate">
                          {mod.liveLocation.id} • {mod.liveLocation.lat}°, {mod.liveLocation.lng}°
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        audio.playAlertBeep();
                        onViewLiveLocation?.(mod.liveLocation);
                      }}
                      className="px-2 py-1 rounded bg-cyan-950 hover:bg-cyan-800 border border-cyan-700 text-[10px] font-bold text-cyan-300 shrink-0 transition-colors flex items-center space-x-1"
                      title="Open Live GPS Telemetry Inspector"
                    >
                      <Crosshair className="w-3 h-3 text-cyan-400" />
                      <span>Track</span>
                    </button>
                  </div>

                  {/* Key Features directly demonstrating SIH transportation problems */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Key Capabilities:
                    </span>
                    <ul className="space-y-1 text-[11px] text-slate-300">
                      {mod.features.map((feat, i) => (
                        <li key={i} className="flex items-start space-x-1.5 leading-snug">
                          <span className="text-cyan-400 font-bold shrink-0 mt-0.5">→</span>
                          <span className="text-slate-200">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Card Action */}
                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">
                    Launch Full System
                  </span>
                  <div className="flex items-center space-x-1 text-xs font-bold text-cyan-400 group-hover:text-cyan-200">
                    <span>Open Module</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
