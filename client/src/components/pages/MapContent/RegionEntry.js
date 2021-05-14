import React, { useState }                              from 'react';
import { WNavItem, WInput, WButton, WRow, WCol }        from 'wt-frontend';
import { useHistory }                                   from 'react-router-dom';

const RegionEntry = (props) => {
    const [editName, toggleEditName] = useState(false);
    const [editCapital, toggleEditCapital] = useState(false);
    const [editLeader, toggleEditLeader] = useState(false);
    let history = useHistory();

    const deleteSubRegion = () => {
        props.deleteRegion(props._id);
    }

    const goToViewer = () => {
        history.push("/maps/" + props.region.name + "/" + props.region._id);
        props.handleSelectViewer(props.entry);
    }

    const handleNameSubmit = (e) => {
        e.stopPropagation();
        toggleEditName(!editName); 
        const { name, value } = e.target;
        console.log(value);
        props.updateRegion(props._id, "name", value);
    }

    const handleCapitalSubmit = (e) => {
        e.stopPropagation();
        toggleEditCapital(!editCapital);
        const { name, value } = e.target;
        console.log(value);
        props.updateRegion(props._id, "capital", value);
    }

    const handleLeaderSubmit = (e) => {
        e.stopPropagation();
        toggleEditLeader(!editLeader);
        const { name, value } = e.target;
        console.log(value);
        props.updateRegion(props._id, "leader", value);
    }

    return (
        <WRow className="regionEntry">
            <WCol size="2" className="entryNameTop">
                <div className="nameButton"> 
                    <WButton className="entryClose" wType="texted" clickAnimation={props.disabled ? "" : "ripple-light" } onClick={deleteSubRegion}>
                        <i className="material-icons">close</i>
                    </WButton>
                    {
                        editName ? 
                        <WInput onBlur={handleNameSubmit} defaultValue={props.name} className="regionEdit"/>
                        :
                        <div className="entryName" onClick={() => toggleEditName(!editName)}>{props.name}</div>
                    }
                </div>
            </WCol>
            <WCol size="2" className="entryCapital">
                {
                    editCapital 
                    ? 
                    <WInput onBlur={handleCapitalSubmit} defaultValue={props.entry.capital} className="regionEdit"/>
                    :
                    <div onClick={() => toggleEditCapital(!editCapital)}>{props.entry.capital}</div>
                }
            </WCol>
            <WCol size="2" className="entryLeader">
                {
                    editLeader
                    ? 
                    <WInput onBlur={handleLeaderSubmit} defaultValue={props.entry.leader} className="regionEdit"/>
                    :
                    <div onClick={() => toggleEditLeader(!editLeader)}>{props.entry.leader}</div>
                }
            </WCol>
            <WCol size="2" className="entryFlag">
                <img src={"/Flags/" + props.name + " Flag.png"} alt="No Flag" className="flagImage"/>
            </WCol>
            <WCol size="4" className="entryLandmarks" onClick={goToViewer}>
                ...
            </WCol>
        </WRow>
    );
};

export default RegionEntry;