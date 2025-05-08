// At the moment this module is not in use

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import './UserSlider.css';
import { BASE_URL, BASE_LOGIN } from '../../config';
import Member from './Member';

const UserSlider = () => {
    const [users, setUsers] = useState([]);
    const [placeHolder, setPlaceHolder] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/auth/users`);
                const filteredUsers = response.data.filter(user => user.username !== BASE_LOGIN);
                const hiddenUser = response.data.find(user => user.username === BASE_LOGIN);
                const placeholderImage = hiddenUser ? hiddenUser.pictureUrl : null;
    
                setUsers(filteredUsers);
                setPlaceHolder(placeholderImage);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
    
        fetchUsers();
    }, []);
    
    const getSlidesToShow = () => {
        const userCount = users.length;
        if (userCount < 3) {
            return 2;
        } else if (userCount > 5) {
            return 5;
        } else {
            return userCount;
        }
    };

    const settings = {
        infinite: true,
        speed: 2000,
        slidesToShow: getSlidesToShow(),
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />
    };

    return (
        <div className="user-slider">
            <Slider {...settings}>
                {users.map(user => (
                    <div key={user.id} className="user-card">
                        <Member
                            image={user.pictureUrl || placeHolder}
                            alt={user.name}
                            name={user.name}
                            url={user.webUrl}
                            address={user.webUrl}
                            description={user.description}
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

const SampleNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={`slider-arrow next`}
            style={{ ...style }}
            onClick={onClick}
        >
            &gt;&gt;
        </div>
    );
};

const SamplePrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <div
            className={`slider-arrow prev`}
            style={{ ...style }}
            onClick={onClick}
        >
            &lt;&lt;
        </div>
    );
};

export default UserSlider;
