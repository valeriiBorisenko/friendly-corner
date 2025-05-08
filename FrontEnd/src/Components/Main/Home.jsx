import "./Home.css";
import React, { useContext } from 'react'; 
import { BackgroundContext } from '../../context/BackgroundContext';

const Asa = '/Asa Andreasson.jpg';
const Tinna = '/Tinna Ahlander.jpg';

function Home() {

  const { backgrounds } = useContext(BackgroundContext);
  
  return (
    <>
      <div className="wrapper">
        
        {/* Background image */}
        <div className="section-0 section">
          {backgrounds.background1 && (
            <>
            <div className="wc-bgd-img" 
                  style={{ backgroundImage: `url(${backgrounds.background1})`}} />
            </>
          )}
        </div>

        {/* About us sub text */}
        <div className="about-sub sub">
          <div className="about-text text">
            <h1>Vi är Friendly corner</h1>
            <br />
            <p>
              En kreativ mötesplats i Jönköping med kontorsplatser, mötesrum och
              butik.
            </p>
            <br />
            <p>
              Vi är ett gäng nyfikna personer som alltid tar oss an projekt på
              ett seriöst sätt och tycker att samarbete är bra för själen.
            </p>
            <br />
            <p>
              Vi värdesätter individer som älskar det dom gör och som ständigt
              strävar efter att växa och bli ännu bättre.
            </p>
            <br />
            <p>Vi gillar ”doers” och snälla själar!</p>
          </div>
        </div>

        {/* Galery */}
        <div className="cowork-cont">
          <div className="photo-frame">
            <figure>
              <img src={Asa} alt="Avatar" className="image" />
              <figcaption>
                Åsa Andreasson<br />
                <a href="https://www.kreativakvadrat.com/" target="_blank" rel="noopener noreferrer">
                  Kreativa Kvadrat
                </a>
              </figcaption>
            </figure>

            <figure>
              <img src={Tinna} alt="Avatar" className="image" />
              <figcaption>
                Tinna Ahlander<br />
                <a href="https://tinnadesign.se/" target="_blank" rel="noopener noreferrer">
                  Tinna Design
                </a>
              </figcaption>
            </figure>
          </div>
            <div className="cowork-text text">  
              <h1>Co-working Office</h1>
              <br />
              <h3>Kreativ mötesplats</h3>
              <br />
              <p>
                Friendly corner på Tändsticksgränd 36, drivs av Tinna Ahlander,
                Tinna Design och Åsa Andreasson, Kreativa Kvadrat.
              
                Du hittar oss i mysiga Tändsticksområdet, i en lugn och unik
                miljö. Trevliga restauranger runt hörnet och nära till tåg och
                buss.
              </p>
              <br />
              <p>Är du intresserad av en kontorsplats, hör av dig till oss!</p>
            </div>

        {/* Insta feed */}
          <div className="insta-sub">
            <div className="instagram-embed">
              <iframe async
                src="https://www.instagram.com/Friendlycorner_jkpg/embed"
                allowtransparency="true"
                ></iframe>
            </div>
          </div>

        </div>

        {/* <img decoding='async' src="https://picsum.photos/800/600?random" alt="instagram picture" /> */}
      </div>
    </>
  );
}

export default Home;
