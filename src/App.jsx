import React, { useState, useEffect } from 'react';
import Header from './components/common/Header';
import Navbar from './components/common/Navbar';
import OverviewModule from './components/overview/OverviewModule';
import InteractiveMap from './components/map/InteractiveMap';
import EmergencyModule from './components/emergency/EmergencyModule';
import EmergencySimulationLab from './components/emergency/EmergencySimulationLab';
import AIAssistantModal from './components/ai/AIAssistantModal';
import LiveLocationModal from './components/common/LiveLocationModal';
import TrafficSignalsModule from './components/traffic/TrafficSignalsModule';
import RoadIntelligenceModule from './components/road/RoadIntelligenceModule';
import FleetLogisticsModule from './components/fleet/FleetLogisticsModule';
import VehicleSafetyModule from './components/safety/VehicleSafetyModule';
import SmartCargoModule from './components/cargo/SmartCargoModule';
import TravellerServicesModule from './components/traveller/TravellerServicesModule';
import PublicTransportModule from './components/publictransport/PublicTransportModule';
import HardwareIoTModule from './components/hardware/HardwareIoTModule';
import DigitalTwinModule from './components/digitaltwin/DigitalTwinModule';
import CommandCenterModule from './components/command/CommandCenterModule';
import AnalyticsModule from './components/analytics/AnalyticsModule';

import { 
  INITIAL_SIGNALS, 
  INITIAL_EMERGENCIES, 
  INITIAL_FLEET, 
  INITIAL_ROAD_HAZARDS, 
  HOSPITALS, 
  TRAVELLER_FACILITIES, 
  INITIAL_IOT_DEVICES,
  USER_ROLES
} from './data/mockData';
import audio from './services/audioService';
import { Bot, Sparkles } from 'lucide-react';

