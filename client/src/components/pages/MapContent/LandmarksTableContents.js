import React                from 'react';
import LandmarkEntry        from './LandmarkEntry';

const LandmarksTableContents = (props) => {
    return (
        <div>
            <>
                {
                    props.landmarks && 
                    props.landmarks.map((value, index) => (
                        <LandmarkEntry value={value}/>
                    ))
                }

            </>
        </div>
    );
};

export default LandmarksTableContents;