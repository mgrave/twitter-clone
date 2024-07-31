/* eslint-disable react/prop-types */
import Avatar from "react-avatar";

export const ProfileAvatar = ({
  name,
  username,
  profileImage,
  profileClick,
}) => {
  return (
    <div className="relative w-[40px] h-[40px]" onClick={profileClick}>
      <div className="w-[40px] h-[40px] rounded-full absolute bg-black opacity-0 hover:opacity-20 cursor-pointer transition-opacity duration-300"></div>
      <Avatar
        src={`http://localhost:8080/profileUploads/${username}/${profileImage}`}
        name={name}
        size="40"
        round={true}
        className="min-w-[40px] object-cover"
      />
    </div>
  );
};
