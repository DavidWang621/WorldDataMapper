import Logo 							from '../navbar/Logo';
import globe 							from '../../pictures/globeRed.jpg';
import Login 							from '../modals/Login';
import Delete 							from '../modals/Delete';
import UpdateAccount					from '../modals/UpdateAccount';
import CreateAccount 					from '../modals/CreateAccount';
import NavbarOptions 					from '../navbar/NavbarOptions';
import * as mutations 					from '../../cache/mutations';
import MapTableContent					from './MapContent/MapTableContents';
import { GET_DB_MAPS } 					from '../../cache/queries';
import React, { useState } 				from 'react';
import { useMutation, useQuery } 		from '@apollo/client';
import { WNavbar, WSidebar, WNavItem } 	from 'wt-frontend';
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
	const [showDelete, toggleShowDelete] 	= useState(false);
	const [showLogin, toggleShowLogin] 		= useState(false);
	const [showCreate, toggleShowCreate] 	= useState(false);
	const [showUpdate, toggleShowUpdate]	= useState(false);

    const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);
    if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { 
		for(let map of data.getAllMaps) {
			maplists.push(map)
		}
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
		toggleShowDelete(false);
		toggleShowCreate(false);
		toggleShowUpdate(false);
		toggleShowLogin(!showLogin);
	};

	const setShowCreate = () => {
		toggleShowDelete(false);
		toggleShowLogin(false);
		toggleShowUpdate(false);
		toggleShowCreate(!showCreate);
	};

	const setShowDelete = () => {
		toggleShowCreate(false);
		toggleShowLogin(false);
		toggleShowUpdate(false);
		toggleShowDelete(!showDelete);
	};

	const setShowUpdate = () => {
		toggleShowCreate(false);
		toggleShowLogin(false);
		toggleShowDelete(false);
		toggleShowUpdate(!showUpdate);	
	};

	const createNewMap = async () => {
		let list = {
			_id: '',
			name: 'untitled',
			owner: props.user._id,
			regions: []
		}
		const { data } = await addMap({ variables: { map: list }, refetchQueries: [{ query: GET_DB_MAPS}]});
		if (data) {
			console.log("Added new map");
		}
	}

    return (
		<WLayout wLayout="header-side">
			<WLHeader>
				<WNavbar color="colored">
					<ul>
						<WNavItem>
							<Logo className='logo' />
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
            {showUpdate ? 
			<UpdateAccount fetchUser={props.fetchUser} setShowUpdate={setShowUpdate} user={props.user}/>
			:
			(<>
			<div className="mapTitleCol">Your Maps</div>
            <div className="mapTitleCol2"></div>
            <div className="mapTableContent">
				<MapTableContent 
					maplist={simpMapLists}
				/>
			</div>
            <div className="rightSide">
                <img src={globe} alt="globe" className="mapGlobe"/>
                <WButton className="newMapButton" span="true" clickAnimation="ripple-light" hoverAnimation="darken" color="danger" raised="false" onClick={createNewMap}>
                    Create New Map
                </WButton>
            </div>
			</>)}	
		</WLayout>
    );
}

export default Maps;