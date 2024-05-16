import axios from 'axios';

const verifyURL = process.env.REACT_APP_VERIFY_URL;

const verifyAccessToken = async (accessToken) => {
    try {
      const response = await axios.post(verifyURL, {}, {
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



export default verifyAccessToken;