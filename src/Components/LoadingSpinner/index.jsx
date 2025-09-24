import { FaSpinner, FaGithub } from 'react-icons/fa';

const LoadingSpinner = ({ message = "Cargando..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative mb-6">
        <div className="w-20 h-20 border-4 border-gray-700 border-t-indigo-500 rounded-full animate-spin"></div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <FaGithub className="text-indigo-400 text-2xl animate-pulse" />
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-lg text-gray-300 mb-2">{message}</p>
        <p className="text-sm text-gray-500">Obteniendo información de usuarios...</p>
      </div>
      
      <div className="flex space-x-1 mt-4">
        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;