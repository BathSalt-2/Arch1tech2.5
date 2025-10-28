import React, { useEffect, useRef } from 'react';
import type { SystemStatus } from '../../types';

interface SystemSonificationProps {
  status: SystemStatus;
  isAudible: boolean;
}

const mapValue = (value: number, inMin: number, inMax: number, outMin: number, outMax: number): number => {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

export const SystemSonification: React.FC<SystemSonificationProps> = ({ status, isAudible }) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<{
    load: OscillatorNode | null;
    consistency: OscillatorNode | null;
    drift: OscillatorNode | null;
  }>({ load: null, consistency: null, drift: null });
  const gainsRef = useRef<{
    load: GainNode | null;
    consistency: GainNode | null;
    drift: GainNode | null;
    master: GainNode | null;
  }>({ load: null, consistency: null, drift: null, master: null });

  useEffect(() => {
    if (isAudible && !audioContextRef.current) {
      // Initialize AudioContext and nodes
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = context;

      const masterGain = context.createGain();
      masterGain.gain.setValueAtTime(0.1, context.currentTime); // Master volume
      masterGain.connect(context.destination);
      gainsRef.current.master = masterGain;

      // Cognitive Load Oscillator (low hum)
      const loadOsc = context.createOscillator();
      loadOsc.type = 'sine';
      loadOsc.frequency.setValueAtTime(60, context.currentTime);
      const loadGain = context.createGain();
      loadOsc.connect(loadGain);
      loadGain.connect(masterGain);
      loadOsc.start();
      oscillatorsRef.current.load = loadOsc;
      gainsRef.current.load = loadGain;

      // Consistency Oscillator (stable mid-tone)
      const consistencyOsc = context.createOscillator();
      consistencyOsc.type = 'sawtooth';
      const consistencyGain = context.createGain();
      consistencyOsc.connect(consistencyGain);
      consistencyGain.connect(masterGain);
      consistencyOsc.start();
      oscillatorsRef.current.consistency = consistencyOsc;
      gainsRef.current.consistency = consistencyGain;

      // Alignment Drift Oscillator (dissonant high-tone)
      const driftOsc = context.createOscillator();
      driftOsc.type = 'square';
      const driftGain = context.createGain();
      driftOsc.connect(driftGain);
      driftGain.connect(masterGain);
      driftOsc.start();
      oscillatorsRef.current.drift = driftOsc;
      gainsRef.current.drift = driftGain;
    } else if (!isAudible && audioContextRef.current) {
      // Disconnect and cleanup
      audioContextRef.current.close().then(() => {
        audioContextRef.current = null;
        oscillatorsRef.current = { load: null, consistency: null, drift: null };
        gainsRef.current = { load: null, consistency: null, drift: null, master: null };
      });
    }

    return () => {
      // Cleanup on component unmount
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isAudible]);

  useEffect(() => {
    if (isAudible && audioContextRef.current) {
      const { currentTime } = audioContextRef.current;
      const { cognitiveLoad, consistency, alignmentDrift } = status;

      // Update Cognitive Load
      if (gainsRef.current.load) {
        const loadGainValue = mapValue(cognitiveLoad, 0, 100, 0, 0.3);
        gainsRef.current.load.gain.linearRampToValueAtTime(loadGainValue, currentTime + 0.5);
      }
      if (oscillatorsRef.current.load) {
        const loadFreqValue = mapValue(cognitiveLoad, 0, 100, 50, 100);
        oscillatorsRef.current.load.frequency.linearRampToValueAtTime(loadFreqValue, currentTime + 0.5);
      }
      
      // Update Consistency
      if (gainsRef.current.consistency) {
          const consistencyGainValue = mapValue(consistency, 0, 100, 0, 0.1);
          gainsRef.current.consistency.gain.linearRampToValueAtTime(consistencyGainValue, currentTime + 0.5);
      }
      if (oscillatorsRef.current.consistency) {
          const consistencyFreqValue = mapValue(consistency, 0, 100, 200, 210); // Subtle frequency change
          oscillatorsRef.current.consistency.frequency.linearRampToValueAtTime(consistencyFreqValue, currentTime + 0.5);
      }
      
      // Update Alignment Drift
      if (gainsRef.current.drift) {
          const driftGainValue = mapValue(alignmentDrift, 0, 100, 0, 0.15);
          gainsRef.current.drift.gain.linearRampToValueAtTime(driftGainValue, currentTime + 0.5);
      }
      if (oscillatorsRef.current.drift) {
          const driftFreqValue = mapValue(alignmentDrift, 0, 100, 400, 800);
          oscillatorsRef.current.drift.frequency.linearRampToValueAtTime(driftFreqValue, currentTime + 0.5);
      }
    }
  }, [status, isAudible]);

  return null;
};
