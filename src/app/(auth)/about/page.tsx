function AboutPage() {
  return (
    <>
      <div className="relative w-full max-w-4xl h-[90vh] bg-white rounded-3xl shadow-2xl flex overflow-hidden">

        <div className="w-1/2 bg-green-100 flex items-center justify-center relative">
          <div className="absolute w-64 h-64 bg-green-200 rounded-full top-24 left-12"></div>
          <img src="https://cdn-icons-png.flaticon.com/512/2913/2913990.png" alt="Tree" className="w-48 h-48 z-10" />
        </div>


        <div className="w-1/2 bg-green-900 text-white flex flex-col justify-center px-12">
          <h2 className="text-3xl font-bold mb-8">Login</h2>
          
        </div>
      </div>
      </>
      );
}
      export default AboutPage