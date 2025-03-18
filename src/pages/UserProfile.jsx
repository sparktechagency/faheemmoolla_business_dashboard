import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Input, Spin, Upload, message } from "antd";
import { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import CustomLoading from "../components/CustomLoading";
import {
  useProfileQuery,
  useUpdateProfileMutation,
} from "../features/profile/profileApi";
import { baseURL } from "../utils/BaseURL";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isPhoneReadOnly, setIsPhoneReadOnly] = useState(false);
  const { data: user, isLoading } = useProfileQuery();

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
        user.data.image
          ? `${baseURL}${user.data.image}`
          : "https://media.istockphoto.com/id/537692968/photo/capturing-the-beauty-of-nature.jpg?s=612x612&w=0&k=20&c=V1HaryvwaOZfq80tAzeVPJST9iPoGnWb8ICmE-lmXJA="
      );
    }
  }, [user]);

  const [updateProfile, { isLoading: postLoading }] =
    useUpdateProfileMutation();
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(
    "https://media.istockphoto.com/id/537692968/photo/capturing-the-beauty-of-nature.jpg?s=612x612&w=0&k=20&c=V1HaryvwaOZfq80tAzeVPJST9iPoGnWb8ICmE-lmXJA="
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
      await updateProfile(formData).unwrap();
      message.success("Profile updated successfully");
      setIsEditing(false);
      setIsPhoneReadOnly(true);
    } catch (error) {
      console.error("API Error:", error);
      message.error(error?.message || "Error updating profile");
    }
  };

  if (isLoading) return <Spin/>;

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
            loading={postLoading}
            icon={<SaveOutlined />}
            className="mt-6 w-[200px] bg-primary"
            style={{ backgroundColor: "#C68C4E" }}
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
