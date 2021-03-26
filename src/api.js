import axios from 'axios';
const baseURL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL,
  timeout: 80000,
  // adapter: cache.adapter,
  // withCredentials: true,
  // headers: {
  //   'X-CSRFToken': Cookies.get('csrftoken'),
  // },
});

export default api;
