import { orderTableDatas } from '../../constants/orderTableDatas';
import OrderRow from './OrderRow';


const OrderTable = () => {
  

  return (
    <div>
      <div>
        <div className="overflow-x-auto">
          <div className="min-w-[1200px] w-full bg-transparent rounded-lg shadow-md space-y-5">
            {/* Header section */}
            <div className="grid grid-cols-10 bg-surfacePrimary border-2 border-[#C68C4E] border-opacity-50  rounded-lg">
              <div  className="py-3 text-center"  >Date</div>
              <div  className="py-3 text-center"  >Order Number</div>
              <div  className="py-3 text-center"  >User Name</div>
              <div  className="py-3 text-center"  >Location</div>
              <div  className="py-3 text-center"  >Offer</div>
              <div  className="py-3 text-center"  >Item & Qty</div>
              <div  className="py-3 text-center"  >Price</div>
              <div  className="py-3 text-center"  >Service Charge</div>
              <div  className="py-3 text-center col-span-2"  >Status</div>
            </div>

            {/* Spacer row for margin */}
            {/* <div className="py-2"></div> */}

            {/* Body section */}
            <div className=" bg-surfacePrimary border-2 border-[#C68C4E] border-opacity-50 rounded-lg">
              {orderTableDatas?.map((item, i) => (
                <OrderRow key={i} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTable;
