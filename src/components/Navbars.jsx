import React from "react";

import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Collapse } from "@material-ui/core";

//Icons
import DashboardIcon from "@material-ui/icons/Dashboard";
import CategoryIcon from "@material-ui/icons/Category";
import PersonIcon from "@material-ui/icons/Person";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import AddIcon from "@material-ui/icons/Add";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import SettingsIcon from "@material-ui/icons/Settings";
import ViewStreamIcon from "@material-ui/icons/ViewStream";

import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

import { useHistory } from "react-router-dom";

import { appName } from "../constants/appDetails";

import { drawerItems } from "../constants/navigation";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const openColor = "#ffaa0050";
const selectedColor = "#ffaa0099";

/*
const drawerItems = [
  {
    title: "Dashboard",
    icon: <DashboardIcon />,
    containsSubItems: false,
    onClick: () => {},
    subItems: [],
  },
  {
    title: "Categories",
    icon: <CategoryIcon />,
    containsSubItems: true,
    onClick: () => {},
    subItems: [
      {
        title: "Parent Categories",
        onClick: (history) => history.push("/collections/categories"),
      },
      {
        title: "Sub Categories",
        onClick: (history) => history.push("/collections/subcategories"),
      },
    ],
  },
  {
    title: "Products",
    icon: <AddIcon />,
    containsSubItems: false,
    onClick: (history) => history.push("/collections/products"),
    subItems: [],
  },
  {
    title: "Banners",
    icon: <ViewStreamIcon />,
    containsSubItems: false,
    onClick: (history) => history.push("/collections/banners"),
    subItems: [],
  },
  {
    title: "Send Notifications",
    icon: <NotificationsActiveIcon />,
    containsSubItems: false,
    onClick: (history) => history.push("/collections/notifications/add"),
    subItems: [],
  },

  {
    title: "Users",
    icon: <PersonIcon />,
    containsSubItems: true,
    onClick: () => {},
    subItems: [
      {
        title: "Admins",
        onClick: (history) => history.push("/collections/users/admins"),
      },
      {
        title: "Delivery Boys",
        onClick: (history) => history.push("/collections/users/delivery-guys"),
      },
      {
        title: "Clients",
        onClick: (history) => history.push("/collections/users/clients"),
      },
    ],
  },
  {
    title: "Order Management",
    icon: <BorderColorIcon />,
    containsSubItems: true,
    onClick: () => {},
    subItems: [
      {
        title: "New",
        onClick: (history) => history.push("/collections/orders/new"),
      },
      {
        title: "In Progress",
        onClick: (history) => history.push("/collections/orders/in-progress"),
      },
      {
        title: "Completed",
        onClick: (history) => history.push("/collections/orders/completed"),
      },
    ],
  },
  {
    title: "Settings",
    icon: <SettingsIcon />,
    containsSubItems: false,
    onClick: (history) => history.push("/settings"),
    subItems: [],
  },
];
*/

function Navbars(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();

  const history = useHistory();

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const [drawerState, setDrawerState] = React.useState(
    drawerItems.map((item, index) => ({
      title: item.title,
      open: false,
      selected: false,
      containsSubItems: item.containsSubItems,
      onClick: item.onClick,
      subItems: item.subItems.map((subItem, subItemIndex) => ({
        title: subItem.title,
        selected: false,
        onClick: subItem.onClick,
      })),
    }))
  );

  const onItemClick = (index) => {
    const newDrawerState = [...drawerState];

    newDrawerState.forEach((item, itemIndex) => {
      if (!newDrawerState[index].containsSubItems) {
        item.selected = false;
      }
      item.subItems.forEach((subItem, subItemIndex) => {
        subItem.selected = false;
      });
    });

    if (newDrawerState[index].containsSubItems) {
      newDrawerState[index].open = !newDrawerState[index].open;
    } else {
      newDrawerState[index].selected = true;
    }
    setDrawerState(newDrawerState);
  };

  const onSubItemClick = (targetItemIndex, targetSubItemIndex) => {
    const newDrawerState = [...drawerState];

    newDrawerState.forEach((item, itemIndex) => {
      item.selected = false;
      item.subItems.forEach((subItem, subItemIndex) => {
        subItem.selected = false;
      });
    });

    if (newDrawerState[targetItemIndex].containsSubItems) {
      newDrawerState[targetItemIndex].open = true;
      newDrawerState[targetItemIndex].subItems[
        targetSubItemIndex
      ].selected = true;
    }

    setDrawerState(newDrawerState);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        {drawerItems.map((item, index) => (
          <div>
            <ListItem
              style={{
                backgroundColor: drawerState[index].containsSubItems
                  ? drawerState[index].open
                    ? openColor
                    : "white"
                  : drawerState[index].selected
                  ? selectedColor
                  : "white",
              }}
              button
              key={index}
              onClick={() => {
                onItemClick(index);
                item.onClick(history);
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
              {item.containsSubItems ? (
                drawerState[index].open ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )
              ) : null}
            </ListItem>
            <Collapse in={drawerState[index].open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.subItems.map((subItem, subItemIndex) => (
                  <ListItem
                    button
                    style={{
                      backgroundColor: drawerState[index].subItems[subItemIndex]
                        .selected
                        ? selectedColor
                        : "white",
                    }}
                    className={classes.nested}
                    onClick={() => {
                      onSubItemClick(index, subItemIndex);
                      subItem.onClick(history);
                    }}
                    key={subItemIndex}
                  >
                    {/*<ListItemIcon>{item.icon}</ListItemIcon>*/}
                    <ListItemText inset primary={subItem.title} />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </div>
        ))}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {appName} Admin
          </Typography>
        </Toolbar>
      </AppBar>

      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
}
export default Navbars;
