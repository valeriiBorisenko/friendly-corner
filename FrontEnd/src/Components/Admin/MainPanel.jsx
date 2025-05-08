import React from 'react';
import BackgroundChanger from './Maintenance/BgdImageChange/BackgroundChanger';
import Prices from './Maintenance/Prices';
import Register from './Maintenance/Register';
import UserList from './Maintenance/UserList';
import SlackFeed from './Maintenance/Slackfeed';

function MainPanel({ selectedComponent }) {
    const renderComponent = () => {
        switch (selectedComponent) {
            case 'BackgroundChanger':
                return <BackgroundChanger />;
            case 'Prices':
                return <Prices />;
            case 'Register':
                return <Register />;
            case 'Colleagues':
                return <UserList />;
            case 'SlackFeed':
                return <SlackFeed />;
            default:
                return <BackgroundChanger />;
        }
    };

    return (
        <div className="adm-panel text">
            {renderComponent()}
        </div>
    );
};

export default MainPanel;