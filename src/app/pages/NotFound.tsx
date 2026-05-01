import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Home, AlertCircle } from 'lucide-react';
import { Link } from 'react-router';

export function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Card className="p-8 text-center max-w-md mx-auto">
        <AlertCircle className="h-20 w-20 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-5xl font-bold mb-3">404</h1>
        <h2 className="text-2xl font-semibold mb-3">Page Not Found</h2>
        <p className="text-lg text-muted-foreground mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Button size="lg" className="h-14 px-6 text-lg gap-2" asChild>
          <Link to="/">
            <Home className="h-6 w-6" />
            Go Home
          </Link>
        </Button>
      </Card>
    </div>
  );
}