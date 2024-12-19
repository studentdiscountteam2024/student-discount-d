"use client";

const LoginNavbar:React.FC= () => {
  return (
      <nav className="flex-col justify-between shadow-lg  bg-white fixed top-0 z-10 w-full p-3">
        <div className="flex  mt-1   justify-center items-center">      
          <a href="/" className="text-[#obdaoa] font-bold text-xl ">
            Student <span className="text-[#ff820d]">Discount</span>
          </a>
        </div>
      </nav>
  );
}
export default LoginNavbar;
