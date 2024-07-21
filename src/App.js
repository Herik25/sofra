import React, { useEffect } from "react";

import ReactGA from "react-ga";
import { Switch } from "react-router-dom/cjs/react-router-dom";
import { BrowserRouter } from "react-router-dom/cjs/react-router-dom.min";
import AppRoute from "./layouts/App_route";
// layouts
import DefaultLight from "./layouts/Default";
import DefaultLightProfessional from "./layouts/DefaultProfessional";
import Full from "./layouts/Full";
import ProductDefault from "./layouts/ProductDefault";
import Seller_layout from "./layouts/Seller_layout";

//page
import Home from "./page/Home";
import Cart from "./page/cart";
import Checkout from "./page/checkout";
import Contact from "./page/contact";
import Payment_form from "./page/payment_form";
import Feedback from "./page/feedback";
import Unsubscribe from "./page/unsubscribe";
import Login from "./page/login";
import Register from "./page/register";
import MobileOTP from "./page/mobile_otp";
import MobileForgot from "./page/mobile_forgot";
import SellerForgot from "./page/seller_forgot";
import Seller from "./page/seller_signup";
import SellerLogin from "./page/seller_login";
import SellerOTP from "./page/seller_otp";

import ProjectDetail from "./page/project_detail";
import ProfessionalProjectDetail from "./page/professional_project_detail";
import Professional from "./page/professional_signup";
import ProfessionalKnowHowDetail from "./page/professional_know_how_detail";
import KnowHowDetail from "./page/know_how_detail";
import LivingExperienceDetail from "./page/living_experience_detail";
import ResetPassword from "./page/reset_password";
import KnowHowList from "./page/knowhow_list";
import KnowHowAdd from "./page/add_know_how";
import WriteKnowHow from "./page/writeknowhow";
import LivingExperienceAdd from "./page/add_living_experience";
import LivingExperienceList from "./page/living_experience_list";
import ProfessionalForgot from "./page/professional_forgot";
import ProfessionalLogin from "./page/professional_login";
import SellerDetail from "./page/seller_detail";
import Thankyou from "./page/thankyou";
import QuestionList from "./page/question_list";
import QuestionDetail from "./page/question_detail";
import Paypal from "./page/paypal";
import ProfessionalOTP from "./page/professional_otp";
import MyProfile from "./page/my_profile";
import FrontProductList from "./page/front_product_list";
import BestSellerList from "./page/best_seller_list";
import SaleProductList from "./page/sale_product_list";
import ShopByCategory from "./page/shop_by_category";
import ShopByRoom from "./page/shop_by_room";
import ShopBySubRoom from "./page/shop_by_sub_room";
import FrontProjectList from "./page/front_project_list";
import SellerProfile from "./page/seller_profile";
import ProfessionalSetupProfile from "./page/professional_setup_profile";
import ProfessionalCategory from "./page/professional_category";
import ProfessionalListing from "./page/professional_listing";
import ProfessionalDetail from "./page/professional_detail";
import ProfessionalProfile from "./page/professional_profile";
import Logout from "./page/logout";
import PrivacyPolicy from "./page/detail";
import ArticleDetails from "./page/article_details";
import UploadProjectForm from "./page/upload_project_form";
import MyAccount from "./page/my_account";
import Dashboard from "./page/dashboard";
import Product from "./page/product";
import ProjectList from "./page/project_list";
import OrderList from "./page/order_list";
import OrderDetail from "./page/order_detail";
import ProductList from "./page/product_list";

const TRACKING_ID = "UA-375759806";
ReactGA.initialize(TRACKING_ID);

