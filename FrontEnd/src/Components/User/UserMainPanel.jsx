import SlackFeed from '../Admin/Maintenance/Slackfeed';
import MeetingRoomCalendar from './MeetingRoomCalendar';
import './UserPage.css';
function UserMainPanel({ selectedComponent }) {
    const renderComponent = () => {
        switch (selectedComponent) {
            case 'MeetingRoomCalendar':
                return <MeetingRoomCalendar />;
            case 'SlackFeed':
                return <SlackFeed />;
            default:
                return <SlackFeed />;
        }
    };

    return (
        <div className="user-panel text">
            {renderComponent()}
        </div>
    );
};

export default UserMainPanel;