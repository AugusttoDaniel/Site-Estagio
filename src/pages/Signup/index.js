import React, { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import * as C from "./styles";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Signup = () => {
	const [nome, setNome] = useState("");
	const [email, setEmail] = useState("");
	const [senha, setSenha] = useState("");
	const [repeatsenha, setRepeatsenha] = useState("");
	const [telefone, setTelefone] = useState("");
	const [error, setError] = useState("");
	const [sucesso, setSucesso] = useState("");
	const navigate = useNavigate();

	const clearFields = () => {
		setNome("");
		setEmail("");
		setSenha("");
		setRepeatsenha("");
		setTelefone("");
	};

	const signup = async (nome, email, senha, telefone) => {
		try {
			const requestOptions = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ nome, email, senha, telefone }),
			};
			const response = await fetch(
				"https://estagio-ten.vercel.app/usuario/criar",
				requestOptions
			);

			const responseData = await response.json();
			if (!response.ok) {
				throw new Error(responseData.errors);
			}
			return responseData;
		} catch (error) {
			throw new Error(error.message);
		}
	};

	const handleSignup = async (e) => {
		e.preventDefault();
		if (!nome || !email || !senha || !repeatsenha || !telefone) {
			setError("Preencha todos os campos");
			return;
		} else if (senha !== repeatsenha) {
			setError("As senhas não são iguais");
			return;
		}
		try {
			const result = await signup(nome, email, senha, telefone);
			if (result.message === "Usuário criado com sucesso!") {
				clearFields();
				setSucesso("Usuário criado com sucesso!");
				setTimeout(() => {
					navigate("/");
				}, 3000);
			}
		} catch (error) {
			setError(error.message);
		}
	};

	return (
		<C.Container>
			<C.Label>Registre-Se</C.Label>
			<C.Content>
				<Input
					type="string"
					placeholder="Digite seu Nome"
					value={nome}
					onChange={(e) => [
						setNome(e.target.value),
						setError(""),
						setSucesso(""),
					]}
				/>
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
					type="string"
					placeholder="Digite seu Telefone"
					value={telefone}
					onChange={(e) => [
						setTelefone(e.target.value),
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
					autocomplete="new-password"
				/>
				<Input
					type="password"
					placeholder="Repita sua Senha"
					value={repeatsenha}
					onChange={(e) => [
						setRepeatsenha(e.target.value),
						setError(""),
						setSucesso(""),
					]}
					autocomplete="new-password"
				/>
				<C.labelError>{error}</C.labelError>
				<C.labelSucesso>{sucesso}</C.labelSucesso>
				<Button Text="Inscrever-se" onClick={handleSignup} />
				<C.LabelSignin>
					Já tem uma conta?
					<C.Strong>
						<Link to="/">&nbsp;Entre</Link>
					</C.Strong>
				</C.LabelSignin>
			</C.Content>
		</C.Container>
	);
};

export default Signup;
