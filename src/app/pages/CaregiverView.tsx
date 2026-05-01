import { useMedications } from '../hooks/useMedications';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Check, X, Clock, TrendingUp, AlertCircle, Users } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { EmergencyContact } from '../types';

export function CaregiverView() {
  const { medications, logs } = useMedications();
  const [emergencyContact, setEmergencyContact] = useLocalStorage<EmergencyContact | null>(
    'easymeds_emergency_contact',
    null
  );
  const [isEditing, setIsEditing] = useState(!emergencyContact);
  const [contactForm, setContactForm] = useState<EmergencyContact>(
    emergencyContact || { name: '', relationship: '', phone: '' }
  );

  // Calculate adherence statistics
  const getLast7DaysStats = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      return date.toISOString().split('T')[0];
    });

    const stats = last7Days.map(dateStr => {
      const dayLogs = logs.filter(log => log.scheduledTime.startsWith(dateStr));
      const taken = dayLogs.filter(log => log.status === 'taken').length;
      const total = dayLogs.length;
      const missed = dayLogs.filter(log => log.status === 'missed').length;

      return {
        date: dateStr,
        taken,
        missed,
        total,
        percentage: total > 0 ? Math.round((taken / total) * 100) : 0,
      };
    });

    return stats.reverse();
  };

  const getOverallAdherence = () => {
    const allLogs = logs;
    const taken = allLogs.filter(log => log.status === 'taken').length;
    const total = allLogs.length;
    return total > 0 ? Math.round((taken / total) * 100) : 0;
  };

  const getTodayStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayLogs = logs.filter(log => log.scheduledTime.startsWith(today));
    const taken = todayLogs.filter(log => log.status === 'taken').length;
    const missed = todayLogs.filter(log => log.status === 'missed').length;
    const total = todayLogs.length;

    return { taken, missed, total };
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactForm.name.trim() || !contactForm.phone.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setEmergencyContact(contactForm);
    setIsEditing(false);
    toast.success('Emergency contact saved!');
  };

  const stats = getLast7DaysStats();
  const overallAdherence = getOverallAdherence();
  const todayStats = getTodayStats();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Users className="h-10 w-10 flex-shrink-0" />
        <h1 className="text-4xl font-bold">Caregiver</h1>
      </div>

      {/* Today's Summary */}
      <Card className="p-5">
        <h2 className="text-2xl font-bold mb-4">Today's Summary</h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
            <div className="text-4xl font-bold text-green-600 mb-1">
              {todayStats.taken}
            </div>
            <div className="text-base text-green-700">Taken</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg border-2 border-red-200">
            <div className="text-4xl font-bold text-red-600 mb-1">
              {todayStats.missed}
            </div>
            <div className="text-base text-red-700">Missed</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <div className="text-4xl font-bold text-blue-600 mb-1">
              {todayStats.total}
            </div>
            <div className="text-base text-blue-700">Total</div>
          </div>
        </div>
      </Card>

      {/* Overall Adherence */}
      <Card className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Adherence Rate</h2>
        </div>
        <div className="text-center py-4">
          <div className="text-6xl font-bold mb-2">{overallAdherence}%</div>
          <p className="text-lg text-muted-foreground">
            Based on {logs.length} doses
          </p>
        </div>
      </Card>

      {/* Last 7 Days */}
      <Card className="p-5">
        <h2 className="text-2xl font-bold mb-4">Last 7 Days</h2>
        <div className="space-y-3">
          {stats.map((day) => (
            <div key={day.date} className="border-2 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-lg font-semibold">
                  {format(new Date(day.date), 'EEE, MMM d')}
                </div>
                <div className="text-xl font-bold">{day.percentage}%</div>
              </div>
              <div className="flex gap-3 text-sm mb-3 flex-wrap">
                <div className="flex items-center gap-1">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>{day.taken}</span>
                </div>
                <div className="flex items-center gap-1">
                  <X className="h-5 w-5 text-red-600" />
                  <span>{day.missed}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>{day.total}</span>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${day.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Active Medications */}
      <Card className="p-5">
        <h2 className="text-2xl font-bold mb-4">Active Medications</h2>
        {medications.length === 0 ? (
          <div className="text-center py-6">
            <AlertCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">
              No medications tracked
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {medications.map((med) => (
              <div key={med.id} className="flex items-center gap-3 p-3 border-2 rounded-lg">
                <div
                  className="w-2 h-10 rounded-full flex-shrink-0"
                  style={{ backgroundColor: med.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xl font-bold break-words">{med.name}</div>
                  <div className="text-base text-muted-foreground">{med.dosage}</div>
                  <div className="text-sm text-muted-foreground">
                    {med.times.length}x daily: {med.times.join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Emergency Contact */}
      <Card className="p-5">
        <h2 className="text-2xl font-bold mb-4">Emergency Contact</h2>
        {isEditing ? (
          <form onSubmit={handleSaveContact} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactName" className="text-lg">
                Name *
              </Label>
              <Input
                id="contactName"
                value={contactForm.name}
                onChange={(e) =>
                  setContactForm({ ...contactForm, name: e.target.value })
                }
                placeholder="e.g., John Doe"
                className="h-14 text-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="relationship" className="text-lg">
                Relationship
              </Label>
              <Input
                id="relationship"
                value={contactForm.relationship}
                onChange={(e) =>
                  setContactForm({ ...contactForm, relationship: e.target.value })
                }
                placeholder="e.g., Son, Daughter"
                className="h-14 text-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-lg">
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={contactForm.phone}
                onChange={(e) =>
                  setContactForm({ ...contactForm, phone: e.target.value })
                }
                placeholder="e.g., (555) 123-4567"
                className="h-14 text-xl"
              />
            </div>

            <div className="flex flex-col gap-3">
              <Button type="submit" size="lg" className="w-full h-14 text-xl">
                Save Contact
              </Button>
              {emergencyContact && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full h-14 text-xl border-2"
                  onClick={() => {
                    setContactForm(emergencyContact);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        ) : emergencyContact ? (
          <div className="space-y-3">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold mb-1">{emergencyContact.name}</div>
              {emergencyContact.relationship && (
                <div className="text-lg text-muted-foreground mb-1">
                  {emergencyContact.relationship}
                </div>
              )}
              <div className="text-xl font-semibold">{emergencyContact.phone}</div>
            </div>
            <Button
              variant="outline"
              size="lg"
              className="h-12 text-lg border-2 w-full"
              onClick={() => setIsEditing(true)}
            >
              Edit Contact
            </Button>
          </div>
        ) : null}
      </Card>
    </div>
  );
}