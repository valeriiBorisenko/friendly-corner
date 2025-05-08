import React from 'react';

function Sidebar({ setSelectedComponent }) {
    
    return (
        <div className="adm-sidebar"> 
            <button onClick={() => setSelectedComponent('BackgroundChanger')} className="adm-link">Maintenance</button> 
            <button onClick={() => setSelectedComponent('Prices')} className="adm-link">Prices</button> 
            <button onClick={() => setSelectedComponent('Register')} className="adm-link">Register</button> 
            <button onClick={() => setSelectedComponent('Colleagues')} className="adm-link colls">Colleagues</button>
            <button onClick={() => setSelectedComponent('SlackFeed')} className="adm-link colls">SlackFeed</button> 
        </div> 
    ); 
};

export default Sidebar;