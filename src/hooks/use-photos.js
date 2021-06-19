import {useState, useEffect, useContext} from 'react';
import UserContext from '../context/user';
import { getPhotos, getUserByUserId } from '../services/firebase';

export default function usePhotos() {
    const [photos, setPhotos] = useState(null);
    const {
        user: { uid: userId = '' }
    } = useContext(UserContext);

    useEffect(() => {
        async function getTimelinePhotos() {
            //  example [2,3,4] <- 2 being raphel
            const [{ following }] = await getUserByUserId(userId);

            // console.log(following)

            let folloewdUserPhotos = [];

            // does the user actually follow people?
            if (following.length > 0) {
                folloewdUserPhotos = await getPhotos(userId, following);
            }

            // re-arrange array to be newest photos first by dateCreated
            folloewdUserPhotos.sort((a, b) => b.dateCreated - a.dateCreated);

            setPhotos(folloewdUserPhotos);
        }

        getTimelinePhotos();
        // console.log(userId);
    }, [userId]);
    
    return { photos };

}