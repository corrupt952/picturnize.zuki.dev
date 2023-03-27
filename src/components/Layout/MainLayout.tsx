import React from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, Box, Button, CssBaseline, Grid, Toolbar, Typography } from "@mui/material";
import { AccountCircle, GitHub } from "@mui/icons-material";
import { Logo } from "../Elements/Logo/Logo";
import { APP_TITLE } from "../../config";

// Constraints
const THEME = createTheme({
  palette: {
    primary: {
      main: '#1c1c1c',
    },
  },
});

// Function Components
const Header = () => {
  const navItems = [
    { name: 'GitHub', href: 'https://github.com/corrupt952/picturnize', icon: <GitHub /> },
    { name: 'Developer', href: 'https://zuki.dev', icon: <AccountCircle /> },
  ]

  return (
    <AppBar position="relative">
      <Toolbar>
        <Grid justifyContent={'space-between'} container spacing={24}>
          <Grid item>
            <Typography variant="h6" color="inherit" display='flex' alignItems='center' flexWrap='wrap' noWrap>
              <Logo width='2rem' height='2rem' /> {APP_TITLE}
            </Typography>
          </Grid>
          <Grid item>
            {navItems.map((item) => {
              return (
                <Button href={item.href} startIcon={item.icon} key={item.name} sx={{ color: 'white' }}>
                  {item.name}
                </Button>
              );
            })}
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  )
}

const Footer = () => {
  return (
    <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
      <Typography variant="body2" color="textSecondary" align="center">
        {`@ 2023- K@zuki. All rights reserved.`}
      </Typography>
    </Box>
  )
}

// Main components
type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout = ({children}: MainLayoutProps) => {
  return (
    <ThemeProvider theme={THEME}>
      <CssBaseline />
      <Header />
      <main>
        {children}
        </main>
      <Footer />
    </ThemeProvider>
  )
}
