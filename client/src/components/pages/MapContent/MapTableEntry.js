import React, { useState }                  from 'react';
import { WNavItem, WInput, WButton, WRow, WCol }        from 'wt-frontend';


const MapTableEntry = (props) => {
    const [editing, toggleEditing] = useState(false);
    // const [preEdit, setpreEdit] = useState(props.name);

    // const handleEditing = (e) => {
    //     e.stopPropagation();
    //     setPreEdit(props.name);
    //     toggleEditing(!editing);
    // };
    return (
        <WRow className="mapElement">
            <WCol size="10" className="mapEntries">
                {props.name}
            </WCol>
            <WCol size = "2" className="mapDelete">
                <WButton className="mapDeleteButton" wType="texted" clickAnimation={props.disabled ? "" : "ripple-light" }>
                    <i className="material-icons">delete</i>
                </WButton>
            </WCol>
        </WRow>
    );
};

export default MapTableEntry;