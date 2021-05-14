import Logo 							from '../navbar/Logo';
import globe 							from '../../pictures/globeRed.jpg';
import Login 							from '../modals/Login';
import Delete 							from '../modals/Delete';
import UpdateAccount					from '../modals/UpdateAccount';
import CreateAccount 					from '../modals/CreateAccount';						
import NavbarOptions 					from '../navbar/NavbarOptions';
import * as mutations 					from '../../cache/mutations';
import MapTableContent					from './MapContent/MapTableContents';
import RegionSpreadsheet				from './MapContent/RegionSpreadsheet';
import RegionViewer						from './MapContent/RegionViewer';
import { GET_DB_MAPS } 					from '../../cache/queries';
import React, { useState } 				from 'react';
import { useMutation, useQuery } 		from '@apollo/client';
import { WNavbar, WSidebar, WNavItem } 	from 'wt-frontend';
import { Route, Switch }						from 'react-router-dom';
import { WLayout, WLHeader, WLMain, WLSide, WButton } from 'wt-frontend';
import { WRow, WCol } from 'wt-frontend';
import { UpdateListField_Transaction, 
	SortItems_Transaction,
	UpdateListItems_Transaction, 
	ReorderItems_Transaction, 
	EditItem_Transaction } 				from '../../utils/jsTPS';

const Maps = (props) => {
    const auth = props.user === null ? false : true;

	let maplists = [];
	let simpMapLists = [];
	// const [activeList, setActiveList]		= useState({});
	const [showLogin, toggleShowLogin] 		= useState(false);
	const [showCreate, toggleShowCreate] 	= useState(false);
	const [showUpdate, toggleShowUpdate]	= useState(false);
	const [mapSelect, toggleMapSelect]		= useState(true);
	const [regionSet, setRegionSet] 		= useState({});

    const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);
    // if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { 
		for(let map of data.getAllMaps) {
			maplists.push(map)
		}
		refetch();
	// // 	// if a list is selected, shift it to front of maplists
	// 	if(activeList._id) {
	// 		let selectedListIndex = maplists.findIndex(entry => entry._id === activeList._id);
	// 		let removed = maplists.splice(selectedListIndex, 1);
	// 		maplists.unshift(removed[0]);
	// 	}
		// create data for sidebar links
		for(let map of maplists) {
			if(map) {
				simpMapLists.push({_id: map._id, name: map.name});
			}	
		}
	}

	const [addMap]				= useMutation(mutations.ADD_MAP);
	const [deleteMap]			= useMutation(mutations.DELETE_MAP);
	const [updateMap]			= useMutation(mutations.UPDATE_MAP);

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

	const createNewMap = async () => {
		let list = {
			_id: '',
			name: 'Untitled',
			owner: props.user._id,
			regions: []
		}
		const { data } = await addMap({ variables: { map: list }, refetchQueries: [{ query: GET_DB_MAPS}]});
		if (data) {
			console.log("Added new map");
		}
		refetch();
	}

	const updateMapField = async (_id, value) => {
		const { data } = await updateMap({ variables : { _id: _id, value: value } });
		if (data) {
			console.log("Updated map");
		}
		refetch();
	}

	const deleteMapField = async (_id) => {
		const { data } = await deleteMap({ variables: { _id: _id } });
		if (data) {
			console.log("Deleted map");
		}
		refetch();
	}

	const selectMap = async (entry) => {
		// for (let i = 0; i < maplists.length; i++) {
		// 	if (maplists[i]._id === _id) {
		// 		tempRegion = maplists[i];
		// 	}
		// }
		setRegionSet(entry);
		toggleMapSelect(false);
	}

    return (
		<WLayout wLayout="header-side">
			{
			mapSelect ?

			!showUpdate &&
			<>
			<WLHeader>
				<WNavbar color="colored">
					<ul>
						<WNavItem>
							<Logo className='logo' toggleMap={toggleMapSelect} user={props.user}/>
						</WNavItem>
					</ul>
					<ul>
						<NavbarOptions
							fetchUser={props.fetchUser} 	auth={auth} 
							setShowCreate={setShowCreate} 	setShowLogin={setShowLogin}
							reloadTodos={refetch}           user={props.user}				
                            setShowUpdate={setShowUpdate}
						/>
					</ul>
				</WNavbar>
			</WLHeader>
			<div className="mapTitleCol">Your Maps</div>
            <div className="mapTitleCol2"></div>
            <div className="mapTableContent">
				<MapTableContent 
					maplist={maplists}		updateMap={updateMapField}	reloadMap={refetch}
					deleteMap={deleteMapField}		handleSelectMap={selectMap}
				/>
			</div>
            <div className="rightSide">
                <img src={globe} alt="globe" className="mapGlobe"/>
                <WButton className="newMapButton" span="true" clickAnimation="ripple-light" hoverAnimation="darken" color="danger" raised="false" onClick={createNewMap}>
                    Create New Map
                </WButton>
            </div>
			</>

			:
			<>
			<Route
				// path={"/maps/" + tempRegion.name}
				path={"/maps/" + regionSet.name}
				name={"region" + regionSet.name}
				render={() => <RegionSpreadsheet tps={props.tps} user={props.user} fetchUser={props.fetchUser} region={regionSet} toggleMapSelect={toggleMapSelect} reloadMap={refetch} regionInfo={regionSet}/>}
			>
			</Route>
			</>
			}

			{
				showUpdate && <UpdateAccount fetchUser={props.fetchUser} setShowUpdate={setShowUpdate} user={props.user}/>
			}
		</WLayout>
    );
}

export default Maps;