import Skeleton from 'react-loading-skeleton';
import usePhotos from '../hooks/use-photos';
import Post from './post/index';

export default function Timeline() {

    const { photos } = usePhotos();

    /* eslint-disable */
    return (
        <div className="container col-span-2">
            {!photos ? ( // map function underscore?????
                    <Skeleton count={4} width={640} height={500} className="mb-5" />
                // <Po>
                //     {[ ... new Array(4)].map((_, index) => (
                //         <Skeleton key={index} count={1} width={320} height={400} />
                //     ))}
                // </Po>
            ) : photos?.length > 0 ? (
         // ) : photos && photos.length > 0  are the same as above
                photos.map((content) => <Post key={content.docId} content={content} />)
            ) : (
                <p className="text-center text-2xl">Follow people to see pictures!</p>
            )}
        </div>
    );
} 