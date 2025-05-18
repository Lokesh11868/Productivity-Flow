import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Globe, PlusCircle, Trash2 } from 'lucide-react';

interface TimeZoneItem {
  id: string;
  name: string;
  offset: string;
  city: string;
}

// List of major time zones
const timeZones: TimeZoneItem[] = [
  { id: '1', name: 'UTC', offset: '+00:00', city: 'Coordinated Universal Time' },
  { id: '2', name: 'EST', offset: '-05:00', city: 'New York' },
  { id: '3', name: 'CST', offset: '-06:00', city: 'Chicago' },
  { id: '4', name: 'PST', offset: '-08:00', city: 'Los Angeles' },
  { id: '5', name: 'GMT', offset: '+00:00', city: 'London' },
  { id: '6', name: 'CET', offset: '+01:00', city: 'Paris' },
  { id: '7', name: 'EET', offset: '+02:00', city: 'Athens' },
  { id: '8', name: 'IST', offset: '+05:30', city: 'New Delhi' },
  { id: '9', name: 'CST', offset: '+08:00', city: 'Beijing' },
  { id: '10', name: 'JST', offset: '+09:00', city: 'Tokyo' },
  { id: '11', name: 'AEST', offset: '+10:00', city: 'Sydney' },
  { id: '12', name: 'NZST', offset: '+12:00', city: 'Auckland' },
];

const TimeZone: React.FC = () => {
  const [baseTime, setBaseTime] = useState(new Date());
  const [sourceZone, setSourceZone] = useState<TimeZoneItem>(timeZones[0]);
  const [targetZones, setTargetZones] = useState<TimeZoneItem[]>([timeZones[1], timeZones[9]]);
  const [customTime, setCustomTime] = useState('');
  const [isCustomTime, setIsCustomTime] = useState(false);
  
  // Update the time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isCustomTime) {
        setBaseTime(new Date());
      }
    }, 60000);
    
    return () => clearInterval(timer);
  }, [isCustomTime]);
  
  const handleSourceZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const zone = timeZones.find(tz => tz.id === e.target.value);
    if (zone) {
      setSourceZone(zone);
    }
  };
  
  const handleCustomTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomTime(e.target.value);
  };
  
  const applyCustomTime = () => {
    const [hours, minutes] = customTime.split(':').map(Number);
    const newDate = new Date();
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    newDate.setSeconds(0);
    
    setBaseTime(newDate);
    setIsCustomTime(true);
  };
  
  const resetToCurrentTime = () => {
    setBaseTime(new Date());
    setIsCustomTime(false);
    setCustomTime('');
  };
  
  const addTargetZone = (zone: TimeZoneItem) => {
    if (!targetZones.some(tz => tz.id === zone.id)) {
      setTargetZones([...targetZones, zone]);
    }
  };
  
  const removeTargetZone = (zoneId: string) => {
    setTargetZones(targetZones.filter(tz => tz.id !== zoneId));
  };
  
  const calculateTime = (baseTime: Date, sourceOffset: string, targetOffset: string): Date => {
    // Parse offsets
    const parseOffset = (offset: string): number => {
      const [hours, minutes] = offset.slice(1).split(':').map(Number);
      return (hours * 60 + minutes) * (offset.startsWith('-') ? -1 : 1);
    };
    
    const sourceOffsetMinutes = parseOffset(sourceOffset);
    const targetOffsetMinutes = parseOffset(targetOffset);
    const diffMinutes = targetOffsetMinutes - sourceOffsetMinutes;
    
    // Clone the date and adjust
    const newTime = new Date(baseTime);
    newTime.setMinutes(newTime.getMinutes() + diffMinutes);
    
    return newTime;
  };
  
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString([], { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Time Zone Converter</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Compare times across different time zones
        </p>

        <div className="glass-panel p-5 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium mb-2">Base Location</label>
              <select
                value={sourceZone.id}
                onChange={handleSourceZoneChange}
                className="input-field mb-4"
              >
                {timeZones.map(zone => (
                  <option key={zone.id} value={zone.id}>
                    {zone.city} ({zone.name}, GMT{zone.offset})
                  </option>
                ))}
              </select>
              
              <div className="flex flex-col space-y-2 mb-4">
                <label className="block text-sm font-medium">Time</label>
                <div className="flex space-x-2">
                  <input
                    type="time"
                    value={customTime}
                    onChange={handleCustomTimeChange}
                    className="input-field"
                  />
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={applyCustomTime}
                    className="btn-primary"
                    disabled={!customTime}
                  >
                    Apply
                  </motion.button>
                  
                  {isCustomTime && (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={resetToCurrentTime}
                      className="btn-secondary"
                    >
                      Now
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 flex items-center justify-center md:justify-end">
              <div className="text-center md:text-right">
                <div className="text-5xl font-bold mb-2 text-primary-600 dark:text-primary-400">
                  {formatTime(baseTime)}
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  {formatDate(baseTime)}
                </div>
                <div className="mt-2 text-sm font-medium">
                  {sourceZone.city} ({sourceZone.name})
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <h2 className="text-xl font-semibold mb-3">Converted Times</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {targetZones.map(zone => {
          const convertedTime = calculateTime(baseTime, sourceZone.offset, zone.offset);
          
          return (
            <motion.div
              key={zone.id}
              className="glass-panel p-4"
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="flex justify-between mb-3">
                <div className="flex items-center">
                  <Globe size={20} className="mr-2 text-primary-500" />
                  <h3 className="font-semibold">{zone.city}</h3>
                </div>
                <button
                  onClick={() => removeTargetZone(zone.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                    {formatTime(convertedTime)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(convertedTime)}
                  </div>
                </div>
                
                <div className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {zone.name} (GMT{zone.offset})
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div className="glass-panel p-5">
        <h3 className="text-lg font-semibold mb-3">Add More Time Zones</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {timeZones
            .filter(zone => !targetZones.some(tz => tz.id === zone.id) && zone.id !== sourceZone.id)
            .map(zone => (
              <motion.button
                key={zone.id}
                onClick={() => addTargetZone(zone)}
                className="flex items-center justify-between p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="text-sm font-medium">{zone.city}</span>
                <PlusCircle size={16} className="text-primary-500" />
              </motion.button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TimeZone;