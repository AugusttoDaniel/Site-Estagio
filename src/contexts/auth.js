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

	const signup = async (nome ,email, password, telefone) => {
    try {
      const response = await fetch("https://estagio-omega.vercel.app/usuario/criar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({nome, password, email, telefone}),
      });

      const data = await response.json();
      if (response.ok) {
        return data.mensagem;
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
