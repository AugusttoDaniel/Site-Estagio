import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState();

	useEffect(() => {
		const loadUser = async () => {
			const userToken = localStorage.getItem("token");
			if (userToken) {
				try {
					const decoded = jwtDecode(userToken);
					const user = {
						email: decoded.email,
						id: decoded.id,
					};
					setUser(user);
				} catch (error) {
					console.error("Error decoding token:", error);
					// Handle token decoding errors, e.g., by logging out the user
				}
			}
		};

		loadUser();
	}, []);

	const signin = async (email, password) => {
		try {
			const response = await fetch("https://estagio-omega.vercel.app/token/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();
			if (response.ok) {
				localStorage.setItem("token", data.token);
				return data.mensagem;
			}
		} catch (error) {
			console.error("Login error:", error);
			throw error;
		}
	};

	const signup = async (nome, email, password, telefone) => {
		try {
			// Set up the configuration for the fetch request
			const requestOptions = {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ nome, email, password, telefone })
			};
	
			// Send the signup request
			const response = await fetch('https://estagio-omega.vercel.app/usuario/criar', requestOptions);
			const data = await response.json();  // Parsing the JSON response body
	
			if (response.ok) {
				// Return the success message if the response status is OK
				return data.mensagem;  // Assuming the server sends back a 'mensagem' field on success
			} else {
				// Log and throw an error with the server-provided message or a default message
				console.error('Signup failed with status:', response.status, data.mensagem);
				throw new Error(data.mensagem || 'Failed to sign up. Please try again later.');
			}
		} catch (error) {
			// Log the error to the console and rethrow it
			console.error('Signup error:', error);
			throw error;
		}
	};
	

	const signout = () => {
		setUser(null);
		localStorage.removeItem("token");
	};

	return (
		<AuthContext.Provider
			value={{ user, signed: !!user, signin, signup, signout }}
		>
			{children}
		</AuthContext.Provider>
	);
};
