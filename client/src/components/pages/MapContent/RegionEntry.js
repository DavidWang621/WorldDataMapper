import React, { useState, useEffect }                   from 'react';
import { WNavItem, WInput, WButton, WRow, WCol }        from 'wt-frontend';
import { useHistory }                                   from 'react-router-dom';

const RegionEntry = (props) => {
    const [editName, toggleEditName] = useState(false);
    const [editCapital, toggleEditCapital] = useState(false);
    const [editLeader, toggleEditLeader] = useState(false);
    let history = useHistory();

    // const keyCombination = (e) => {
	// 	if(e.keyCode == 37) {
    //         console.log(editCapital);
    //         if (editCapital) {
    //             console.log(e.target.value);
    //         }
	// 	}
	// 	else if (e.keyCode === 37 && editLeader) { 
	// 		console.log(e.target.value);
	// 	}
	// }
	// document.onkeydown = keyCombination;

    const pressKey = (e) => {
		if (e.keyCode === 37 && editCapital) {
			console.log(e.target.value);
            handleCapitalSubmit(e);
            toggleEditName(!editName);
		} else if (e.keyCode === 37 && editLeader) {
			console.log(e.target.value);
            handleLeaderSubmit(e);
            toggleEditCapital(!editCapital)
		} else if (e.keyCode === 39 && editName) {
            console.log(e.target.value);
            handleNameSubmit(e);
            toggleEditCapital(!editCapital);
        } else if (e.keyCode === 39 && editCapital) {
            console.log(e.target.value);
            handleCapitalSubmit(e);
            toggleEditLeader(!editLeader);
        }
	}

	useEffect(() => {
		document.addEventListener("keydown", pressKey);
		return () => document.removeEventListener("keydown", pressKey);
	});

    const deleteSubRegion = () => {
        props.deleteRegion(props._id);
    }

    const goToViewer = () => {
        props.tps.clearAllTransactions();
        // history.push("/maps/" + props.region.name + "/" + props.region._id);
        props.handleSelectViewer(props.entry);
    }

    const handleNameSubmit = (e) => {
        e.stopPropagation();
        toggleEditName(!editName); 
        const { name, value } = e.target;
        console.log(value);
        props.updateRegion(props._id, "name", value, props.name);
    }

    const handleCapitalSubmit = (e) => {
        e.stopPropagation();
        toggleEditCapital(!editCapital);
        const { name, value } = e.target;
        console.log(value);
        props.updateRegion(props._id, "capital", value, props.entry.capital);
    }

    const handleLeaderSubmit = (e) => {
        e.stopPropagation();
        toggleEditLeader(!editLeader);
        const { name, value } = e.target;
        console.log(value);
        props.updateRegion(props._id, "leader", value, props.entry.leader);
    }

    let landmarks = props.entry.landmarks;
    let displayLandmark = "...";
    if (landmarks.length > 0) {
        displayLandmark = landmarks[0] + ",...";
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
                {displayLandmark}
            </WCol>
        </WRow>
    );
};

export default RegionEntry;