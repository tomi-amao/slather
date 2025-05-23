import { Header } from "@/components/header";
import { Search } from "lucide-react";

const EXAMPLE_SANDWICHES = {
  topRated: [
    {
      id: 1,
      title: "The Classic Melt",
      description: "A timeless favorite with perfectly melted cheese.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCE3PuVHRJdgvp97MlvyMj8tK9BBjdnY6mLvMcEQzUIRzLxpsrVpG4eAXI_kFJE-vZpm1fgll9istHQY9vRave3WBT918GuKFBs2zFWhW_MlyZUP_goxFs8X3lkRjAfWOOrTG2seYZpcXwKh_DXBB4Ic5IGE5asyaHMDi496ZPxcpI9p57lQEC5V2ZXmaHd0-q9GfXoDtsnzxzhCxXim1l7OmdY6VLl7RgmLpPWWeDfRFNHC_kMLn3l4_JHt63qetQm8hW8Q4bC2Yo"
    },
    {
      id: 2,
      title: "Avocado Delight",
      description: "Fresh avocado and crisp veggies make this a healthy choice.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBOH-AFpmOfLqUb6QZbZwgz4ACep6Z11ykSeqnVEp32n4uzNi5n_4TYIREuhW0wCqBH1UwveapoR9tpJCPL8wXPXwDoihEmVkOtXwxWvAS9iMbCtBCLrd3iQxr0zjkbQS_R2MR61tHM8HF3ci90oCbhiZK3_d72BAtWyhKA1JHEeoc60raCnkCwTnK8t8AxEoDxvxt5ci73c7aOidyyY0Fr-1LStEkIQY-kVGwZMJFziFEfGrMuXPQy3T4zX5wU9pkseBdrjHB56TI"
    },
    {
      id: 3,
      title: "BLT Supreme",
      description: "The ultimate BLT with extra bacon and a special sauce.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAC5S-bepdMfBdQoELfCk2BeZswI5xEw7NbE4oAneYWOWcgiFpsbnxjMvjeDIE-czQ4NYsqprmNV2Z5TtvP-LW9Tisi0dqoFxdDCy0eizPpKwHdtV3DuwrpT7vN9_QG-b-znEz2RUR3-o6ww_3fdPAxOr7oLIOfwCHpG1oks4yD9jhtK3-HY2lIEDo4xke-UzX05JVoREzQgaF84KeCd7EBN9kRVGS1W7LUWKgJ_QAVaBiUNywJb7y5A1_BcXGUpOh_X04yqjnSry4"
    }
  ],
  trending: [
    {
      id: 4,
      title: "Spicy Italian Sub",
      description: "A flavorful sub with a variety of Italian meats and cheeses.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0uXhOFw2gQcEIoQfvZhbzUWfWf_E4_sk2oVng0mZGszR_Y961kxvLLvY4W5ReAhGuOzAKbq8QYgZ3wgIVRaNviOjyAhFxnieqYjPCCBGvoxaOj-LvgQ-Uuym9RNnE7GlNxkCqYks8jhJUugJ5jRejLCC07qp_YDhHVRyweWV_bZMmk19tAtFRZubZrh6KYQ_cKHtElrA_tA5zgURfJV99_bv1HpNDkq2eqS2P9qpTI1rjqFNYdM-oYCeWRBetiEpwMGNGaPLQLek"
    },
    {
      id: 5,
      title: "Cuban Sandwich",
      description: "A pressed sandwich with roasted pork, ham, and pickles.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3OVTYtESahI3tq9hMF7lUxGTrx5JMYrovNByejuFeiYgs11sOdq7EKsec-4RuIMwKQpFtrd9bEVl39Z7VzRiidvfEwgDNcYZYj1wdul6zZ6gWABQbRrlF1Mu9vg0CtvjunXfwyZqAYKTSKafS9_vV1U_-wH5Ip6qlk2ocbhZz7fXFmkEVj0DyWjxq0fOCHI1WjlMWHcETTLG_sovT0ufUXnOtgfrOenEte4mgqI9UJJuwhLM3Cz2A223ycQVlhl_hDv9jxl4Trtk"
    },
    {
      id: 6,
      title: "French Dip",
      description: "Thinly sliced roast beef on a baguette, served with au jus.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfqsj2-udOWt-Es6OR9OgLHAHk5YGlW6xJyjqexkK5o0nKH6Sxfgl_d7mYGoGSmqEprLBRKgcwnlE_Q3WRzpy0c-2IvRFr1it55D_8WSLvFEAhZihlPj5IQ5Qp5uT20PQe41GOYs5iZ9AZVMe9qFmw1rh9jUdRNPxrg6xmG7VXA8yZe_Be4gnPHtj0eNgfNHFH1k5qCzUvv90No1GSR5bfRU56h74EKl1rzqQdXesbgt-IuDpWF9u_cA_uV1ujwmIdxBFF0fMwSXk"
    },
    {
      id: 7,
      title: "Reuben",
      description: "Corned beef, sauerkraut, and Swiss cheese on rye bread.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlKTLkkWjimFjlIma-9BdCeh6KD1QA71q_OKArukp316gRPKB6jFMaMvcA1YBFNCh-r9vTZNK9ASu8a0ttlH-HDCZ-tqT9lN4CU1PIcrKXPYKxFSMBsEUaZleQkmfu4ERCifNLahUTy5RGidSliRbafAp1tQqJ1lKAbqTx-vyfH9VQNv68v9ucOrW5MbCvtm8BTrrbpDolQLuHWf7nCV6oj6fJUeeSUGNR_SUIFASmHbK1Ps5Ro-lO4BR79IUlmRhCw_YJC7wSvFE"
    }
  ]
};

export default function Home() {
  return (
    <div className="layout-container flex h-full grow flex-col">
      <Header />
      <div className="px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <div className="px-4 py-3">
            <label className="flex flex-col min-w-40 h-12 w-full">
              <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                <div className="text-[#8c6a5a] flex border-none bg-[#f1ece9] items-center justify-center pl-4 rounded-l-xl border-r-0">
                  <Search size={24} />
                </div>
                <input
                  placeholder="Search for sandwiches or locations"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#191310] focus:outline-0 focus:ring-0 border-none bg-[#f1ece9] focus:border-none h-full placeholder:text-[#8c6a5a] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                />
              </div>
            </label>
          </div>

          <h2 className="text-[#191310] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
            Top Rated Sandwiches
          </h2>
          <div className="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex items-stretch p-4 gap-3">
              {EXAMPLE_SANDWICHES.topRated.map((sandwich) => (
                <div key={sandwich.id} className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-60">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl flex flex-col"
                    style={{ backgroundImage: `url("${sandwich.image}")` }}
                  />
                  <div>
                    <p className="text-[#191310] text-base font-medium leading-normal">{sandwich.title}</p>
                    <p className="text-[#8c6a5a] text-sm font-normal leading-normal">{sandwich.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-[#191310] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
            Trending Sandwiches
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
            {EXAMPLE_SANDWICHES.trending.map((sandwich) => (
              <div key={sandwich.id} className="flex flex-col gap-3 pb-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                  style={{ backgroundImage: `url("${sandwich.image}")` }}
                />
                <div>
                  <p className="text-[#191310] text-base font-medium leading-normal">{sandwich.title}</p>
                  <p className="text-[#8c6a5a] text-sm font-normal leading-normal">{sandwich.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex px-4 py-3 justify-center">
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#eccebf] text-[#191310] text-sm font-bold leading-normal tracking-[0.015em]">
              <span className="truncate">Submit a Sandwich</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
