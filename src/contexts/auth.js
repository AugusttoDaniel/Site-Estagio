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
					localStorage.removeItem("token"); // Remove invalid token
				}
			}
		};

		loadUser();
	}, []);

	const signin = async (email, senha) => {
		try {
			const response = await fetch("https://estagio-omega.vercel.app/token/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, senha}),
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

	const signup = async (nome, email, senha, telefone) => {
		console.log(nome, email, senha, telefone);
		try {
			const requestOptions = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ nome, email, senha,telefone }),
			};
			const response = await fetch(
				"https://estagio-omega.vercel.app/usuario/criar",
				requestOptions
			);
			const data = await response.json();

			if (response.ok) {
				return data.mensagem;
			} else {
				console.error(
					"Signup failed with status:",
					response.status,
					data.mensagem
				);
				throw new Error(
					data.mensagem || "Failed to sign up. Please try again later."
				);
			}
		} catch (error) {
			console.error("Signup error:", error);
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
