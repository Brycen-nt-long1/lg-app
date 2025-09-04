import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

export interface NavBarItem {
    label: string;
    href: string;
}

interface NavBarProps {
    items: NavBarItem[];
}

const Navbar: React.FC<NavBarProps> = ({ items }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [systemInfo, setSystemInfo] = useState('');

    useEffect(() => {
        const info = localStorage.getItem('system-info') || '';
        setSystemInfo(info);
    }, []);

    const handleSystemInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSystemInfo(e.target.value);
        localStorage.setItem('system-info', e.target.value);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('auth-token');
        sessionStorage.removeItem('auth-token-exp');
        localStorage.removeItem('system-info');
        setSystemInfo('');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <ul className="navbar-nav">
                {items.map((item) => (
                    <li key={item.label}>
                        <Link
                            className={`nav-link${location.pathname === item.href ? ' active' : ''}`}
                            to={item.href}
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
            <input
                type="text"
                value={systemInfo}
                onChange={handleSystemInfoChange}
                placeholder="System Info"
                style={{marginRight: 16, padding: '8px 12px', borderRadius: 6, border: '1px solid #d0d7de', fontSize: 16}}
            />
            <button onClick={handleLogout} className="logout-btn">Logout</button>
        </nav>
    );
};

export default Navbar;