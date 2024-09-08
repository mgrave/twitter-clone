/* eslint-disable react/prop-types */
import Avatar from "react-avatar";

export const ProfileAvatar = ({
  name,
  profileImage,
  profileClick,
  w,
  h,
  s,
}) => {
  return (
    <div className={`relative ${w ? w : "w-40px"} ${h ? h : "h-40px"}`}>
      <div
        className={`${w ? w : "w-40px"} ${
          h ? h : "h-40px"
        } rounded-full absolute bg-black opacity-0 hover:opacity-20 cursor-pointer transition-opacity duration-300`}
        onClick={profileClick}
      ></div>
      <Avatar
        src={`http://localhost:8080/api/user/profileImage/${profileImage}`}
        name={name}
        size={s ? s : "40"}
        round={true}
        className="min-w-[40px] object-cover"
        onClick={profileClick}
      />
    </div>
  );
};
