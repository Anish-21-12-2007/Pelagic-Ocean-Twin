export type GyreId = 'great-pacific' | 'indian-ocean' | 'north-atlantic';

export interface GyreProfile {
  id: GyreId;
  code: string;
  name: string;
  basin: string;
  coordinatesLabel: string;
  latBase: number;
  lonBase: number;
  latHemisphere: 'N' | 'S';
  lonHemisphere: 'E' | 'W';
  plasticTonnageKt: number;
  densityKgKm2: number;
  convergenceAreaMKm2: number;
  flowSpeed: number;
  turbulence: number;
  convergenceBias: number;
  dominantPolymer: string;
  meanDepthBandM: string;
  mapFocusX: number;
  mapFocusY: number;
  editorialBrief: string;
}

export interface DroneHotspot {
  id: string;
  code: string;
  title: string;
  subsystem: string;
  xPercent: number;
  yPercent: number;
  metricLabel: string;
  metricValue: string;
  description: string;
}

export interface PointerRefState {
  x: number;
  y: number;
  ndcX: number;
  ndcY: number;
  velocityX: number;
  velocityY: number;
  active: boolean;
}

export interface SweepTelemetry {
  isHolding: boolean;
  sweepCharge: number; // 0 to 1
  clearedRatio: number; // 0 to 1
  recoveredTonsPerHr: number;
  fuelSavedPct: number;
  completedSweeps: number;
}

export interface ImpactMetric {
  code: string;
  label: string;
  value: string;
  unit: string;
  detail: string;
  accent: 'pelagic' | 'convergence' | 'cleared' | 'bone';
}
