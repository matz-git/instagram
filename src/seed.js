/* eslint-disable no-plusplus */
/* eslint-disable import/prefer-default-export */
export function seedDatabase(firebase) {
    const users = [
      {
        userId: 'OxFCQDdMOraLu2v7h9ZqNOF9nLF3',
        username: 'st',
        fullName: 'st',
        emailAddress: 'st@st.st',
        following: ['2'],
        followers: ['2', '3', '4'],
        dateCreated: Date.now()
      },
      {
        userId: '2',
        username: 'raphael',
        fullName: 'Raffaello Sanzio da Urbino',
        emailAddress: 'raphael@sanzio.com',
        following: [],
        followers: ['5H8VAh8zXqYJzAnH5x8JCdq6jBX2'],
        dateCreated: Date.now()
      },
      {
        userId: '3',
        username: 'dali',
        fullName: 'Salvador Dalí',
        emailAddress: 'salvador@dali.com',
        following: [],
        followers: ['NvPY9M9MzFTARQ6M816YAzDJxZ72'],
        dateCreated: Date.now()
      },
      {
        userId: '4',
        username: 'orwell',
        fullName: 'George Orwell',
        emailAddress: 'george@orwell.com',
        following: [],
        followers: ['NvPY9M9MzFTARQ6M816YAzDJxZ72'],
        dateCreated: Date.now()
      },
      {
        userId: 'srDY8iUofyPGGApzHzfDqB7kKVg2',
        username: 'max',
        fullName: 'Max Musterman',
        emailAddress: 'max@mustermann.com',
        following: [],
        followers: [],
        dateCreated: Date.now()
      },
      {
        userId: '6',
        username: 'stefan',
        fullName: 'Stefan',
        emailAddress: 'stefan@stefan.com',
        following: [],
        followers: [],
        dateCreated: Date.now()
      }
    ];
   
    // eslint-disable-next-line prefer-const
    for (let k = 0; k < users.length; k++) {
      firebase.firestore().collection('users').add(users[k]);
    }
  
    // eslint-disable-next-line prefer-const
    for (let i = 1; i <= 5; ++i) {
      firebase
        .firestore()
        .collection('photos')
        .add({
          photoId: i,
          userId: '2',
          imageSrc: `/images/users/raphael/${i}.jpg`,
          caption: 'Saint George and the Dragon',
          likes: [],
          comments: [
            {
              displayName: 'dali',
              comment: 'Love this place, looks like my animal farm!'
            },
            {
              displayName: 'orwell',
              comment: 'Would you mind if I used this picture?'
            }
          ],
          userLatitude: '40.7128°',
          userLongitude: '74.0060°',
          dateCreated: Date.now()
        });
    }

    // eslint-disable-next-line prefer-const
    for (let i = 11; i <= 13; ++i) {
        firebase
          .firestore()
          .collection('photos')
          .add({
            photoId: i,
            userId: 'srDY8iUofyPGGApzHzfDqB7kKVg2',
            imageSrc: `/images/users/max/${i}.jpg`,
            caption: 'Image caption',
            likes: [],
            comments: [
              {
                displayName: 'dali',
                comment: 'Love this!'
              }
            ],
            userLatitude: '40.7128°',
            userLongitude: '74.0060°',
            dateCreated: Date.now()
        });
    }
    
    // eslint-disable-next-line prefer-const
    for (let i = 21; i <= 23; ++i) {
        firebase
          .firestore()
          .collection('photos')
          .add({
            photoId: i,
            userId: '6',
            imageSrc: `/images/users/stefan/${i}.jpg`,
            caption: 'pictures taken with huawei p30 pro',
            likes: [],
            comments: [],
            userLatitude: '40.7128°',
            userLongitude: '74.0060°',
            dateCreated: Date.now()
        });
    }
}