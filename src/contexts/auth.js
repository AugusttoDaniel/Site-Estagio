import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);

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
					localStorage.removeItem("token"); 
				}
			}
		};

		loadUser();
	}, []);

	const signin = async (email, senha) => {
		const password = senha;
		try {
			const requestOptions = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({email, password}),
			};

			const response = await fetch(
				"https://estagio-omega.vercel.app/token",
				requestOptions
			);

			if (!response.ok) {
				const errorResponse = await response.text();
				throw new Error(errorResponse || "Unknown error occurred");
			}

			const responseData = await response.json();
			localStorage.setItem("token", responseData.token);
			return responseData.mensagem;
		} catch (error) {
			console.error("Signup failed:", error);
			throw error;
		}
	};

	const signup = async (nome, email, senha, telefone) => {
		try {
			const requestOptions = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ nome, email, senha, telefone }),
			};
			const response = await fetch(
				"http://localhost:3001/usuario/criar",
				requestOptions
			);

			if (!response.ok) {
				const errorResponse = await response.text();
				throw new Error(errorResponse || "Unknown error occurred");
			}
			const responseData = await response.json();
			console.log("Signup successful", responseData);
			return responseData;
		} catch (error) {
			console.error("Signup failed:", error);
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
