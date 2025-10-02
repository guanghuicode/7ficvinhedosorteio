import { LoaderCircle } from 'lucide-react';

const Spinner = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <LoaderCircle className="animate-spin text-primary" size={48} />
    </div>
  );
};

export default Spinner;

