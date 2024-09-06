import { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import User from "./User.jsx";
import instance from "../utils/axiosConfig.js";

export const RightSidebar = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await instance.get("http://localhost:8080/api/user/");
        setUsers(response.data.users);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="w-[26vw] hidden max-w-[350px] h-screen pr-3 lg:flex flex-col bg-white dark:bg-black ">
      <div className="flex items-center py-3 px-4 bg-gray-100 dark:bg-slate-700  rounded-full outline-none w-full mt-2">
        <div>
          <LuSearch size={"20px"} className="text-gray-500" />
        </div>
        <input
          type="text"
          className="w-full bg-transparent outline-none pl-4 text-black dark:text-white"
          placeholder="Search"
        />
      </div>
      <div className="border border-gray-200 dark:border-gray-600 rounded-2xl mt-4 overflow-hidden min-h-[336px]">
        <h1 className="font-bold text-xl ml-4 my-3 text-black dark:text-white">
          Who to follow
        </h1>
        {users.map((user) => (
          <User key={user._id} user={user} />
        ))}
      </div>
    </div>
  );
};
