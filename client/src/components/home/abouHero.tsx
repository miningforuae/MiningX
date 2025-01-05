export default function WeMineSection() {
    return (
      <section className="bg-primary text-white py-16 px-8 md:px-16 lg:px-32">
        {/* Container */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          {/* Left Section */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-green-500 font-bold uppercase mb-2">
              Some Words About Us
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Join the <span className="text-white">WeMine</span>
              <br />
              Community Today!
            </h1>
          </div>
  
          {/* Right Section */}
          <div className="flex-1 flex flex-col gap-8">
            {/* Innovative Collaboration */}
            <div>
              <h2 className="font-bold text-xl mb-2">Innovative collaboration</h2>
              <p className="text-gray-300">
                We work closely with industry experts to drive cutting-edge
                advancements in mining technology, ensuring that our customers
                have access to the most efficient solutions.
              </p>
            </div>
  
            {/* Miner-Centric Approach */}
            <div>
              <h2 className="font-bold text-xl mb-2">Miner-centric approach</h2>
              <p className="text-gray-300">
                We prioritize understanding their unique needs, providing
                personalized support, and delivering customised solutions to help
                them maximize their mining capabilities and achieve their goals.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
  