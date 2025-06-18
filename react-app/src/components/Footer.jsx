import Logo from '/images/logo_black.png';
import Instagram from '/images/instagram.png';
import Facebook from '/images/facebook.png';
import Tiktok from '/images/tiktok.png';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
        

      <div className="footer-content">
        <div className="footer-column logo-column">
          <img src={Logo} alt="furb. logo" className="footer-logo" />
        </div>
        
        <div className="footer-column">
          <h3 className="footer-title">Company</h3>
          <ul className="footer-links">
            <li><a href="/about">About us</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/copyright">Copyright Policy</a></li>
            <li><a href="/terms">Terms and Condition</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer-title">Help</h3>
          <ul className="footer-links">
            <li><a href="/help">Help Center</a></li>
            <li><a href="/security">Security Center</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer-title">Contact us</h3>
          <ul className="footer-links">
            <li className="contact-item">
              <a href="mailto:furb@gmail.com">furb@gmail.com</a>
            </li>
            <li className="contact-item">
              <a href="tel:+6281234567890">+62 812 3456 7890</a>
            </li>
            <li className="social-media">
              <a href="https://www.facebook.com/furb" target="_blank" rel="noopener noreferrer">
                <img src={Facebook} alt="Facebook" className="social-icon" />
              </a>
              <a href="https://www.instagram.com/furb" target="_blank" rel="noopener noreferrer">
                <img src={Instagram} alt="Instagram" className="social-icon" />
              </a>
              <a href="https://www.tiktok.com/@furb" target="_blank" rel="noopener noreferrer">
                <img src={Tiktok} alt="TikTok" className="social-icon" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© furb. 2025, All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;