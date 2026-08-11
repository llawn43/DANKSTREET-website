/* =========================================================================
   DANK STREET — SITE CONTENT
   -------------------------------------------------------------------------
   Sources:
   - 0_Input/ArtistMarketing/DANK STREET/DANK STREET_Tour_Info.xlsx
   - https://linktr.ee/dankstreetmusic
   - Spotify artist 0NLNgYQ7nC55xyR1yK0ELY
   - DANK MEDIA KIT 2026/LIVE PHOTOS (hero + contact — rebuild via scripts/build_hero_from_live_photos.py)
   - Apple Music / iTunes 30s previews for Sound toggle playlist
   ========================================================================= */
window.DANK_STREET = {
  /* --- Identity ------------------------------------------------------- */
  name: "DANK STREET",
  tagline: "bass \u00b7 house \u00b7 garage",
  bio:
    "Philly / NYC based DJ and producer. Bass, house, and garage for dark rooms and late nights. " +
    "Releases with No Hype Music and Deep Legends. Bookings & promo: dankstreets@gmail.com",

  logo: "assets/img/logo-hero.png",
  headshot: "assets/img/photos/live-01-headshot.jpg",
  epk: "assets/img/epk.jpg",
  /* Landscapes first so background-size:cover fills wide desktops without bars.
     Portrait frames still use cover (crop sides on desktop / top-bottom on mobile). */
  heroPhotos: [
    "assets/img/photos/live-02-otherworld.jpg",
    "assets/img/photos/live-06-otherworld-2.jpg",
    "assets/img/photos/live-05-press.jpg",
    "assets/img/photos/live-03-barbary.jpg",
    "assets/img/photos/live-08-otherworld-20.jpg",
    "assets/img/photos/live-09-barbary-wide.jpg",
    "assets/img/photos/live-01-headshot.jpg",
    "assets/img/photos/live-10-dank-street-portrait.jpg",
  ],

  /* --- Hero emblem (3D icon logo) ------------------------------------- */
  emblemImage: "assets/img/icon-logo.png",

  /* --- Audio (30s release previews; Sound toggle playlist) ------------ */
  audio: {
    playlist: [
      { src: "assets/audio/previews/en-la-calle.mp3", label: "EN LA CALLE" },
      { src: "assets/audio/previews/ride-out.mp3", label: "RIDE OUT" },
      { src: "assets/audio/previews/get-down.mp3", label: "GET DOWN" },
      { src: "assets/audio/previews/no-disrespect.mp3", label: "NO DISRESPECT" },
      { src: "assets/audio/previews/attack.mp3", label: "ATTACK" },
    ],
    hover: "",
    click: "",
  },

  /* --- Music / discography ------------------------------------------- */
  tracks: [
    {
      title: "EN LA CALLE EP",
      year: "2026",
      cover: "assets/img/covers/en-la-calle.jpg",
      links: [
        { label: "Spotify", url: "https://open.spotify.com/album/2E1cEs3TvynqRdvBwOmWYy" },
        { label: "SoundCloud", url: "https://soundcloud.com/dankstreet/sets/en-la-calle-tusi" },
        { label: "Apple Music", url: "https://music.apple.com/us/artist/dank-street/1811364253" },
      ],
      embed: "https://open.spotify.com/embed/album/2E1cEs3TvynqRdvBwOmWYy",
    },
    {
      title: "RIDE OUT",
      year: "2026",
      cover: "assets/img/covers/ride-out.jpg",
      links: [
        { label: "Spotify", url: "https://open.spotify.com/album/2HfxYi09ht5IGIbYyWEu3o" },
        { label: "SoundCloud", url: "https://soundcloud.com/dankstreet" },
      ],
      embed: "https://open.spotify.com/embed/album/2HfxYi09ht5IGIbYyWEu3o",
    },
    {
      title: "GET DOWN EP",
      year: "2026",
      cover: "assets/img/covers/get-down.jpg",
      links: [
        { label: "Spotify", url: "https://open.spotify.com/album/6R0Ntx5HMZtzrcWofvSUpd" },
        { label: "SoundCloud", url: "https://soundcloud.com/dankstreet" },
      ],
      embed: "https://open.spotify.com/embed/album/6R0Ntx5HMZtzrcWofvSUpd",
    },
    {
      title: "NO DISRESPECT",
      year: "2026",
      cover: "assets/img/covers/no-disrespect.jpg",
      links: [
        { label: "Spotify", url: "https://open.spotify.com/album/1RBdkX82HJCY5WuV0hDGW0" },
        { label: "SoundCloud", url: "https://soundcloud.com/dankstreet" },
      ],
      embed: "https://open.spotify.com/embed/album/1RBdkX82HJCY5WuV0hDGW0",
    },
    {
      title: "ATTACK",
      year: "2026",
      cover: "assets/img/covers/attack.jpg",
      links: [
        { label: "Spotify", url: "https://open.spotify.com/album/3o10b05oI2qrUJ8rUW8AbG" },
        { label: "SoundCloud", url: "https://soundcloud.com/dankstreet" },
      ],
      embed: "https://open.spotify.com/embed/album/3o10b05oI2qrUJ8rUW8AbG",
    },
    {
      title: "PRAY FOR 'EM (w/ Viziion)",
      year: "2025",
      cover: "assets/img/covers/pray-for-em.jpg",
      links: [
        { label: "Spotify", url: "https://open.spotify.com/album/0C3NUppMOUCSURv24SNeaa" },
        { label: "SoundCloud", url: "https://soundcloud.com/dankstreet" },
      ],
      embed: "https://open.spotify.com/embed/album/0C3NUppMOUCSURv24SNeaa",
    },
  ],

  /* --- Tour (from DANK STREET AUGSEPT CALENDAR.JPG "End of Summer Run"
     + DANK STREET_Tour_Info.xlsx + Linktree tickets) ------------------- */
  tour: [
    {
      date: "AUG 07",
      city: "Elements Festival",
      venue: "Solar Sounds — Vibe Village Stage",
      tickets: "",
    },
    {
      date: "AUG 15",
      city: "Philadelphia, PA",
      venue: "The Barbary — Ragie Ban / Sound Selectas 2-year anniversary",
      tickets: "https://www.tixr.com/amp/1dojqp/198416",
    },
    {
      date: "AUG 21",
      city: "The Dolphin",
      venue: "Sunday Scaries — Direct Support",
      tickets: "",
    },
    {
      date: "AUG 29",
      city: "The Ave Live",
      venue: "Shipwrek",
      tickets: "",
    },
    {
      date: "AUG 30",
      city: "Liberty Point",
      venue: "Day Fest — Sound Selectas Takeover",
      tickets: "",
    },
    {
      date: "SEP 05",
      city: "Orlando, FL",
      venue: "Urban Air — Wonky Willa / Smith",
      tickets: "",
    },
    {
      date: "SEP 11",
      city: "Philadelphia, PA",
      venue: "Breakaway Philly — Silent Disco",
      tickets: "https://www.universe.com/events/breakaway-philadelphia-2026-tickets-WT3N6X?ref=dank",
    },
    {
      date: "SEP 19",
      city: "New York, NY",
      venue: "Haus on Hudson — Sunset Boat Party",
      tickets: "",
    },
  ],

  /* --- Socials -------------------------------------------------------- */
  socials: [
    {
      label: "Instagram",
      url: "https://instagram.com/dankstreetmusic",
      icon: "assets/img/social/instagram.svg",
    },
    {
      label: "Linktree",
      url: "https://linktr.ee/dankstreetmusic",
      icon: "assets/img/social/linktree.svg",
    },
    {
      label: "Spotify",
      url: "https://open.spotify.com/artist/0NLNgYQ7nC55xyR1yK0ELY",
      icon: "assets/img/social/spotify.svg",
    },
    {
      label: "SoundCloud",
      url: "https://soundcloud.com/dankstreet",
      icon: "assets/img/social/soundcloud.svg",
    },
    {
      label: "Apple Music",
      url: "https://music.apple.com/us/artist/dank-street/1811364253",
      icon: "assets/img/social/applemusic.svg",
    },
  ],

  /* --- Merch (coming soon; Feature.fm list for drop announcements) ----- */
  merch: {
    heading: "Merch",
    status: "Coming soon",
    blurb:
      "Tees, hoodies, and limited-run pieces are in the works. Join the DANK STREET list on " +
      "Feature.fm and you'll hear about every drop first, with early access before it goes public.",
    cta: "Join the list",
    subscribeUrl: "https://ffm.bio/dankstreetmusic",
  },

  /* --- Contact -------------------------------------------------------- */
  contact: {
    heading: "Contact",
    blurb: "Bookings, promo, and press. Philly / NYC. Download the EPK for the full press kit.",
    email: "dankstreets@gmail.com",
    lines: [
      { label: "Bookings / Promo", value: "dankstreets@gmail.com" },
    ],
  },
};
