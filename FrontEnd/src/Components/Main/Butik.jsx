import "./Butik.css";
import React, { useContext } from 'react'; 
import { BackgroundContext } from '../../context/BackgroundContext';

// Remove direct imports and use direct URL references
const butik1 = '/Butik1.jpg';
const butik2 = '/Butik2.jpg';
const butik3 = '/Butik3.jpg';

function Butik() {

    const { backgrounds } = useContext(BackgroundContext);

    return(
        <>
        <div className="wrapper">
            <div className='section-3 section' id='butik'>
                {backgrounds.background5 && (
                    <>
                        <div className="butik-bgd-img" style={{ backgroundImage: `url(${backgrounds.background5})`, }} />
                    </>
                )}
            </div>
            <div className="butik-sub sub" >
                <div className='butik-text text'>
                    <h1>Butik</h1><br />
                    <p>Inredning, barnböcker och mycket annat.</p><br />
                    <p>I vår butik, på mysiga Tändsticksområdet, hittar du inredning, barnböcker och
                        mycket annat.
                    Vi försöker hitta det unika och speciella till dig!
                    
                    Mycket av det vi säljer är producerat i vårt närområde.
                    Åsa som är inredare och stylist hittar de trendiga inredningsdetaljerna och Tinna illustrerar unika kort,
                        posters och böcker för barn.</p>
                    <p>Varmt välkommen in.</p>
                </div>
            </div>
            <div className="butik-cont">
                <div className="butik-pic">
                    <img src={butik1} alt="butik picture" />
                    <img src={butik2} alt="butik picture" />
                    <img src={butik3} alt="butik picture" />
                </div>
            </div>
        </div>
        </>
    );
}

export default Butik;
