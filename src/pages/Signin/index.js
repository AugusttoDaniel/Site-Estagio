import React, { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import * as C from "./styles";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Signin = () => {
	const { signin } = useAuth();
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [senha, setSenha] = useState("");
	const [error, setError] = useState("");
	const [sucesso, setSucesso] = useState("");

	const handleLogin = async (e) => {
		e.preventDefault();
		if (!email || !senha) {
			setError("Preencha todos os campos");
			return;
		}
	
		try {
			const data = await signin(email, senha);
			if (data === "Sucesso ao Efetuar Login") {
				setSucesso(data);
				setTimeout(() => navigate("/Home"), 10); 
			} else {
				setError(data || "Erro desconhecido");
			}
		} catch (error) {
			setError("Falha ao tentar fazer login. Tente novamente.");
		}
	};

	return (
		<C.Container>
			<C.Label>Faça Seu Login</C.Label>
			<form>
				<C.Content>
					<Input
						type="email"
						placeholder="Digite seu E-mail"
						value={email}
						onChange={(e) => [
							setEmail(e.target.value),
							setError(""),
							setSucesso(""),
						]}
					/>
					<Input
						type="password"
						placeholder="Digite sua Senha"
						value={senha}
						onChange={(e) => [
							setSenha(e.target.value),
							setError(""),
							setSucesso(""),
						]}
					/>
					<C.labelError>{error}</C.labelError>
					<C.labelSucesso>{sucesso}</C.labelSucesso>
					<Button Text="Entrar" onClick={handleLogin} />
					<C.LabelSignup>
						Não tem uma conta?
						<C.Strong>
							<Link to="/signup">&nbsp;Registre-se</Link>
						</C.Strong>
					</C.LabelSignup>
				</C.Content>
			</form>
		</C.Container>
	);
};

export default Signin;
