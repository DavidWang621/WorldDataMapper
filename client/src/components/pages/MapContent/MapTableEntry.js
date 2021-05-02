import React, { useState }                              from 'react';
import { WNavItem, WInput, WButton, WRow, WCol }        from 'wt-frontend';
import { useHistory }                                   from 'react-router-dom';

const MapTableEntry = (props) => {
    const [editing, toggleEditing] = useState(false);
    // const [preEdit, setpreEdit] = useState(props.name);

    let history = useHistory();

    const handleEditing = (e) => {
        e.stopPropagation();
        toggleEditing(!editing);
    };

    const handleSubmit = (e) => {
        handleEditing(e);
        const { name, value } = e.target;
        console.log(value);
        props.updateMap(props._id, value);
        // history.go(0);
    }

    return (
        <WRow className="mapElement">
                <WCol size="10" className="mapEntries" onDoubleClick={handleEditing}>
                    {editing ? <WInput onBlur={handleSubmit} defaultValue={props.name} className="mapEdit"/> : props.name}
                </WCol>

            <WCol size = "2" className="mapDelete">
                <WButton className="mapDeleteButton" wType="texted" clickAnimation={props.disabled ? "" : "ripple-light" } onClick={() => props.deleteMap(props._id)}>
                    <i className="material-icons">delete</i>
                </WButton>
            </WCol>
        </WRow>
    );
};

export default MapTableEntry;