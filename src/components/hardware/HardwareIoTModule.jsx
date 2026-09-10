import React, { useState } from 'react';
import { 
  Cpu, Radio, Wifi, Battery, Activity, Sliders, CheckCircle2, 
  AlertTriangle, RefreshCw, Terminal, Layers, Zap, Info, Crosshair, MapPin
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import audio from '../../services/audioService';
import { INITIAL_IOT_DEVICES } from '../../data/mockData';

export default function HardwareIoTModule({ 
  onViewLiveLocation,
  onNavigate 
}) {
  const [devices, setDevices] = useState(INITIAL_IOT_DEVICES);
  const [selectedDevice, setSelectedDevice] = useState(INITIAL_IOT_DEVICES[0]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [toastMessage, setToastMessage] = useState(null);

  const handlePingDevice = (devId) => {
    audio.playAlertBeep();
    setToastMessage(`Device ${devId} pinged successfully. Round-trip latency: 14ms (via MQTT broker).`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSimulateDeviceSpike = (devId) => {
    audio.playAlertBeep();
    setDevices(prev => prev.map(d => {
      if (d.id === devId) {
        return {
          ...d,
          status: d.status === 'ONLINE' ? 'WARNING' : 'ONLINE',
          lastUpdate: 'Just now'
        };
      }
      return d;
    }));
    setToastMessage(`Simulated hardware event injected into ${devId} telemetry pipeline.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredDevices = devices.filter(d => {
    if (filterStatus !== 'ALL' && d.status !== filterStatus) return false;
    if (filterCategory !== 'ALL' && !(d?.category || '').toLowerCase().includes(filterCategory.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-[#0b1428] border border-cyan-800/50 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 bg-cyan-950 border border-cyan-700 rounded-xl text-cyan-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black text-white tracking-wide">
                  HARDWARE & CONNECTED IoT NETWORK
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  SIH26222 HARDWARE CORE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                15+ Embedded Sensors, Roadside Units (RSU), V2X Edge Controllers, CAN-Bus Telematics & LoRaWAN Gateways
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs font-mono">
          <div className="bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">TOTAL DEVICES</span>
            <span className="text-cyan-300 font-bold text-base">{devices.length} Nodes</span>
          </div>
          <div className="bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">ONLINE STATUS</span>
            <span className="text-emerald-400 font-bold text-base">94% Nominal</span>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-cyan-950 border border-cyan-500 text-cyan-200 text-xs rounded-xl flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#081020] p-3 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Status:</span>
          {['ALL', 'ONLINE', 'WARNING', 'OFFLINE'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                filterStatus === st 
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700' 
                  : 'text-slate-400 hover:text-white bg-slate-900/60'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Category:</span>
          {['ALL', 'Traffic', 'Road Health', 'Environmental', 'Emergency', 'Logistics', 'Vehicle Safety', 'Public Transport'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filterCategory === cat 
                  ? 'bg-purple-950 text-purple-300 border border-purple-700' 
                  : 'text-slate-400 hover:text-white bg-slate-900/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Hardware Grid & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Cards (2 Cols on Large) */}
        <div className="lg:col-span-2 space-y-3 max-h-[640px] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredDevices.map((dev) => {
              const isSelected = selectedDevice.id === dev.id;
              return (
                <div
                  key={dev.id}
                  onClick={() => {
                    setSelectedDevice(dev);
                    audio.playAlertBeep();
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2.5 ${
                    isSelected ? 'bg-[#0e223d] border-cyan-400 glow-cyan' : 'bg-[#0d162d] border-slate-800 hover:border-cyan-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-black text-cyan-300">{dev.id}</span>
                        <StatusBadge status={dev.status} size="xs" />
                      </div>
                      <h4 className="text-xs font-bold text-white mt-1 line-clamp-1" title={dev.name}>
                        {dev.name}
                      </h4>
                      <p className="text-[10px] text-slate-400">{dev.location}</p>
                    </div>

                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-900">
                      {dev.protocol.split(' ')[0]}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 grid grid-cols-3 gap-1 text-[10px] font-mono">
                    <div>
                      <span className="text-slate-500 block">Signal</span>
                      <span className="text-emerald-400 font-semibold">{dev.signalStrength}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Battery/Power</span>
                      <span className="text-slate-300 font-semibold truncate block">{dev.battery.split(' ')[0]}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Updated</span>
                      <span className="text-slate-400">{dev.lastUpdate}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Device Deep Inspector & Hardware Spec */}
        <div className="bg-[#091122] border border-cyan-900/60 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Device Telemetry Inspector</h3>
              </div>
              <StatusBadge status={selectedDevice.status} size="xs" />
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Device Name & ID</span>
                <p className="font-bold text-white text-sm">{selectedDevice.name}</p>
                <p className="font-mono text-cyan-400 font-bold">{selectedDevice.id}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Location / Host Vehicle</span>
                <p className="font-mono text-slate-200">{selectedDevice.location}</p>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#0a1428] rounded-xl border border-cyan-900/60">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span className="text-[11px] font-mono text-cyan-200">28.6145° N, 77.2080° E</span>
                </div>
                <button
                  onClick={() => {
                    audio.playAlertBeep();
                    onViewLiveLocation?.({
                      id: selectedDevice.id,
                      name: selectedDevice.name,
                      title: `${selectedDevice.name} (${selectedDevice.id})`,
                      location: selectedDevice.location,
                      lat: '28.6145',
                      lng: '77.2080',
                      speedKmh: 0,
                      heading: '0° N',
                      accuracy: '±5 cm (IoT Station)',
                      category: 'Hardware & Connected IoT',
                      details: `${selectedDevice.hardwareSpec}. Protocol: ${selectedDevice.protocol}.`
                    });
                  }}
                  className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 font-bold text-[10px] rounded-lg transition-colors flex items-center space-x-1"
                >
                  <Crosshair className="w-3 h-3 text-cyan-400" />
                  <span>Track Live Node</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[9px]">PROTOCOL</span>
                  <span className="text-emerald-300 font-bold">{selectedDevice.protocol}</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                  <span className="text-slate-400 block text-[9px]">FIRMWARE</span>
                  <span className="text-cyan-300 font-bold">{selectedDevice.firmware}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Hardware Specification</span>
                <p className="font-mono text-slate-300 bg-slate-900/90 p-2 rounded border border-slate-800 text-[11px]">
                  {selectedDevice.hardwareSpec}
                </p>
              </div>

              {/* Real-time Telemetry JSON Stream */}
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                  Live Sensor JSON Packet (Decoded)
                </span>
                <pre className="bg-[#050b14] border border-cyan-900/80 text-cyan-300 p-3 rounded-lg text-[10px] font-mono overflow-x-auto">
                  {JSON.stringify(selectedDevice.telemetry, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            <button
              onClick={() => handlePingDevice(selectedDevice.id)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Ping Device (MQTT Heartbeat)</span>
            </button>
            <button
              onClick={() => handleSimulateDeviceSpike(selectedDevice.id)}
              className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-cyan-950"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Simulate Hardware Telemetry Spike / State Toggle</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
