import axios from 'axios';

const logoutURL = "http://localhost:5000/logout";

const logoutUser = async (accessToken,refreshToken,username) => {
    try {
      const response = await axios.post(logoutURL, {refreshToken,username}, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching profile data:', error);
      throw error; // You can re-throw the error to handle it elsewhere if needed
    }
  };



export default logoutUser;