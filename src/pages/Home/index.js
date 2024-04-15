import React from "react";
import Button from "../../components/Button";
import useAuth from "../../hooks/useAuth";
import * as C from "./styles";

const Home = () => {
	const { signout } = useAuth();

	const handleSignOut = () => {
		signout();
		window.location.replace("/");
	};

	return (
		<C.Container>
			<C.Title>Home</C.Title>
			<Button Text="Sair" onClick={handleSignOut}>
				Sair
			</Button>
		</C.Container>
	);
};

export default Home;
