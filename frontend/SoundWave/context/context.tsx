import React, { createContext, useState, useEffect, useContext } from 'react';
import { getStorageItemAsync, deleteStorageItemAsync } from '@/context/storage';

interface AuthContextType {
	user: any | null;
	setUser: (user: any | null) => void;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	setUser: () => {},
	logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<any | null>(null);

	useEffect(() => {
		const loadUser = async () => {
			const storedUser = await getStorageItemAsync('userData');
			if (storedUser) {
				setUser(JSON.parse(storedUser));
			}
		};
		loadUser();
	}, []);

	const logout = async () => {
		await deleteStorageItemAsync('userToken');
		await deleteStorageItemAsync('userData');
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, setUser, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);