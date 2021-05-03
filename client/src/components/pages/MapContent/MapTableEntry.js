import React, { useState }                              from 'react';
import { WNavItem, WInput, WButton, WRow, WCol }        from 'wt-frontend';
import { Switch, useHistory, Route }                    from 'react-router-dom';
import RegionSpreadsheet                                from './RegionSpreadsheet'

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
    }

    const selectMap = (e) => {
        props.handleSelectMap(props.entry);
        // history.push("/maps/" + props.name);
        history.push("/maps/" + props.name + "/" + props._id);
    }

    const editMap = () => {
        toggleEditing(!editing);
    }

    return (
        <WRow className="mapElement">
            <WCol size="1" className="mapEditBut">
                <WButton className="mapEditButton" wType="texted" clickAnimation={props.disabled ? "" : "ripple-light" } onClick={editMap}>
                    <i className="material-icons">edit</i>
                </WButton>
            </WCol>
            <WCol size="9" className="mapEntries">
                {editing ? <WInput onBlur={handleSubmit} defaultValue={props.name} className="mapEdit"/> : <div onClick={selectMap}>{props.name}</div>}
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