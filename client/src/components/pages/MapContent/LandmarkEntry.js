import React                        from 'react';
import { WRow, WCol, WButton }      from 'wt-frontend';

const LandmarkEntry = (props) => {
    const deleteLandmark = () => {

    }

    return (
        <WRow className="landmarkEntry">
            <WCol size="2">
                <WButton className="landmarkClose" wType="texted" clickAnimation={props.disabled ? "" : "ripple-light" } onClick={deleteLandmark}>
                    <i className="material-icons">close</i>
                </WButton>
            </WCol>
            <WCol size="5" className="landmarkCol">
                <div className="landmarkValue">
                    {props.value}
                </div>
            </WCol>
        </WRow>
    );
};

export default LandmarkEntry;
