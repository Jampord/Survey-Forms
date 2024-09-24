import * as React from "react";
import "../styles/SideBar.scss";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CurrentDate from "./CurrentDate";
import { useDispatch, useSelector } from "react-redux";
import { navigationData } from "../routes/NavigationData";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Menu,
  MenuItem,
  Modal,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";
import PasswordIcon from "@mui/icons-material/Password";
import { clearToken } from "../features/auth/authSlice";
import useDisclosure from "../hooks/useDisclosure";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { changePasswordYup } from "../schema/Schema";
import { useChangePasswordMutation } from "../redux/api/userAPI";
import { setSidebarToggle } from "../redux/reducers/sidebarSlice";
import { setSnackbar } from "../redux/reducers/snackbarSlice";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Sidebar({ children }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const sidebarToggle = useSelector((state) => state.sidebar.toggle);

  const handleDrawerOpen = () => {
    dispatch(setSidebarToggle(true));
    setOpen(true);
  };

  const handleDrawerClose = () => {
    dispatch(setSidebarToggle(false));
    setOpen(false);
  };

  const handleItemClick = (event) => {
    event.stopPropagation();
  };

  const permissions = useSelector((state) => state.permissions.permissions);
  const filteredNavdata = navigationData.filter((item) =>
    permissions.includes(item.name)
  );

  const fullName = localStorage.getItem("fullName");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const onMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setIsMenuOpen(true);
  };

  const onMenuClose = () => {
    setIsMenuOpen(false);
    setAnchorEl(null);
  };

  //Logout
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(clearToken());
    localStorage.removeItem("encryptedToken");
    localStorage.removeItem("fullName");
    localStorage.removeItem("permissions");
    navigate("/login");
  };

  const {
    isOpen: isConfirmDialogOpen,
    onOpen: onConfirmDialogOpen,
    onClose: onConfirmDialogClose,
  } = useDisclosure();
  //end of logout

  //Change Password
  const [changePassword] = useChangePasswordMutation();
  // const password = localStorage.getItem("password");
  const {
    isOpen: isChangePasswordModalOpen,
    onOpen: onChangePasswordModalOpen,
    onClose: onChangePasswordModalClose,
  } = useDisclosure();

  const {
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(changePasswordYup.schema),
    mode: "onSubmit",
    defaultValues: changePasswordYup.defaultValues,
  });

  const id = localStorage.getItem("id");

  const onSubmit = async (data) => {
    try {
      await changePassword({ Id: id, body: data }).unwrap();
      dispatch(setSnackbar({ message: "Changed password successfully!" }));
      onChangePasswordModalClose();
    } catch (err) {
      console.log(err);
      dispatch(setSnackbar({ message: err.data, severity: "error" }));
      onChangePasswordModalClose();
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 350,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  };

  const updatePass = localStorage.getItem("updatePass");

  return (
    <>
      <Box sx={{ display: "flex" }}>
        {/* <CssBaseline /> */}
        <AppBar position="fixed" open={sidebarToggle}>
          <Toolbar
            sx={{
              backgroundColor: "#97937d",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex" }}>
              <IconButton
                color="inherit"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{
                  marginRight: 5,
                  ...(sidebarToggle && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6">
                <CurrentDate />
              </Typography>
            </Box>
            <Box
              onClick={onMenuOpen}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              {fullName} <AccountCircleIcon />
              <ExpandMoreIcon />
              <Menu
                keepMounted
                open={isMenuOpen}
                onClose={onMenuClose}
                anchorEl={anchorEl}
              >
                <MenuItem onClick={onChangePasswordModalOpen}>
                  <PasswordIcon /> Change Password
                </MenuItem>
                <Divider />
                <MenuItem onClick={onConfirmDialogOpen}>
                  <LogoutIcon />
                  Logout
                </MenuItem>
              </Menu>
              {/* <Logout /> */}
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={sidebarToggle}>
          <Box sx={{}}>
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "rtl" ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )}
              </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
              {filteredNavdata.map((item) => (
                <ListItem
                  onClick={handleItemClick}
                  key={item.name}
                  disablePadding
                  sx={{ display: "block" }}
                >
                  <NavLink to={item.path}>
                    {/* {({ isActive }) => ( */}
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: sidebarToggle ? "initial" : "center",
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: sidebarToggle ? 3 : "auto",
                          justifyContent: "center",
                        }}
                      >
                        {/* <span
                            className={`navbar__items__spacer ${
                              isActive ? "selected" : ""
                            }`}
                          > */}
                        {item.icon}
                        {/* </span> */}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.name}
                        sx={{
                          opacity: sidebarToggle ? 1 : 0,
                          color: "#171713",
                        }}
                      />
                    </ListItemButton>
                    {/* )} */}
                  </NavLink>
                </ListItem>
              ))}
            </List>
            <Divider />
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          {children}
        </Box>
      </Box>

      <Modal
        open={isChangePasswordModalOpen}
        onClose={onChangePasswordModalClose}
      >
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Change Password Form
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) =>
                !errors.fullName ? (
                  <TextField
                    {...field}
                    label="Password"
                    variant="outlined"
                    fullWidth
                    helperText="Input your current password."
                  />
                ) : (
                  <TextField
                    {...field}
                    error
                    label="Password"
                    variant="outlined"
                    helperText={errors.fullName.message}
                    fullWidth
                  />
                )
              }
            />

            <Controller
              name="newPassword"
              control={control}
              defaultValue=""
              render={({ field }) =>
                !errors.fullName ? (
                  <TextField
                    {...field}
                    label="New Password"
                    variant="outlined"
                    fullWidth
                    helperText="Input your new password."
                  />
                ) : (
                  <TextField
                    {...field}
                    error
                    label="New Password"
                    variant="outlined"
                    helperText={errors.fullName.message}
                    fullWidth
                  />
                )
              }
            />

            <Controller
              name="confirmPassword"
              control={control}
              defaultValue=""
              render={({ field }) =>
                !errors.fullName ? (
                  <TextField
                    {...field}
                    label="Confirm Password"
                    variant="outlined"
                    fullWidth
                    helperText="Confirm your current password."
                  />
                ) : (
                  <TextField
                    {...field}
                    error
                    label="Confirm Password"
                    variant="outlined"
                    helperText={errors.fullName.message}
                    fullWidth
                  />
                )
              }
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                display: "inline-flex",
                width: 80,
                marginRight: 0,
                fontSize: 12,
              }}
            >
              Confirm
            </Button>

            <Button
              onClick={onChangePasswordModalClose}
              variant="outlined"
              sx={{
                display: "inline-flex",
                width: 80,
                fontSize: 12,
              }}
            >
              No
            </Button>
          </form>
        </Box>
      </Modal>

      <Dialog open={isConfirmDialogOpen} onClose={onConfirmDialogClose}>
        <DialogTitle>Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleLogout}
            variant="contained"
            autoFocus
            color={"error"}
            sx={{
              display: "inline-flex",
              width: 80,
              marginRight: 0,
              fontSize: 12,
            }}
          >
            Yes
          </Button>
          <Button
            onClick={onConfirmDialogClose}
            variant="contained"
            color="primary"
            sx={{
              display: "inline-flex",
              width: 80,
              fontSize: 12,
            }}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
