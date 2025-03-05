import OtherDesktopNavbar from "@/components/OtherDesktopNavbar";
import OtherMobileNavbar from "@/components/OtherMobileNavbar";
import { Sawarabi_Mincho as SawarabiMinchoFont } from "next/font/google";

const sawarabiMincho = SawarabiMinchoFont({
  subsets: ["latin"],
  weight: "400",
});

function Page() {
  return (
    <div className="relative">

      <div className="hidden lg:flex fixed top-0 left-0 right-0 z-20">
        <OtherDesktopNavbar />
      </div>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-20">
        <OtherMobileNavbar />
      </div>

      <div className="relative min-h-screen bg-gray-50">
        <div className="relative">
          <img className="h-[80vh] w-full object-cover" src="/images/background.png" alt="background" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#fff]">
            <h1 className={`text-7xl ${sawarabiMincho.className}`}>Hana</h1>
            <p className={`text-5xl ${sawarabiMincho.className}`}>Shabu & Grill</p>
            <div className="flex justify-center mt-10 mb-16">
            <a href="/register" className="bg-[#FFB8DA] hover:bg-[#ff9ec9] text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105">
              สมัครสมาชิกเพื่อจองโต๊ะ
            </a>
          </div>
          </div>
        </div>

        <div className="relative z-10 flex justify-center mt-[-15vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-[90vw] max-w-7xl mx-auto">
            <div className="bg-white p-6 shadow-lg border-0 rounded-lg overflow-hidden">
              <div className="flex flex-col justify-center items-center">
                <div className="relative w-[200px] h-[200px] mb-4">
                  <img className="w-full h-full rounded-full opacity-25" src="/images/standard.jpg" alt="standard" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-4xl text-[#4D4D4D] font-bold">229฿</p>
                  </div>
                </div>
                <p className="text-2xl font-medium text-[#4D4D4D] mb-2">Standard</p>
                <p className="text-gray-500 text-center max-w-xs">เมนูชาบูคุณภาพที่นำเสนอเนื้อหมูชั้นดี เสิร์ฟพร้อมผักสดและน้ำซุปกลมกล่อม รังสรรค์รสชาติให้คุณได้สัมผัสความอร่อยในราคาที่คุ้มค่า</p>
              </div>
            </div>

            <div className="bg-white p-6 shadow-lg border-0 rounded-lg overflow-hidden">
              <div className="flex flex-col justify-center items-center">
                <div className="relative w-[200px] h-[200px] mb-4">
                  <img className="w-full h-full rounded-full opacity-25" src="/images/premium.jpg" alt="premium" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-4xl text-[#4D4D4D] font-bold">339฿</p>
                  </div>
                </div>
                <p className="text-2xl font-medium text-[#4D4D4D] mb-2">Premium</p>
                <p className="text-gray-500 text-center max-w-xs">สัมผัสประสบการณ์ชาบูระดับพรีเมียม ทั้งเนื้อวัวเนื้อหมูชั้นเลิศ กุ้งสดเนื้อแน่น และเมนูพิเศษหลากหลาย พร้อมน้ำซุปและน้ำจิ้มรสชาติเยี่ยมที่คัดสรรมาอย่างพิถีพิถัน</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-7xl mx-auto mt-16 px-16">
          <h2 className="text-3xl font-bold text-[#4D4D4D] mb-8">โปรโมชั่น</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-[#fff] rounded-lg overflow-hidden shadow-md">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#4D4D4D] mb-4">สมาชิกใหม่ รับส่วนลด 10%</h3>
                <img className="w-full h-48 object-cover rounded-md mb-4" src="/images/standard.jpg" alt="สมาชิกใหม่" />
                <p className="text-gray-600 mb-4">สมัครเป็นสมาชิกวันนี้ รับส่วนลดทันที 10%</p>
              </div>
            </div>

            <div className="bg-[#fff] rounded-lg overflow-hidden shadow-md">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#4D4D4D] mb-4">เพื่อนเยอะ ลดเยอะ! จ่าย 4 คน 3 คน</h3>
                <img className="w-full h-48 object-cover rounded-md mb-4" src="/images/premium.jpg" alt="มากับเพื่อน" />
                <p className="text-gray-600 mb-4">ทานชาบูแบบกลุ่มและรับสิทธิพิเศษ เมื่อมา 4 คนจ่ายเพียง 3 คน</p>
              </div>
            </div>

            <div className="bg-[#fff] rounded-lg overflow-hidden shadow-md">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#4D4D4D] mb-4">ชาบูคู่รัก เพียง 599 บาท</h3>
                <img className="w-full h-48 object-cover rounded-md mb-4" src="/images/standard.jpg" alt="ชาบูคู่รัก" />
                <p className="text-gray-600 mb-4">มาเป็นคู่ รับโปรโมชั่นสุดโรแมนติก! เมื่อทานคู่กันในราคาเพียง 599 บาท ทำมะได้ทานเมนู Premium</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
