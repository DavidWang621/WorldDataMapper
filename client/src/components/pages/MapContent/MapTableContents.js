import React                    from 'react';
import MapTableEntry            from './MapTableEntry';

const MapTableContents = (props) => {

    return (
        <>
            {
                props.maplist && 
                props.maplist.map(entry => (
                    <MapTableEntry
                        name={entry.name}   _id={entry._id}
                        key={entry._id}     updateMap={props.updateMap}
                        deleteMap={props.deleteMap}
                    />
                ))
            }
        </>
    );
};

export default MapTableContents;