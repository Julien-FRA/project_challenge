import React, { useEffect, useState } from "react";
import { Router } from "./Router.js";
import { useMantineTheme } from "@mantine/core";
import * as AuthService from "./services/auth.service";
import { ThemeProvider } from "styled-components";

function App() {
  const theme = useMantineTheme();

  // const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    // setCurrentUser(AuthService.getCurrentUser());
  });

  const logOut = () => {
    AuthService.logout();
    // setCurrentUser(undefined);
  };
  return (
    <ThemeProvider theme={theme}>

        <Router />
    </ThemeProvider>
  );
}

export default App;
