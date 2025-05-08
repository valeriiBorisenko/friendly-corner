import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-cont" id="contact-us">
        <h2>Kontakt</h2>
        <br />
        <div className="columns">
          <div className="left-column">
            <p>Friendly corner
              <br />
              Tändsticksgränd 36
              <br />
              553 15 Jönköping
              <br />
              <br />
              <a href="mailto:info@friendlycorner.se" target="_blank">
                info@friendlycorner.se
              </a>
            </p>
          </div>
          <div className="right-column">
            <p>
              Åsa Andreasson, Kreativa Kvadrat,{" "}
              <a href="tel:0701474725">0701 47 47 25</a>
              <br />
              Tinna Ahlander, Tinna design,{" "}
              <a href="tel:0703142656">0703 14 26 56</a>
              <br />
              <br />
              <br />
              <a
                href="https://instagram.com/friendlycorner_jkpg"
                target="_blank"
              >
                instagram: friendlycorner
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
