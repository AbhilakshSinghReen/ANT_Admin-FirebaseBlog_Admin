import { BrowserRouter, Switch, Route } from "react-router-dom";

import UserContext from "./context/UserContext";
import useAuthListener from "./firebase/hooks/useAuthListener";

import Login from "./pages/Login";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import DoubleAuthAttempt from "./pages/DoubleAuthAttempt";

import CreateNewBlogCategory from "./pages/Blog Categories/CreateNewBlogCategory";
import ViewAllBlogCategories from "./pages/Blog Categories/ViewAllBlogCategories";
import ViewBlogCategory from "./pages/Blog Categories/ViewBlogCategory";

import CreateNewBlogSubCategory from "./pages/Blog Sub Categories/CreateNewBlogSubCategory";
import ViewAllBlogSubCategories from "./pages/Blog Sub Categories/ViewAllBlogSubCategories";
import ViewBlogSubCategory from "./pages/Blog Sub Categories/ViewBlogSubCategory";

import CreateNewBlogPost from "./pages/Blog Posts/CreateNewBlogPost";
import ViewAllBlogPosts from "./pages/Blog Posts/ViewAllBlogPosts";
import ViewBlogPost from "./pages/Blog Posts/ViewBlogPost";

import CreateNewTutorialCategory from "./pages/Tutorial Categories/CreateNewTutorialCategory";
import ViewAllTutorialCategories from "./pages/Tutorial Categories/ViewAllTutorialCategories";
import ViewTutorialCategory from "./pages/Tutorial Categories/ViewTutorialCategory";

import CreateNewTutorialSubcategory from "./pages/Tutorial Subcategories/CreateNewTutorialSubcategory";
import ViewAllTutorialSubcategories from "./pages/Tutorial Subcategories/ViewAllTutorialSubcategories";
import ViewTutorialSubcategory from "./pages/Tutorial Subcategories/ViewTutorialSubcategory";

import CreateNewTutorialSeries from "./pages/Tutorial Series/CreateNewTutorialSeries";
import ViewAllTutorialSeries from "./pages/Tutorial Series/ViewAllTutorialSeries";
import ViewTutorialSeries from "./pages/Tutorial Series/ViewTutorialSeries";

import CreateNewTutorial from "./pages/Tutorials/CreateNewTutorial";
import ViewAllTutorials from "./pages/Tutorials/ViewAllTutorials";
import ViewTutorial from "./pages/Tutorials/ViewTutorial";

import CreateNewCollaborator from "./pages/Collaborators/CreateNewCollaborator";
//Two more imports here

import CreateNewSocialNetworkProfile from "./pages/Connect/CreateNewSocialNetworkProfile";
import ViewAllSocialNetworkProfiles from "./pages/Connect/ViewAllSocialNetworkProfiles";

import About from "./pages/About";

import PrivacyPolicy from "./pages/PrivacyPolicy";

import TermsAndConditions from "./pages/TermsAndConditions";

import GenerateSitemap from "./pages/Utility/GenerateSitemap";

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
  utilitySlugs,
} from "./constants/slugs";

