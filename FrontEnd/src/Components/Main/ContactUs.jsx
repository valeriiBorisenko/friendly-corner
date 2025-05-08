import "./ContactUs.css";

function ContactUs() {
  return (
    <>
      <div className="map-sub wrapper" id="contactUs">
        <div className="google-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2127.0012981558334!2d14.156510477984465!3d57.78435557390335!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465a6de9cf27f35d%3A0x6bdf2eafedb0c192!2zVMOkbmRzdGlja3NncsOkbmQgMzYsIDU1MyAxNSBKw7Zua8O2cGluZw!5e0!3m2!1sen!2sse!4v1730467132139!5m2!1sen!2sse"
            width="600"
            height="450"
            loading="lazy"
            allowFullScreen=""
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </>
  );
}

export default ContactUs;