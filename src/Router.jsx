import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import BankDetailsView from './components/bankInfo';
import ProtectedRoute from "./components/ProtectedRoute";
import Wallet from "./components/wallet/Wallet";
import Layout from "./layouts/Layout";
import CheckEmail from "./pages/auth/CheckEmail";
import ForgotPassword from "./pages/auth/ForgotPassword";
import GoogleCallback from './pages/auth/GoogleCallback';
import SetPassword from "./pages/auth/SetPassword";
import Login from "./pages/auth/SignIn";
import Signup from "./pages/auth/Signup";
import SuccessReset from "./pages/auth/SucessReset";
import Verify from "./pages/auth/Verify_user";
import Dashboard from "./pages/dashboard/Dashboard";
import Earning from "./pages/earning/Earning";
import Help from "./pages/help/Help";
import CreateSingleMeal from "./pages/meal/CreateNewMeal";
import EditSingleMeal from "./pages/meal/EditNewMeal";
import MealManagement from "./pages/meal/MealManagement";
import NotFound from "./pages/NotFound";
import Notification from "./pages/Notification";
import CreateOffers from "./pages/offer/CreateOffer";
import Offer from "./pages/offer/Offter";
import ViewDetails from "./pages/offer/ViewDetails";
import Order from "./pages/order/Order";
import Payouts from "./pages/payouts/Payouts";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Settings from "./pages/Settings/Settings";
import CreateNewShop from "./pages/shop/CreateNewShop";
import EditSingleShop from "./pages/shop/EditNewShop";
import ShopManagement from "./pages/shop/ShopManagement";
import TermsConditions from "./pages/TermsConditions";
import UserProfile from "./pages/UserProfile";

const Routers = () => {
  return (
    <Router>
      <Routes>
        {/* Authentication routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/success" element={<SuccessReset />} />
        <Route path="/auth/signup/verify" element={<Verify />} />
        <Route
          path="/auth/login/forgot_password"
          element={<ForgotPassword />}
        />
        <Route path="/auth/login/check_email" element={<CheckEmail />} />
        <Route path="/auth/login/set_password" element={<SetPassword />} />
        <Route path="/api/v1/auth/google/callback" element={<GoogleCallback />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="order" element={<Order />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="bank-information" element={<BankDetailsView />} />

          <Route path="shop-management">
            <Route index element={<ShopManagement />} />
            <Route path="create-new-shop" element={<CreateNewShop />} />
            <Route path="edit-shop/:shopId" element={<EditSingleShop />} />
          </Route>
          <Route path="meal-management">
            <Route index element={<MealManagement />} />
            <Route path="create-new-meal/" element={<CreateSingleMeal />} />
            <Route path="edit-meal/:mealId" element={<EditSingleMeal />} />
          </Route>
          <Route path="offer">
            <Route index element={<Offer />} />
            <Route path="create_offer" element={<CreateOffers />} />
            <Route path="view-details" element={<ViewDetails />} />
          </Route>
          <Route path="help" element={<Help />} />
          <Route path="earning" element={<Earning />} />
          <Route path="payouts" element={<Payouts />} />
          <Route path="settings">
            <Route index element={<Settings />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="notification" element={<Notification />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms-conditions" element={<TermsConditions />} />
          </Route>
        </Route>

        {/* 404 Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default Routers;
