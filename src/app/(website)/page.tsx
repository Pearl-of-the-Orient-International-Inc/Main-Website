import { Button } from "@/components/ui/button";
import { ArrowRightIcon, ChevronRightIcon } from "lucide-react";
import { ImagesSlider } from "@/components/magic-ui/ImagesSlider";
import Link from "next/link";
import { HeroVideoDialog } from "@/components/magic-ui/HeroVideoDialog";
import { WorldMap } from "@/components/magic-ui/WorldMap";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Timeline } from "@/components/magic-ui/Timeline";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const images = [
  "/hero-carousels/1.jpg",
  "/hero-carousels/2.jpg",
  "/hero-carousels/3.jpg",
  "/hero-carousels/4.jpg",
  "/hero-carousels/5.jpg",
  "/hero-carousels/6.jpg",
  "/hero-carousels/7.jpg",
];

type NewsItem = {
  date: string;
  image: string;
};

const items: NewsItem[] = [
  {
    date: "January 18, 2026",
    image:
      "https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/615887490_870611515816948_3404896555160632264_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHv0hRkR-4sPXpZFdBfYO-9mJHEq0Xd2wmYkcSrRd3bCV23sE9c5KC2bmB8pxLpph2avraoy5fm_HYEr840bhMF&_nc_ohc=dZcE1YHVrQgQ7kNvwHxu-pY&_nc_oc=AdnpSlNz-Xo3URXvUj9Dn2tHDnSQVB1beXgor2RC0Zjfrzt2DHu1v3H1j8kVfiSX9gY&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=Z_aaK8tTeJJ0fZSYFFYSLg&oh=00_AfpzpgDcZqqf9ZlpZl9R6ytpJoiV4VFJDG8TgpVFAutSug&oe=697C8DBF",
  },
  {
    date: "December 7, 2025",
    image:
      "https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/594405361_839110632300370_739974065792773738_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEqQEl8IgLsVXKDZSqDvVLal6614h-lZvSXrrXiH6Vm9Cv8d93Y1MMZRN9arOAQpr6n_LmrSd8Tz6ikBAQBVzQ6&_nc_ohc=xh-yhA-E8XQQ7kNvwGE9w73&_nc_oc=Adn4aL_x3S6oFYUVLArNcNCztdUwCN-kOEY4GaSD-C2FG2rStd5stGrXnnQvjBbHiFc&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=ow-v65rH4Ns_gxroKwUzcg&oh=00_Afqq5LLVHWv288WZ4-doXkWlJ8Ya5nyPahcQ7VSKttJ1ow&oe=697C875D",
  },
  {
    date: "November 7, 2025",
    image:
      "https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/577447591_816157864595647_6322373054462900206_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHuAlBMAn1SPnsuZPlOK26Q9xi2RSd-hAj3GLZFJ36ECHe-5Hs3_I5tyc4_K0E4nz81uSvszJrAJ5zduWlMRyFO&_nc_ohc=kpQ9581DzloQ7kNvwF7rwsy&_nc_oc=AdmOHwufq5SGMJ5M4ZcyDWevuBem5a-JTCDiu5XV5QWQmwDwdoqcMtLdehp-AhFA8CE&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=yP3wZPDmiGW976Z-RxaEqw&oh=00_AfpZHQYWu8U25TGrh-ZazsdQwSvVqUweonj1x5_2hVDfkw&oe=697C8968",
  },
  {
    date: "October 31, 2025",
    image:
      "https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/571680760_809824721895628_4402940141947498705_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeG2vew6i5Ozb1FoLD-NEwF2pp-N8fc-DV-mn43x9z4NX6H54ZJ6K2a06VZsxCc_x7WR9l30lXQH2-xXmP2eqXcY&_nc_ohc=Sddyl-sUjB4Q7kNvwEb5nZ6&_nc_oc=Admj4oxA6KJhKFG5r2qKHyc0o_askS_2c3Iv6DMDJHGeGMDeXIys2fngyFuGf6xzJLo&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=ofGwootImN8vWuImGxD9yA&oh=00_AfpDXNGvH_PatJodeSGTe4Q__KZKTXFKGKr32p-FFpTodg&oe=697C85C6",
  },
  {
    date: "October 31, 2025",
    image:
      "https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/571487378_809798511898249_9139413770376307687_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeF9FGyAHPy15rPgWHRHU8e1B1tAbktZiWIHW0BuS1mJYs9avvUgPATjNskOLwkxI8oNR0x4sqdfdiQykOwPAm6H&_nc_ohc=8KyeQI0L9O8Q7kNvwGPmqo5&_nc_oc=Adn3iZQS2hPa-8f6Fwodoq-XEIhButQ151R7LN1CjQ5brJ_6NLi42Jq8wZwLMtSKgMM&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=wChs1OjcP7BvzNXx5Gj8PQ&oh=00_Afqm4bZ55a7t7jsllXtQs-beXlKtik72L_-hfXJJ-LosKQ&oe=697C968D",
  },
  {
    date: "October 20, 2025",
    image:
      "https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/564584977_801026729442094_5213524547290418868_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEn-pWbXbMXr14z7nTJ1odexb6ohmZZGI3FvqiGZlkYjRO2U20zuPNkDAjD0KDCTeDKp6kwgHb95tXfMD6Wvpds&_nc_ohc=ru46HUtkZhIQ7kNvwH9jKZh&_nc_oc=Admy8bsw9F7WyF6fh2YZQ_7YKtSnbo2PeO6M03xAVfJ0Fi-8WbIGAuZKnIJSZyfumxs&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=jsgh6gcIO4A6h4N8lnyLFQ&oh=00_AfoZUYVDeyywTBd7v8VRv_kAe740YGMicCHAjYu2uVtoYA&oe=697C9860",
  },
  {
    date: "October 7, 2025",
    image:
      "https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/557204022_788704800674287_8552116038241307771_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFdjiXq69e84UnQsunUU2f2dy8gHMtcH-V3LyAcy1wf5URiupjDephrPi2A-jc265Q0afYjmvgoAEcXxQEw9ZjJ&_nc_ohc=kV0AVK3V_QoQ7kNvwFNjHbj&_nc_oc=AdkL_xPzKM8855zvaQPaWHu9NiDR2cy1xRWxmUe2Dnu4WDILDVVBkPyeQD1spWcwlWc&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=iy-62l80ulFKM84KKgfllQ&oh=00_Afo-D2y_VSZ-75_FHQYmO2zRIgei73v7FUjV4DJmXfShNA&oe=697C9456",
  },
  {
    date: "September 29, 2025",
    image:
      "https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/555822828_781725571372210_8791148310997938907_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeF5Pxt8poyDcs7dihQXziEThJsBhP7NMNWEmwGE_s0w1elAN8hqDkc-vgrJeywVAPgUaMl7C3D3r7snkZ0HNKxC&_nc_ohc=KOQzUjRWXj8Q7kNvwHUQQ99&_nc_oc=AdkIWBPJ7K9I2GkMZxKM9jHORm8_DyEGccL6zKfGC0Kbk-uNheoE6xpOKrQniK1qV8I&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=Z4jpDEiKpXcXF56t4OI6bA&oh=00_AfpIiQI0-1bZSsZxR3KlNuDilKkr2Vs7G_J4xzpt6t6LWA&oe=697C7FE9",
  },
  {
    date: "September 13, 2025",
    image:
      "https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/545576469_768259972718770_1757879799856552116_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeG_ysL-_b52FmSnPEehqGN75CIPHS3eqIzkIg8dLd6ojKX8-LYXZWbM8Hz_jea4LtFROP7iiICgo-SE_nqA5tv8&_nc_ohc=F-MMVC36-doQ7kNvwFdhMtz&_nc_oc=Adn5qObdeUI3B8XnUKaT2pqGcr_TTGNa0j0tA_KPPdWmLdYPP6O-dbT29_umae1hzTI&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=i6tOuNeHJfJnRrapevL0_Q&oh=00_Afrq7nrucgStWDdYt7owD5VRjwie3X1Dfjorjo60qZ-7pg&oe=697C74D2",
  },
  {
    date: "August 29, 2025",
    image:
      "https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/539318544_756493890562045_1312984958528056726_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFdVZOZhkjRFtIsk-SI3ZEUKjpuc5D9NWgqOm5zkP01aGdffx0D1oa5gpThsXt2LcvmWADCKLm5ppzw0mEHGdev&_nc_ohc=IrOcqJ3NFfAQ7kNvwGFFqn3&_nc_oc=AdnvFz3ElikNFFNNuxlo43i_2_HwMddg6RCrvR4TiTekp2HvtExq_z4H9hRFpfclQvM&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=FHEoITtCfTdXKTrcWxvEVw&oh=00_AfqNGv_i3bBlIaWe-1mXm1sNnUbQDDJnpraJk2VfWBCCWA&oe=697C9535",
  },
  {
    date: "August 21, 2025",
    image:
      "https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/537183918_749875874557180_5059120973741787985_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFDxmkoNojklOBZB-FQ6xxNBYp1_RffXq8FinX9F99er2D5Lq9w3MiXJq4C89gXUG4pgYjBUf8v3ojgD3nYGMYW&_nc_ohc=zGsmK3sr_r4Q7kNvwG4yA5A&_nc_oc=AdlrA9t5fI8TxtBI2drE5mVg-iAHurzshDhzxBUCDV-xEsAVgdNVJ5d8nqE6sQ8o9MM&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=utGDWaShctb0GNrhF-JpoA&oh=00_AfpRLHabwj4OW8hEh0oW0cfJyAR-wCgnoQVHDjGbvTLG2A&oe=697C9720",
  },
  {
    date: "August 20, 2025",
    image:
      "https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/535881331_749046267973474_4535553279498715619_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFPfvVjjfcxm-PwappYKZoAPdtC18NB4YE920LXw0Hhgbcwesrb6zyHksmExDOV6YhSXWirpTZb4KPWZSLAh2h_&_nc_ohc=6Zl2Isjn67UQ7kNvwFqvRkh&_nc_oc=AdkmtYEUO_m42QrvSu2TBRsPayOz_2uVmfDHv2lkxrGqcIVjSedJ6Zvv-rdgsveLv_Y&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=yuY3bwjZQmQgniZ-AAzF0A&oh=00_Afq6LDu1tiQUV5YknDfbk9a2dhOOhdisqEar9YpLJ9vIIA&oe=697C9A43",
  },
  {
    date: "August 15, 2025",
    image:
      "https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/534230162_745234851687949_5773957815865136260_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHmUMizCXdOvHAuhcJq1vyvcfGHBjy2yVZx8YcGPLbJVoJYFN49wpTk-txUbUwONMEOM2XNqyH7N3ANdG7WAdR_&_nc_ohc=geGCNJdWCRMQ7kNvwE_egA7&_nc_oc=Adm3UB_BVzZ5B86ZXQDQ5AV9DmzR6uWOOS-n2Hw9hks-0Q-2T4mdKvOvwzbZL-yxYj0&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=TDOzi5xR1f4mZAV6WY4UPA&oh=00_AfqEie1Cbxrv-lnRAmQHSW4as7kj0yxcXv_OCBUFCIr_wQ&oe=697C88C2",
  },
  {
    date: "August 6, 2025",
    image:
      "https://scontent.fmnl19-1.fna.fbcdn.net/v/t39.30808-6/519406969_737793909098710_5777518618617149127_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGs5PF_SDR_dHY4PM40D6MkdCVSjSVX_Sl0JVKNJVf9KXbFE9oV1CTUS90u_ODtId3zRkBngYy5eg7J6uFQqrhz&_nc_ohc=sStspT6_V9AQ7kNvwF8P5vc&_nc_oc=AdkwNHXXDnhSD-2FomoEhCA9PHJ5b7D8Ari6VVXe5QQikPwLuG6B6Naw5d3EqhSUiBo&_nc_zt=23&_nc_ht=scontent.fmnl19-1.fna&_nc_gid=1uonoilgpm-Bo_VxDoS7Hg&oh=00_Afq2U0b0JAJYg1bK_9pE1glUpMbBeJfdN0xPjJvC5AouXg&oe=697C9AA4",
  },
];