function App() {
  const { user } = useAuthListener();

  return (
    <UserContext.Provider value={{ user }}>
      <BrowserRouter>
        <Switch>
          <Route path={Slugs.login} component={Login} exact />
          <Layout>
            <Route path={Slugs.dashboard} component={Dashboard} exact />
            <Route
              path={Slugs.doubleAuthAttempt}
              component={DoubleAuthAttempt}
              exact
            />
            {/*BLOG CATEGORIES*/}
            <Route
              path={blogCategorySlugs.createDocument}
              component={CreateNewBlogCategory}
              exact
            />
            <Route
              path={blogCategorySlugs.viewCollection}
              component={ViewAllBlogCategories}
              exact
            />
            <Route
              path={blogCategorySlugs.viewDocument}
              component={ViewBlogCategory}
              exact
            />

            {/*BLOG SUBCATEGORIES*/}
            <Route
              path={blogSubCategorySlugs.createDocument}
              component={CreateNewBlogSubCategory}
              exact
            />
            <Route
              path={blogSubCategorySlugs.viewCollection}
              component={ViewAllBlogSubCategories}
              exact
            />
            <Route
              path={blogSubCategorySlugs.viewDocument}
              component={ViewBlogSubCategory}
              exact
            />

            {/*BLOG POSTS*/}
            <Route
              path={blogPostSlugs.createDocument}
              component={CreateNewBlogPost}
              exact
            />
            <Route
              path={blogPostSlugs.viewCollection}
              component={ViewAllBlogPosts}
              exact
            />
            <Route
              path={blogPostSlugs.viewDocument}
              component={ViewBlogPost}
              exact
            />

            {/*TUTORIAL CATEGORIES*/}
            <Route
              path={tutorialsCategorySlugs.createDocument}
              component={CreateNewTutorialCategory}
              exact
            />
            <Route
              path={tutorialsCategorySlugs.viewCollection}
              component={ViewAllTutorialCategories}
              exact
            />
            <Route
              path={tutorialsCategorySlugs.viewDocument}
              component={ViewTutorialCategory}
              exact
            />

            {/*TUTORIAL SUBCATEGORIES*/}
            <Route
              path={tutorialsSubcategorySlugs.createDocument}
              component={CreateNewTutorialSubcategory}
              exact
            />
            <Route
              path={tutorialsSubcategorySlugs.viewCollection}
              component={ViewAllTutorialSubcategories}
              exact
            />
            <Route
              path={tutorialsSubcategorySlugs.viewDocument}
              component={ViewTutorialSubcategory}
              exact
            />

            {/*TUTORIAL SERIES*/}
            <Route
              path={tutorialsSeriesSlugs.createDocument}
              component={CreateNewTutorialSeries}
              exact
            />
            <Route
              path={tutorialsSeriesSlugs.viewCollection}
              component={ViewAllTutorialSeries}
              exact
            />
            <Route
              path={tutorialsSeriesSlugs.viewDocument}
              component={ViewTutorialSeries}
              exact
            />

            {/*TUTORIALS*/}
            <Route
              path={tutorialsTutorialsSlugs.createDocument}
              component={CreateNewTutorial}
              exact
            />
            <Route
              path={tutorialsTutorialsSlugs.viewCollection}
              component={ViewAllTutorials}
              exact
            />
            <Route
              path={tutorialsTutorialsSlugs.viewDocument}
              component={ViewTutorial}
              exact
            />

            {/*COLLABORATORS*/}
            <Route
              path={collaboratorsSlugs.createDocument}
              component={CreateNewCollaborator}
              exact
            />
            <Route
              path={collaboratorsSlugs.viewCollection}
              component={CreateNewCollaborator}
              exact
            />
            <Route
              path={collaboratorsSlugs.viewDocument}
              component={CreateNewCollaborator}
              exact
            />

            {/*CONNECT*/}
            <Route
              path={connectSlugs.createDocument}
              component={CreateNewSocialNetworkProfile}
              exact
            />
            <Route
              path={connectSlugs.viewCollection}
              component={ViewAllSocialNetworkProfiles}
              exact
            />
            {/*ABOUT*/}
            <Route path={aboutSlugs.viewCollection} component={About} exact />
            {/*PRIVACY POLICY*/}
            <Route
              path={privacyPolicySlugs.viewCollection}
              component={PrivacyPolicy}
              exact
            />
            {/*TERMS AND CONDITIONS*/}
            <Route
              path={termsAndConditionsSlugs.viewCollection}
              component={TermsAndConditions}
              exact
            />
            {/*SITEMAP*/}
            <Route
              path={utilitySlugs.generateSitemap}
              component={GenerateSitemap}
              exact
            />
          </Layout>
        </Switch>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
