import axios from 'axios';

const GITHUB_API = 'https://api.github.com';

export const githubService = {
  searchUsers: (query) => {
    return axios.get(`${GITHUB_API}/search/users?q=${query}&per_page=10`)
      .then(response => response.data)
      .catch(error => {
        throw new Error(error.response?.data?.message || 'Error searching users');
      });
  },

  getUserProfile: (username) => {
    return axios.get(`${GITHUB_API}/users/${username}`)
      .then(response => response.data)
      .catch(error => {
        throw new Error(error.response?.data?.message || 'Error fetching user profile');
      });
  }
};

export const useGithubApi = () => {
  return {
    searchUsers: (query) => githubService.searchUsers(query),
    getUserProfile: (username) => githubService.getUserProfile(username)
  };
};