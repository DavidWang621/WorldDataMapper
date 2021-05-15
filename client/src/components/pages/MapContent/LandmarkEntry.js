import React, { useState }                        from 'react';
import { WRow, WCol, WButton, WInput }      from 'wt-frontend';

const LandmarkEntry = (props) => {

    const [editLandmark, toggleEditLandmark]    = useState(false);

    const deleteLandmark = () => {
        props.deleteLandmark(props.value);
    }

    const handleLandmarkSubmit = (e) => {
        e.stopPropagation();
        toggleEditLandmark(!editLandmark); 
        const { name, value } = e.target;
        console.log(value);
        props.updateLandmark(value, props.value);
    }

    return (
        <WRow className="landmarkEntry">
            <WCol size="2">
                <WButton className="landmarkClose" wType="texted" clickAnimation={props.disabled ? "" : "ripple-light" } onClick={deleteLandmark}>
                    <i className="material-icons">close</i>
                </WButton>
            </WCol>
            <WCol size="5" className="landmarkCol">
                {
                    editLandmark ? 
                    <WInput onBlur={handleLandmarkSubmit} defaultValue={props.value}/>
                    :
                    <div className="landmarkValue" onClick={() => toggleEditLandmark(!editLandmark)}>
                        {props.value}
                    </div>
                }
            </WCol>
        </WRow>
    );
};

export default LandmarkEntry;
