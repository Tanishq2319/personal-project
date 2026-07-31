"use client";

import { motion } from "framer-motion";
import { Backdrop, EASE, Line, Tint, TitleCard } from "../ui";
import { STOCK, img } from "../unsplash";

const ACCENT = "var(--color-rose)";
export const DURATION = 35;

export default function Ch9() {
  return (
    <div className="relative h-full scroll-touch overflow-x-hidden bg-[#0B0B0D]">
      <Backdrop src={img(STOCK.stars)} opacity={0.3} blur={5} />
      <Tint color={ACCENT} strength={22} />

      <TitleCard label="Episode Nine" title="The Soundtrack" out={6} accent={ACCENT} />

      <div className="w-full max-w-xl mx-auto px-6 pt-24 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 5.5, ease: EASE }}
          className="mx-auto rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur-2xl shadow-2xl"
        >
          {/* Vinyl Disc Animation */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="mx-auto size-44 rounded-full bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-950 p-2 shadow-2xl border border-white/20 relative grid place-items-center"
          >
            <div className="size-16 rounded-full bg-purple-900/60 border border-purple-400/40 grid place-items-center">
              <span className="size-4 rounded-full bg-white/80" />
            </div>
          </motion.div>

          <h3 className="mt-8 font-(family-name:--font-display) text-2xl text-white font-light">
            Our Rain & Late-Night Playlist
          </h3>
          <p className="mt-2 text-xs text-white/50 font-light">
            The songs that played in the background while we talked about everything.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
