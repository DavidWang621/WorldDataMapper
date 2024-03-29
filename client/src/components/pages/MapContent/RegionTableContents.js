import React, { useState }                              from 'react';
import { WNavItem, WInput, WButton, WRow, WCol }        from 'wt-frontend';
import RegionEntry                                      from './RegionEntry';

const RegionTableContents = (props) => {
    return (
        <>
            {
                props.region && 
                props.region.map(entry => (
                    <RegionEntry name={entry.name}  _id={entry._id} 
                    key={entry._id} entry={entry} region={props.regionInfo}
                    handleSelectViewer={props.handleSelectViewer} updateRegion={props.updateRegion}
                    deleteRegion={props.deleteRegion} tps={props.tps}/>
                ))
            }
        </>
    );
};

export default RegionTableContents;