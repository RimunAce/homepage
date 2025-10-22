"use client";

export default function Contact() {
  return (
    <section id="contact" className="retro-card relative overflow-visible">
      <img
        src="https://cdn.apis.rocks/images/teto.png"
        alt="Character"
        className="absolute -right-4 -bottom-6 z-50 pointer-events-none w-32 h-auto sm:w-36 sm:-right-6 sm:-bottom-8 md:w-44 md:-right-8 md:-bottom-10 lg:w-52 lg:-right-10 lg:-bottom-12"
      />
      <h2 className="retro-heading">CONTACT</h2>
      <div className="space-y-3">
        <div className="retro-text">
          <p className="font-bold text-sm mb-2">GET IN TOUCH</p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs">GitHub:</span>
              <a
                href="https://github.com/RimunAce"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs retro-link"
              >
                @RimunAce
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs">Discord:</span>
              <span className="text-xs">respire</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs">Email:</span>
              <a href="mailto:hi@respire.my" className="text-xs retro-link">
                hi@respire.my
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-retro-black pt-3">
          <p className="text-xs retro-text">
            Feel free to reach out for collaborations, questions, or just to say
            hello!
          </p>
        </div>
      </div>
    </section>
  );
}
