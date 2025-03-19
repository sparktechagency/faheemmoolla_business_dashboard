import { useState, useEffect } from "react";
import { Input, Button, Upload, message } from "antd";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { MdEdit } from "react-icons/md";
import { useProfileQuery, useUpdateProfileMutation } from "../features/profile/profileApi";
import CustomLoading from "../components/CustomLoading";
import { baseURL } from "../utils/BaseURL";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isPhoneReadOnly, setIsPhoneReadOnly] = useState(false);
  const { data: user, isLoading, refetch } = useProfileQuery();

  // Initialize profile state when user data is fetched
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (user?.data) {
      setProfile({
        name: user.data.name || "",
        email: user.data.email || "",
        phone: user.data.phone || "",
      });

      // Set profile image correctly
      setPreviewImage(
        user.data.image ? `${baseURL}/${user.data.image}` :
        "https://i.ibb.co.com/fYrFP06M/images-1.png"
      );
    }
  }, [user]);

  const [updateProfile, { isLoading: updateLoading }] = useUpdateProfileMutation();
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(
    "https://i.ibb.co.com/fYrFP06M/images-1.png"
  );

  const handleFileChange = ({ file }) => {
    if (!isEditing) return;
    if (!file.originFileObj) return;

    const reader = new FileReader();
    reader.readAsDataURL(file.originFileObj);
    reader.onload = () => {
      setPreviewImage(reader.result);
      setProfileImageFile(file.originFileObj);
    };
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const phonePattern = /^[0-9]{10,15}$/;

    if (!profile.phone) {
      message.error("Phone number is required");
      return;
    }

    if (!phonePattern.test(profile.phone)) {
      message.error("Please enter a valid phone number");
      return;
    }

    const data = { phone: profile.phone, name: profile.name };
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    if (profileImageFile) {
      formData.append("image", profileImageFile);
    }

    try {
      const result = await updateProfile(formData).unwrap();
      
      // Refetch the user profile data to get the updated information
      await refetch();
      
      // If the API returns the updated user data directly, you can also update the state
      if (result?.data?.image) {
        setPreviewImage(`${baseURL}/${result.data.image}`);
      }
      
      message.success("Profile updated successfully");
      setIsEditing(false);
      setIsPhoneReadOnly(true);
      setProfileImageFile(null); // Reset the file state after successful update
    } catch (error) {
      console.error("API Error:", error);
      message.error(error?.message || "Error updating profile");
    }
  };

  if (isLoading) {
    return <CustomLoading />;
  }

  return (
    <div className="flex flex-col items-start justify-center pt-28">
      <div className="rounded-xl w-full max-w-[800px]">
        <div className="flex items-end justify-between space-x-4">
          <div className="flex items-center gap-3">
            <div className="w-[140px] h-[140px] rounded-full border-2 border-primary mx-auto flex flex-col items-center relative">
              <div className="w-full h-full rounded-full">
                <img
                  src={previewImage}
                  alt="Profile"
                  className="object-cover w-full h-full rounded-full"
                />
              </div>

              {isEditing && (
                <div className="absolute flex items-center justify-center w-8 h-8 p-2 text-center rounded-full cursor-pointer bg-[#FF991C] bottom-1 right-5">
                  <Upload showUploadList={false} onChange={handleFileChange}>
                    <MdEdit className="mt-1 text-xl text-white" />
                  </Upload>
                </div>
              )}
            </div>
            <h2 className="text-4xl font-semibold text-gray-800">
              {profile.name}
            </h2>
          </div>
          <Button
            type="text"
            icon={<EditOutlined />}
            className="mt-2 border border-primary w-[150px]"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block text-gray-600">Full Name</label>
          <Input
            name="name"
            value={profile.name}
            onChange={handleChange}
            disabled={!isEditing}
            className="border rounded-lg border-primary p-2 h-[44px]"
          />

          <label className="block text-gray-600">Email</label>
          <Input
            name="email"
            type="email"
            readOnly
            value={profile.email}
            disabled
            className="border rounded-lg border-primary p-2 h-[44px]"
          />

          <label className="block text-gray-600">Contact Number</label>
          <Input
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            disabled={isPhoneReadOnly || !isEditing}
            className="border rounded-lg border-primary p-2 h-[44px]"
            placeholder="Enter your phone number"
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="primary"
            loading={updateLoading}
            icon={<SaveOutlined />}
            className="mt-6 w-[200px] bg-primary"
            style={{ backgroundColor: "#C68C4E" }}
            onClick={handleSave}
            disabled={!isEditing}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;