import React, { useState }                              from 'react';
import { WNavItem, WInput, WButton, WRow, WCol }        from 'wt-frontend';

const RegionEntry = (props) => {
    const deleteSubRegion = () => {

    }

    const goToViewer = () => {
        console.log("Hello");
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
                Untitled
            </WCol>
            <WCol size="4" className="entryLandmarks" onClick={goToViewer}>
                ...
            </WCol>
        </WRow>
    );
};

export default RegionEntry;