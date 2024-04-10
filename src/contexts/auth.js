import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState();

	useEffect(() => {
		const userToken = localStorage.getItem("token");
		if (userToken) {
			const decoded = jwtDecode(userToken);
			const user = {
				email: decoded.email,
				id: decoded.id,
			};
			setUser(user);
		}
	}, []);

	const signin = async (email, password) => {
		try {
			const response = await fetch("https://estagio-omega.vercel.app/token/", {
				// Adjust the URL based on your setup
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

	const signup = (email, password) => {
		const usersStorage = JSON.parse(localStorage.getItem("users_bd"));

		const hasUser = usersStorage?.filter((user) => user.email === email);

		if (hasUser?.length) {
			return "Já tem uma conta com esse E-mail";
		}

		let newUser;

		if (usersStorage) {
			newUser = [...usersStorage, { email, password }];
		} else {
			newUser = [{ email, password }];
		}

		localStorage.setItem("users_bd", JSON.stringify(newUser));

		return;
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
