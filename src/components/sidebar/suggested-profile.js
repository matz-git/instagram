import  { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { updateLoggedInUserFollowing, updateFollowedUserFollowers } from '../../services/firebase';


export default function SuggestedProfile({ profileDocId, username, profileId, userId, loggedInUserDocId, profileImage }) {
    const [followed, setFollowed] = useState(false);

    async function handleFollowUser() {
        setFollowed(true);
        
        await updateLoggedInUserFollowing(loggedInUserDocId, profileId, false);
        await updateFollowedUserFollowers(profileDocId, userId, false);
    }

    if (typeof profileImage === 'undefined') {
        profileImage = '/images/avatars/stefan.jpg' // eslint-disable-line no-param-reassign
    }

    return !followed ? (
        <div className="flex flex-row items-center justify-between">
            <div className="flex items-center justify-between">
                <img
                    className="rounded-full w-8 flex mr-3"
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src='/images/avatars/stefan.jpg';
                    }}
                    src={profileImage}
                    alt=""
                />
                <Link to={`/p/${username}`}>
                    <p className="font-bold text-sm">{username}</p>
                </Link>
            </div>
            <button
                className="text-xs font-bold text-blue-medium"
                type="button"
                onClick={handleFollowUser}
            >
                Follow
            </button>
        </div>
    ) : null;
}

SuggestedProfile.propTypes = {
    profileDocId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    profileId: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    loggedInUserDocId: PropTypes.string.isRequired,
    profileImage: PropTypes.string
}