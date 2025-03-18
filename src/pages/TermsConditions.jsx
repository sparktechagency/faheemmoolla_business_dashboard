import trams from "../assets/trams.png"
import arrow from './../assets/icons/arrow.svg';


const TermsConditions = () => {
    return (
      <section>
        <div>
<div className='rounded py-[11px] pl-[16px]'>
                <div className='flex items-center gap-[20px]'>
                    <img className='cursor-pointer inactive-icon' src={arrow} alt="" />
                    <h3 className='text-xl font-medium'>Terms & Conditions</h3>
                </div>
        </div>
        </div>
        <div className="px-[303px] py-[68px]">
            <img src={trams} alt="" />
        </div>
      </section>
    );
};

export default TermsConditions;