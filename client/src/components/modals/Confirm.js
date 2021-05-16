import React, { useState } from 'react';

import { WModal, WMHeader, WMMain, WButton, WInput } from 'wt-frontend';
import WMFooter from 'wt-frontend/build/components/wmodal/WMFooter';

const Confirm = (props) => {
    const [input, setInput]         = useState('');

    const updateInput = (e) => {
        setInput(e.target.value);
    }

    const handleAdd = () => {
        props.addMap(input);
        props.setShowAdd(false);
    }

    return (
        <WModal className="add-modal" cover="true" visible={props.mapAdd}>
            <WMHeader  className="modal-header" onClose={() => props.setShowAdd(false)}>
                Add Map
			</WMHeader >

            <WMMain>
               <WInput className="" onBlur={updateInput} name="mapName" labelAnimation="up" barAnimation="solid" labelText="Map Name" wType="outlined" inputType="text" />
            </WMMain>

            <WMFooter>
                <WButton className="modal-button" onClick={handleAdd} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="danger">
                    Add
				</WButton>
                <label className="col-spacer">&nbsp;</label>
                <WButton className="modal-button" onClick={() => props.setShowAdd(false)} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="danger">
                    Cancel
				</WButton>
            </WMFooter>

        </WModal >
    );
}

export default Confirm;