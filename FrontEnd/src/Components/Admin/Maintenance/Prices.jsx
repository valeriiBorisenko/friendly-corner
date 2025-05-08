/* eslint-disable no-unused-vars */
import React, { useContext, useState } from 'react';
import { BackgroundContext } from '../../../context/BackgroundContext';
import axios from 'axios';
import { BASE_URL } from '../../../config';
import './Prices.css';

const PricesList = () => {
    const { prices, setPrices } = useContext(BackgroundContext);
    const [editedPrices, setEditedPrices] = useState({});
    const [alert, setAlert] = useState({ show: false, message: '' });

    const handleEdit = (id, value) => {
        setEditedPrices({
            ...editedPrices,
            [id]: value
        });
    };

    const handleSave = async () => {
        try {
            const updates = Object.keys(editedPrices).map(id => {
                const original = prices.find(price => price.id === parseInt(id, 10));
                return {
                    id: parseInt(id, 10), // Ensure ID is an integer
                    location: original.location, // Include location
                    amount: parseFloat(editedPrices[id]), // Ensure amount is a decimal number
                    date: original.date // Include date
                };
            });

            console.log("Updates to be sent:", updates); // Log updates for debugging

            await Promise.all(
                updates.map(price => axios.put(`${BASE_URL}/api/prices/${price.id}`, price))
            );

            // Fetch the updated prices
            const response = await axios.get(`${BASE_URL}/api/prices`);
            setPrices(response.data);
            setEditedPrices({});
            
            // Show alert
            setAlert({ show: true, message: 'Data saved successfully!' });
            setTimeout(() => setAlert({ show: false, message: '' }), 3000); // Hide after 3 seconds
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                console.error('Validation errors:', error.response.data.errors);
            } else {
                console.error('Error saving prices:', error.response ? error.response.data : error.message);
            }

            // Show alert for error
            setAlert({ show: true, message: 'Failed to save data.' });
            setTimeout(() => setAlert({ show: false, message: '' }), 3000); // Hide after 3 seconds
        }
    };

    return (
        <div className="prices-list">
            <div className="prices-text text">
                <h1>Prices</h1>
                {alert.show && <span className="price-alert">{alert.message}</span>}
            </div>
            <table className="prices-table">
                <thead>
                    <tr>
                        <th>Price location</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {prices.map(price => (
                        <tr key={price.id}>
                            <td>{price.location}</td>
                            <td>
                                <div className="prices-input-wrapper"> 
                                    <input type="number" className="prices-input" value={editedPrices[price.id] || price.amount} 
                                        onChange={(e) => handleEdit(price.id, e.target.value)} /> 
                                    <span className="prices-input-text"> 
                                    {price.id === 1 ? "kr/mån" : "kr"} 
                                    </span> 
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="prices-save-button" onClick={handleSave}>Save</button>
        </div>
    );
};

export default PricesList;
