import React, { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import * as C from "./styles";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Signup = () => {
	const [nome, setNome] = useState("");
	const [email, setEmail] = useState("");
	const [senha, setSenha] = useState("");
	const [repeatsenha, setRepeatsenha] = useState("");
	const [telefone, setTelefone] = useState("");
	const [error, setError] = useState("");
	const [sucesso, setSucesso] = useState("");

	const { signup } = useAuth();

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
			const res = await signup(nome, email, senha, telefone);
			if (res === "Usuário criado com sucesso!") {
				setSucesso(res);
			} else {
				setError(res || "Erro desconhecido");
			}
		} catch (error) {
			setError("Falha ao tentar fazer login. Tente novamente.");
		}
	};

	return (
		<C.Container>
			<C.Label>Registre-Se</C.Label>
			<form>
				<C.Content>
					<Input
						type="string"
						placeholder="Digite seu Nome"
						value={nome}
						onChange={(e) => [setNome(e.target.value), setError("")]}
					/>
					<Input
						type="email"
						placeholder="Digite seu E-mail"
						value={email}
						onChange={(e) => [setEmail(e.target.value), setError("")]}
					/>
					<Input
						type="string"
						placeholder="Digite seu Telefone"
						value={telefone}
						onChange={(e) => [setTelefone(e.target.value), setError("")]}
					/>
					<Input
						type="password"
						placeholder="Digite sua Senha"
						value={senha}
						onChange={(e) => [setSenha(e.target.value), setError("")]}
						autocomplete="new-password"
					/>
					<Input
						type="password"
						placeholder="Repita sua Senha"
						value={repeatsenha}
						onChange={(e) => [setRepeatsenha(e.target.value), setError("")]}
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
			</form>
		</C.Container>
	);
};

export default Signup;
