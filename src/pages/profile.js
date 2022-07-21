import { useParams, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getUserByUsername } from '../services/firebase';
import * as ROUTES from '../constants/routes';
import Header from '../components/header';
import UserProfile from '../components/profile';
 
export default function Profile() {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const history = useHistory();
    const [imageContainer, setImageContainer] = useState('');

    const imageContainerFunc = (a) => {
        setImageContainer(a)
    }
    
    useEffect(() => {
        async function checkUserExists() {
            const [user] = await getUserByUsername(username);
            if (user?.userId) {
                setUser(user);
            } else {
                history.push(ROUTES.NOT_FOUND);
            }
        }

        checkUserExists();
    }, [username, history]);

    return user?.username ? (
        <div className="bg-gray-background">
            <Header imageContainer={imageContainer} userImage={imageContainer}/>
            <UserProfile user={user} setImageContainer={imageContainerFunc} />
        </div>
    ) : null;
}