const Loader = ({ feed }) => {
  return (
    <div
      className={`flex justify-center items-center ${!feed && "min-h-screen"}`}
    >
      <div className="loader border-[16px] border-white dark:border-black rounded-full w-[120px] h-[120px] border-t-sky-500 dark:border-t-sky-500"></div>
    </div>
  );
};

export default Loader;
