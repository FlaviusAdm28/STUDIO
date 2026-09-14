import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  /* The dev badge sits in the frame. Nothing uninvited belongs in the composition. */
  devIndicators: false,

  /*
    **`127.0.0.1` and `localhost` are different origins to Next 16, and the difference is fatal in dev.**

    The dev server advertises `localhost`, so a page opened at `http://127.0.0.1:3000/` has its
    dev-resource requests blocked — `Blocked cross-origin request to Next.js dev resource
    /_next/webpack-hmr from "127.0.0.1"`. The document still renders, because the HTML is server-sent,
    so the page *looks* fine and is in fact completely inert: **React never hydrates.**

    What that looks like is the trap. With no client there is no driver and no clock, so every element
    sits at its stylesheet default with nothing sequencing it — the three occasions and the final
    sentence are all painted at once, on top of each other. It reads as a choreography bug in junction
    05 → 06 and it is not one; it is the absence of any choreography at all.

    Both spellings are the same machine, and both are used — the browser bar says one, a curl or a
    devtools session says the other. Naming them here is a one-line fix for a failure with no error
    message in the page.
  */
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
}

export default nextConfig
