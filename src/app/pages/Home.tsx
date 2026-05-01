import { useMedications } from '../hooks/useMedications';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Check, X, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function Home() {
  const { getTodaySchedule, logMedication, updateLog } = useMedications();
  const schedule = getTodaySchedule();

  const handleMarkTaken = (medId: string, time: string, logId?: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const scheduledTime = `${todayStr}T${time}:00`;

    if (logId) {
      updateLog(logId, {
        status: 'taken',
        actualTime: new Date().toISOString(),
      });
    } else {
      const medication = schedule.find(s => s.medication.id === medId)?.medication;
      if (medication) {
        logMedication({
          medicationId: medId,
          medicationName: medication.name,
          scheduledTime,
          status: 'taken',
          actualTime: new Date().toISOString(),
        });
      }
    }
    toast.success('Medication marked as taken!', {
      description: 'Great job staying on track!',
      duration: 3000,
    });
  };

  const handleMarkMissed = (medId: string, time: string, logId?: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const scheduledTime = `${todayStr}T${time}:00`;

    if (logId) {
      updateLog(logId, {
        status: 'missed',
      });
    } else {
      const medication = schedule.find(s => s.medication.id === medId)?.medication;
      if (medication) {
        logMedication({
          medicationId: medId,
          medicationName: medication.name,
          scheduledTime,
          status: 'missed',
        });
      }
    }
    toast.error('Medication marked as missed', {
      description: 'Try to take it as soon as you can.',
      duration: 3000,
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'taken':
        return 'bg-green-100 border-green-500';
      case 'missed':
        return 'bg-red-100 border-red-500';
      default:
        return 'bg-white border-gray-300';
    }
  };

  const currentTime = format(new Date(), 'HH:mm');

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-4xl font-bold mb-1">Today's Schedule</h1>
        <p className="text-xl text-muted-foreground">
          {format(new Date(), 'EEEE, MMM d')}
        </p>
      </div>

      {schedule.length === 0 ? (
        <Card className="p-8 text-center">
          <AlertCircle className="h-16 w-16 mx-auto mb-3 text-muted-foreground" />
          <h2 className="text-2xl font-semibold mb-2">No medications scheduled</h2>
          <p className="text-lg text-muted-foreground mb-4">
            Add your first medication to get started
          </p>
          <Button size="lg" className="h-14 px-6 text-lg" asChild>
            <a href="/medications/add">Add Medication</a>
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {schedule.map((item, index) => {
            const isPast = item.time < currentTime;
            const status = item.log?.status;

            return (
              <Card
                key={`${item.medication.id}-${item.time}-${index}`}
                className={`p-4 border-4 ${getStatusColor(status)}`}
              >
                <div className="flex items-start gap-3">
                  {/* Medication Color Indicator */}
                  <div
                    className="w-2 h-full min-h-[60px] rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.medication.color }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-2xl font-bold mb-1 break-words">
                          {item.medication.name}
                        </h3>
                        <p className="text-xl text-muted-foreground mb-1">
                          {item.medication.dosage}
                        </p>
                        <div className="flex items-center gap-2 text-xl">
                          <Clock className="h-5 w-5" />
                          <span className="font-semibold">{item.time}</span>
                          {isPast && !status && (
                            <span className="text-destructive text-base">(Overdue)</span>
                          )}
                        </div>
                      </div>

                      {/* Status Badge */}
                      {status && (
                        <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white/50 flex-shrink-0">
                          {status === 'taken' && (
                            <>
                              <Check className="h-6 w-6 text-green-600" />
                              <span className="text-lg font-semibold text-green-600">
                                Taken
                              </span>
                            </>
                          )}
                          {status === 'missed' && (
                            <>
                              <X className="h-6 w-6 text-red-600" />
                              <span className="text-lg font-semibold text-red-600">
                                Missed
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {item.medication.notes && (
                      <p className="text-base text-muted-foreground mb-3 p-3 bg-muted/50 rounded-lg break-words">
                        {item.medication.notes}
                      </p>
                    )}

                    {/* Action Buttons */}
                    {!status && (
                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={() =>
                            handleMarkTaken(
                              item.medication.id,
                              item.time,
                              item.log?.id
                            )
                          }
                          size="lg"
                          className="w-full h-14 text-lg gap-2 bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-6 w-6" />
                          I Took This
                        </Button>
                        <Button
                          onClick={() =>
                            handleMarkMissed(
                              item.medication.id,
                              item.time,
                              item.log?.id
                            )
                          }
                          size="lg"
                          variant="outline"
                          className="w-full h-14 text-lg gap-2 border-2"
                        >
                          <X className="h-6 w-6" />
                          Missed
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}