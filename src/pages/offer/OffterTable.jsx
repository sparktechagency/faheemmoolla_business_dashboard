import { Link } from 'react-router-dom';
import { offerTableDatas } from '../../constants/offerTableDatas';
import OfferRow from '../../components/offer/OfferRow';


const OfferTable = () => {
  

  return (
    <div>
      <div className='space-y-4'>
      
        <div className="overflow-x-auto">
          <div className="min-w-[1200px] w-full bg-transparent rounded-lg shadow-md space-y-5">
            {/* Header section */}
            <div className="grid grid-cols-11 border-2 border-opacity-50 rounded-lg bg-surfacePrimary border-primary">
              <div  className="py-3 text-center">SL</div>
              <div  className="py-3 text-center">Shop Name</div>
              <div  className="py-3 text-center">Item Name</div>
              <div  className="py-3 text-center">Offer Type</div>
              <div  className="py-3 text-center">Category</div>
              <div  className="py-3 text-center">Start Date</div>
              <div  className="py-3 text-center">End Date</div>
              <div  className="py-3 text-center">Price</div>
              <div  className="py-3 text-center">Status</div>
              <div  className="col-span-2 py-3 text-center">Action</div>
            </div>

            {/* Spacer row for margin */}
            {/* <div className="py-2"></div> */}

            {/* Body section */}
            <div className="border-2 border-opacity-50 rounded-lg  bg-surfacePrimary border-primary">
              {offerTableDatas?.map((item, i) => (
                <OfferRow key={i} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferTable;
