import React, { useState, useRef, useEffect } from 'react';
import { LogOut, UserCircle2 } from 'lucide-react';

const Header = ({ title = 'Dashboard', onLogout }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex justify-between items-center bg-white border-b px-6 py-3 rounded-t-lg shadow-sm" ref={dropdownRef}>
            <h1 className="text-xl font-semibold">{title}</h1>

            <div className="relative">
                <button
                    className="p-2 rounded-full hover:bg-gray-100"
                    onClick={() => setOpen(!open)}
                >
                    <UserCircle2 className="w-6 h-6 text-gray-700" />
                </button>

                {open && (
                    <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md border w-40 z-50">
                        <button
                            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600"
                            onClick={onLogout}
                        >
                            <LogOut className="w-4 h-4" />
                            Keluar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;
