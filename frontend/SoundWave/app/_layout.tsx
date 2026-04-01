import {Stack} from 'expo-router';
import {AuthProvider} from '@/context/context';

export default function Layout() {
	return (
		<AuthProvider>
			<Stack screenOptions={{headerShown: false}}>
				<Stack.Screen name="index" options={{title: 'Home'}}/>
				<Stack.Screen name="Song" options={{title: 'Song'}}/>
				<Stack.Screen name="Album" options={{title: 'Album'}}/>
				<Stack.Screen name="Login" options={{title: 'Login'}}/>
				<Stack.Screen name="Signup" options={{title: 'Signup'}}/>
				<Stack.Screen name="Profile" options={{title: 'Profile'}}/>
				<Stack.Screen name="Settings" options={{title: 'Settings'}}/>
				<Stack.Screen name="Homepage" options={{title: 'Homepage'}}/>
			</Stack>
		</AuthProvider>
	);
}
