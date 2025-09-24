import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import UserSearch from './Components/UserSearch';
import UserList from './Components/UserList';
import UserProfile from './Components/UserProfile';
import UserChart from './Components/UserChart';
import ErrorMessage from './Components/ErrorMessage';
import NoUsersMessage from './Components/NoUserMessage';
import LoadingSpinner from './Components/LoadingSpinner'; 
import { githubService } from './services/githubService';

const App = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [query, setQuery] = useState('');
  const [lastSearchQuery, setLastSearchQuery] = useState(''); 

  const handleSearch = async (searchQuery) => {
    setHasSearched(true);
    setQuery(searchQuery);
    setLastSearchQuery(searchQuery);
    setLoading(true);
    setError('');
    setUsers([]); 
    
    try {
      const data = await githubService.searchUsers(searchQuery);
      const usersWithDetails = await Promise.all(
        data.items.map(async (user) => {
          try {
            const details = await githubService.getUserProfile(user.login);
            return {
              ...user,
              followers: details.followers,
              public_repos: details.public_repos
            };
          } catch {
            return { ...user, followers: 0, public_repos: 0 };
          }
        })
      );
      setUsers(usersWithDetails);
    } catch (err) {
      setError(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setUsers([]);
    setHasSearched(false);
    setQuery('');
    setLastSearchQuery('');
    setError('');
  };

  const restoreLastSearch = async () => {
    if (lastSearchQuery && users.length === 0 && hasSearched) {
      await handleSearch(lastSearchQuery);
    }
  };

  const renderMainContent = () => {
    if (loading) {
      return <LoadingSpinner message="Cargando usuarios..." />;
    }

    if (users.length > 0) {
      return (
        <>
          <UserList users={users} />
          <UserChart users={users} />
        </>
      );
    }

    return (
      <NoUsersMessage
        hasSearched={hasSearched}
        loading={loading}
        onReset={resetSearch}
      />
    );
  };

  const MainContent = () => {
    const location = useLocation();

    useEffect(() => {
      if (location.pathname === '/' && lastSearchQuery && users.length === 0 && hasSearched && !loading) {
        restoreLastSearch();
      }
    }, [location.pathname]);

    return (
      <>
        <UserSearch
          query={query}
          setQuery={setQuery}
          onSearch={handleSearch}
          loading={loading}
        />
        {renderMainContent()}
      </>
    );
  };

  return (
    <Router>
      <div className="min-h-screen bg-black flex justify-center">
        <div className="w-full max-w-[1500px] p-10">
          <Routes>
            <Route path="/" element={<MainContent />} />
            <Route path="/user/:username" element={<UserProfile />} />
          </Routes>
        </div>
        <ErrorMessage error={error} onClose={() => setError('')} />
      </div>
    </Router>
  );
};

export default App;