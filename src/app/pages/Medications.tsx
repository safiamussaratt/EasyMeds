import { useMedications } from '../hooks/useMedications';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Plus, Edit, Trash2, Clock, Calendar } from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';

export function Medications() {
  const { medications, deleteMedication } = useMedications();

  const handleDelete = (id: string, name: string) => {
    deleteMedication(id);
    toast.success(`${name} has been deleted`, {
      description: 'The medication has been removed from your list.',
    });
  };

  const getFrequencyText = (frequency: string, times: string[]) => {
    if (frequency === 'custom') {
      return `${times.length} times daily`;
    }
    const freqMap: Record<string, string> = {
      once: 'Once daily',
      twice: 'Twice daily',
      three: '3 times daily',
      four: '4 times daily',
    };
    return freqMap[frequency] || frequency;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-4xl font-bold">My Medications</h1>
        <Button size="lg" className="h-14 px-4 text-lg gap-2" asChild>
          <Link to="/medications/add">
            <Plus className="h-6 w-6" />
            <span className="hidden xs:inline">Add</span>
          </Link>
        </Button>
      </div>

      {medications.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-2">No medications yet</h2>
            <p className="text-lg text-muted-foreground mb-4">
              Start by adding your first medication
            </p>
            <Button size="lg" className="h-14 px-6 text-lg gap-2" asChild>
              <Link to="/medications/add">
                <Plus className="h-6 w-6" />
                Add Medication
              </Link>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {medications.map((med) => (
            <Card key={med.id} className="p-4 border-2">
              <div className="flex items-start gap-3">
                {/* Color indicator */}
                <div
                  className="w-2 h-full min-h-[60px] rounded-full flex-shrink-0"
                  style={{ backgroundColor: med.color }}
                />

                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-bold mb-1 break-words">{med.name}</h3>
                  <p className="text-xl text-muted-foreground mb-3">
                    {med.dosage}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-base">
                      <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <span>{getFrequencyText(med.frequency, med.times)}</span>
                    </div>

                    <div className="flex items-start gap-2 text-base">
                      <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div className="flex gap-2 flex-wrap">
                        {med.times.map((time, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-muted rounded-lg font-semibold text-sm"
                          >
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>

                    {med.notes && (
                      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg mt-2 break-words">
                        {med.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="lg"
                      variant="outline"
                      className="flex-1 h-12 px-4 text-base gap-2 border-2"
                      asChild
                    >
                      <Link to={`/medications/edit/${med.id}`}>
                        <Edit className="h-5 w-5" />
                        Edit
                      </Link>
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="lg"
                          variant="destructive"
                          className="flex-1 h-12 px-4 text-base gap-2"
                        >
                          <Trash2 className="h-5 w-5" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-w-sm mx-4">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-2xl">
                            Delete {med.name}?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-lg">
                            This will permanently remove this medication and all its
                            history. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
                          <AlertDialogAction
                            onClick={() => handleDelete(med.id, med.name)}
                            className="h-12 px-6 text-lg bg-destructive hover:bg-destructive/90 w-full"
                          >
                            Delete
                          </AlertDialogAction>
                          <AlertDialogCancel className="h-12 px-6 text-lg w-full m-0">
                            Cancel
                          </AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}