import React from 'react';
import './Member.css';
import { getDomainName } from '../../utils';

function Member(props) {
    const domainName = getDomainName(props.url);
    return (
        <figure className='photo-box'>
            <img src={props.image} alt={props.alt} className="colleague" />
            <figcaption>{props.name}<br />
                <a href={props.url} target="_blank" rel="noopener noreferrer">{domainName}</a>
            </figcaption>
            <div className='member-overlay text'>
                <span>
                    {props.description || "No description available."}
                </span>
            </div>
        </figure>
    );
}

export default Member;
