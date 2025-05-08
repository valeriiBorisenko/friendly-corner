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
          const updatedBackgrounds = {};
          const timestamp = new Date().getTime(); // Cache-busting
          response.data.forEach(image => {
            if (image.backgroundType && image.imagePath) {
              updatedBackgrounds[image.backgroundType] = `${BASE_URL}${image.imagePath}?t=${timestamp}`;
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
      const timestamp = new Date().getTime(); // Cache-busting
      setBackgrounds({ 
          background1: `/bgd-main.png?t=${timestamp}`,
          background2: `/bgd-office.jpg?t=${timestamp}`,
          background3: `/bgd-meeting.jpg?t=${timestamp}`,
          background4: `/bgd-meeting-2.jpg?t=${timestamp}`,
          background5: `/bgd-butik.jpg?t=${timestamp}`
      });
    };

    fetchSavedImages();
    fetchPrices();
  }, [BASE_URL]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BackgroundContext.Provider value={{ backgrounds, setBackgrounds, prices, setPrices }}>
      {children}
    </BackgroundContext.Provider>
  );
};