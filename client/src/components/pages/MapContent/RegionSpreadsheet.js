import React, {useState}                                from 'react';
import { WLayout, WLHeader, WLMain, WLSide, WButton }   from 'wt-frontend';
import { WNavbar, WSidebar, WNavItem, WRow, WCol }      from 'wt-frontend';
import Logo 							                from '../../navbar/Logo';
import NavbarOptions                                    from '../../navbar/NavbarOptions';
import { useMutation, useQuery } 		                from '@apollo/client';
import { GET_DB_MAPS } 					                from '../../../cache/queries';
import UpdateAccount                                    from '../../modals/UpdateAccount';
import RegionTableContents                              from './RegionTableContents';
import * as mutations 					                from '../../../cache/mutations';
import RegionViewer                                     from './RegionViewer';
import { Route }                                        from 'react-router-dom';
import { AddListItems_Transaction, 
    EditListItems_Transaction, 
    SortListItems_Transaction, 
    DeleteListItems_Transaction }                       from '../../../utils/jsTPS';

const RegionSpreadsheet = (props) => {

    const auth = props.user === null ? false : true;

	const [showLogin, toggleShowLogin] 		        = useState(false);
	const [showCreate, toggleShowCreate] 	        = useState(false);
	const [showUpdate, toggleShowUpdate]	        = useState(false);
    const [landmarkSelect, toggleLandmarkSelect]    = useState(true);
    const [regionEntry, toggleRegionEntry]          = useState({});
    const [canUndo, setCanUndo]                     = useState(props.tps.hasTransactionToUndo());
	const [canRedo, setCanRedo]                     = useState(props.tps.hasTransactionToRedo());

    const [addRegion]				        = useMutation(mutations.ADD_REGION);
    const [updateRegion]                    = useMutation(mutations.UPDATE_REGION);
    const [deleteRegion]                    = useMutation(mutations.DELETE_REGION);
    const [sortRegion]                      = useMutation(mutations.SORT_REGION);

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

    let regions = props.region.regions;
    let maps = [];
    const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);
    if (data) {
        for(let map of data.getAllMaps) {
			if (props.region._id === map._id) {
                maps = map.regions;
            }
		}
    }

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

    const addSubRegion = async () => {
        let region = {
            _id: '',
            name: 'Untitled',
            capital: 'Untitled',
            leader: 'Untitled',
            landmarks: []
        }
        let temp = [{ query: GET_DB_MAPS }];
        let mapId = props.region._id;
        let transaction = new AddListItems_Transaction(mapId, region, addRegion, deleteRegion, temp);
        props.tps.addTransaction(transaction);
        tpsRedo();
        // const { data } = await addRegion({ variables: { region: region, _id: props.region._id, index: -1 }});
		// if (data) {
		// 	console.log("Added new region");
		// }
		// props.reloadMap();
    }

    const updateRegionField = async (itemId, field, value, oldValue) => {
        console.log("itemId", itemId);
        console.log("field", field);
        console.log("value", value);
        console.log("mapId", props.region._id);
        let transaction = new EditListItems_Transaction(props.region._id, itemId, value, field, oldValue, updateRegion);
        props.tps.addTransaction(transaction);
        tpsRedo();
        // const { data } = await updateRegion({ variables: { mapId: props.region._id, _id: itemId, value: value, field: field}});
		// if (data) {
		// 	console.log("Updated region");
		// }
		// props.reloadMap();
    }

    const deleteRegionField = async (itemId) => {
        console.log("itemId", itemId);
        console.log("mapId", props.region._id);
        console.log(maps);
        let index = -1;
        let tempRegion = null;
        for (let i = 0; i < maps.length; i++) {
            if (itemId === maps[i]._id){
                index = i;
                tempRegion = maps[i];
            }
        }
        console.log(index);
        console.log(tempRegion);
        let transaction = new DeleteListItems_Transaction(props.region._id, itemId, index, tempRegion, addRegion, deleteRegion);
        props.tps.addTransaction(transaction);
        tpsRedo();
        // const { data } = await deleteRegion({ variables: { mapId: props.region._id, itemId: itemId}});
        // if (data) {
        //     console.log("Deleted region");
        // }
        // props.reloadMap();
    }

    const sortRegionField = async (field) => {
        const itemToSort = maps;
        let order = isInIncreasingOrder(itemToSort, field);
        console.log(order);
        console.log(maps);
        // const { data } = await sortRegion({ variables: { _id: props.region._id, criteria: field, order: order}});
        // if (data) {
        //     console.log("Sorted region");
        // }
        // props.reloadMap();
        let transaction = new SortListItems_Transaction(props.region._id, field, order, sortRegion);
        props.tps.addTransaction(transaction);
        tpsRedo();
    }

    const isInIncreasingOrder = (items, criteria) => {
        for (let i = 0; i < items.length - 1; i++) {
			if (items[i][criteria] > items[i + 1][criteria]) {
				return false;
			}
		}
		return true;
    }

    const selectLandmark = (entry) => {
        toggleRegionEntry(entry);
        toggleLandmarkSelect(false);
    }

    return (
        <WLayout wLayout="header-side">
            {
            landmarkSelect ?

            !showUpdate &&
            <>
            <WLHeader>
				<WNavbar color="colored">
					<ul>
						<WNavItem>
							<Logo className='logo' toggleMap={props.toggleMapSelect} user={props.user} tps={props.tps}/>
						</WNavItem>
					</ul>
					<ul>
						<NavbarOptions
							fetchUser={props.fetchUser} 	auth={auth} 
							setShowCreate={setShowCreate} 	setShowLogin={setShowLogin}
                            user={props.user}				setShowUpdate={setShowUpdate}
						/>
					</ul>
				</WNavbar>
			</WLHeader>
            <div className="regionTopArea">
                <WButton className="regionAdd" wType="texted" clickAnimation={props.disabled ? "" : "ripple-light" } onClick={addSubRegion}>
                        <i className="material-icons">add</i>
                </WButton>
                <WButton className="regionUndoRedo" wType="texted" clickAnimation={props.disabled ? "" : "ripple-light" } onClick={tpsUndo}>
                    <i className="material-icons">undo</i>
                </WButton>
                <WButton className="regionUndoRedo" wType="texted" clickAnimation={props.disabled ? "" : "ripple-light" } onClick={tpsRedo}>
                    <i className="material-icons">redo</i>
                </WButton>
                <div className="regionArea">
                    <div className="regionNameTitle">
                        Region Name:
                    </div>
                    <div className="regionName">
                        {props.region.name}
                    </div>
                </div>
            </div>
            <WRow className="topLabel labels">
                <WCol size="2" className="topArea" onClick={() => sortRegionField("name")}>
                    Name
                </WCol>
                <WCol size="2" className="topArea" onClick={() => sortRegionField("capital")}>
                    Capital
                </WCol>
                <WCol size="2" className="topArea" onClick={() => sortRegionField("leader")}>
                    Leader
                </WCol>
                <WCol size="2" className="topArea">
                    Flag
                </WCol>
                <WCol size="4" className="topArea">
                    Landmarks
                </WCol>
            </WRow>
            <div className="regionSection">
                <RegionTableContents region={maps} regionInfo={props.regionInfo}    
                handleSelectViewer={selectLandmark} updateRegion={updateRegionField}
                deleteRegion={deleteRegionField} tps={props.tps}/>
            </div>
            </>
            :
            <Route
				// path={"/maps/" + tempRegion.name}
				path={"/maps/" + props.regionInfo.name + "/" + props.regionInfo._id}
				name={"region" + props.regionInfo.name}
				render={() => <RegionViewer reload={refetch} user={props.user} fetchUser={props.fetchUser} 
                toggleMap={props.toggleMapSelect} region={props.region} subregion={regionEntry} toggleLandmark={toggleLandmarkSelect} tps={props.tps} />}
			>
			</Route>
            }

            {
                showUpdate && <UpdateAccount fetchUser={props.fetchUser} setShowUpdate={setShowUpdate} user={props.user}/>
            }
        </WLayout>
    );
};

export default RegionSpreadsheet;