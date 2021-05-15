import React                from 'react';
import LandmarkEntry        from './LandmarkEntry';

const LandmarksTableContents = (props) => {
    return (
        <div>
            <>
                {
                    props.landmarks && 
                    props.landmarks.map((value, index) => (
                        <LandmarkEntry value={value} deleteLandmark={props.deleteLandmark} updateLandmark={props.updateLandmark}/>
                    ))
                }

            </>
        </div>
    );
};

export default LandmarksTableContents;