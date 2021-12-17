import CreateIcon from "@material-ui/icons/Create";
import AssignmentIcon from "@material-ui/icons/Assignment";
import PersonIcon from "@material-ui/icons/Person";
import HeadsetMicIcon from "@material-ui/icons/HeadsetMic";
import InfoIcon from "@material-ui/icons/Info";
import PolicyIcon from "@material-ui/icons/Policy";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import MapIcon from '@material-ui/icons/Map';
import SettingsIcon from "@material-ui/icons/Settings";

import Slugs, {
  blogCategorySlugs,
  blogSubCategorySlugs,
  blogPostSlugs,
  tutorialsCategorySlugs,
  tutorialsSubcategorySlugs,
  tutorialsSeriesSlugs,
  tutorialsTutorialsSlugs,
  collaboratorsSlugs,
  connectSlugs,
  aboutSlugs,
  privacyPolicySlugs,
  termsAndConditionsSlugs,
  utilitySlugs
} from "./slugs";

export const drawerItems = [
  {
    title: "Blog",
    icon: <CreateIcon />,
    containsSubItems: true,
    onClick: () => {},
    subItems: [
      {
        title: "Categories",
        onClick: (history) => history.push(blogCategorySlugs.viewCollection),
      },
      {
        title: "Sub Categories",
        onClick: (history) => history.push(blogSubCategorySlugs.viewCollection),
      },
      {
        title: "Posts",
        onClick: (history) => history.push(blogPostSlugs.viewCollection),
      },
    ],
  },
  {
    title: "Tutorials",
    icon: <AssignmentIcon />,
    containsSubItems: true,
    onClick: () => {},
    subItems: [
      {
        title: "Categories",
        onClick: (history) =>
          history.push(tutorialsCategorySlugs.viewCollection),
      },
      {
        title: "Sub Categories",
        onClick: (history) =>
          history.push(tutorialsSubcategorySlugs.viewCollection),
      },
      {
        title: "Series",
        onClick: (history) => history.push(tutorialsSeriesSlugs.viewCollection),
      },
      {
        title: "Tutorials",
        onClick: (history) =>
          history.push(tutorialsTutorialsSlugs.viewCollection),
      },
    ],
  },
  {
    title: "Collaborators",
    icon: <PersonIcon />,
    containsSubItems: false,
    //onClick: (history) => history.push(collaboratorsSlugs.viewCollection),
    onClick: (history) => history.push(collaboratorsSlugs.createDocument),
    subItems: [],
  },
  {
    title: "Connect",
    icon: <HeadsetMicIcon />,
    containsSubItems: false,
    onClick: (history) => history.push(connectSlugs.viewCollection),
    subItems: [],
  },
  {
    title: "About",
    icon: <InfoIcon />,
    containsSubItems: false,
    onClick: (history) => history.push(aboutSlugs.viewCollection),
    subItems: [],
  },
  {
    title: "Privacy Policy",
    icon: <PolicyIcon />,
    containsSubItems: false,
    onClick: (history) => history.push(privacyPolicySlugs.viewCollection),
    subItems: [],
  },
  {
    title: "Terms and Conditions",
    icon: <IndeterminateCheckBoxIcon />,
    containsSubItems: false,
    onClick: (history) => history.push(termsAndConditionsSlugs.viewCollection),
    subItems: [],
  },
  {
    title: "Sitemap",
    icon: <MapIcon />,
    containsSubItems: false,
    //onClick: (history) => history.push(collaboratorsSlugs.viewCollection),
    onClick: (history) => history.push(utilitySlugs.generateSitemap),
    subItems: [],
  },
  {
    title: "Settings",
    icon: <SettingsIcon />,
    containsSubItems: false,
    onClick: (history) => history.push(Slugs.settings),
    subItems: [],
  },
];
