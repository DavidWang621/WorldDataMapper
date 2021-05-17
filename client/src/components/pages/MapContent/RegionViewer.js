import React, {useState}                                                from 'react';
import { WButton, WLayout, WLHeader, WNavbar, WNavItem, WRow, WCol}     from 'wt-frontend';
import Logo 							                                from '../../navbar/Logo';
import NavbarOptions                                                    from '../../navbar/NavbarOptions';
import UpdateAccount                                                    from '../../modals/UpdateAccount';
import Delete                                                           from '../../modals/Delete';
import { useMutation, useQuery } 		                                from '@apollo/client';
import { GET_DB_MAPS } 					                                from '../../../cache/queries';
import { useHistory }                                                   from 'react-router-dom'  
import LandmarksTableContents                                           from './LandmarksTableContents';   
import * as mutations 					                                from '../../../cache/mutations';               
import WInput from 'wt-frontend/build/components/winput/WInput';
import { AddLandmark_Transaction, ChangeParent_Transaction, DeleteLandmark_Transaction, EditLandmark_Transaction } from '../../../utils/jsTPS';

const RegionViewer = (props) => {

    const [showLogin, toggleShowLogin] 		= useState(false);
	const [showCreate, toggleShowCreate] 	= useState(false);
	const [showUpdate, toggleShowUpdate]	= useState(false);
    const [landmarkValue, setLandmarkValue] = useState('');
    const [canUndo, setCanUndo]             = useState(props.tps.hasTransactionToUndo());
	const [canRedo, setCanRedo]             = useState(props.tps.hasTransactionToRedo());
    const [editParent, toggleEditParent]    = useState(false);
    const [currentParent, changeParentName] = useState(props.region.name);
    const [mapDelete, setMapDelete]         = useState(false);
    const [deleteValue, SetDeleteValue]     = useState('');

    const [addLandmark]				        = useMutation(mutations.ADD_LANDMARK);
    const [deleteLandmark]                  = useMutation(mutations.DELETE_LANDMARK);
    const [updateLandmark]                  = useMutation(mutations.UPDATE_LANDMARK);
    const [updateParent]                    = useMutation(mutations.UPDATE_PARENT);

    const keyCombination = (e, callback) => {
		if(e.key === 'z' && e.ctrlKey) {
			if(props.tps.hasTransactionToUndo()) {
				tpsUndo();
			}
		}
		else if (e.key === 'y' && e.ctrlKey) { 
			if(props.tps.hasTransactionToRedo()) {
				tpsRedo();
			}
		}
	}
	document.onkeydown = keyCombination;

    const auth = props.user === null ? false : true;

    const tpsUndo = async () => {
		const ret = await props.tps.undoTransaction();
		if(ret) {
			setCanUndo(props.tps.hasTransactionToUndo());
			setCanRedo(props.tps.hasTransactionToRedo());
		}
	}

	const tpsRedo = async () => {
		const ret = await props.tps.doTransaction();
		if(ret) {
			setCanUndo(props.tps.hasTransactionToUndo());
			setCanRedo(props.tps.hasTransactionToRedo());
		}
	}

    let maps = [];
    let landmarks = [];
    let allMaps = [];
    const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);
    if (data) {
        allMaps = data.getAllMaps;
        for(let map of data.getAllMaps) {
			if (props.region._id === map._id) {
                maps = map.regions;
            }
		}
        for (let region of maps) {
            if (props.subregion._id === region._id) {
                landmarks = region.landmarks
            }
        }
    }

    let history = useHistory();

    const setShowLogin = () => {
		toggleShowCreate(false);
		toggleShowUpdate(false);
		toggleShowLogin(!showLogin);
	};

	const setShowCreate = () => {
		toggleShowLogin(false);
		toggleShowUpdate(false);
		toggleShowCreate(!showCreate);
	};

	const setShowUpdate = () => {
		toggleShowCreate(false);
		toggleShowLogin(false);
		toggleShowUpdate(!showUpdate);	
	};

    const moveToSheet = () => {
        props.toggleLandmark(true);
        // props.mapSelect(true);
        // history.push("/maps/" + currentParent);
        props.moveSheet("/maps/" + currentParent);
    }

    const myChangeHandler = (e) => {
        setLandmarkValue(e.target.value);
    }

    const addLandmarkField = async () => {
        if (landmarkValue !== '') {
            setLandmarkValue('');
            // console.log(props.region._id);
            // console.log(props.subregion._id);
            // console.log(landmarkValue);
            // const { data } = await addLandmark({variables: {mapId: props.region._id, regionId: props.subregion._id, value: landmarkValue, index: -1}});
            // if (data) {
            //     console.log("Updated landmark", data);
            // }
            // console.log(props.region._id);
            // console.log(props.subregion._id);
            // console.log(landmarkValue);
            let transaction = new AddLandmark_Transaction(props.region._id, props.subregion._id, landmarkValue, -1, addLandmark, deleteLandmark);
            props.tps.addTransaction(transaction);
            tpsRedo();
        }
    }

    const deleteLandmarkField = async (value) => {
        let index = -1;
        for (let i = 0; i < landmarks.length; i++) {
            if (landmarks[i] === value) {
                index = i;
            }
        }
        // const { data } = await deleteLandmark({variables: {mapId: props.region._id, regionId: props.subregion._id, value: value}});
        // if (data) {
        //     console.log("Deleted landmark", data);
        // }
        let transaction = new DeleteLandmark_Transaction(props.region._id, props.subregion._id, value, index, addLandmark, deleteLandmark);
        props.tps.addTransaction(transaction);
        tpsRedo();
    }

    const updateLandmarkField = async (value, oldValue) => {
        // console.log(props.region._id);
        // console.log("regionId", props.subregion._id);
        // console.log(value);
        // console.log(oldValue);
        // const { data } = await updateLandmark({variables: {mapId: props.region._id, regionId: props.subregion._id, value: value, oldValue: oldValue}});
        // if (data) {
        //     console.log("Updated landmark", data);
        // }
        let transaction = new EditLandmark_Transaction(props.region._id, props.subregion._id, value, oldValue, updateLandmark);
        props.tps.addTransaction(transaction);
        tpsRedo();
    }

    const handleParentChange = (e) => {
        const { name, value } = e.target;
        toggleEditParent(!editParent);
        for (let map of allMaps) {
            if (map.name === value) {
                changeParent(value, map._id);
            }
        }
    }

    const changeParent = async (value, mapId) => {
        let region = {
            _id: props.subregion._id,
            name: props.subregion.name,
            capital: props.subregion.capital,
            leader: props.subregion.leader,
            landmarks: landmarks
        }
        // // let transaction = new ChangeParent_Transaction(props.region._id, mapId, region, updateParent);
        // // props.tps.addTransaction(transaction);
        // // tpsRedo();
        // const { data } = updateParent({variables: {oldMapId: props.region._id, newMapId: mapId, region: region}});
        // if (data) {
        //     console.log("Changed region");
        // }
        props.changeParentField(props.region._id, mapId, region);
        changeParentName(value);
        // history.push("/maps/" + value + "/" + props.subregion.name);
    }

    const setShowDelete = (value) => {
        setMapDelete(value);
    }

    const mapDel = (value) => {
        SetDeleteValue(value);
        setMapDelete(true);
    }

    const goBack = () => {
        console.log(props.subregion);
        let index = -1;
        for (let i = 0; i < maps.length; i++) {
            if (maps[i]._id === props.subregion._id) {
                index = i;
            }
        }
        if (index > 0) {
            let temp = null;
            for (let i = 0; i < maps.length; i++) {
                if (i === index - 1) {
                    temp = maps[i];
                }
            }
            props.goBackward(temp);
            props.toggleRegion(temp);
        }
    }

    const goForward = () => {
        console.log(props.subregion);
        let index = -1;
        for (let i = 0; i < maps.length; i++) {
            if (maps[i]._id === props.subregion._id) {
                index = i;
            }
        }
        console.log(index);
        console.log(maps.length);
        if (index < maps.length-1) {
            let temp = null;
            for (let i = 0; i < maps.length; i++) {
                if (i === index + 1) {
                    temp = maps[i];
                }
            }
            props.goForward(temp);
            props.toggleRegion(temp);
        }
    }

    const checkBackLength = () => {
        let index = -1;
        for (let i = 0; i < maps.length; i++) {
            if (maps[i]._id === props.subregion._id) {
                index = i;
            }
        }
        if (index <= 0) {
            return false;
        }
        return true;
    }

    const checkForwardLength = () => {
        let index = -1;
        for (let i = 0; i < maps.length; i++) {
            if (maps[i]._id === props.subregion._id) {
                index = i;
            }
        }
        if (index >= maps.length-1) {
            return false;
        }
        return true;
    }

    return (
        <WLayout wLayout="header-side">
            <>
			<WLHeader>
				<WNavbar color="colored">
					<ul>
						<WNavItem>
							<Logo className='logo' toggleMap={props.toggleMap} user={props.user} tps={props.tps}/>
						</WNavItem>
					</ul>
                    <ul>
                        <div className="parentRegion">
                            {props.region.name}  {">"}  {props.subregion.name}
                        </div>
                    </ul>
                    <ul>
                        <WButton className="viewerArrow" disabled={!checkBackLength()}wType="texted" clickAnimation={props.disabled ? "" : "ripple-light" } onClick={goBack}>
                            <i className="material-icons">arrow_back</i>
                        </WButton>
                        <WButton className="viewerArrow" disabled={!checkForwardLength()} wType="texted" clickAnimation={props.disabled ? "" : "ripple-light" } onClick={goForward}>
                            <i className="material-icons">arrow_forward</i>
                        </WButton>
                    </ul>
					<ul>
						<NavbarOptions
							fetchUser={props.fetchUser} 	auth={auth} 
							setShowCreate={setShowCreate} 	setShowLogin={setShowLogin}
							reloadTodos={props.reload}           user={props.user}				
                            setShowUpdate={setShowUpdate}
						/>
					</ul>
				</WNavbar>
                <div className="viewerTop">
                    <WButton className="viewerUndoRedo" disabled={!props.tps.hasTransactionToUndo() } wType="texted" clickAnimation={props.disabled ? "" : "ripple-light" } onClick={tpsUndo}>
                        <i className="material-icons">undo</i>
                    </WButton>
                    <WButton className="viewerUndoRedo" disabled={!props.tps.hasTransactionToRedo()} wType="texted" clickAnimation={props.disabled ? "" : "ripple-light" } onClick={tpsRedo}>
                        <i className="material-icons">redo</i>
                    </WButton>
                    <div className="regionLandmarkTitle">
                        Region Landmarks:
                    </div>
                </div>
			</WLHeader>
            <div className="mainViewer">
                <div className="leftViewer">
                    <img src={"/Flags/" + props.subregion.name + " Flag.png"} className="viewerFlag"/>
                    <WRow>
                        <WCol size="3" className="viewerName">
                            Region Name:
                        </WCol>
                        <WCol size="2" className="nameViewer">
                            {props.subregion.name}
                        </WCol>
                        <WCol size="1"></WCol>
                    </WRow>
                    <WRow>
                        <WCol size="3" className="viewerName">
                            Parent Region:
                        </WCol>
                        <WCol size="2" className="nameViewer parentViewer">
                            {
                                editParent 
                                ?
                                <WInput onBlur={handleParentChange} defaultValue={currentParent} className="parentEdit"/>
                                :
                                <div onClick={moveToSheet}>
                                    {currentParent}
                                </div>
                            }
                        </WCol>
                        <WCol size="1">
                            <WButton wType="texted" clickAnimation={props.disabled ? "" : "ripple-light" } span={false} onClick={() => toggleEditParent(!editParent)}>
                                <i className="material-icons">edit</i>
                            </WButton>
                        </WCol>
                    </WRow>
                    <WRow>
                        <WCol size="3" className="viewerName">
                            Region Capital:
                        </WCol>
                        <WCol size="2" className="nameViewer">
                            {props.subregion.capital}
                        </WCol>
                        <WCol size="1"></WCol>
                    </WRow>
                    <WRow>
                        <WCol size="3" className="viewerName">
                            Region Leader:
                        </WCol>
                        <WCol size="2" className="nameViewer">
                            {props.subregion.leader}
                        </WCol>
                        <WCol size="1"></WCol>
                    </WRow>
                    <WRow>
                        <WCol size="3" className="viewerName">
                            # of Sub Regions:
                        </WCol>
                        <WCol size="2" className="nameViewer">
                            0
                        </WCol>
                        <WCol size="1"></WCol>
                    </WRow>
                </div>
                <div className="rightViewer">
                    <div className="landmarksContent">
                        <LandmarksTableContents landmarks={landmarks} deleteLandmark={mapDel} updateLandmark={updateLandmarkField}/>
                    </div>
                    <div className="addLandmark">
                        <WButton wType="texted" clickAnimation={props.disabled ? "" : "ripple-light" } className="addLandmarkButton" onClick={addLandmarkField}>
                            <i className="material-icons">add</i>
                        </WButton>
                        <WInput className="inputLandmark" onChange={myChangeHandler}/>
                    </div>
                </div>
            </div>
            </>
            
            {
                mapDelete && <Delete mapDelete={mapDelete} setShowDelete={setShowDelete} activeid={deleteValue} deleteList={deleteLandmarkField}/>
            }

            {
                showUpdate && <UpdateAccount fetchUser={props.fetchUser} setShowUpdate={setShowUpdate} user={props.user}/>
            }
        </WLayout>
    );
};

export default RegionViewer;