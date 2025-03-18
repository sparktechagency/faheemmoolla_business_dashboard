import {
  dashboard,
  order,
  shop,
  meal,
  bank,
  offer,
  earning,
  help,
  setting,
  password,
  notification,
  privacy,
  profile,
} from "../assets/assets";

export const menuDatas = [
  {
    icon: dashboard,
    title: "Dashboard",
    link: "/",
  },
  {
    icon: order,
    title: "Order",
    link: "/order",
  },
  {
    icon: shop,
    title: "Shop Management",
    link: "/shop-management",
  },
  {
    icon: meal,
    title: "Meal Management",
    link: "/meal-management",
  },
  {
    icon: offer,
    title: "Create Offer",
    link: "/offer",
  },
  {
    icon: earning,
    title: "Earning",
    link: "/earning",
  },
  {
    icon: help,
    title: "Help",
    link: "/help",
  },
  {
    icon: setting,
    title: "Settings",
    link: "/settings",
    subLinks: [
      { subicon: password, title: "Change Password", link: "/settings" },
      { subicon: profile, title: "Profile", link: "/settings/profile" },
      {
        subicon: notification,
        title: "Notification",
        link: "/settings/notification",
      },
      {
        subicon: privacy,
        title: "Privacy and Policy",
        link: "/settings/privacy-policy",
      },
      {
        subicon: privacy,
        title: "Terms and Conditions",
        link: "/settings/terms-conditions",
      },
    ],
  },
];
