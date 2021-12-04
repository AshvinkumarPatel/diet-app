import LogoutIcon from '@mui/icons-material/Logout';
import { useDispatch } from 'react-redux';
import { resetUserData } from '../../reducers/user';
import { resetFoodData } from '../../reducers/food';

function Logout() {
    const dispatch = useDispatch();
    const handleLogout = () => {
        dispatch(resetUserData());
        dispatch(resetFoodData());
        localStorage.removeItem('token');
    };
    return <LogoutIcon onClick={handleLogout} />;
}

export default Logout;
