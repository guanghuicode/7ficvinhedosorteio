import React, { useState } from 'react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addStand, exportWinners, getDashboardData } from '../../services/adminService';
import Spinner from '../ui/Spinner';
import QRCode from 'qrcode.react';
import { Download, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const StandManager: React.FC = () => {
  const [newStandName, setNewStandName] = useState('');
  const queryClient = useQueryClient();

  const { data: stands, isLoading } = useQuery({
    queryKey: ['stands'],
    queryFn: getDashboardData,
  });

  const addStandMutation = useMutation({
    mutationFn: addStand,
    onSuccess: () => {
      toast.success('Stand added!');
      queryClient.invalidateQueries({ queryKey: ['stands'] });
      setNewStandName('');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const exportMutation = useMutation({
    mutationFn: exportWinners,
    onSuccess: (csvData) => {
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'fair_passport_winners.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Winners list downloaded!");
    },
    onError: (error) => {
        toast.error(error.message);
    }
  });


  const handleAddStand = (e: React.FormEvent) => {
    e.preventDefault();
    addStandMutation.mutate(newStandName);
  };

  return (
    <div className="space-y-8">
      <Card>
        <h2 className="text-2xl font-bold mb-4">Manage Stands</h2>
        <form onSubmit={handleAddStand} className="flex flex-col sm:flex-row gap-2">
          <Input
            type="text"
            placeholder="E.g., 'Main Stage'"
            value={newStandName}
            onChange={(e) => setNewStandName(e.target.value)}
            aria-label="New Stand Name"
          />
          <Button type="submit" isLoading={addStandMutation.isPending} className="sm:w-auto">
            <PlusCircle className="mr-2" /> Add Stand
          </Button>
        </form>
      </Card>
      
      <Card>
        <h2 className="text-2xl font-bold mb-4">Event Stands</h2>
        {isLoading ? <Spinner /> : (
          <div className="space-y-4">
            {stands && stands.length > 0 ? (
              stands.map((stand) => (
                <div key={stand.id} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-secondary rounded-lg">
                  <span className="font-semibold text-lg mb-4 sm:mb-0">{stand.name}</span>
                  <div className='bg-white p-2 rounded-md'>
                    <QRCode value={JSON.stringify({ standId: stand.id })} size={128} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No stands added yet. Add one above to get started.</p>
            )}
          </div>
        )}
      </Card>

      <Card>
        <h2 className="text-2xl font-bold mb-4">Export Winners</h2>
        <p className="text-gray-600 mb-4">Download a CSV file of all participants who have met the scan requirement.</p>
        <Button onClick={() => exportMutation.mutate()} isLoading={exportMutation.isPending} variant="secondary">
          <Download className="mr-2" /> Export Winners List
        </Button>
      </Card>
    </div>
  );
};

export default StandManager;

