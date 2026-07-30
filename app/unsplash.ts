/**
 * Curated Unsplash photos, hotlinked per Unsplash API guidelines (no key ships
 * to the browser, no rate limit at runtime). These are atmosphere and stand-ins
 * for real photos — every one is replaced the moment the matching file lands in
 * /public/photos/. Credits render in the ending.
 */
const base = (id: string) => `https://images.unsplash.com/photo-${id}?ixlib=rb-4.1.0`;

/** Sized, compressed, auto-format URL. */
export const img = (url: string, w = 1600) =>
  `${url}&w=${w}&q=72&auto=format&fit=crop`;

export const STOCK = {
  rainWindow: base("1515694346937-94d85e41e6f0"),
  rainStreet: base("1518182170546-07661fd94144"),
  rainStreet2: base("1571366657764-16ca342d3284"),
  autumn: base("1506193503569-d57d2a678510"),
  autumnMacro: base("1543683840-c66117bdb1f8"),
  orchid: base("1534885320675-b08aa131cc5e"),
  cityNight: base("1542416409-400da26855b5"),
  cityNight2: base("1596892203652-152c4e61d4b5"),
  cafe: base("1484251065541-c9770829890f"),
  cafe2: base("1639450258604-6c04ce877e41"),
  stars: base("1519810755548-39cd217da494"),
  aurora: base("1534254910684-68bdc1d69cf7"),
  plane: base("1543797414-a0c3ad076f7c"),
  planeWing: base("1603277103691-756354934c2d"),
  bar: base("1696062985889-de626efe0148"),
  bar2: base("1578911489158-334e5cd2a051"),
  letter: base("1543769657-fcf1236421bc"),
};

/** Photographer credits, required by the Unsplash API terms. */
export const CREDITS = [
  "Max Bender",
  "Aaron Burden",
  "Oliver Hihn",
  "Rita Ox",
  "Stéphan Valentin",
  "Hiep Duong",
  "Kari Shea",
  "Wafer WAN",
  "Ferenc Horvath",
  "Free Nature Stock",
  "@felirbe",
  "Shaun Alam",
  "Ambitious Studio* | Rick Barrett",
  "Klara Kulikova",
  "Jack Finnigan",
  "Lerone Pieters",
  "Micah Boswell",
];
