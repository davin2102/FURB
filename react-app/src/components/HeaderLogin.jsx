// import React, { useState, useEffect, useRef } from 'react';
// import './Header.css';
// import logo from '/images/logo.png';
// import SearchBar from './SearchBar';
// import { Link } from 'react-router-dom';
// import Profile from '/images/profile.png';
// import Chaticon from '/images/chat-icon.png';

// // SVG for bookmark icon
// const BookmarkSVG = ({ filled }) => (
//   <svg
//     width="44"
//     height="44"
//     viewBox="0 0 24 24"
//     fill={filled ? "#fff" : "none"}
//     stroke={filled ? "#f4b400" : "#fff"}
//     strokeWidth="2.2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.13))', borderRadius: "8px" }}
//   >
//     <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
//   </svg>
// );

// const HeaderLogin = () => {
//   const [showBookmarks, setShowBookmarks] = useState(false);
//   const [bookmarks, setBookmarks] = useState([]);

//   // Load bookmarks from localStorage
//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem('bookmarkedItems') || '[]');
//     setBookmarks(stored);
//   }, [showBookmarks]);

//   return (
//     <header className="header-container">
//       <div className="header-left">
//         <Link to="/HomeLogin" className="logo-link">
//           <img src={logo} alt="furb logo" className="logo-img" />
//         </Link>
//       </div>

//       <div className="header-center">
//         <SearchBar />
//       </div>

//       <div className="header-right">
//         <div className="icon-container">
//           {/* Bookmark Icon */}
//           <button
//             className="bookmark-header-btn"
//             onClick={() => setShowBookmarks((v) => !v)}
//             aria-label="Show Bookmarks"
//             style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '8px' }}
//           >
//             <BookmarkSVG filled={false} />
//           </button>
//           {/* Chat Icon */}
//           <Link to="/Chatroom">
//             <img src={Chaticon} alt="chat icon" className='Chat-icon'/>
//           </Link>
//           <Link to="/Sell">
//             <img src={Profile} alt="profile picture" className='Profile'/>
//           </Link>
//         </div>
//         {/* Bookmarks Modal/Dropdown */}
//         {showBookmarks && (
//           <div className="bookmark-dropdown">
//             <h4>Bookmarked Items</h4>
//             {bookmarks.length === 0 ? (
//               <div style={{ padding: '10px', color: '#888' }}>No bookmarks yet.</div>
//             ) : (
//               <ul>
//                 {bookmarks.map((item, idx) => (
//                   <li key={idx} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
//                     <img src={item.image} alt={item.title} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6, marginRight: 10 }} />
//                     <span>{item.title}</span>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         )}
//       </div>
//     </header>
//   );
// };

// export default HeaderLogin;

import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
import logo from '/images/logo.png';
import SearchBar from './SearchBar';
import { Link } from 'react-router-dom';
import Profile from '/images/profile.png';
import Chaticon from '/images/chat-icon.png';

const BookmarkSVG = ({ filled }) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill={filled ? "#fff" : "none"}
    stroke={filled ? "#f4b400" : "#fff"}
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.13))', borderRadius: "8px" }}
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const HeaderLogin = () => {
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const dropdownRef = useRef(null);
  const iconRef = useRef(null);

  // Load bookmarks from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('bookmarkedItems') || '[]');
    setBookmarks(stored);
  }, [showBookmarks]);

  // Handle clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        iconRef.current &&
        !iconRef.current.contains(event.target)
      ) {
        setShowBookmarks(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header-container">
      <div className="header-left">
        <Link to="/HomeLogin" className="logo-link">
          <img src={logo} alt="furb logo" className="logo-img" />
        </Link>
      </div>

      <div className="header-center">
        <SearchBar />
      </div>

      <div className="header-right">
        <div className="icon-container" ref={iconRef}>
          <button
            className="bookmark-header-btn"
            onClick={() => setShowBookmarks((v) => !v)}
            aria-label="Show Bookmarks"
            style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '8px' }}
          >
            <BookmarkSVG filled={false} />
          </button>

          <Link to="/Chatroom">
            <img src={Chaticon} alt="chat icon" className='Chat-icon' />
          </Link>
          <Link to="/Sell">
            <img src={Profile} alt="profile picture" className='Profile' />
          </Link>
        </div>

        {showBookmarks && (
          <div className="bookmark-dropdown" ref={dropdownRef}>
            <h4>Bookmarked Items</h4>
            {bookmarks.length === 0 ? (
              <div style={{ padding: '10px', color: '#888' }}>No bookmarks yet.</div>
            ) : (
              <ul>
                {bookmarks.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                    <img src={item.image} alt={item.title} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6, marginRight: 10 }} />
                    <span>{item.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderLogin;