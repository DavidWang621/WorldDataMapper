import React, {useState}                                                from 'react';
import { WButton, WLayout, WLHeader, WNavbar, WNavItem, WRow, WCol}     from 'wt-frontend';
import Logo 							                                from '../../navbar/Logo';
import NavbarOptions                                                    from '../../navbar/NavbarOptions';
import UpdateAccount                                                    from '../../modals/UpdateAccount';
import { useMutation, useQuery } 		                                from '@apollo/client';
import { GET_DB_MAPS } 					                                from '../../../cache/queries';
import { useHistory }                                                   from 'react-router-dom'  
import LandmarksTableContents                                           from './LandmarksTableContents';   
import * as mutations 					                                from '../../../cache/mutations';               
import WInput from 'wt-frontend/build/components/winput/WInput';

const RegionViewer = (props) => {

    const [showLogin, toggleShowLogin] 		= useState(false);
	const [showCreate, toggleShowCreate] 	= useState(false);
	const [showUpdate, toggleShowUpdate]	= useState(false);
    const [landmarkValue, setLandmarkValue] = useState('');

    const [addLandmark]				        = useMutation(mutations.ADD_LANDMARK);

    const auth = props.user === null ? false : true;

    let maps = [];
    let landmarks = []
    const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);
    if (data) {
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
        history.push("/maps/" + props.region.name)
    }

    const myChangeHandler = (e) => {
        setLandmarkValue(e.target.value);
    }

    const addLandmarkField = async () => {
        setLandmarkValue('');
        console.log(props.region._id);
        console.log(props.subregion._id);
        console.log(landmarkValue);
        const { data } = await addLandmark({variables: {mapId: props.region._id, regionId: props.subregion._id, value: landmarkValue, index: -1}});
        if (data) {
            console.log("updated landmark", data);
        }
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
						<NavbarOptions
							fetchUser={props.fetchUser} 	auth={auth} 
							setShowCreate={setShowCreate} 	setShowLogin={setShowLogin}
							reloadTodos={props.reload}           user={props.user}				
                            setShowUpdate={setShowUpdate}
						/>
					</ul>
				</WNavbar>
                <div className="viewerTop">
                    <WButton className="viewerUndoRedo" wType="texted" clickAnimation={props.disabled ? "" : "ripple-light" }>
                        <i className="material-icons">undo</i>
                    </WButton>
                    <WButton className="viewerUndoRedo" wType="texted" clickAnimation={props.disabled ? "" : "ripple-light" }>
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
                        <WCol size="2" className="nameViewer parentViewer" onClick={moveToSheet}>
                            {props.region.name}
                        </WCol>
                        <WCol size="1">
                            <WButton wType="texted" clickAnimation={props.disabled ? "" : "ripple-light" } span={false}>
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
                        <LandmarksTableContents landmarks={landmarks}/>
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
                showUpdate && <UpdateAccount fetchUser={props.fetchUser} setShowUpdate={setShowUpdate} user={props.user}/>
            }
        </WLayout>
    );
};

export default RegionViewer;