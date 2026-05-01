export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: 'once' | 'twice' | 'three' | 'four' | 'custom';
  times: string[]; // e.g., ['08:00', '14:00', '20:00']
  startDate: string;
  endDate?: string;
  notes?: string;
  color: string; // For visual identification
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  medicationName: string;
  scheduledTime: string; // ISO string
  status: 'taken' | 'missed' | 'skipped';
  actualTime?: string; // When it was actually taken
  notes?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}
