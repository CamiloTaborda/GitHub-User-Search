import { Link } from 'react-router-dom';
import { FaUser, FaIdCard, FaBook, FaExternalLinkAlt } from 'react-icons/fa';
import SlideInFromBottomSection from '../../Animations/SlideInFromBottomSection';

const UserList = ({ users }) => {
  if (!users || users.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 text-lg">
        No se encontraron usuarios
      </div>
    );
  }

  return (
    <SlideInFromBottomSection>
    <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {users.map((user) => (
        <Link
          key={user.id}
          to={`/user/${user.login}`}
          className="block bg-[var(--color-bg-main)] text-white rounded-3xl shadow-2xl border border-gray-700 p-8
                     transform transition-transform duration-300 hover:scale-105 hover:shadow-indigo-500/60"
        >
          <div className="flex flex-col items-center text-center">
            <img
              src={user.avatar_url}
              alt={user.login}
              className="w-24 h-24 rounded-full border-4 border-indigo-500 mb-4"
            />
            <h3 className="text-2xl font-bold text-indigo-400 mb-1">{user.login}</h3>
            <div className="flex items-center space-x-3 text-gray-300 mb-3">
              <FaIdCard />
              <span>ID: {user.id}</span>
            </div>
            <div className="flex justify-center gap-6 text-gray-300 mt-2">
              <div className="flex items-center gap-1">
                <FaUser className="text-yellow-400" />
                <span>{user.followers || 0} Followers</span>
              </div>
              <div className="flex items-center gap-1">
                <FaBook className="text-green-400" />
                <span>{user.public_repos || 0} Repos</span>
              </div>
            </div>
            <FaExternalLinkAlt className="mt-4 text-gray-400 text-lg" />
          </div>
        </Link>
      ))}
    </div>
    </SlideInFromBottomSection>
  );
};

export default UserList;
