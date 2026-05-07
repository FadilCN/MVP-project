function Welcome() {
  return (
    <div className="pl-5 grid grid-cols-[1fr_2fr] gap-4 bg-zinc-900 h-full overflow-hidden">
      
      <div className="text-[50px] pt-10 leading-[0.9]">
        Hello<br /> User Name
      </div>

      <div className="text-[50px] pt-10 leading-[0.9]">
        <span className="text-[39px] pr-10 leading-[0.9] block text-right">
          <span className="text-cyan-400">Build more.</span>{" "}
          <span className="text-pink-400">Break less.</span>{" "}
          <span className="text-purple-400">Move faster</span>{" "}
          <span className="text-yellow-300">with AI</span>
        </span>
        <span className="text-[15px] leading-[1.3] pt-6 max-w-[400px text-slate-200 text-right block pr-10 ">
          Codable is an AI-enabled code editor that helps you write, understand,
          and improve code in real time. From instant suggestions to intelligent
          debugging, it feels like having a second brain focused entirely on your
          development flow.
        </span>
      </div>

    </div>
  );
}

export default Welcome;