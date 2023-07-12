import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { AccountCircle, GitHub } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { Logo } from "@/components/Elements/Logo/Logo";
import { Config } from "@/config";

// Function Components
const Header = () => {
  const [open, setOpen] = React.useState(false);

  const navItems = [
    {
      name: "GitHub",
      href: "https://github.com/corrupt952/picturnize",
      icon: <GitHub />,
    },
    { name: "Developer", href: "https://zuki.dev", icon: <AccountCircle /> },
  ];

  return (
    <AppBar position="relative">
      <Toolbar>
        <Grid justifyContent={"space-between"} container spacing={24}>
          <Grid item>
            <Typography
              variant="h6"
              color="inherit"
              display="flex"
              alignItems="center"
              flexWrap="wrap"
              noWrap
            >
              <Logo width="2rem" height="2rem" /> {Config.title}
            </Typography>
          </Grid>
          <Grid item sx={{ display: { xs: "none", md: "flex" } }}>
            {navItems.map((item) => {
              return (
                <Button
                  href={item.href}
                  target="_blank"
                  startIcon={item.icon}
                  key={item.name}
                  sx={{ color: "white" }}
                >
                  {item.name}
                </Button>
              );
            })}
          </Grid>
          <Grid item sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton color="inherit" onClick={() => setOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Menu
              keepMounted
              open={Boolean(open)}
              anchorEl={null}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              onClose={() => setOpen(false)}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {navItems.map((item) => {
                return (
                  <MenuItem
                    component="a"
                    key={item.name}
                    href={item.href}
                    target="_blank"
                  >
                    {item.name}
                  </MenuItem>
                );
              })}
            </Menu>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

const Footer = () => {
  return (
    <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
      <Typography variant="body2" color="textSecondary" align="center">
        {`@ 2023- K@zuki. All rights reserved.`}
      </Typography>
    </Box>
  );
};

// Main components
type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <ThemeProvider theme={Config.theme}>
      <CssBaseline />
      <Header />
      <main>{children}</main>
      <Footer />
    </ThemeProvider>
  );
};
