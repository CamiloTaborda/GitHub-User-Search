import { useState, useEffect } from 'react';
import { FaSearch, FaGithub } from 'react-icons/fa';
import SlideInFromLeftSection from '../../Animations/SlideInFromLeftSection';

const UserSearch = ({ onSearch, loading, query, setQuery }) => { 
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (query.length < 4 && query !== 'doublevpartners') {
      setModalMessage('La búsqueda debe tener al menos 4 caracteres');
      setShowModal(true);
      return;
    }

    onSearch(query);
  };

  const handleQuickSearch = (quickQuery) => {
    setQuery(quickQuery);
    onSearch(quickQuery);
  };

  return (
    <SlideInFromLeftSection>
    <div className="bg-[var(--color-bg-main)] text-gray-100 rounded-3xl shadow-2xl p-6 mb-6 w-full mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6">
        <FaGithub className="text-3xl mr-3" />
        <h1 className="text-4xl font-extrabold tracking-tight">GitHub User Search</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={query} 
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar usuarios de GitHub (mínimo 4 caracteres)"
              className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
            />
            <FaSearch className="absolute right-4 top-3.5 text-gray-400" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="text-white px-6 py-3 rounded-xl font-semibold bg-blue-500 hover:bg-blue-600 
                       transition-transform duration-300 transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </form>

      {/* Quick Search */}
      <div className="flex flex-wrap gap-3 items-center text-sm text-gray-400 mt-2">
        <span>Búsqueda rápida:</span>
        {['doublevpartners', 'react', 'javascript'].map((item) => (
          <button
            key={item}
            onClick={() => handleQuickSearch(item)}
            className="bg-blue-500 hover:bg-blue-600 text-white hover:text-indigo-300 font-medium 
                       transition-transform duration-300 transform hover:scale-105 px-3 py-1 rounded-full border border-gray-600"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-900 text-gray-100 rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center animate-fadeIn">
            <p className="mb-4">{modalMessage}</p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-xl transition-transform duration-300 transform hover:scale-105"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
    </SlideInFromLeftSection>
  );
};

export default UserSearch;