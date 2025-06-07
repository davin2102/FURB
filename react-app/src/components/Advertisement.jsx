import './advertisement.css';
import AdvertisementImage from "/images/advertisement.png";
import AdvertisementImage2 from "/images/advertisement2.png";
import AdvertisementImage3 from "/images/advertisement3.png";
import { useState, useEffect } from 'react';

const banners = [
    { id: 1, content: AdvertisementImage },
    { id: 2, content: AdvertisementImage2 },
    { id: 3, content: AdvertisementImage3 }
];

const Advertisement = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 5000);
        
        return () => clearInterval(interval);
    }, []);

    const handleImageLoad = (e, index) => {
        console.log(`Image ${index+1} dimensions:`, 
                   e.target.naturalWidth, 'x', e.target.naturalHeight);
        // Set container dimensions based on first image
        if (index === 0) {
            setDimensions({
                width: e.target.naturalWidth,
                height: e.target.naturalHeight
            });
        }
    };

    return (
        <div className="advertisement-wrapper">
            <div className="banner-container" style={{
                width: dimensions.width > 0 ? `${dimensions.width}px` : '100%',
                height: dimensions.height > 0 ? `${dimensions.height}px` : 'auto',
                maxWidth: '100%'
            }}>
                {banners.map((banner, index) => (
                    <div 
                        key={banner.id}
                        className={`banner ${index === currentIndex ? 'active' : ''}`}
                    >
                        <img
                            src={banner.content}
                            alt={`Advertisement ${banner.id}`}
                            className="banner-image"
                            onLoad={(e) => handleImageLoad(e, index)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Advertisement;