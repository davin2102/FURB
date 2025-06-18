import './Advertisement.css';
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

    // Update dimensions when image changes
    useEffect(() => {
        const img = new window.Image();
        img.src = banners[currentIndex].content;
        img.onload = () => {
            setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        };
    }, [currentIndex]);

    return (
        <div className="advertisement-wrapper">
            <div
                className="banner-container"
                style={{
                    width: dimensions.width ? `${dimensions.width}px` : 'auto',
                    height: dimensions.height ? `${dimensions.height}px` : 'auto'
                }}
            >
                {banners.map((banner, index) => (
                    <div
                        key={banner.id}
                        className={`banner ${index === currentIndex ? 'active' : ''}`}
                    >
                        <img
                            src={banner.content}
                            alt={`Advertisement ${banner.id}`}
                            className="banner-image"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Advertisement;
