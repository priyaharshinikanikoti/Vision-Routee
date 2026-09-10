import React, { useState } from 'react';
import { 
  Navigation, MapPin, Fuel, BatteryCharging, AlertTriangle, 
  ShieldAlert, Siren, PhoneCall, Send, Coffee, Droplets, 
  CheckCircle2, Clock, DollarSign, Sparkles, X, Plus, Filter, Crosshair
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import audio from '../../services/audioService';
import { ROUTE_OPTIONS, TRAVELLER_FACILITIES } from '../../data/mockData';

export default function TravellerServicesModule({ 
  hazards = [],
  onReportSubmitted,
  onViewLiveLocation,
  onNavigate 
}) {
  const [origin, setOrigin] = useState('Sector 18 Central Station');
  const [destination, setDestination] = useState('Tech Park Airport Feeder Hub');
  const [vehicleType, setVehicleType] = useState('Car');
  const [batteryFuelLevel, setBatteryFuelLevel] = useState(24);
  const [selectedRouteId, setSelectedRouteId] = useState('route-fastest');
  
  // Facilities Filter
  const [facilityFilter, setFacilityFilter] = useState('All');
  const [onlyAlongRoute, setOnlyAlongRoute] = useState(true);

  // Safety & Emergency SOS
  const [sosActive, setSosActive] = useState(false);
  const [giveWayAlertActive, setGiveWayAlertActive] = useState(true);

  // Citizen Reporting Modal State (Section 31)
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportCategory, setReportCategory] = useState('Pothole');
  const [reportLocation, setReportLocation] = useState('Main Ring Road near Flyover 3');
  const [reportSeverity, setReportSeverity] = useState('HIGH');
  const [reportDesc, setReportDesc] = useState('Severe pothole causing vehicles to brake abruptly.');
  const [reportSubmittedSuccess, setReportSubmittedSuccess] = useState(false);

  const selectedRoute = ROUTE_OPTIONS.find(r => r.id === selectedRouteId) || ROUTE_OPTIONS[0];

  const handleTriggerSOS = () => {
    setSosActive(true);
    audio.playSiren();
  };

  const handleSubmitReport = (e) => {
    e.preventDefault();
    audio.playSuccessChime();
    const newReport = {
      id: `CR-${Math.floor(100 + Math.random() * 900)}`,
      category: reportCategory,
      location: reportLocation,
      severity: reportSeverity,
      status: 'UNDER REVIEW',
      timestamp: 'Just now',
      reportedBy: 'Citizen Public App',
      description: reportDesc,
      upvotes: 1,
      coordinates: { x: 45, y: 45 }
    };
    onReportSubmitted?.(newReport);
    setReportSubmittedSuccess(true);
    setTimeout(() => {
      setReportSubmittedSuccess(false);
      setShowReportModal(false);
    }, 2500);
  };

  const filteredFacilities = TRAVELLER_FACILITIES.filter(fac => {
    if (onlyAlongRoute && !fac.onRoute) return false;
    if (facilityFilter !== 'All' && fac.category !== facilityFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-[#0b1428] border border-sky-800/50 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 bg-sky-950 border border-sky-700 rounded-xl text-sky-400">
              <Navigation className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-wide">
                TRAVELLER SERVICES & PUBLIC SAFETY
              </h2>
              <p className="text-xs text-slate-400">
                Multi-Criteria Navigation, Facilities along Route, Emergency Vehicle Give-Way Alert & Citizen Reporting
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center space-x-2 px-3.5 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>REPORT ROAD HAZARD</span>
          </button>
          
          <button
            onClick={handleTriggerSOS}
            className={`flex items-center space-x-2 px-4 py-2 text-white font-black text-xs rounded-xl shadow-lg transition-all ${
              sosActive 
                ? 'bg-red-700 animate-pulse ring-2 ring-red-400' 
                : 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 shadow-red-950'
            }`}
          >
            <Siren className="w-4 h-4 text-white" />
            <span>{sosActive ? 'SOS BROADCASTING LIVE!' : 'EMERGENCY SOS'}</span>
          </button>
        </div>
      </div>

      {/* SECTION 30: EMERGENCY VEHICLE APPROACHING ALERT BANNER */}
      {giveWayAlertActive && (
        <div className="bg-gradient-to-r from-red-950 via-rose-900 to-red-950 border-2 border-red-500 rounded-xl p-4 shadow-2xl flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-600 rounded-xl text-white shadow-lg shrink-0">
              <Siren className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-wider">
                EMERGENCY VEHICLE APPROACHING: 350 m BEHIND!
              </h4>
              <p className="text-xs text-red-200 font-medium">
                Ambulance <span className="font-mono font-bold text-white">AMB-104</span> on critical emergency green corridor. <span className="underline font-bold">PLEASE SAFELY YIELD AND GIVE WAY TO LEFT LANE</span>.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setGiveWayAlertActive(false)}
            className="px-3 py-1.5 bg-black/40 hover:bg-black/60 rounded-lg text-xs text-slate-300 shrink-0 font-semibold"
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* Trip Planning & Multi-Criteria Route Optimization (Sections 14 & 27) */}
      <div className="bg-[#091122] border border-sky-900/60 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Origin Point</label>
            <input 
              type="text" 
              value={origin} 
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full bg-[#0e1932] border border-slate-700 rounded-lg p-2 text-white font-semibold"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Destination</label>
            <input 
              type="text" 
              value={destination} 
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-[#0e1932] border border-slate-700 rounded-lg p-2 text-white font-semibold"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Vehicle Type</label>
            <select 
              value={vehicleType} 
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full bg-[#0e1932] border border-slate-700 rounded-lg p-2 text-white font-semibold"
            >
              <option value="Car">Sedan / Hatchback</option>
              <option value="EV">Electric Vehicle (EV)</option>
              <option value="Bike">Motorcycle / Two-Wheeler</option>
              <option value="Truck">Heavy Goods Vehicle</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Fuel / Battery Level</label>
            <div className="flex items-center space-x-2">
              <input 
                type="number" 
                min="5" 
                max="100" 
                value={batteryFuelLevel} 
                onChange={(e) => setBatteryFuelLevel(Number(e.target.value))}
                className="w-full bg-[#0e1932] border border-slate-700 rounded-lg p-2 text-white font-mono"
              />
              <span className="text-xs font-mono text-cyan-400">%</span>
            </div>
          </div>
        </div>

        {/* Route Alternatives Selection (Section 14) */}
        <div>
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            Available Intelligent Routes (Optimized by Traffic, Hazards & Fuel)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ROUTE_OPTIONS.map((route) => {
              const isSelected = selectedRouteId === route.id;
              return (
                <div
                  key={route.id}
                  onClick={() => {
                    setSelectedRouteId(route.id);
                    audio.playAlertBeep();
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-[#0e213d] border-cyan-400 glow-cyan ring-1 ring-cyan-400' 
                      : 'bg-[#0c162b] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      {route.recommended && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 mb-1 inline-block">
                          ★ RECOMMENDED
                        </span>
                      )}
                      <h5 className="text-xs font-bold text-white">{route.name}</h5>
                    </div>
                    <span className="text-base font-mono font-black text-cyan-300">{route.eta}</span>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-1 pt-2 border-t border-slate-800 text-[10px] font-mono">
                    <div>
                      <span className="text-slate-400 block">Distance</span>
                      <span className="text-slate-200 font-semibold">{route.distanceKm} km</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Traffic</span>
                      <span className={`font-semibold ${route.trafficColor}`}>{route.traffic.split(' ')[0]}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Road Score</span>
                      <span className="text-emerald-400 font-semibold">{route.roadConditionScore.split(' ')[0]}</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 mt-2">{route.highlights}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 29: SMART TRAVELLER PROACTIVE RECOMMENDATIONS */}
        <div className="p-4 rounded-xl bg-[#0a152b] border border-cyan-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-cyan-950 border border-cyan-700 rounded-lg text-cyan-300 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">AI Proactive Route Recommendation</span>
              <p className="text-xs text-white mt-0.5">
                {batteryFuelLevel <= 25 
                  ? `Low ${vehicleType === 'EV' ? 'Battery' : 'Fuel'} (${batteryFuelLevel}%). Recommended: ${vehicleType === 'EV' ? 'Tata Power 60kW Fast Charger 3.1 km ahead' : 'IndianOil Swagat Oasis 2.4 km ahead'}.`
                  : 'You have been driving for 2h 20m. NHAI Rest Area with clean restrooms & cafe is 4.2 km ahead.'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setOnlyAlongRoute(true)}
            className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg shrink-0 transition-colors"
          >
            Navigate to Stop
          </button>
        </div>
      </div>

      {/* SECTION 28: TRAVELLER FACILITIES ALONG ROUTE DISCOVERY */}
      <div className="bg-[#091122] border border-sky-900/60 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Discovered Facilities Along Route ({filteredFacilities.length} Found)
            </h3>
            <p className="text-xs text-slate-400">
              Verified highway amenities, EV charging, clean restrooms, medical kiosks and vehicle tyre puncture points
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-1.5">
            {['All', 'Fuel Stations', 'EV Charging', 'Restrooms', 'Food', 'Rest Areas', 'Vehicle Repair', 'ATMs'].map(cat => (
              <button
                key={cat}
                onClick={() => setFacilityFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  facilityFilter === cat ? 'bg-sky-950 text-sky-300 border border-sky-700' : 'text-slate-400 hover:text-white bg-slate-900/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredFacilities.map((fac) => (
            <div 
              key={fac.id} 
              className="bg-[#0d162d] border border-slate-800 hover:border-sky-800/80 p-3.5 rounded-xl transition-all space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-900">
                    {fac.category}
                  </span>
                  <h4 className="text-xs font-bold text-white mt-1.5">{fac.name}</h4>
                </div>
                <span className="text-xs font-mono font-bold text-amber-300">★ {fac.rating}</span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                <span className="text-cyan-300 font-mono font-semibold">{fac.distanceKm} km from route</span>
                <span className="text-emerald-400 font-mono text-[10px]">OPEN NOW</span>
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {fac.amenities?.map((am, i) => (
                  <span key={i} className="text-[9px] bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800">
                    {am}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex justify-end">
                <button
                  onClick={() => {
                    audio.playAlertBeep();
                    onViewLiveLocation?.({
                      id: fac.id,
                      name: fac.name,
                      title: `${fac.name} (${fac.category})`,
                      location: `${fac.distanceKm} km from route`,
                      lat: (28.6100 + (fac.coordinates?.y || 50) * 0.0004).toFixed(4),
                      lng: (77.2000 + (fac.coordinates?.x || 50) * 0.0004).toFixed(4),
                      speedKmh: 0,
                      heading: '0° N',
                      category: fac.category,
                      details: `Rating: ${fac.rating} stars. Amenities: ${fac.amenities?.join(', ')}.`
                    });
                  }}
                  className="px-2 py-1 rounded bg-sky-950 hover:bg-sky-900 border border-sky-700 text-sky-300 font-bold text-[10px] flex items-center space-x-1"
                >
                  <Crosshair className="w-3 h-3" />
                  <span>Track Location</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 31: CITIZEN REPORTING MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#091122] border border-amber-600/70 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowReportModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-800">
              <div className="p-2.5 bg-amber-950 border border-amber-700 rounded-xl text-amber-400">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">CITIZEN ROAD HAZARD REPORTING</h3>
                <p className="text-xs text-slate-400">Direct integration to Central Command Center queue</p>
              </div>
            </div>

            {reportSubmittedSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-white">REPORT RECEIVED SUCCESSFULLY!</h4>
                <p className="text-xs text-slate-400 font-mono">Status: UNDER REVIEW • Ticket #CR-504 Logged</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="mt-4 space-y-3.5 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Issue Category</label>
                  <select 
                    value={reportCategory} 
                    onChange={(e) => setReportCategory(e.target.value)}
                    className="w-full bg-[#0e1932] border border-slate-700 rounded-lg p-2 text-white font-semibold"
                  >
                    <option value="Pothole">Pothole / Road Damage</option>
                    <option value="Flooded Road">Flooded Road / Submerged Underpass</option>
                    <option value="Accident">Accident / Collision</option>
                    <option value="Road Blockage">Road Blockage / Debris</option>
                    <option value="Broken Signal">Broken / Malfunctioning Traffic Signal</option>
                    <option value="Damaged Sign">Damaged Road Sign / Poor Visibility</option>
                    <option value="Illegal Parking">Illegal Parking / Lane Obstruction</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Location Details</label>
                  <input 
                    type="text" 
                    value={reportLocation} 
                    onChange={(e) => setReportLocation(e.target.value)}
                    required
                    className="w-full bg-[#0e1932] border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Severity Rating</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(sev => (
                      <button
                        type="button"
                        key={sev}
                        onClick={() => setReportSeverity(sev)}
                        className={`p-2 rounded-lg font-bold text-[10px] transition-all ${
                          reportSeverity === sev ? 'bg-amber-950 border border-amber-500 text-amber-300' : 'bg-slate-900 border border-slate-800 text-slate-400'
                        }`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Incident Description</label>
                  <textarea 
                    value={reportDesc} 
                    onChange={(e) => setReportDesc(e.target.value)}
                    rows={3}
                    className="w-full bg-[#0e1932] border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg shadow-lg shadow-amber-950 flex items-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit to Command Center</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
