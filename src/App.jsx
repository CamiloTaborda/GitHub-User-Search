import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserSearch from './Components/UserSearch';
import UserList from './Components/UserList';
import UserProfile from './Components/UserProfile';
import UserChart from './Components/UserChart';
import ErrorMessage from './Components/ErrorMessage';
import NoUsersMessage from './Components/NoUserMessage';
import { githubService } from './services/githubService';

const App = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [query, setQuery] = useState('');

  const handleSearch = async (searchQuery) => {
    setHasSearched(true);
    setQuery(searchQuery);
    setLoading(true);
    setError('');
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
    setError('');
  };

  return (
    <Router>
      <div className="min-h-screen bg-black flex justify-center">
        <div className="w-full max-w-[1500px] p-10">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <UserSearch 
                    query={query} 
                    setQuery={setQuery} 
                    onSearch={handleSearch} 
                    loading={loading} 
                  />
                  {users.length > 0 ? (
                    <>
                      <UserList users={users} />
                      <UserChart users={users} />
                    </>
                  ) : (
                    <NoUsersMessage 
                      hasSearched={hasSearched} 
                      loading={loading} 
                      onReset={resetSearch} 
                    />
                  )}
                </>
              }
            />
            <Route path="/user/:username" element={<UserProfile />} />
          </Routes>
        </div>
        <ErrorMessage error={error} onClose={() => setError('')} />
      </div>
    </Router>
  );
};

export default App;
