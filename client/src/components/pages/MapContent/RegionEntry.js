import React, { useState }                              from 'react';
import { WNavItem, WInput, WButton, WRow, WCol }        from 'wt-frontend';
import { useHistory }                                   from 'react-router-dom';

const RegionEntry = (props) => {
    let history = useHistory();

    const deleteSubRegion = () => {

    }

    const goToViewer = () => {
        history.push("/maps/" + props.region.name + "/" + props.region._id);
        props.handleSelectViewer(props.entry);
    }

    return (
        <WRow className="regionEntry">
            <WCol size="2" className="entryNameTop">
                <WButton className="entryClose" wType="texted" clickAnimation={props.disabled ? "" : "ripple-light" } onClick={deleteSubRegion}>
                    <i className="material-icons">close</i>
                </WButton>
                <div className="entryName">{props.name}</div>
            </WCol>
            <WCol size="2" className="entryCapital">
                {props.entry.capital}
            </WCol>
            <WCol size="2" className="entryLeader">
                {props.entry.leader}
            </WCol>
            <WCol size="2" className="entryFlag">
                <img src={"/Flags/" + props.name + "Flag.png"} alt="No Flag" className="flagImage"/>
            </WCol>
            <WCol size="4" className="entryLandmarks" onClick={goToViewer}>
                ...
            </WCol>
        </WRow>
    );
};

export default RegionEntry;