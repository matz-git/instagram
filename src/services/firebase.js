import {firebase,FieldValue} from '../lib/firebase';

export async function doesUsernameExist(username) {
    const result = await firebase
        .firestore()
        .collection('users')
        .where('username', '==', username)
        .get();

        // console.log(result);

        return result.docs.map((user) => user.data().length > 0);
}

export async function getUserByUsername(username) {
    const result = await firebase
        .firestore()
        .collection('users')
        .where('username', '==', username)
        .get();

        // console.log(result);

    return result.docs.map((item) => ({
        ... item.data(),
        docId: item.id
    }));

    // return user.length > 0 ? user : false;
}

// get user from the firestore where userId === userId (passed from the auth)
export async function getUserByUserId(userId) {
    const result = await firebase
        .firestore()
        .collection('users')
        .where('userId', '==', userId)
        .get();

        // ... nachschauen + docId???
        const user = result.docs.map((item) => ({
            ... item.data(),
            docId: item.id
        }));

    return user;
}

export async function getSuggestedProfiles(userId, following) {
    const result = await firebase
        .firestore()
        .collection('users')
        .limit(10)
        .get();

    return result.docs
        .map((user) => ({ ... user.data(), docId: user.id }))
        .filter((profile) => profile.userId !== userId && !following.includes(profile.userId));
        // ... nachschauen + docId???
        // const user = result.docs.map((item) => ({
        //     ... item.data(),
        //     docId: item.id
        // }));
}

// updateLoggedInUserFollowing, updateFollowedUserFollowers
export async function updateLoggedInUserFollowing(
    loggedInUserDocId, // currently logged in user document id (stefan´s profile)
    profileId, // the user that karl requests to follow
    isFollowingProfile // true/false (am i currently following this person?)
) {
    return firebase
        .firestore()
        .collection('users')
        .doc(loggedInUserDocId)
        .update({
            following: isFollowingProfile
                ? FieldValue.arrayRemove(profileId)
                : FieldValue.arrayUnion(profileId)
        });
}

// updateLoggedInUserFollowing, updateFollowedUserFollowers
export async function updateFollowedUserFollowers(
    profileDocId, // the user that karl requests to follow
    loggedInUserDocId, // currently logged in user document id (stefan´s profile)
    isFollowingProfile // true/false (am i currently following this person?)
) {
    return firebase
        .firestore()
        .collection('users')
        .doc(profileDocId)
        .update({
            followers: isFollowingProfile
                ? FieldValue.arrayRemove(loggedInUserDocId)
                : FieldValue.arrayUnion(loggedInUserDocId)
        });
}

export async function getPhotos(userId, following) {
    const result = await firebase
        .firestore()
        .collection('photos')
        .where('userId', 'in', following)
        .get();

    // console.log(result)

    const userFollowedPhotos = result.docs.map((photo) => ({
        ... photo.data(),
        docId: photo.id
    }));

    // console.log('userFoff', userFollowedPhotos);

    const photosWithUserDetails = await Promise.all(
        userFollowedPhotos.map(async (photo) => {
            let userLikedPhoto = false;
            if ( photo.likes.includes(userId) ) {
                userLikedPhoto = true;
            }
            const user = await getUserByUserId(photo.userId);
            const { username } = user[0];

            return { username, ... photo, userLikedPhoto };
        })
    );

    return photosWithUserDetails;
}
// export async function getUserIdByUsername(username) {
//     const result = await firebase
//         .firestore()
//         .collection('users')
//         .where('username', '==', username)
//         .get();

//     // ... nachschauen + docId???
//     const user = result.docs.map((item) => ({
//         ... item.data(),
//         docId: item.id
//     }));

// return user.id; 
// }

export async function getUserPhotosByUsername(username) {
    const [user] = await getUserByUsername(username);
    const result = await firebase
        .firestore()
        .collection('photos')
        .where('userId', '==', user.userId)
        .get();

    return result.docs.map((item) => ({
        ... item.data(),
        docId: item.id
    }));
    // console.log('userId', userId);
    // return 0;
}

export async function isUserFollowingProfile(loggedInUserUsername, profileUserId) {
    const result = await firebase
        .firestore()
        .collection('users')
        .where('username', '==', loggedInUserUsername)
        .where('following', 'array-contains', profileUserId)
        .get();

    const [response = {}] = result.docs.map((item) => ({
        ...item.data(),
        docId: item.id
    }));

    return response.userId;
    // console.log('response', response)
}

export async function toggleFollow(
    isFollowingProfile,
    activeUserDocId,
    profileDocId,
    profileUserId,
    followingUserId
) {
    console.log('activeUserDocId', activeUserDocId)
    console.log('profileDocId', profileDocId)
    console.log('profileUserId', profileUserId)
    console.log('followingUserId', followingUserId)
    // 1st param: karls doc id
    // 2nd param: raphaels user id
    // 3rd param: is the user following this profile? e.g. does karl follow raphael? (true/false)
    await updateLoggedInUserFollowing(activeUserDocId, profileUserId, isFollowingProfile);

    // 1st param: karls user id
    // 2nd param: raphaels doc id
    // 3rd param: is the user following this profile? e.g. does karl follow raphael? (true/false)
    await updateFollowedUserFollowers(profileDocId, followingUserId, isFollowingProfile);
}
 









