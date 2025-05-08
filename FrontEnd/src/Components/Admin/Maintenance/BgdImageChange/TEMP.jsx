import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';  // Import the base URL

export const BackgroundContext = createContext();

export function BackgroundProvider({ children }) {
  const [backgrounds, setBackgrounds] = useState({});
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedImages = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/api/backgroundimage/getSavedImages`);
  
        if (response.data && response.data.length > 0) {
          const updatedBackgrounds = { ...backgrounds };
          response.data.forEach(image => {
            if (image.backgroundType && image.imagePath) {
              updatedBackgrounds[image.backgroundType] = `${BASE_URL}${image.imagePath}?t=${new Date().getTime()}`;
            }
          });
  
          setBackgrounds(updatedBackgrounds);
        } else {
          setDefaultBackgrounds();
        }
      } catch (error) {
        console.error('Error fetching saved images:', error);
        setDefaultBackgrounds();
      } finally {
        setLoading(false);
      }
    };

    const fetchPrices = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/api/prices`);
        setPrices(response.data);
      } catch (error) {
        console.error('Error fetching prices:', error);
      } finally {
        setLoading(false);
      }
    };

    const setDefaultBackgrounds = () => { 
      setBackgrounds({ 
          background1: 'Images/bgd-main.png', 
          background2: 'Images/bgd-office.jpg', 
          background3: 'Images/bgd-meeting.jpg', 
          background4: 'Images/bgd-meeting-2.jpg', 
          background5: 'Images/bgd-butik.jpg' 
      }); 
    };

    fetchSavedImages();
    fetchPrices();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BackgroundContext.Provider value={{ backgrounds, setBackgrounds, prices, setPrices }}>
      {children}
    </BackgroundContext.Provider>
  );
};