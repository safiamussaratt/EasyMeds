import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useMedications } from '../hooks/useMedications';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const MEDICATION_COLORS = [
  '#EF4444', // red
  '#F59E0B', // orange
  '#10B981', // green
  '#3B82F6', // blue
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#14B8A6', // teal
  '#F97316', // orange-2
];

export function EditMedication() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getMedicationById, updateMedication } = useMedications();

  const medication = id ? getMedicationById(id) : null;

  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'once' as 'once' | 'twice' | 'three' | 'four' | 'custom',
    times: ['08:00'],
    startDate: new Date().toISOString().split('T')[0],
    notes: '',
    color: MEDICATION_COLORS[0],
  });

  useEffect(() => {
    if (medication) {
      setFormData({
        name: medication.name,
        dosage: medication.dosage,
        frequency: medication.frequency,
        times: medication.times,
        startDate: medication.startDate,
        notes: medication.notes || '',
        color: medication.color,
      });
    } else if (id) {
      toast.error('Medication not found');
      navigate('/medications');
    }
  }, [medication, id, navigate]);

  const handleTimeChange = (index: number, value: string) => {
    const newTimes = [...formData.times];
    newTimes[index] = value;
    setFormData({ ...formData, times: newTimes });
  };

  const addTimeSlot = () => {
    setFormData({ ...formData, times: [...formData.times, '12:00'] });
  };

  const removeTimeSlot = (index: number) => {
    if (formData.times.length > 1) {
      const newTimes = formData.times.filter((_, i) => i !== index);
      setFormData({ ...formData, times: newTimes });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    // Validation
    if (!formData.name.trim()) {
      toast.error('Please enter a medication name');
      return;
    }

    if (!formData.dosage.trim()) {
      toast.error('Please enter the dosage');
      return;
    }

    if (formData.times.length === 0) {
      toast.error('Please add at least one time');
      return;
    }

    updateMedication(id, {
      name: formData.name.trim(),
      dosage: formData.dosage.trim(),
      frequency: formData.frequency,
      times: formData.times.sort(),
      startDate: formData.startDate,
      notes: formData.notes.trim(),
      color: formData.color,
    });

    toast.success('Medication updated!', {
      description: `${formData.name} has been updated.`,
    });

    navigate('/medications');
  };

  if (!medication) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="lg"
          className="h-12 w-12 p-0 flex-shrink-0"
          onClick={() => navigate('/medications')}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-4xl font-bold">Edit Medication</h1>
      </div>

      <Card className="p-5">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Medication Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xl">
              Medication Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Aspirin"
              className="h-14 text-xl"
            />
          </div>

          {/* Dosage */}
          <div className="space-y-2">
            <Label htmlFor="dosage" className="text-xl">
              Dosage *
            </Label>
            <Input
              id="dosage"
              value={formData.dosage}
              onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
              placeholder="e.g., 100mg, 1 tablet"
              className="h-14 text-xl"
            />
          </div>

          {/* Times */}
          <div className="space-y-2">
            <Label className="text-xl">What times? *</Label>
            <div className="space-y-3">
              {formData.times.map((time, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                    className="h-14 text-xl flex-1"
                  />
                  {formData.times.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="lg"
                      className="h-14 w-14 p-0 flex-shrink-0"
                      onClick={() => removeTimeSlot(index)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="h-12 text-lg gap-2 border-2 w-full"
                onClick={addTimeSlot}
              >
                <Plus className="h-5 w-5" />
                Add Another Time
              </Button>
            </div>
          </div>

          {/* Color Picker */}
          <div className="space-y-2">
            <Label className="text-xl">Choose a color</Label>
            <div className="flex gap-3 flex-wrap">
              {MEDICATION_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-14 h-14 rounded-full border-4 transition-transform ${
                    formData.color === color
                      ? 'border-primary scale-110'
                      : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select ${color}`}
                />
              ))}
            </div>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-xl">
              Start Date
            </Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              className="h-14 text-xl"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-xl">
              Notes (optional)
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g., Take with food"
              className="min-h-28 text-lg"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <Button type="submit" size="lg" className="w-full h-14 text-xl">
              Save Changes
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full h-14 text-xl border-2"
              onClick={() => navigate('/medications')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}