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

const RegionSpreadsheet = (props) => {

    const auth = props.user === null ? false : true;

    const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);

	const [showLogin, toggleShowLogin] 		= useState(false);
	const [showCreate, toggleShowCreate] 	= useState(false);
	const [showUpdate, toggleShowUpdate]	= useState(false);

    const [addRegion]				        = useMutation(mutations.ADD_REGION);

    let regions = props.region.regions;

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
        const { data } = await addRegion({ variables: { region: region, _id: props.region._id, index: -1 }});
		if (data) {
			console.log("Added new region");
		}
		refetch();
    }

    const undo = () => {

    }

    const redo = () => {

    }

    const printRegion = () => {
        console.log(regions);
    }

    return (
        <WLayout wLayout="header-side">
            <WLHeader>
				<WNavbar color="colored">
					<ul>
						<WNavItem>
							<Logo className='logo' toggleMap={props.toggleMapSelect}/>
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
            <>
            <div className="regionTopArea">
                <WButton className="regionAdd" wType="texted" clickAnimation={props.disabled ? "" : "ripple-light" } onClick={addSubRegion}>
                        <i className="material-icons">add</i>
                </WButton>
                <WButton className="regionUndoRedo" wType="texted" clickAnimation={props.disabled ? "" : "ripple-light" } onClick={undo}>
                    <i className="material-icons">undo</i>
                </WButton>
                <WButton className="regionUndoRedo" wType="texted" clickAnimation={props.disabled ? "" : "ripple-light" } onClick={printRegion}>
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
                <WCol size="2" className="topArea">
                    Name
                </WCol>
                <WCol size="2" className="topArea">
                    Capital
                </WCol>
                <WCol size="2" className="topArea">
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
                <RegionTableContents region={regions}/>
            </div>
            </>
            }
        </WLayout>
    );
};

export default RegionSpreadsheet;