import { TiArrowUp } from "react-icons/ti";
import { totalFood, totalitem, totalRevenue, totalShop } from "../assets/assets";


/* ---------------------- Top all mini cards datas ---------------------- */
export const dashboardTopCardDatas = [
  {
    cardImg: totalFood,
    cardCount: "75",
    cardTitle: "Total Food Sell",
    cardPercentage: "4% (30 days)",
    icon: (
      <span className="p-[1px] bg-[#00B074] bg-opacity-15 rounded-full">
        <TiArrowUp className="text-lg text-[#00B074]" />
      </span>
    ),
  },
  {
    cardImg: totalRevenue,
    cardCount: "$128",
    cardTitle: "Total Revenue",
    cardPercentage: "12% (30 days)",
    icon: (
      <span className="p-[1px] bg-red-200 rotate-180 rounded-full ">
        <TiArrowUp className="text-lg text-red-400" />
      </span>
    ),
  },
  {
    cardImg: totalitem,
    cardCount: "357",
    cardTitle: "Total Item",
  },
  {
    cardImg: totalShop,
    cardCount: 75,
    cardTitle: "Total Shop",
  },
];

/* ---------------------- Top all mini cards datas ---------------------- */
export const orderTopCardDatas = [
  {
    cardImg: totalitem,
    cardCount: "357",
    cardTitle: "Completed Orders",
  },
  {
    cardImg: totalRevenue,
    cardCount: "$38",
    cardTitle: "Orders in Progress",
    cardPercentage: "12% (30 days)",
    icon: (
        <span className="p-[1px] bg-red-200 rotate-180 rounded-full ">
          <TiArrowUp className="text-lg text-red-400" />
        </span>
      )
    },
    {
      cardImg: totalFood,
      cardCount: "75",
      cardTitle: "Total Food Sell",
      cardPercentage: "4% (30 days)",
      icon: (
        <span className="p-[1px] bg-[#00B074] bg-opacity-15 rounded-full">
          <TiArrowUp className="text-lg text-[#00B074]" />
        </span>
      ),
    }
]
  