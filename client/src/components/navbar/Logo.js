import React from 'react';
import { useHistory} from 'react-router-dom';

const Logo = (props) => {
    let history = useHistory();
    const goHome = () => {
        props.toggleMap(true);
        history.push("/maps");
    }

    return (
        <div className='logo' style={{color: "red"}} onClick={goHome}>
            The World Data Mapper
        </div>
    );
};

export default Logo;