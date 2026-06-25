import Link from 'next/link'
import React from 'react'

import ShopProducts from './ShopProducts'

const Page = () => {
  return (
    <div>
      {/* Hero / Banner */}
      <section className="relative bg-[#032a0d] text-white">
        <div className="absolute inset-0">
          <div className="h-full w-full bg-[url('https://applyarchershub.dlsu.edu.ph/UpdatedAssets/SCSS/ApplicationLandingPage/images/hero-bg.png')] bg-cover bg-center opacity-40" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 mt-10">
          <p className="text-xs sm:text-sm text-white/70 mb-2">
            <Link href="/">Home</Link>{" "}
            <span className="mx-1 sm:mx-2 text-white/50">/</span>{" "}
            <span className="font-medium text-white">
              Chaplain Products
            </span>
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-wide">
            Chaplain Products
          </h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-white/80 leading-relaxed">
            Official chaplain pins, patches, accessories, and apparel are
            available for Pearl of the Orient chaplain members and officers who
            wish to avail items for identification, ministry service,
            ceremonies, and official activities.
          </p>
        </div>
      </section>

      <ShopProducts />
    </div>
  )
}

export default Page
