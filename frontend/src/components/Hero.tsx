"use client";

export default function Hero() {
  return (
    <section className="w-screen h-screen flex flex-col items-center text-center px-6 pt-40">
      <h1 className="text-4xl md:text-5xl font-bold text-blue-900">
        AI support for grants and contracts
      </h1>
      <p className="mt-4 text-lg text-gray-500 max-w-2xl">
        Our AI assistant helps researchers and grants officers handle routine processes instantly,
        and escalates complex queries seamlessly to the Contracts Team.
      </p>
      <button className="mt-8 px-8 py-3 text-white bg-[#033F85] rounded-full shadow-md hover:bg-blue-700">
        Start Chat Now
      </button>
    </section>
  );
}