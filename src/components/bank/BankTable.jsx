import { useMemo } from 'react';
import { useAllShopQuery } from '../../features/shop/shopApi';
import BankRow from './BankRow';
import CustomLoading from '../CustomLoading';
import { Spin } from 'antd';

const BankTable = () => {
  const { data: allShop, error: queryError, isLoading: queryLoading } = useAllShopQuery({pollingInterval: 5000});

  const bankDetails = useMemo(() => allShop?.data?.shops?.map((shop) => shop?.bankCard) || [], [allShop?.data]);

  if (queryLoading) return <Spin/>;
  if (queryError) return <div className="text-center text-red-500">Server Error</div>;

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1200px] w-full bg-transparent rounded-lg shadow-md">
        {/* Table Header */}
        <div className="grid grid-cols-7 bg-surfacePrimary border-2 border-[#C68C4E] border-opacity-50 rounded-lg">
          {['Sl', 'A/C Holder Name', 'Card Number', 'Expire Date', 'CVV', 'Shop Name', 'Action'].map((heading) => (
            <div key={heading} className="py-3 font-semibold text-center">{heading}</div>
          ))}
        </div>

        {/* Table Body */}
        <div className="py-2"></div>
        <div className="bg-surfacePrimary border-2 border-[#C68C4E] border-opacity-50 rounded-lg">
          {bankDetails.length === 0 ? (
            <h3 className="py-10 text-center">No Data Available</h3>
          ) : (
            bankDetails.map((item, i) => (
              <BankRow key={i} data={allShop?.data?.shops?.slice()?.reverse()|| []} list={i} allShop={allShop} item={item} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BankTable;
