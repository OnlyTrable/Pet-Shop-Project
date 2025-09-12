import { useState } from "react";
import { CircularProgress } from "@mui/material";
import style from "./styles.module.css"
import instagramIcon from "../../assets/icons/instagram.svg";
import whatsappIcon from "../../assets/icons/whatsapp.svg";

function Footer (){
  const [isMapLoading, setIsMapLoading] = useState(true);
  const address = "Wallstraße 9-13, 10179 Berlin, Deutschland";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const googleMapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&z=15&output=embed`;

    return (
    <footer className={style.footer}>
      <div className={style.contactSection}>
        <h2 className={style.title}>Contact</h2>
        <div className={style.contactGrid}>
          <div className={style.contactCard}>
            <p className={style.label}>Phone</p>
            <a href="tel:+493091588492" className={style.info}>+49 30 915-88492</a>
          </div>
          <div className={style.contactCard}>
            <p className={style.label}>Socials</p>
            <div className={style.socials}>
              <a href="https://www.instagram.com/itcareerhub/" target="_blank" rel="noopener noreferrer">
                <img src={instagramIcon} alt="Instagram itcareerhub" />
              </a>
              <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer">
                <img src={whatsappIcon} alt="WhatsApp" />
              </a>
            </div>
          </div>
          <div className={style.contactCard}>
            <p className={style.label}>Address</p>
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className={style.info}>
              {address}
            </a>
          </div>
          <div className={style.contactCard}>
            <p className={style.label}>Working Hours</p>
            <p className={style.info}>24 hours a day</p>
          </div>
        </div>
      </div>
      <div className={style.mapContainer}>
        {isMapLoading && (
          <div className={style.mapLoader}>
            <CircularProgress />
          </div>
        )}
        <iframe
          src={googleMapsEmbedUrl}
          style={{ border: 0, width: '100%', height: '100%', visibility: isMapLoading ? 'hidden' : 'visible' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          title={`Google Map of ${address}`}
          onLoad={() => setIsMapLoading(false)}
        ></iframe>
      </div>
    </footer>)
}

export default Footer;