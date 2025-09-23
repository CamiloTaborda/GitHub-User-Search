import { useEffect } from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

const ErrorMessage = ({ error, onClose }) => {
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, onClose]);

  if (!error) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaExclamationTriangle className="mr-2" />
            <span className="font-medium">Error:</span>
          </div>
          <button
            onClick={onClose}
            className="text-red-700 hover:text-red-900"
          >
            <FaTimes />
          </button>
        </div>
        <p className="mt-2 text-sm">{error}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;