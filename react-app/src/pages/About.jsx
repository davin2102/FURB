import Header from "../components/Header";
import HeaderLogin from "../components/HeaderLogin";
import Banner from "/images/banner.png";
import "./About.css";
import BigWaste from "/images/mission1.png";
import SmallWaste2 from "/images/mission2.png";
import SmallWaste1 from "/images/mission3.png";
import ScrollRevealOverlay from "../components/ScrollRevealOverlay";
import LockIcon from "/images/shopping.png";
import AIIcon from "/images/ai.png";
import ChatIcon from "/images/chat.png";
import Footer from '../components/Footer';

const About = () => {
  const isLoggedIn = !!localStorage.getItem("currentUser");

  return (
    <div className="about-page">
      {isLoggedIn ? <HeaderLogin /> : <Header />}

      {/* Full-width banner section */}
      <div className="banner-container-about">
        <img
          src={Banner}
          alt="About Us Banner"
          className="banner-image-about"
        />
        {/* Optional banner overlay text */}
      </div>

      <div className="about-content">
        {/* Our Challenge Section */}
        <div class="challenge-centered">
          <p class="challenge-label">Our Challenge</p>
          <h2 class="challenge-headline">
            Indonesia faces a growing furniture waste crisis
          </h2>
          <p class="challenge-description">
            millions of tons of sofas, chairs, tables, and cabinets are
            discarded every year, clogging
            <br />
            landfills and polluting neighborhoods.
          </p>
        </div>
        {/* Our Mission Section */}
        <div className="mission-flex">
          <div className="mission-images-col">
            <img
              src={SmallWaste1}
              alt="Furniture Waste 1"
              className="mission-img-small-1"
            />
            <img
              src={SmallWaste2}
              alt="Furniture Waste 2"
              className="mission-img-small-2"
            />
          </div>
          <img
            src={BigWaste}
            alt="Furniture Waste Main"
            className="mission-img-large"
          />
          <div className="mission-text-col">
            <div className="mission-title">Our Mission</div>
            <div className="mission-headline">
              Reduce Furniture
              <br />
              Waste in Indonesia
            </div>
            <div className="mission-desc">
              Every year, millions of tons of furniture end up in landfills
              across Indonesia, contributing to environmental damage and wasted
              resources.
            </div>
          </div>
        </div>
        
        <div className="application-section">
          <p className="application-title">Our Application</p>
          <div className="application-highlight">
           <p className="application-text">
            <span>Our platform encourages recycling<br /></span>
            <span>second-hand furniture to reduce<br /></span>
            <span>waste and decrease environmental damage</span>
           </p>
          </div>
      </div>

        <div className="business-section">
          <p className="business-label">Our Business</p>
          <h2 className="business-headline">
            We Build The Platform, You Make The Choices
          </h2>

          <div className="business-cards">
            <div className="business-card">
              <img src={LockIcon} alt="E-Commerce Icon" className="icon-img" />
              <h3 className="card-title">E-Commerce</h3>
              <p className="card-description">
                furb. E-commerce service provides many handy features, such as
                high quality real-time messaging, bookmarks, and many more.
              </p>
            </div>

            <div className="business-card">
              <img src={AIIcon} alt="AI Icon" className="icon-img" />
              <h3 className="card-title">Artificial Intelligence</h3>
              <p className="card-description">
                furb. AI helps user to search and filter out items that they
                want efficiently with high accuracy and precision.
              </p>
            </div>

            <div className="business-card">
              <img src={ChatIcon} alt="Messaging Icon" className="icon-img" />
              <h3 className="card-title">In-App Messaging</h3>
              <p className="card-description">
                furb. gives an embedded chat for logged-in users to communicate
                with each other, allowing negotiating and making deals.
              </p>
            </div>
          </div>
        </div>

        <div className="team-section">
          <p className="team-subtitle">Get to Know</p>
          <h2 className="team-title">The Team</h2>

          <div className="team-rows">
            {/* Row 1: 3 members */}
            <div className="team-row">
              <div className="team-member">
                <img
                  src="/images/team1.png"
                  alt="Wilbert"
                  className="team-photo"
                />
                <h3 className="member-name">Wilbert</h3>
                <p className="member-role">
                  Front-End Developer & Web Designer
                </p>
              </div>

              <div className="team-member">
                <img
                  src="/images/team2.png"
                  alt="Benedictus Alonso"
                  className="team-photo"
                />
                <h3 className="member-name">Benedictus Alonso</h3>
                <p className="member-role">
                  Back-End Developer & Database Engineer
                </p>
              </div>

              <div className="team-member">
                <img
                  src="/images/team3.png"
                  alt="Christopher Davin"
                  className="team-photo"
                />
                <h3 className="member-name">Christopher Davin</h3>
                <p className="member-role">
                  Back-End Developer & API Developer
                </p>
              </div>
            </div>

            {/* Row 2: 2 members */}
            <div className="team-row">
              <div className="team-member">
                <img
                  src="/images/team4.png"
                  alt="Philbert"
                  className="team-photo"
                />
                <h3 className="member-name">Philbert</h3>
                <p className="member-role">
                  Front-End Developer & Web Designer
                </p>
              </div>

              <div className="team-member">
                <img
                  src="/images/team5.png"
                  alt="Nathanael Reinhart"
                  className="team-photo"
                />
                <h3 className="member-name">Nathanael Reinhart</h3>
                <p className="member-role">
                  Back-End Developer & Database Engineer
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
