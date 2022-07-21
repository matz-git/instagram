import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import useUser from '../../hooks/use-user';
import { isUserFollowingProfile, toggleFollow, updateLoggedInUserProfileImage } from '../../services/firebase';
import UserContext from '../../context/user';
import { storage } from '../../lib/firebase';


export default function Header({ 
    photosCount, 
    setFollowerCount,
    followerCount, 
    handleUpd,
    profile: {
        docId: profileDocId,
        userId: profileUserId,
        fullName,
        followers, // in production DONT parse all followers (e.g. followers > 1m)
        following, // in production DONT parse all followings (e.g. followings > 1m)
        username: profileUsername,
        profileImage: profilImageNew
    }
}) {
    const { user: loggedInUser } = useContext(UserContext);
    const { user } = useUser(loggedInUser?.uid);
    const [isFollowingProfile, setIsFollowingProfile] = useState(false);
    const activeBtnFollow = user && user.username && user.username !== profileUsername;
    const [activeBtnUpload, setActiveBtnUpload] = useState();
    const [profileImage, setProfileImage] = useState('');
    const [file, setFile] = useState(null);

    const handleToggleFollow = async () => {
        setIsFollowingProfile((isFollowingProfile) => !isFollowingProfile);
        setFollowerCount({
            followerCount: isFollowingProfile ? followerCount - 1 : followerCount + 1
        }); 
        await toggleFollow(isFollowingProfile, user.docId, profileDocId, profileUserId, user.userId);
    };
    
    if (typeof profileImage === 'undefined')
        setProfileImage('/images/avatars/stefan.jpg')

    useEffect(() => {
        const isLoggedInUserFollowingProfile = async () => {
            const isFollowing = await isUserFollowingProfile(user.username, profileUserId)
            setIsFollowingProfile(!!isFollowing);
        }

        if (user?.username && profileUserId) {
            isLoggedInUserFollowingProfile();
        }
      
        setProfileImage(profilImageNew)

    }, [user?.username, profileUserId, profilImageNew]);


    async function handleUpload(e) {
        e.preventDefault();
        const path = `/images/${file.name}`;
        const ref = storage.ref(path);
    
        await ref.put(file);
        const url = await ref.getDownloadURL();
        updateLoggedInUserProfileImage(profileDocId, url)
        setProfileImage(url)
        setFile(null);
        handleUpd(url);
        setActiveBtnUpload(false) 
    }

    function handleChange(e) {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
            setActiveBtnUpload(true)
        }
    }

    return <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
        <div className="container flex justify-center items-center">
            {profileUsername ? (
                <img
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src='/images/avatars/stefan.jpg';
                    }}
                    className="rounded-full h-40 w-40 flex`"
                    alt={`${profileUsername} profile pic`}
                    src={profileImage}
                />
            ) : (
                <p />
            )}
        </div>
        <div className="flex items-center justify-center flex-col col-span-2">
            <div className="container flex items-center">
                <p className="text-2xl mr-4">{profileUsername}</p>
                {!activeBtnFollow && ( 
                <form onSubmit={handleUpload}>
                    <input type="file" onChange={handleChange} />
                    { activeBtnUpload && (<button  className="bg-blue-medium font-bold text-sm rounded text-white w-20 h-8"type="submit" disabled={!file}>upload</button>)}
                </form>
                )}
                {activeBtnFollow && (
                    <button
                        className="bg-blue-medium font-bold text-sm rounded text-white w-20 h-8"
                        type="button"
                        onClick={handleToggleFollow}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                handleToggleFollow();
                            }
                        }}
                    >
                        {isFollowingProfile ? 'Unfollow' : 'Follow'}
                    </button>
                )}
            </div>
            <div className="container flex mt-4">
                {!followers || !following ? (
                    <Skeleton count={1} width={677} height={24} />
                ) : (
                    <>
                        <p className="mr-10">
                            <span className="font-bold">{photosCount} </span>
                            Photos
                        </p>
                        <p className="mr-10">
                            <span className="font-bold">{followerCount} </span>
                            {followerCount === 1 ? 'Follower' : 'Followers'}
                        </p>
                        <p className="mr-10">
                            <span className="font-bold">{following.length} </span>
                            Following
                        </p>
                    </>
                )}
            </div>
            <div className="container mt-4">
                    <p className="font-medium">
                        {!fullName ? <Skeleton count={1} height={24} /> : fullName}
                    </p>

            </div>
        </div>
    </div>;
} 

Header.propTypes = {
    photosCount: PropTypes.number.isRequired, 
    handleUpd: PropTypes.func, 
    followerCount: PropTypes.number.isRequired,
    setFollowerCount: PropTypes.func.isRequired,
    profile: PropTypes.shape({
        docId: PropTypes.string,
        userId: PropTypes.string,
        fullName: PropTypes.string,
        username: PropTypes.string,
        following: PropTypes.array,
        followers: PropTypes.array,
        profileImage: PropTypes.string
    }).isRequired,
};