function App() {
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  return (
    <>
      <BrowserRouter basename="/">
        <Switch>
          <AppRoute exact path="/" component={Home} layout={DefaultLight} />
          <AppRoute exact path="/home" component={Home} layout={DefaultLight} />
          <AppRoute
            exact
            path="/home/:device_type"
            component={Home}
            layout={DefaultLight}
          />
          <AppRoute exact path="/cart" component={Cart} layout={DefaultLight} />
          <AppRoute
            exact
            path="/checkout"
            component={Checkout}
            layout={DefaultLight}
          />
          <AppRoute
            exact
            path="/contact"
            component={Contact}
            layout={DefaultLight}
          />
          <AppRoute
            exact
            path="/payment_form"
            component={Payment_form}
            layout={DefaultLight}
          />
          <AppRoute
            exact
            path="/feedback"
            component={Feedback}
            layout={DefaultLight}
          />
          <AppRoute
            exact
            path="/unsubscribe/:code"
            component={Unsubscribe}
            layout={DefaultLight}
          />
          <AppRoute exact path="/login" component={Login} layout={Full} />
          <AppRoute exact path="/register" component={Register} layout={Full} />
          <AppRoute
            exact
            path="/mobile-otp"
            component={MobileOTP}
            layout={Full}
          />
          <AppRoute
            exact
            path="/mobile-forgot"
            component={MobileForgot}
            layout={Full}
          />
          {/* <AppRoute exact path="/home/:device_type" component={Home} layout={DefaultLight} /> */}
          <AppRoute
          exact
          path="/productdetail/:product_id"
          component={ProjectDetail}
          layout={ProductDefault}
        />
        <AppRoute
          exact
          path="/projectdetail/:project_id"
          component={ProjectDetail}
          layout={DefaultLight}
        />
        <AppRoute
          exact
          path="/professionalprojectdetail/:project_id"
          component={ProfessionalProjectDetail}
          layout={DefaultLightProfessional}
        />
        <AppRoute
          exact
          path="/know-how-detail/:know_id"
          component={KnowHowDetail}
          layout={DefaultLight}
        />
        <AppRoute
          exact
          path="/professionalknowhowdetail/:know_id"
          component={ProfessionalKnowHowDetail}
          layout={DefaultLightProfessional}
        />
        <AppRoute
          exact
          path="/living-experience-detail/:living_id"
          component={LivingExperienceDetail}
          layout={DefaultLight}
        />
        <AppRoute
          exact
          path="/Reset-password"
          component={ResetPassword}
          layout={DefaultLight}
        />
        <AppRoute
          exact
          path="/know-how-list"
          component={KnowHowList}
          layout={DefaultLight}
        />
        <AppRoute
          exact
          path="/add-know-how"
          component={KnowHowAdd}
          layout={Full}
        />
        <AppRoute
          exact
          path="/add-know-how/:id"
          component={KnowHowAdd}
          layout={Full}
        />
        <AppRoute
          exact
          path="/knowhow"
          component={WriteKnowHow}
          layout={DefaultLight}
        />
        <AppRoute
          exact
          path="/add-living-experience"
          component={LivingExperienceAdd}
          layout={Full}
        />
        <AppRoute
          exact
          path="/add-living-experience/:id"
          component={LivingExperienceAdd}
          layout={Full}
        />
        <AppRoute
          exact
          path="/living-experience-list"
          component={LivingExperienceList}
          layout={DefaultLight}
        />
        <AppRoute
          exact
          path="/Professional-signup"
          component={Professional}
          layout={DefaultLightProfessional}
        />
        <AppRoute
          exact
          path="/Professional-forgot"
          component={ProfessionalForgot}
          layout={DefaultLightProfessional}
        />
        <AppRoute
          exact
          path="/Professional-login"
          component={ProfessionalLogin}
          layout={DefaultLightProfessional}
        />
        <AppRoute
          exact
          path="/Professional-login/:device_type"
          component={ProfessionalLogin}
          layout={DefaultLightProfessional}
        />
        <AppRoute
          exact
          path="/Seller-signup"
          component={Seller}
          layout={DefaultLightProfessional}
        />
        <AppRoute
          exact
          path="/Seller-detail/:seller_id"
          component={SellerDetail}
          layout={DefaultLight}
        />
        <AppRoute
          exact
          path="/Thankyou"
          component={Thankyou}
          layout={DefaultLight}
        />
        <AppRoute
          exact
          path="/Paypal/:grand_total"
          component={Paypal}
          layout={DefaultLight}
        />
        <AppRoute
          exact
          path="/question-list"
          component={QuestionList}
          layout={DefaultLight}
        />
        <AppRoute
          exact
          path="/question-detail/:question_id"
          component={QuestionDetail}
          layout={DefaultLight}
        />
        <AppRoute
          exact
          path="/Seller-login"
          component={SellerLogin}
          layout={DefaultLightProfessional}
        />
        <AppRoute
          exact
          path="/Seller-login/:device_type"
          component={SellerLogin}
          layout={DefaultLightProfessional}
        />
         <AppRoute
          exact
          path="/Seller-forgot"
          component={SellerForgot}
          layout={DefaultLightProfessional}
        />
        {/* <AppRoute exact path="/Seller-otp" component={SellerOTP} layout={DefaultLight} /> */}
        <AppRoute
          exact
          path="/Seller-otp/:seller_id"
          component={SellerOTP}
          layout={DefaultLightProfessional}
        />
        <AppRoute
          exact
          path="/Professional-otp/:professional_id"
          component={ProfessionalOTP}
          layout={DefaultLightProfessional}
        />
        <AppRoute
          exact
          path="/My-profile"
          component={MyProfile}
          layout={DefaultLight}
        />
        <AppRoute
          exact
          path="/Living-Room"
          component={FrontProductList}
          layout={DefaultLight}
        />
        <AppRoute
          exact
          path="/best-seller"
          component={BestSellerList}
          layout={DefaultLight}
        />
        <AppRoute
          exact
          path="/sale-product"
          component={SaleProductList}
          layout={DefaultLight}
        />
        <AppRoute
          exact
          path="/sale-product/:search"
          component={SaleProductList}
          layout={DefaultLight}
        />
        <AppRoute
          exact
          path="/Living-Room/:id"
          component={FrontProductList}
          layout={DefaultLight}
        />
        <AppRoute
          exact
          path="/shop-by-category"
          component={ShopByCategory}
          layout={DefaultLight}
        />
        <AppRoute
          exact
          path="/shop-by-room"
          component={ShopByRoom}
          layout={DefaultLight}
        />
        <AppRoute
          exact
          path="/shop-by-subcat/:room_id"
          component={ShopBySubRoom}
          layout={DefaultLight}
        />
        <AppRoute
          exact
          path="/projects"
          component={FrontProjectList}
          layout={DefaultLight}
        />
        <AppRoute
          exact
          path="/Seller-profile/:seller_id"
          component={SellerProfile}
          layout={Full}
        />
        <AppRoute
          exact
          path="/Setup-profile/:professional_id"
          component={ProfessionalSetupProfile}
          layout={Full}
        />
        <AppRoute
          exact
          path="/Setup-profile/:professional_id/:check"
          component={ProfessionalSetupProfile}
          layout={Full}
        />
        <AppRoute
          exact
          path="/Professional-category"
          component={ProfessionalCategory}
          layout={DefaultLight}
        />
        <AppRoute
          exact
          path="/Professional-listing/:professional_id"
          component={ProfessionalListing}
          layout={DefaultLight}
        />
        <AppRoute
          exact
          path="/Professional-detail/:professional_id"
          component={ProfessionalDetail}
          layout={DefaultLight}
        />
        <AppRoute
          exact
          path="/Professional-profile"
          component={ProfessionalProfile}
          layout={DefaultLightProfessional}
        />
        <AppRoute
          exact
          path="/Logout"
          component={Logout}
          layout={DefaultLight}
        />
        <AppRoute
          exact
          path="/detail/:cms_id"
          component={PrivacyPolicy}
          layout={DefaultLight}
        />
        <AppRoute
          exact
          path="/acrticle_detail/:article_id"
          component={ArticleDetails}
          layout={DefaultLight}
        />
        <AppRoute
          exact
          path="/Upload-project"
          component={UploadProjectForm}
          layout={Full}
        />
        <AppRoute
          exact
          path="/Upload-project/:id"
          component={UploadProjectForm}
          layout={Full}
        />
        <AppRoute
          exact
          path="/My-Account"
          component={MyAccount}
          layout={Seller_layout}
        />
        <AppRoute
          exact
          path="/Dashboard"
          component={Dashboard}
          layout={Seller_layout}
        />
        <AppRoute
          exact
          path="/Product"
          component={Product}
          layout={Seller_layout}
        />
        <AppRoute
          exact
          path="/ProductList"
          component={ProductList}
          layout={Seller_layout}
        />
        <AppRoute
          exact
          path="/edit-sellerproduct/:id"
          component={Product}
          layout={Seller_layout}
        />
        <AppRoute
          exact
          path="/ProjectList"
          component={ProjectList}
          layout={Seller_layout}
        />
        <AppRoute
          exact
          path="/edit-sellerproject/:id"
          component={UploadProjectForm}
          layout={Seller_layout}
        />
        <AppRoute
          exact
          path="/Orders"
          component={OrderList}
          layout={Seller_layout}
        />
        <AppRoute
          exact
          path="/Order-detail/:oid"
          component={OrderDetail}
          layout={Seller_layout}
        />
        <AppRoute
          exact
          path="/Reports"
          component={ProjectList}
          layout={Seller_layout}
        />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
