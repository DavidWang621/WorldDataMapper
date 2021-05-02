import React, {useState}                                from 'react';
import { WLayout, WLHeader, WLMain, WLSide, WButton }   from 'wt-frontend';
import { WNavbar, WSidebar, WNavItem }                 	from 'wt-frontend';
import Logo 							                from '../../navbar/Logo';
import NavbarOptions                                    from '../../navbar/NavbarOptions';
import { useMutation, useQuery } 		                from '@apollo/client';
import { GET_DB_MAPS } 					                from '../../../cache/queries';
import UpdateAccount                                    from '../../modals/UpdateAccount';


const RegionSpreadsheet = (props) => {

    const auth = props.user === null ? false : true;

    const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);

	const [showLogin, toggleShowLogin] 		= useState(false);
	const [showCreate, toggleShowCreate] 	= useState(false);
	const [showUpdate, toggleShowUpdate]	= useState(false);

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
            <div>
                Hey!
            </div>
            }
        </WLayout>
    );
};

export default RegionSpreadsheet;