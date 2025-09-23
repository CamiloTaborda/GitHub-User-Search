import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { githubService } from "../../services/githubService";
import { 
  FaArrowLeft, FaUsers, FaBook, FaLink, 
  FaMapMarkerAlt, FaTwitter, FaBuilding, FaEnvelope 
} from "react-icons/fa";
import UserChart from '../UserChart';
import AnimatedSection from '../../Animations/AnimatedSection';

const UserProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

   useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError('');

        const userData = await githubService.getUserProfile(username);
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchUser();
  }, [username]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <p className="text-red-500 text-lg mb-4">Error: {error || 'Usuario no encontrado'}</p>
        <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
          Volver a la búsqueda
        </Link>
      </div>
    );
  }

  return (
    <AnimatedSection>
    <div className="min-h-screen text-white space-y-8">
      <Link
        to="/"
        className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg 
                   transition-transform duration-300 transform hover:scale-105 mb-6 shadow-md hover:shadow-lg"
      >
        <FaArrowLeft className="mr-2" />
        Volver a la búsqueda
      </Link>

      <div className="rounded-3xl shadow-2xl overflow-hidden w-full mx-auto space-y-8">
        <div className="md:flex gap-8">
          <div className="md:w-1/3 flex flex-col items-center bg-[var(--color-bg-main)] p-6 rounded-2xl">
            <img
              src={user.avatar_url}
              alt={user.login}
              className="w-40 h-40 rounded-full border-4 border-indigo-500 mb-4"
            />
            <h1 className="text-3xl font-bold text-indigo-400 mb-1">{user.name || user.login}</h1>
            <p className="text-gray-300 text-lg mb-2">@{user.login}</p>
            {user.bio && <p className="text-gray-200 text-center">{user.bio}</p>}
          </div>

          <div className="md:w-2/3 flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-blue-700 p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300">
                <FaUsers className="text-3xl mx-auto mb-2 text-yellow-400" />
                <p className="text-4xl font-bold">{user.followers}</p>
                <p className="text-gray-200">Seguidores</p>
              </div>
              <div className="bg-green-700 p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300">
                <FaBook className="text-3xl mx-auto mb-2 text-yellow-400" />
                <p className="text-4xl font-bold">{user.public_repos}</p>
                <p className="text-gray-200">Repositorios</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-gray-300 text-lg">
              {user.company && (
                <div className="flex items-center gap-2">
                  <FaBuilding className="text-gray-400" /> <span>{user.company}</span>
                </div>
              )}
              {user.location && (
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-gray-400" /> <span>{user.location}</span>
                </div>
              )}
              {user.blog && (
                <div className="flex items-center gap-2">
                  <FaLink className="text-gray-400" /> 
                  <a href={user.blog} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    {user.blog}
                  </a>
                </div>
              )}
              {user.twitter_username && (
                <div className="flex items-center gap-2">
                  <FaTwitter className="text-gray-400" /> 
                  <a href={`https://twitter.com/${user.twitter_username}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    @{user.twitter_username}
                  </a>
                </div>
              )}
              {user.email && (
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-gray-400" /> <span>{user.email}</span>
                </div>
              )}
              {user.hireable !== null && (
                <div className="flex items-center gap-2">
                  <span>{user.hireable ? 'Disponible para trabajo' : 'No disponible para trabajo'}</span>
                </div>
              )}
            </div>

            {user.created_at && (
              <div className="mt-6 pt-6 border-t border-gray-700 text-gray-400 text-sm text-center">
                Miembro desde: {new Date(user.created_at).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        {/* Gráfica del usuario */}
        <div className="mt-8">
          <UserChart users={[user]} />
        </div>
      </div>
    </div>
    </AnimatedSection>
  );
};

export default UserProfile;
