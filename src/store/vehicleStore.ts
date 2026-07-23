import { create } from 'zustand';
import type { Vehicle, VehicleSignals, VehicleStatus } from '@/types/vehicle';
import { MOCK_SIGNALS, MOCK_SIGNALS_2, MOCK_VEHICLE, MOCK_VEHICLE_2 } from '@/services/mockSignals';
import { getVehicleStatus } from '@/services/mockApi';

interface VehicleState {
  activeVin: string;
  vehicles: Vehicle[];
  signalsMap: Record<string, VehicleSignals>;
  status: VehicleStatus | null;
  loading: boolean;
  error: string | null;
  setActiveVin: (vin: string) => void;
  fetchStatus: () => Promise<void>;
}

export const useVehicleStore = create<VehicleState>((set, get) => ({
  activeVin: MOCK_VEHICLE.vin,
  vehicles: [MOCK_VEHICLE, MOCK_VEHICLE_2],
  signalsMap: {
    [MOCK_VEHICLE.vin]: MOCK_SIGNALS,
    [MOCK_VEHICLE_2.vin]: MOCK_SIGNALS_2,
  },
  status: null,
  loading: false,
  error: null,
  setActiveVin: (vin) => set({ activeVin: vin }),
  fetchStatus: async () => {
    const vin = get().activeVin;
    set({ loading: true, error: null });
    try {
      const status = await getVehicleStatus(vin);
      set({ status, loading: false });
    } catch (e) {
      set({
        loading: false,
        error: e instanceof Error ? e.message : 'Failed to load vehicle status',
      });
    }
  },
}));

export function useActiveSignals(): VehicleSignals {
  const { activeVin, signalsMap, status } = useVehicleStore();
  if (status?.signals) return status.signals;
  return signalsMap[activeVin] ?? MOCK_SIGNALS;
}

export function useActiveVehicle(): Vehicle {
  const { activeVin, vehicles, status } = useVehicleStore();
  if (status?.vehicle) return status.vehicle;
  return vehicles.find((v) => v.vin === activeVin) ?? MOCK_VEHICLE;
}
