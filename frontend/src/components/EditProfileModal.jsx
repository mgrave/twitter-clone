/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { IoCloseOutline, IoCloudUploadOutline } from "react-icons/io5";
import { ProfileAvatar } from "./ProfileAvatar";

export const EditProfileModal = ({ user, isOpen, onClose, onSave }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerImagePreview, setBannerImagePreview] = useState(null);
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);

  useEffect(() => {
    if (user.profileImage) {
      setProfileImagePreview(
        `http://localhost:8080/profileUploads/${user.username}/${user.profileImage}`
      );
    } else {
      setProfileImagePreview(null);
    }
    if (user.bannerImage) {
      setBannerImagePreview(
        `http://localhost:8080/profileUploads/${user.username}/${user.bannerImage}`
      );
    } else {
      setBannerImagePreview(null);
    }
  }, [user]);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleBannerImageChange = (e) => {
    const file = e.target.files[0];
    setBannerImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setBannerImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);

    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    if (bannerImage) {
      formData.append("bannerImage", bannerImage);
    }

    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl w-[600px] h-[600px] overflow-y-auto p-0.5">
        <div className="flex items-center justify-between m-2">
          <div className="flex items-center">
            <div
              className="rounded-full hover:bg-gray-200 w-[32px] h-[32px] mr-10 flex items-center justify-center cursor-pointer transition-colors duration-300"
              onClick={onClose}
            >
              <IoCloseOutline size="24" />
            </div>
            <h2 className="text-xl font-bold ">Editar Perfil</h2>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 bg-black text-white rounded-full font-semibold"
          >
            Guardar
          </button>
        </div>

        <div className="w-full h-[200px] bg-slate-300 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <label
              htmlFor="bannerImageInput"
              className="h-[42px] w-[42px] rounded-full bg-gray-900 bg-opacity-60 flex items-center justify-center hover:bg-opacity-80 cursor-pointer transition-opacity duration-300"
            >
              <IoCloudUploadOutline size="24" className="text-white" />
            </label>
            <input
              type="file"
              id="bannerImageInput"
              accept="image/*"
              onChange={handleBannerImageChange}
              className="hidden"
            />
          </div>
          {bannerImagePreview && (
            <img
              src={bannerImagePreview}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="relative mb-24">
          <div className="absolute -top-[67px] border-4 rounded-full border-white left-4">
            <div className="h-[134px] w-[134px] absolute flex items-center justify-center">
              <label
                htmlFor="profileImageInput"
                className="w-[42px] h-[42px] rounded-full bg-opacity-60 bg-gray-900 hover:bg-opacity-80 cursor-pointer flex items-center justify-center transition-colors duration-300"
              >
                <IoCloudUploadOutline
                  size="24"
                  className="cursor-pointer text-white"
                />
              </label>
              <input
                type="file"
                id="profileImageInput"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="hidden"
              />
            </div>
            {profileImagePreview ? (
              <img
                src={profileImagePreview}
                alt="Profile"
                className="w-[134px] h-[134px] rounded-full object-cover"
              />
            ) : (
              <ProfileAvatar
                name={user.name}
                username={user.username}
                profileImage={user.profileImage}
              />
            )}
          </div>
        </div>

        <div className="mb-4 px-4">
          <label className="block text-gray-700">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded w-full py-2 px-3"
          />
        </div>
        <div className="mb-4 px-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border rounded w-full py-2 px-3"
          />
        </div>
      </div>
    </div>
  );
};
