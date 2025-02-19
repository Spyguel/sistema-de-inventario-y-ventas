// ButtonSidebar.js
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export const ButtonSidebar = ({ item, open }) => {
  const navigate = useNavigate();
  const Icon = item.icon;

  const handleClick = () => {
    if (item.path === '/logout') {
      localStorage.removeItem('token');
      localStorage.removeItem('rol');
      navigate('/login');
    } else {
      navigate(item.path);
    }
  };

  return (
    <li
      className={`flex rounded-md p-2 cursor-pointer hover:bg-accent-soft-blue text-text-primary text-sm items-center gap-x-4 ${item.gap ? 'mt-9' : 'mt-2'}`}
      onClick={handleClick}
    >
      <div className="flex items-center gap-x-4 w-full">
        <Icon className="w-6 h-6" />
        <span className={`${!open && 'hidden'} origin-left duration-200`}>
          {item.title}
        </span>
      </div>
    </li>
  );
};

ButtonSidebar.propTypes = {
  item: PropTypes.shape({
    icon: PropTypes.elementType.isRequired,
    path: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    gap: PropTypes.bool,
  }).isRequired,
  open: PropTypes.bool.isRequired,
};

export default ButtonSidebar;