export default function App() {
  const [userRole, setUserRole] = useState('central-command');
  const [activeModule, setActiveModule] = useState('overview');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSimLabOpen, setIsSimLabOpen] = useState(false);
  const [isAICopilotOpen, setIsAICopilotOpen] = useState(false);
  const [liveLocationEntity, setLiveLocationEntity] = useState(null);

  // Synchronized state across all modules
  const [signals, setSignals] = useState(INITIAL_SIGNALS);
  const [emergencies, setEmergencies] = useState(INITIAL_EMERGENCIES);
  const [fleet, setFleet] = useState(INITIAL_FLEET);
  const [hazards, setHazards] = useState(INITIAL_ROAD_HAZARDS);
  const [hospitals, setHospitals] = useState(HOSPITALS);
  const [facilities, setFacilities] = useState(TRAVELLER_FACILITIES);
  const [iotDevices, setIotDevices] = useState(INITIAL_IOT_DEVICES);
  const [isCorridorActive, setIsCorridorActive] = useState(true);
  const [hospitalNotified, setHospitalNotified] = useState(true);
  const [customAlerts, setCustomAlerts] = useState([]);

  // Role switching
  const handleRoleChange = (roleId) => {
    setUserRole(roleId);
    if (roleId === 'ambulance') setActiveModule('emergency');
    else if (roleId === 'fire') setActiveModule('emergency');
    else if (roleId === 'police') setActiveModule('traffic-signals');
    else if (roleId === 'municipal') setActiveModule('road-intelligence');
    else if (roleId === 'logistics') setActiveModule('fleet-logistics');
    else if (roleId === 'bus') setActiveModule('public-transport');
    else if (roleId === 'hospital') setActiveModule('emergency');
    else if (roleId === 'traveller') setActiveModule('traveller-services');
    else if (roleId === 'central-command') setActiveModule('overview');
  };

  const handleActivateCorridor = () => {
    setIsCorridorActive(true);
    setSignals(prev => prev.map(s => ({
      ...s,
      state: 'GREEN',
      isPriorityActive: true,
      priorityStatus: 'Coordinated Green Preemption'
    })));
    setHospitalNotified(true);
    setCustomAlerts(prev => [
      {
        id: `ALT-${Date.now()}`,
        type: 'DYNAMIC GREEN CORRIDOR ENGAGED',
        vehicle: 'AMB-104',
        desc: 'V2I Preemption broadcasted. Signals SC-501 to SC-504 switched to emergency green override. Hospital ETA 11 min.'
      },
      ...prev
    ]);
  };

  const handleNotifyHospital = () => {
    setHospitalNotified(true);
  };

  const handleReportSubmitted = (newReport) => {
    const hazardItem = {
      id: newReport.id,
      category: newReport.category,
      severity: newReport.severity,
      location: newReport.location,
      distanceFromAmbulanceMeters: 1200,
      detectedTime: newReport.timestamp,
      source: newReport.reportedBy,
      status: newReport.status,
      details: newReport.description,
      actionTaken: 'Logged in Command Center Queue; PWD squad notified.',
      lat: (28.6100 + (newReport.coordinates?.y || 50) * 0.0005).toFixed(4),
      lng: (77.2000 + (newReport.coordinates?.x || 50) * 0.0005).toFixed(4),
      coordinates: newReport.coordinates || { x: 48, y: 52 }
    };
    setHazards(prev => [hazardItem, ...prev]);
    setCustomAlerts(prev => [
      {
        id: `ALT-${Date.now()}`,
        type: `CITIZEN REPORT: ${newReport.category}`,
        vehicle: 'Citizen App',
        desc: `${newReport.description} at ${newReport.location}`
      },
      ...prev
    ]);
  };

  const handleCommandAlert = (alertObj) => {
    setCustomAlerts(prev => [alertObj, ...prev]);
  };

  const handleViewLiveLocation = (entity) => {
    setLiveLocationEntity(entity);
  };

  const handleOpenFullMapFromLocation = (entity) => {
    setActiveModule('live-map');
    setLiveLocationEntity(null);
  };

  const currentRoleObj = USER_ROLES.find(r => r.id === userRole) || USER_ROLES[0];

  return (
    <div className="min-h-screen bg-[#070c18] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black font-sans relative">
      {/* Universal Header */}
      <Header
        userRole={userRole}
        setUserRole={handleRoleChange}
        onOpenSimulationLab={() => setIsSimLabOpen(true)}
        onOpenAICopilot={() => setIsAICopilotOpen(true)}
        activeEmergenciesCount={emergencies.length}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onNavigateToModule={setActiveModule}
      />

      {/* Primary Navigation with all Modules */}
      <Navbar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        userRole={userRole}
      />

      {/* Role Context Bar */}
      <div className="bg-[#0a1224] border-b border-cyan-950/60 px-4 sm:px-6 py-1.5 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] uppercase font-bold text-slate-400">Active Persona:</span>
          <span className={`font-bold font-mono ${currentRoleObj.color}`}>
            {currentRoleObj.name}
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-400 hidden sm:inline text-[11px]">
            {currentRoleObj.badge}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[11px] font-mono">
          <span className="text-slate-400">Dynamic Green Corridor:</span>
          <span className={`font-bold ${isCorridorActive ? 'text-emerald-400' : 'text-slate-400'}`}>
            {isCorridorActive ? 'ENGAGED (SIGNALS PREEMPTED)' : 'STANDBY'}
          </span>
        </div>
      </div>

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-[1920px] w-full mx-auto p-3 sm:p-6 space-y-6">
        {activeModule === 'overview' && (
          <OverviewModule
            onNavigate={setActiveModule}
            onOpenSimulationLab={() => setIsSimLabOpen(true)}
            signals={signals}
            emergencies={emergencies}
            fleet={fleet}
            hazards={hazards}
            hospitals={hospitals}
            facilities={facilities}
            iotDevices={iotDevices}
            isCorridorActive={isCorridorActive}
            onActivateCorridor={handleActivateCorridor}
            onNotifyHospital={handleNotifyHospital}
            onViewLiveLocation={handleViewLiveLocation}
          />
        )}

        {activeModule === 'live-map' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0b1428] p-4 rounded-2xl border border-cyan-800/50">
              <div>
                <h2 className="text-lg font-black text-white uppercase tracking-wider">
                  CENTRAL MULTI-LAYER TRANSPORTATION MAP
                </h2>
                <p className="text-xs text-slate-400">
                  Full 24-Layer Interactive Vector GIS Canvas with Live Telemetry Tracking
                </p>
              </div>
              <button
                onClick={handleActivateCorridor}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs rounded-xl shadow-lg shadow-red-950 transition-all"
              >
                ACTIVATE CORRIDOR ON MAP
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
              onActivateCorridor={handleActivateCorridor}
              onNotifyHospital={handleNotifyHospital}
            />
          </div>
        )}

        {activeModule === 'emergency' && (
          <EmergencyModule
            emergencies={emergencies}
            signals={signals}
            hospitals={hospitals}
            isCorridorActive={isCorridorActive}
            onActivateCorridor={handleActivateCorridor}
            onNotifyHospital={handleNotifyHospital}
            hospitalNotified={hospitalNotified}
            onViewLiveLocation={handleViewLiveLocation}
            onNavigate={setActiveModule}
          />
        )}

        {activeModule === 'traffic-signals' && (
          <TrafficSignalsModule 
            signals={signals}
            onUpdateSignals={setSignals}
            isCorridorActive={isCorridorActive}
            onActivateCorridor={handleActivateCorridor}
            onViewLiveLocation={handleViewLiveLocation}
            onNavigate={setActiveModule}
          />
        )}

        {activeModule === 'road-intelligence' && (
          <RoadIntelligenceModule
            hazards={hazards}
            onUpdateHazards={setHazards}
            onViewLiveLocation={handleViewLiveLocation}
            onNavigate={setActiveModule}
          />
        )}

        {activeModule === 'fleet-logistics' && (
          <FleetLogisticsModule
            fleet={fleet}
            onCommandAlert={handleCommandAlert}
            onViewLiveLocation={handleViewLiveLocation}
            onNavigate={setActiveModule}
          />
        )}

        {activeModule === 'vehicle-safety' && (
          <VehicleSafetyModule
            onTriggerSafetyAlert={handleCommandAlert}
            onViewLiveLocation={handleViewLiveLocation}
            onNavigate={setActiveModule}
          />
        )}

        {activeModule === 'cargo-coldchain' && (
          <SmartCargoModule
            onTriggerCommandAlert={handleCommandAlert}
            onViewLiveLocation={handleViewLiveLocation}
            onNavigate={setActiveModule}
          />
        )}

        {activeModule === 'public-transport' && (
          <PublicTransportModule 
            onViewLiveLocation={handleViewLiveLocation}
            onNavigate={setActiveModule}
          />
        )}

        {activeModule === 'traveller-services' && (
          <TravellerServicesModule
            hazards={hazards}
            onReportSubmitted={handleReportSubmitted}
            onViewLiveLocation={handleViewLiveLocation}
            onNavigate={setActiveModule}
          />
        )}

        {activeModule === 'hardware-iot' && (
          <HardwareIoTModule 
            onViewLiveLocation={handleViewLiveLocation}
            onNavigate={setActiveModule}
          />
        )}

        {activeModule === 'digital-twin' && (
          <DigitalTwinModule 
            isCorridorActive={isCorridorActive}
            onActivateCorridor={handleActivateCorridor}
            onViewLiveLocation={handleViewLiveLocation}
            onNavigate={setActiveModule}
          />
        )}

        {activeModule === 'command-center' && (
          <CommandCenterModule
            emergencies={emergencies}
            signals={signals}
            hazards={hazards}
            fleet={fleet}
            iotDevices={iotDevices}
            customAlerts={customAlerts}
            onViewLiveLocation={handleViewLiveLocation}
            onNavigate={setActiveModule}
          />
        )}

        {activeModule === 'analytics' && (
          <AnalyticsModule />
        )}
      </main>

      {/* Universal Live Location / Telemetry Modal */}
      <LiveLocationModal
        isOpen={Boolean(liveLocationEntity)}
        entity={liveLocationEntity}
        onClose={() => setLiveLocationEntity(null)}
        onOpenFullMap={handleOpenFullMapFromLocation}
      />

      {/* Floating Groq AI Assistant Launch Button */}
      <button
        onClick={() => {
          setIsAICopilotOpen(true);
          audio.playAlertBeep();
        }}
        className="fixed bottom-6 right-6 z-40 flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs rounded-2xl shadow-2xl shadow-cyan-500/40 border border-cyan-300/40 transition-all transform hover:scale-105 active:scale-95 group"
        title="Open Groq AI Transit Intelligence Copilot"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
        </div>
        <span className="hidden sm:inline">AI COPILOT</span>
        <span className="px-1.5 py-0.5 rounded bg-black/40 text-[9px] font-mono text-cyan-200">GROQ</span>
      </button>

      {/* Groq AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAICopilotOpen}
        onClose={() => setIsAICopilotOpen(false)}
      />

      {/* Emergency Simulation Lab Modal */}
      <EmergencySimulationLab
        isOpen={isSimLabOpen}
        onClose={() => setIsSimLabOpen(false)}
      />



      {/* Bottom Footer */}
      <footer className="bg-[#050a14] border-t border-cyan-950/80 px-4 sm:px-6 py-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          <span className="font-bold text-slate-400">SMART TRANSIT COMMAND</span> — Connected Intelligence for Safer, Faster and Smarter Transportation
        </div>
        <div className="font-mono text-[11px] text-cyan-400/80">
          Smart India Hackathon 2026 • Problem Statement: SIH26222 • Powered by Groq AI
        </div>
      </footer>
    </div>
  );
}
