import { useNavigate } from "react-router-dom";
import tramsNotDataImage from "../assets/trams.png";
import { useSettingQuery } from "../features/settings/settingApi";
import arrow from './../assets/icons/arrow.svg';

const PrivacyPolicy = () => {
  const router = useNavigate();
  const { data, isLoading, error } = useSettingQuery({ pollingInterval: 5000 });

  let privacyContent = "<p>No privacy policy available.</p>"; // Default fallback
  try {
    if (data?.data?.privacyPolicy) {
      privacyContent = JSON.parse(data.data.privacyPolicy);
    }
  } catch (err) {
    console.error("Error parsing privacy policy:", err);
  }

  return (
    <section>
      {/* Header Section */}
      <div className="rounded py-[11px] pl-[16px]">
        <div className="flex items-center gap-[20px]">
          <img onClick={()=>router('/settings')} className="cursor-pointer inactive-icon" src={arrow} alt="Back Arrow" />
          <h3 className="text-xl font-medium">Privacy Policy</h3>
        </div>
      </div>

      {/* Loading and Error Handling */}
      {isLoading ? (
        <p className="py-4 text-center">Loading...</p>
      ) : error ? (
        <p className="py-4 text-center text-red-500">Failed to load privacy policy.</p>
      ) : (
        <>
           <div className="p-10 " dangerouslySetInnerHTML={{ __html: privacyContent }} />
        </>
      )}
    </section>
  );
};

export default PrivacyPolicy;
