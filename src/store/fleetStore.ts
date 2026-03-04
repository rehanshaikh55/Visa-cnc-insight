import { create } from 'zustand';
import { calcPower, MachineState } from '@/lib/utils';

export interface MachineSnapshot {
  id: string;
  rms: number;
  state: MachineState;
  powerKw: number;
  costToday: number;
  energyKwh: number;
  cycleCount: number;
  uptimeSec: number;
  lastUpdated: number;
  history: Array<{ rms: number; ts: number }>;
  operator: string;
}

export interface WsPayload {
  mid: string;
  rms: number;
  state: MachineState;
  ts: number;
  powerKw?: number;
  costToday?: number;
  cycleCount?: number;
}

interface FleetStore {
  machines: Record<string, MachineSnapshot>;
  setAllMachines: (machines: Record<string, MachineSnapshot>) => void;
  updateMachine: (payload: WsPayload) => void;
}

export const useFleetStore = create<FleetStore>((set) => ({
  machines: {},

  setAllMachines: (machines) => set({ machines }),

  updateMachine: (payload) =>
    set((state) => {
      const existing = state.machines[payload.mid];
      const rms = payload.rms;
      const powerKw = payload.powerKw ?? calcPower(rms);
      const now = payload.ts || Date.now();

      const historyEntry = { rms, ts: now };
      const history = existing
        ? [...existing.history.slice(-59), historyEntry]
        : [historyEntry];

      const uptimeSec =
        payload.state !== 'OFF'
          ? (existing?.uptimeSec ?? 0) + 1
          : 0;

      return {
        machines: {
          ...state.machines,
          [payload.mid]: {
            id: payload.mid,
            rms,
            state: payload.state,
            powerKw,
            costToday: payload.costToday ?? existing?.costToday ?? 0,
            energyKwh: existing?.energyKwh ?? 0,
            cycleCount: payload.cycleCount ?? existing?.cycleCount ?? 0,
            uptimeSec,
            lastUpdated: now,
            history,
            operator: existing?.operator ?? 'Unassigned',
          },
        },
      };
    }),
}));
