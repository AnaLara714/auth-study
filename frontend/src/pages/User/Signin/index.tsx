import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import { PageRoutes } from "@/pages";
import { iUser } from "@/config/types";

export const SigninUser = () => {
  const [newUser, setNewUser] = useState<iUser>({ name: "", admin: false, email: "", password: ""});
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [validEmail, setValidEmail] = useState(true);
  const [completedEmail, setCompletedEmail] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    
    if(name === "email") {
      const emailRegex = /^\w+@[a-z]+(\.[a-z]+)+$/;
      setValidEmail(false);
      if(emailRegex.test(value))  {
        setValidEmail(true);
        setCompletedEmail(true);
      };
    }
    setNewUser((prevUser) => ({...prevUser, [name]: value}))
  };

  const handleSignin = async () => {
    if (newUser.password !== passwordConfirmation && !completedEmail) {
      console.error('A senha e a confirmação de senha não correspondem');
      alert('A senha e a confirmação de senha não correspondem');
      return;
    } else {
        try {
          const response = await fetch("http://localhost:5000/users", {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json', 
            },
            body: JSON.stringify(newUser),
          });

          if (response.ok) {
            const userData = await response.json();
            alert("Cadastro realizado, faça seu login para ter mais acesso!")
          } else {
            console.error("erro de cadastro")
          }
        } catch(error) {
          console.log("Erro", error);
        };
        console.log("handle sign in");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "500px",
        margin: "20px auto",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
      }}
    >
      <Typography sx={{ fontSize: 26 }}>Cadastre-se</Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <TextField
          type="text"
          name="name"
          value={newUser.name}
          onChange={handleInputChange}
          placeholder="informe seu nome"
        />
        <TextField
          type="email"
          name="email"
          onChange={handleInputChange}
          helperText={!validEmail ? "Insira um e-mail válido." : ""}
          value={newUser.email}
          placeholder="informe seu email"
        />
        <TextField
          type="password"
          name="password"
          value={newUser.password}
          onChange={handleInputChange}
          placeholder="informe sua senha"
        />
        <TextField
          type="password"
          onChange={(event) => setPasswordConfirmation(event.target.value)}
          value={passwordConfirmation}
          placeholder="confirme sua senha"
        />
        <Button onClick={handleSignin} disabled={!validEmail}>Sign IN</Button>
      </Box>
      <Typography>
        Caso já tenha uma conta, basta <Link to={PageRoutes.login}>Logar</Link>.
      </Typography>
    </Box>
  );
};
