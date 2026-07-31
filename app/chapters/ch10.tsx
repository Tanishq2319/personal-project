"use client";

import ScrollReveal from "../scrollReveal";

export const DURATION = 999;

const paragraphs = [
  {
    text: `I don't really know why I'm writing this. You will probably never read it. That is kind of the whole point. It is easier to say things when you are reasonably sure no one is listening.`,
  },
  {
    text: `There is this thing that happens when you spend enough time with someone. You stop noticing the exact moment things change. One day it is just normal, and then one day it isn't, and you can never really point to the line between those two things. I think for me it was somewhere at Mudcups. We were sitting at that corner table, the one we always ended up at without planning to, your coffee going cold because we wouldn't stop talking. I don't even remember what we were saying. But I remember the exact way you looked when you were listening. Like you were actually there. Like you weren't thinking about something else. I remember noticing that and then not knowing what to do with the fact that I had noticed it.`,
  },
  {
    text: `And then there was Valentine's Day. My first one. And somehow, in what I can only describe as a very confident and very terrible decision, I showed up with three girls. Three. On Valentine's Day. I want you to sit with that for a second. I had genuinely convinced myself this was going to go well. It did not go well. I spent most of that day performing the version of myself that was fine and having a great time. But there were small bits of that day I spent with just you, and those were the only parts where I actually relaxed. Where I stopped performing. Where I laughed without thinking about it first. I didn't connect those dots at the time. Looking back, they were very obvious dots.`,
  },
  {
    text: `After that I started noticing everything. I noticed which side of the room you sat on. I noticed the face you made right before you laughed, that little half-second before it actually happened. I noticed that you always started laughing at your own joke before you even finished telling it and you could never hold it together. I noticed the way you said certain words. I noticed when you were tired versus when you were just being quiet. I didn't try to notice any of this. It just happened on its own. And once it started I couldn't make it stop, so I gave up trying.`,
  },
  {
    text: `I kept track of things I had absolutely no reason to keep track of. Like the rain walk, where there was perfectly good dry shelter ten steps away and neither of us moved towards it. We just kept walking in the rain, completely soaked, laughing at how stupid we were being. A sensible person would have run for cover in the first thirty seconds. We stayed out for the whole thing. I think about that walk more than I have any right to.`,
  },
  {
    text: `Or Gilly's, where it was too loud to hear anything properly and we still somehow talked the whole time. And somewhere in the middle of all that noise you got me a cake. For my birthday. In a bar. I don't know how you even planned that without me noticing. I remember the table laughing and me not knowing what face to make, and you just looking very pleased with yourself. Which was fair. That was a good one. I haven't forgotten it.`,
  },
  {
    text: `Or the college fest where there were hundreds of people moving in every direction and lights and music and noise, and the only thing I was actually paying attention to was where you were standing.`,
  },
  {
    text: `I am not sure what any of that adds up to. I never tried to figure it out properly or put a name on it. It felt easier to just let it be what it was and not ask too many questions. I just know that those were the parts of that whole year that felt the most real. The most like something I would want to hold onto.`,
  },
  {
    text: `So I did. All of it. Even the blurry ones. Especially the blurry ones.`,
  },
];

export default function Ch10() {
  return (
    <div className="relative h-full scroll-touch bg-[#07070F] text-white">

      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-purple-900/20 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/3 size-[400px] rounded-full bg-pink-900/10 blur-[100px]" />
      </div>

      {/* Film grain */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC43IiBudW1PY3RhdmVzPSI0IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNuKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />

      <div className="relative z-10 max-w-xl w-full mx-auto flex flex-col gap-12 px-6 pt-16 pb-28">

        {/* Title */}
        <ScrollReveal>
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-mono tracking-[0.6em] text-purple-400/60 uppercase">
              Director's Cut · Unlocked
            </span>
            <h1 className="font-mono text-2xl sm:text-3xl font-bold text-white/90 leading-snug">
              A Letter Written Before<br />I Had The Courage
            </h1>
            <span className="text-xs font-mono text-white/25 tracking-widest">
              For Shreya. From the version of me who was scared to say this out loud.
            </span>
          </div>
        </ScrollReveal>

        {/* Thin rule */}
        <ScrollReveal>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </ScrollReveal>

        {/* Letter paragraphs */}
        <div className="flex flex-col gap-8">
          {paragraphs.map((p, i) => (
            <ScrollReveal key={i} delay={i * 60} direction="up">
              <p className="font-mono text-sm sm:text-base text-white/60 leading-[2] tracking-wide">
                {p.text}
              </p>
            </ScrollReveal>
          ))}
        </div>

        {/* Sign-off */}
        <ScrollReveal delay={200}>
          <div className="flex flex-col gap-6 pt-4">
            <div className="h-px w-16 bg-purple-400/20" />
            <p className="font-mono text-white/80 text-base font-bold tracking-widest">
              T
            </p>
          </div>
        </ScrollReveal>

        {/* Bottom label */}
        <ScrollReveal delay={300}>
          <div className="text-center pt-8 border-t border-white/5">
            <span className="font-mono text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
              Oiiiiii.
            </span>
            <p className="text-[10px] font-mono tracking-widest text-white/15 uppercase mt-3">
              A Memory Series · Original · Season 1 · 2024
            </p>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}
