// Shared, curated product menu used by both the desktop mega-menu (HeaderNav)
// and the mobile menu (MobileMenu). Not API-driven, so it stays consistent,
// excludes empty categories, and renders without the backend.

export interface ProductMenuItem {
  label: string;
  to: string;
  image: string;
}

export interface ProductMenuGroup {
  title: string;
  items: ProductMenuItem[];
}

export const productMenuGroups: ProductMenuGroup[] = [
  {
    title: "Раници",
    items: [
      { label: "Детски раници", to: "/category/kids-bags", image: "/img/banners/banner1.jpg" },
    ],
  },
  {
    title: "Текстил за баня",
    items: [
      { label: "Детски халати", to: "/category/kid-bathrobes", image: "/img/banners/banner2.jpg" },
      { label: "Кърпи за лице", to: "/category/personalizirani-kurpi-za-lice", image: "/img/home/face-towels.webp" },
      { label: "Кърпи с ушички", to: "/category/kids-towels", image: "/img/banners/banner3.jpg" },
      { label: "Муселинови одеяла", to: "/category/kids-blankets", image: "/img/banners/blankets-promo.jpg" },
    ],
  },
  {
    title: "Аксесоари и подаръци",
    items: [
      { label: "Ключодържатели", to: "/category/keychains", image: "/img/home/keychains.webp" },
      { label: "Плюшени играчки", to: "/category/personalizirani-plusheni-igrachki", image: "/img/home/plush-toys.webp" },
      { label: "Гергефи", to: "/category/personalizirani-gergefi", image: "/img/banners/banner4.jpg" },
    ],
  },
];
