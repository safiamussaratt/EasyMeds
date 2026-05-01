import { useLocalStorage } from "./useLocalStorage";
import { Medication, MedicationLog } from "../types";

export function useMedications() {
  const [medications, setMedications] = useLocalStorage<
    Medication[]
  >("easymeds_medications", []);
  const [logs, setLogs] = useLocalStorage<MedicationLog[]>(
    "easymeds_logs",
    [],
  );

  const addMedication = (
    medication: Omit<Medication, "id">,
  ) => {
    const newMedication: Medication = {
      ...medication,
      id: crypto.randomUUID(),
    };
    setMedications([...medications, newMedication]);
    return newMedication;
  };

  const updateMedication = (
    id: string,
    updates: Partial<Medication>,
  ) => {
    setMedications(
      medications.map((med) =>
        med.id === id ? { ...med, ...updates } : med,
      ),
    );
  };

  const deleteMedication = (id: string) => {
    setMedications(medications.filter((med) => med.id !== id));
    // Also delete associated logs
    setLogs(logs.filter((log) => log.medicationId !== id));
  };

  const getMedicationById = (id: string) => {
    return medications.find((med) => med.id === id);
  };

  const logMedication = (log: Omit<MedicationLog, "id">) => {
    const newLog: MedicationLog = {
      ...log,
      id: crypto.randomUUID(),
    };
    setLogs([...logs, newLog]);
    return newLog;
  };

  const updateLog = (
    id: string,
    updates: Partial<MedicationLog>,
  ) => {
    setLogs(
      logs.map((log) =>
        log.id === id ? { ...log, ...updates } : log,
      ),
    );
  };

  const getLogsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return logs.filter((log) =>
      log.scheduledTime.startsWith(dateStr),
    );
  };

  const getTodaySchedule = () => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    // Generate schedule for today based on medications
    const schedule: Array<{
      medication: Medication;
      time: string;
      log?: MedicationLog;
    }> = [];

    medications.forEach((med) => {
      // Check if medication is active today
      const startDate = new Date(med.startDate);
      const endDate = med.endDate
        ? new Date(med.endDate)
        : null;

      if (
        startDate <= today &&
        (!endDate || endDate >= today)
      ) {
        med.times.forEach((time) => {
          const scheduledTime = `${todayStr}T${time}:00`;
          const existingLog = logs.find(
            (log) =>
              log.medicationId === med.id &&
              log.scheduledTime === scheduledTime,
          );

          schedule.push({
            medication: med,
            time: time,
            log: existingLog,
          });
        });
      }
    });

    // Sort by time
    schedule.sort((a, b) => a.time.localeCompare(b.time));

    return schedule;
  };

  return {
    medications,
    logs,
    addMedication,
    updateMedication,
    deleteMedication,
    getMedicationById,
    logMedication,
    updateLog,
    getLogsForDate,
    getTodaySchedule,
  };
}