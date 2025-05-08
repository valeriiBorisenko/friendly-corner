import './MeetRoom.css';

import React, { useContext } from 'react'; 
import { BackgroundContext } from '../../context/BackgroundContext';


function MeetingRoom() {

    const { backgrounds, prices } = useContext(BackgroundContext);
  
    // Helper function to get the price by ID
    const formatNumber = (number) => {
        return number.toLocaleString('sv-SE'); // Format numbers according to Swedish conventions
    };
    
    const getPriceById = (id) => {
        const price = prices.find(price => price.id === id);
        return price ? formatNumber(price.amount) : "...";
    };
    
    return(
        <>
        <div className="wrapper">

            {/* Background image */}
            <div className='section-2 section' id='meetingRoom'>
                {backgrounds.background3 && (
                    <>
                        <div className="meetingRoom-bgd-img" style={{ backgroundImage: `url(${backgrounds.background3})`, }} />
                    </>
                )}
            </div>

            <div className="meetingRoom-sub sub">
                <div className='meetingRoom-text text'>
                    <h1>Mötesrum Slottet</h1><br />

                    <p>Mötesrum utöver det vanliga</p><br />

                    <p>Byt miljö och boka mötesrum hos oss!

                    Ett mötesrum utöver det vanliga, måste upplevas.
                    Du hittar oss i mysiga Tändsticksområdet, i en lugn och unik miljö.
                    Trevliga restauranger runt hörnet och nära till tåg och buss.</p><br /><br />

                    <p>Heldag {getPriceById(3)} kr</p>
                    <p>Halvdag {getPriceById(4)} kr</p>
                    <p>Helgdag {getPriceById(5)} kr</p><br />

                    <p>Det finns Wifi, bildskärm, whiteboard. Fika eller lunch kan ni boka via oss</p><br />

                    <p>(priser exklusive moms)</p>
                </div>
            </div>
            <div className="section-2-2">
                {backgrounds.background4 && (
                    <>
                        <div className="meetRoom-post-img" style={{ backgroundImage: `url(${backgrounds.background4})`, }} />
                    </>
                )}

                {/* <div className='meetRoom-post-img'></div> */}
            </div>
        </div>
        </>
    );

}

export default MeetingRoom;