const chaplaincyRoadmap = [
  {
    title: "Phase 1",
    content: (
      <div>
        {/* Image Placeholder */}
        <div className="mb-4 sm:mb-6 w-full h-40 sm:h-48 md:h-64 lg:h-80 rounded-lg bg-linear-to-br from-[#032a0d]/20 to-[#032a0d]/5 border-2 border-dashed border-[#032a0d]/30 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="text-3xl sm:text-4xl mb-2">📷</div>
            <p className="text-[10px] sm:text-xs md:text-sm text-[#032a0d]/60 font-medium">
              Phase 1 Image Placeholder
            </p>
          </div>
        </div>
        <div className="mb-4">
          <h4 className="text-base md:text-lg font-semibold text-[#032a0d] mb-2">
            Associate Chaplain
          </h4>
          <p className="text-xs md:text-sm text-[#032a0d]/70 font-medium mb-4">
            Status: <span className="text-[#032a0d]">Entrant/Member</span>
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-[#032a0d] mt-1">•</span>
            <span>Entrant member</span>
          </div>
          <div className="flex items-start gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-[#032a0d] mt-1">•</span>
            <span>Chaplaincy orientation</span>
          </div>
          <div className="flex items-start gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-[#032a0d] mt-1">•</span>
            <span>Submission of requirements</span>
          </div>
          <div className="flex items-start gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-[#032a0d] mt-1">•</span>
            <span>Chaplaincy 101 (pre-req)</span>
          </div>
          <div className="flex items-start gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-[#032a0d] mt-1">•</span>
            <span>Oath taking</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Phase 2",
    content: (
      <div>
        {/* Image Placeholder */}
        <div className="mb-4 sm:mb-6 w-full h-40 sm:h-48 md:h-64 lg:h-80 rounded-lg bg-linear-to-br from-[#032a0d]/20 to-[#032a0d]/5 border-2 border-dashed border-[#032a0d]/30 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="text-3xl sm:text-4xl mb-2">📷</div>
            <p className="text-[10px] sm:text-xs md:text-sm text-[#032a0d]/60 font-medium">
              Phase 2 Image Placeholder
            </p>
          </div>
        </div>
        <div className="mb-4">
          <h4 className="text-base md:text-lg font-semibold text-[#032a0d] mb-2">
            Professional Chaplain
          </h4>
          <p className="text-xs md:text-sm text-[#032a0d]/70 font-medium mb-4">
            Status: <span className="text-[#032a0d]">Chaplaincy Graduate</span>
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-[#032a0d] mt-1">•</span>
            <span>School of Chaplaincy graduate</span>
          </div>
          <div className="flex items-start gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-[#032a0d] mt-1">•</span>
            <span>3 months schooling</span>
          </div>
          <div className="flex items-start gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-[#032a0d] mt-1">•</span>
            <span>8 subjects (blended)</span>
          </div>
          <div className="flex items-start gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-[#032a0d] mt-1">•</span>
            <span>OJT (pre-req)</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Phase 3",
    content: (
      <div>
        {/* Image Placeholder */}
        <div className="mb-4 sm:mb-6 w-full h-40 sm:h-48 md:h-64 lg:h-80 rounded-lg bg-linear-to-br from-[#032a0d]/20 to-[#032a0d]/5 border-2 border-dashed border-[#032a0d]/30 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="text-3xl sm:text-4xl mb-2">📷</div>
            <p className="text-[10px] sm:text-xs md:text-sm text-[#032a0d]/60 font-medium">
              Phase 3 Image Placeholder
            </p>
          </div>
        </div>
        <div className="mb-4">
          <h4 className="text-base md:text-lg font-semibold text-[#032a0d] mb-2">
            Ordained and Commissioned Practitioner
          </h4>
          <p className="text-xs md:text-sm text-[#032a0d]/70 font-medium mb-4">
            Status:{" "}
            <span className="text-[#032a0d]">
              Ordained & Commissioned Chaplain
            </span>
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-[#032a0d] mt-1">•</span>
            <span>Graduate of any bachelor degree</span>
          </div>
          <div className="flex items-start gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-[#032a0d] mt-1">•</span>
            <span>Pre-test and post-test</span>
          </div>
          <div className="flex items-start gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-[#032a0d] mt-1">•</span>
            <span>OJT supervised</span>
          </div>
          <div className="flex items-start gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-[#032a0d] mt-1">•</span>
            <span>Covenant bow</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Phase 4",
    content: (
      <div>
        {/* Image Placeholder */}
        <div className="mb-4 sm:mb-6 w-full h-40 sm:h-48 md:h-64 lg:h-80 rounded-lg bg-linear-to-br from-[#032a0d]/20 to-[#032a0d]/5 border-2 border-dashed border-[#032a0d]/30 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="text-3xl sm:text-4xl mb-2">📷</div>
            <p className="text-[10px] sm:text-xs md:text-sm text-[#032a0d]/60 font-medium">
              Phase 4 Image Placeholder
            </p>
          </div>
        </div>
        <div className="mb-4">
          <h4 className="text-base md:text-lg font-semibold text-[#032a0d] mb-2">
            Certified Specialist Training Officer/Instructor
          </h4>
          <p className="text-xs md:text-sm text-[#032a0d]/70 font-medium mb-4">
            Status: <span className="text-[#032a0d]">Certified Minister</span>
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-[#032a0d] mt-1">•</span>
            <span>At least 1 chaplaincy ministry</span>
          </div>
          <div className="flex items-start gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-[#032a0d] mt-1">•</span>
            <span>Local church partnership</span>
          </div>
          <div className="flex items-start gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-[#032a0d] mt-1">•</span>
            <span>Public/private institution partnership</span>
          </div>
          <div className="flex items-start gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-[#032a0d] mt-1">•</span>
            <span>Certified training officer/instructor</span>
          </div>
          <div className="flex items-start gap-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300">
            <span className="text-[#032a0d] mt-1">•</span>
            <span>CRASM optional/pinning</span>
          </div>
        </div>
      </div>
    ),
  },
];

export default function Page() {
  const groupedItems: NewsItem[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    groupedItems.push(items.slice(i, i + 2));
  }

  return (
    <main className="min-h-screen">
      <ImagesSlider
        className="relative min-h-screen text-white"
        images={images}
      >
        {/* header fade */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-linear-to-b from-[#032a0d] to-transparent" />

        <div className="relative z-50 mx-auto container pt-20 sm:pt-24 md:pt-28 px-4 sm:px-6">
          {/* viewport 1: title */}
          <div className="flex min-h-[calc(100vh-12rem)] sm:min-h-[calc(100vh-15rem)] flex-col items-center justify-center text-center">
            <div className="font-normal text-sm sm:text-base md:text-lg uppercase tracking-widest px-4">
              Join a community devoted to spiritual growth, leadership
              development, and kingdom service
            </div>
            <h1 className="mt-6 sm:mt-8 md:mt-10 font-serif text-2xl sm:text-3xl capitalize md:text-4xl lg:text-5xl xl:text-6xl px-4">

              The best way to find yourself is to lose in the service of others
            </h1>
            <Button
              size="lg"
              className="mt-4 sm:mt-5 bg-[#032a0d] text-white rounded-full items-center flex hover:bg-[#032a0d]/95 text-sm sm:text-base"
            >
              Become a member <ArrowRightIcon className="size-4 sm:size-5" />
            </Button>
          </div>

          {/* viewport 2: content revealed on scroll */}
          <div className="pb-20 sm:pb-32 md:pb-40 px-4 sm:px-6">
            <div className="grid gap-6 sm:gap-8 md:gap-10 md:grid-cols-2 md:items-start">
              <blockquote className="max-w-xl border-l-2 pl-4 sm:pl-6 italic leading-relaxed text-sm sm:text-base">
                &quot;Take heed therefore unto yourselves, and to all the flock,
                over the which of the Holy Ghost hath made you overseers, to
                feed the church of God, which he hath purchased with his own
                blood.&quot; - <b>Acts 20:28</b>
              </blockquote>

              <div className="justify-self-start md:justify-self-end">
                <nav className="space-y-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em]">
                  {[
                    {
                      label: "Our Vision and Mission",
                      href: "/about-pearl-of-the-orient",
                    },
                    {
                      label: "School of Chaplaincy",
                      href: "#",
                    },
                    {
                      label: "Organizational Structure",
                      href: "/organizational-structure",
                    },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="block w-fit border-b border-white/60 pb-0.5 text-white/90 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </ImagesSlider>

      {/* CTA */}
      <section className="py-8 sm:py-10 lg:py-12 max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-center color-primary">
          Force for Good
        </h2>
        <p className="mt-4 sm:mt-6 text-center text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed font-serif color-primary px-4">
          Take heed therefore unto yourselves, and to all the flock, over the
          which of the Holy Ghost hath made you overseers, to feed the church of
          God, which he hath purchased with his own blood.
        </p>
        <div className="flex items-center justify-between mt-10">
          <Link href="#" className="flex items-center group gap-3">
            <div className="border-2 border-[#032a0d] rounded-full text-[#032a0d] group-hover:text-white group-hover:bg-[#032a0d] transition-colors flex items-center justify-center size-10">
              <ChevronRightIcon strokeWidth={3} />
            </div>
            <p className="uppercase font-medium group-hover:underline text-[#032a0d]">
              pearl of the orient theological seminary & colleges inc
            </p>
          </Link>
          <Link href="#" className="flex items-center group gap-3">
            <div className="border-2 border-[#032a0d] rounded-full text-[#032a0d] group-hover:text-white group-hover:bg-[#032a0d] transition-colors flex items-center justify-center size-10">
              <ChevronRightIcon strokeWidth={3} />
            </div>
            <p className="uppercase font-medium group-hover:underline text-[#032a0d]">
              About Pearl of the orient
            </p>
          </Link>
        </div>
      </section>

      {/* Learn & Grow */}
      <section
        className="relative min-h-[50vh] sm:min-h-[60vh] bg-cover bg-bottom text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5)), url(/main/landing.jpg)`,
        }}
      >
        <div className="relative z-10 mx-auto max-w-6xl py-12 sm:py-16 md:py-20 px-4 sm:px-6">
          <div className="space-y-4 sm:space-y-6">
            {/* Category Heading */}
            <div className="text-xs sm:text-sm uppercase tracking-[0.2em] text-white/90">
              Chaplaincy and Values Education
            </div>

            {/* Main Title */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              Learn and Grow
            </h2>

            {/* Descriptive Paragraph */}
            <p className="max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed text-white/95">
              Whatever stage you are in life, Pearl of the Orient International
              Auxiliary Chaplain Values Educators Inc. believes learning should
              encompass your overall development, giving you the tools and
              skills necessary to build a meaningful career, to realize your
              full potential as an individual, and to become a responsible and
              engaged servant leader in your community and the world.
            </p>

            {/* Call-to-Action Link */}
            <HeroVideoDialog
              className="block dark:hidden"
              animationStyle="from-center"
              videoSrc="https://res.cloudinary.com/dovvdfxru/video/upload/v1769411349/V3_The_Pearl_Chaplaincy_Promotional_Video_mwinwn.mp4"
              thumbnailAlt="Hero Video"
            />
          </div>
        </div>
      </section>

      {/* Course Outline */}
      <section
        className="relative min-h-[50vh] sm:min-h-[60vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(/main/paper-bg.jpg)`,
        }}
      >
        <div className="max-w-6xl mx-auto py-12 sm:py-16 md:py-20 px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="text-xs sm:text-sm uppercase tracking-[0.2em] text-[#032a0d]/70 mb-2">
              Curriculum
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-[#032a0d]">
              Course Outline
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              "Personality development of a chaplain",
              "Pastoral Psychology & biblical counseling",
              "Theology and practice of ordained chaplain",
              "Chaplaincy ministry",
              "Stress management & critical incident",
              "Philippine constitution & family code",
              "Governance & development",
              "Ethics & Accountability of a chaplain",
              "Christian leadership & management",
            ].map((course, index) => (
              <div
                key={index}
                className="group relative p-6 border-2 border-[#032a0d]/20 rounded-lg hover:border-[#032a0d] transition-all duration-300 hover:shadow-lg bg-white"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 mt-1">
                    <div className="size-8 rounded-full bg-[#032a0d]/10 group-hover:bg-[#032a0d] transition-colors flex items-center justify-center">
                      <span className="text-sm font-semibold text-[#032a0d] group-hover:text-white transition-colors">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                  <p className="text-[#032a0d] font-medium leading-relaxed group-hover:text-[#032a0d]/90 transition-colors">
                    {course}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Around The World */}
      <section className="py-12 sm:py-16 md:py-20 min-h-[60vh] sm:min-h-[70vh] md:h-screen overflow-hidden bg-[#032a0d] w-full">
        <div className="max-w-7xl mx-auto text-center px-4 sm:px-6">
          <div className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-2 sm:mb-4 text-white">
            Around the World
          </div>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-neutral-100 max-w-4xl mx-auto px-4">
            To organize a chaplain team both here and abroad who are Lorem ipsum
            dolor sit, amet consectetur adipisicing elit. Magni non blanditiis
            cumque optio repellat rem, a similique neque excepturi consequuntur.
          </p>
        </div>
        <div className="container mt-4 sm:mt-5 mx-auto px-4">
          <WorldMap
            dots={[
              {
                start: {
                  lat: 64.2008,
                  lng: -149.4937,
                }, // Alaska (Fairbanks)
                end: {
                  lat: 34.0522,
                  lng: -118.2437,
                }, // Los Angeles
              },
              {
                start: { lat: 64.2008, lng: -149.4937 }, // Alaska (Fairbanks)
                end: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
              },
              {
                start: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
                end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
              },
              {
                start: { lat: 51.5074, lng: -0.1278 }, // London
                end: { lat: 28.6139, lng: 77.209 }, // New Delhi
              },
              {
                start: { lat: 28.6139, lng: 77.209 }, // New Delhi
                end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
              },
              {
                start: { lat: 28.6139, lng: 77.209 }, // New Delhi
                end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
              },
            ]}
          />
        </div>
      </section>

      {/* News & Events */}
      <section
        className="relative my-4 sm:my-5 py-4 sm:py-5 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.6), rgba(255,255,255,0.5)), url(/main/news.jpg)`,
        }}
      >
        <div className="relative h-full bg-white py-4 sm:py-5 px-2 sm:px-4">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="relative w-full"
          >
            {/* LEFT FULL-HEIGHT ARROW */}
            <div className="absolute left-0 top-0 z-10 h-full w-4 sm:w-5 bg-white flex items-center justify-center">
              <CarouselPrevious className="static bg-white hover:bg-white shadow-none rounded-none ml-2 sm:ml-4 md:ml-10 size-8 sm:size-10 md:size-12 border-none" />
            </div>

            {/* RIGHT FULL-HEIGHT ARROW */}
            <div className="absolute right-0 top-0 z-10 h-full w-4 sm:w-5 bg-white flex items-center justify-center">
              <CarouselNext className="static bg-white hover:bg-white shadow-none rounded-none mr-2 sm:mr-4 md:mr-10 size-8 sm:size-10 md:size-12 border-none" />
            </div>

            {/* CONTENT */}
            <CarouselContent className="-ml-2 md:-ml-4">
              {groupedItems.map((group, groupIndex) => (
                <CarouselItem
                  key={groupIndex}
                  className="pl-2 md:pl-4 basis-full md:basis-1/3 lg:basis-1/4"
                >
                  {groupIndex % 2 === 0 ? (
                    <SingleCard item={group[0]} />
                  ) : (
                    <div className="flex flex-col h-full">
                      {group.map((item, i) => (
                        <StackedCard key={i} item={item} />
                      ))}
                    </div>
                  )}
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        <Button
          size="lg"
          className="mt-4 sm:mt-5 mx-auto flex items-center justify-center bg-[#032a0d] hover:bg-[#032a0d]/90 text-sm sm:text-base"
        >
          View More
        </Button>
      </section>

      {/* Chaplaincy Roadmap */}
      <section
        className="relative min-h-[50vh] sm:min-h-[60vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(/main/paper-bg.jpg)`,
        }}
      >
        <div className="max-w-6xl relative overflow-clip mx-auto py-12 sm:py-16 md:py-20 px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="text-xs sm:text-sm uppercase tracking-[0.2em] text-[#032a0d]/70 mb-2">
              Chaplaincy Roadmap
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-[#032a0d] px-4">
              Your Journey to Chaplaincy Excellence
            </h2>
            <p className="mt-3 sm:mt-4 max-w-3xl mx-auto text-sm sm:text-base md:text-lg text-[#032a0d]/80 px-4">
              Follow a structured path from entry-level membership to certified
              specialist, developing your skills and commitment to chaplaincy
              ministry at each phase.
            </p>
          </div>
          <Timeline data={chaplaincyRoadmap} />
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <div className="text-sm uppercase tracking-[0.2em] text-[#032a0d]/70 mb-2">
              Frequently Asked Questions
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#032a0d]">
              Common Questions About Chaplaincy
            </h2>
            <p className="mt-4 text-base md:text-lg text-[#032a0d]/70 max-w-2xl mx-auto">
              Find answers to common questions about membership, schooling, and
              chaplaincy ministry.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem
              value="item-1"
              className="border-2 border-[#032a0d]/10 rounded-lg px-4 sm:px-6 bg-white hover:border-[#032a0d]/30 transition-colors"
            >
              <AccordionTrigger className="text-left text-[#032a0d] font-semibold py-4 sm:py-6 hover:no-underline">
                How do I become a member of Pearl of the Orient International
                Auxiliary Chaplain Values Educators Inc.?
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-base text-neutral-700 dark:text-neutral-300 pb-4 sm:pb-6">
                To become a member, you must first complete the entrant member
                process, which includes attending a chaplaincy orientation,
                submitting all required documents, completing Chaplaincy 101 as
                a prerequisite, and participating in the oath-taking ceremony.
                This initial phase establishes you as an Associate Chaplain with
                Entrant/Member status.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-2"
              className="border-2 border-[#032a0d]/10 rounded-lg px-4 sm:px-6 bg-white hover:border-[#032a0d]/30 transition-colors"
            >
              <AccordionTrigger className="text-left text-[#032a0d] font-semibold py-4 sm:py-6 hover:no-underline">
                What is the School of Chaplaincy program and how long does it
                take?
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-base text-neutral-700 dark:text-neutral-300 pb-4 sm:pb-6">
                The School of Chaplaincy is a comprehensive 3-month program
                designed to equip individuals for professional chaplaincy
                ministry. The program includes 8 subjects delivered through a
                blended learning approach (combining online and in-person
                sessions). Upon completion and successful OJT (On-the-Job
                Training), graduates achieve Professional Chaplain status as
                Chaplaincy Graduates.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-3"
              className="border-2 border-[#032a0d]/10 rounded-lg px-4 sm:px-6 bg-white hover:border-[#032a0d]/30 transition-colors"
            >
              <AccordionTrigger className="text-left text-[#032a0d] font-semibold py-4 sm:py-6 hover:no-underline">
                What are the requirements to become an Ordained and Commissioned
                Chaplain?
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-base text-neutral-700 dark:text-neutral-300 pb-4 sm:pb-6">
                To become an Ordained and Commissioned Chaplain (Phase 3), you
                must be a graduate of any bachelor&apos;s degree program,
                complete both pre-test and post-test assessments, successfully
                complete supervised OJT (On-the-Job Training), and participate
                in the covenant bow ceremony. This phase represents a
                significant commitment to chaplaincy ministry and values
                education.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-4"
              className="border-2 border-[#032a0d]/10 rounded-lg px-4 sm:px-6 bg-white hover:border-[#032a0d]/30 transition-colors"
            >
              <AccordionTrigger className="text-left text-[#032a0d] font-semibold py-4 sm:py-6 hover:no-underline">
                How can I become a Certified Specialist Training
                Officer/Instructor?
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-base text-neutral-700 dark:text-neutral-300 pb-4 sm:pb-6">
                To achieve Certified Specialist Training Officer/Instructor
                status (Phase 4), you must have at least one active chaplaincy
                ministry, establish partnerships with local churches, form
                partnerships with public or private institutions, obtain
                certification as a training officer/instructor, and optionally
                complete CRASM (Certified Religious and Spiritual Ministry)
                pinning. This represents the highest level of chaplaincy
                certification.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-5"
              className="border-2 border-[#032a0d]/10 rounded-lg px-4 sm:px-6 bg-white hover:border-[#032a0d]/30 transition-colors"
            >
              <AccordionTrigger className="text-left text-[#032a0d] font-semibold py-4 sm:py-6 hover:no-underline">
                What ministry opportunities are available for chaplains?
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-base text-neutral-700 dark:text-neutral-300 pb-4 sm:pb-6">
                Chaplains can serve in various ministry settings including
                hospitals, schools, military, prisons, corporate environments,
                and community organizations. Our chaplains provide spiritual
                care, values education, counseling, and support services. We
                also facilitate partnerships with local churches and
                institutions to expand ministry reach and impact in communities
                both locally and internationally.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-10 sm:mt-12 text-center">
            <Link href="#">
              <Button
                size="lg"
                className="bg-[#032a0d] hover:bg-[#032a0d]/90 text-white rounded-full px-8 py-6 text-base sm:text-lg"
              >
                View All FAQs
                <ArrowRightIcon className="ml-2 size-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

interface SingleCardProps {
  item: NewsItem;
}

interface StackedCardProps {
  item: NewsItem;
}

const SingleCard = ({ item }: SingleCardProps) => (
  <div className="group relative h-full bg-white border overflow-hidden">
    <div className="relative h-200 w-full overflow-hidden bg-[#032a0d]/5">
      <Image
        src={item.image}
        alt={item.date}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
      />

      <div
        className="
        absolute inset-x-0 bottom-0
        translate-y-full opacity-0
        group-hover:translate-y-0 group-hover:opacity-100
        transition-all duration-500
        bg-linear-to-t from-[#032a0d] to-transparent
        px-4 sm:px-6 py-6 sm:py-8 md:py-10 text-center
      "
      >
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
          {item.date}
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-zinc-100">Vol.55 No.13</p>
      </div>
    </div>
  </div>
);

const StackedCard = ({ item }: StackedCardProps) => (
  <div className="group relative bg-white border overflow-hidden">
    <div className="relative h-100 w-full overflow-hidden bg-[#032a0d]/5">
      <Image
        src={item.image}
        alt={item.date}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
      />

      <div
        className="
        absolute inset-x-0 bottom-0
        translate-y-full opacity-0
        group-hover:translate-y-0 group-hover:opacity-100
        transition-all duration-500
        bg-linear-to-t from-[#032a0d] to-transparent
        px-4 sm:px-6 py-4 sm:py-6 md:py-8 text-center
      "
      >
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
          {item.date}
        </h3>
        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-zinc-100">
          Vol.55 No.13
        </p>
      </div>
    </div>
  </div>
);
