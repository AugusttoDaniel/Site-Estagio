import { createContext, useEffect, useState } from "react";
export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(null);

	useEffect(() => {
		const userContext = localStorage.getItem("token");
		setUser(userContext);
		setLoading(false);
	}, []);

	if (loading) {
		return <p>Loading...</p>;
	}

	const signin = async (email, senha) => {
		const password = senha;
		try {
			const requestOptions = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
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
			window.location.reload();
			return responseData.mensagem;
		} catch (error) {
			console.error("Signup failed:", error);
			localStorage.removeItem("token");
			throw error;
		}
	};

	

	const signout = () => {
		setUser(null);
		localStorage.clear();
		window.location.reload();
	};

	return (
		<AuthContext.Provider
			value={{ user, signed: !!user, signin, signout }}
		>
			{children}
		</AuthContext.Provider>
	);
};
