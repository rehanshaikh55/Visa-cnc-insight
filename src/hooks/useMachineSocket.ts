'use client';

import { useEffect, useRef } from 'react';
import { useFleetStore } from '@/store/fleetStore';
import { generateMockMachines, tickMock } from '@/lib/mockData';
import { getSocket } from '@/lib/socket';

// Stable selector — avoid full-store subscription causing re-renders
const setAllMachinesSelector = (s: ReturnType<typeof useFleetStore.getState>) => s.setAllMachines;
const updateMachineSelector  = (s: ReturnType<typeof useFleetStore.getState>) => s.updateMachine;

export function useMachineSocket() {
  const setAllMachines = useFleetStore(setAllMachinesSelector);
  const updateMachine  = useFleetStore(updateMachineSelector);
  const intervalRef    = useRef<ReturnType<typeof setInterval> | null>(null);

  // Read env var once — it's baked in at build time
  const isMock = process.env.NEXT_PUBLIC_MOCK !== 'false';

  useEffect(() => {
    if (isMock) {
      const initial = generateMockMachines();
      setAllMachines(initial);

      let current = initial;
      intervalRef.current = setInterval(() => {
        current = tickMock(current);
        setAllMachines(current);
      }, 1000);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }

    // Real socket mode
    const socket = getSocket();

    fetch('/api/fleet/summary')
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data === 'object') setAllMachines(data);
      })
      .catch(() => {
        // Backend unavailable — fall back to mock so the UI isn't blank
        const initial = generateMockMachines();
        setAllMachines(initial);
        let current = initial;
        intervalRef.current = setInterval(() => {
          current = tickMock(current);
          setAllMachines(current);
        }, 1000);
      });

    socket.connect();
    socket.on('machine_update', updateMachine);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      socket.off('machine_update', updateMachine);
      socket.disconnect();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
