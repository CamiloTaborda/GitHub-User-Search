import { FaSearch, FaExclamationTriangle } from 'react-icons/fa';

const NoUsersMessage = ({ hasSearched, loading, onReset }) => {
  if (!hasSearched) {
    return (
      <div className="flex flex-col items-center justify-center text-gray-400 mt-20 text-xl gap-4">
        <FaSearch className="text-5xl text-blue-400" />
        <span>¡Busca usuarios de GitHub para empezar!</span>
      </div>
    );
  }

  if (hasSearched && !loading) {
    return (
      <div className="flex flex-col items-center justify-center text-red-500 mt-20 text-xl gap-4">
        <FaExclamationTriangle className="text-5xl" />
        <span>No se encontraron usuarios con esa búsqueda</span>
        <button
          onClick={onReset}
          className="mt-4 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold
                     transition-transform duration-300 transform hover:scale-105"
        >
          Volver
        </button>
      </div>
    );
  }

  return null;
};

export default NoUsersMessage;
