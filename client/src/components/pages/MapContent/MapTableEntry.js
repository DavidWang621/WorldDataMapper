import React, { useState }                  from 'react';
import { WNavItem, WInput, WButton }        from 'wt-frontend';


const MapTableEntry = (props) => {
    const [editing, toggleEditing] = useState(false);
    // const [preEdit, setpreEdit] = useState(props.name);

    // const handleEditing = (e) => {
    //     e.stopPropagation();
    //     setPreEdit(props.name);
    //     toggleEditing(!editing);
    // };
    return (
        <WNavItem>
            <div>
                {props.name}
            </div>
            <WButton className="mapDeleteButton" wType="texted" clickAnimation={props.disabled ? "" : "ripple-light" }>
                <i className="material-icons">delete_outline</i>
            </WButton>
        </WNavItem>
    );
};

export default MapTableEntry;