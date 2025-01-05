import Image from 'next/image';

export default function SolutionCard() {
  return (
    <div       className="min-h-screen bg-black bg-[url('/soutionBk.webp')] bg-cover bg-center flex items-center justify-center mt-10" >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Container */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-4">
              Unlock the Potential of Crypto
            </h1>
            <p className="text-lg leading-relaxed mb-6">
              Dive into the world of cryptocurrency with our premium selection. Featuring Bitcoin, the original trailblazer, Ethereum, the platform of endless possibilities, and Kaspa, the new frontier of speedy transactions.
            </p>
            <p className="text-lg leading-relaxed">
              Our curated collection offers you the keys to explore the innovative landscapes of digital currencies. Whether you are looking to invest, trade, or mine, our comprehensive solutions provide you with the power to join the financial revolution. Experience the synergy of security and progress, with our trusted cryptocurrencies. Start your journey with us today and be part of shaping the future of commerce.
            </p>
          </div>

          {/* Right Content */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Image
                src="/soution2.jpg" // Replace with your image path
                alt="Bitcoin"
                className="rounded-lg shadow-lg"
                width={300}
                height={300}
              />
            </div>
            <div className="relative">
              <Image
                src="/soution4.webp" // Replace with your image path
                alt="Ethereum"
                className="rounded-lg shadow-lg"
                width={300}
                height={300}
              />
            </div>
            <div className="col-span-2 relative">
              <Image
                src="/soution3.webp" // Replace with your image path
                alt="Kaspa"
                className="rounded-lg shadow-lg"
                width={600}
                height={300}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
