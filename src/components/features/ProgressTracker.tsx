import React from 'react';
import { UserProfile, UserProgress } from '../../services/userService';
import Card from '../ui/Card';
import Progress from '../ui/Progress';
import Button from '../ui/Button';
import { useScannerStore } from '../../store/useScannerStore';
import { ScanLine } from 'lucide-react';

interface ProgressTrackerProps {
  profile: UserProfile;
  progress: UserProgress;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ profile, progress }) => {
  const openScanner = useScannerStore((state) => state.openScanner);
  const progressPercentage = (progress.scannedCount / progress.requiredScans) * 100;
 
  const isComplete = progress.scannedCount >= progress.requiredScans;

  return (
    <Card className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Welcome, {profile.name}!</h2>
      
      {isComplete ? (
        <div className="text-center text-success font-semibold text-lg">
          Congratulations! You've collected all your stamps!
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-center text-gray-600">
            You've scanned {progress.scannedCount} of {progress.requiredScans} stands.
          </p>
          <Progress value={progressPercentage} />
          <Button onClick={openScanner} className="w-full">
            <ScanLine className="mr-2" /> Scan Another Stand
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ProgressTracker;

