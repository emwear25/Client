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
      { label: "Детски раници", to: "/category/kids-bags", image: "/img/menu/kids-bags.jpg" },
    ],
  },
  {
    title: "Баня и сън",
    items: [
      { label: "Детски халати", to: "/category/kid-bathrobes", image: "/img/menu/bathrobes.jpg" },
      { label: "Кърпи за лице", to: "/category/personalizirani-kurpi-za-lice", image: "/img/menu/face-towels.jpg" },
      { label: "Кърпи с ушички", to: "/category/kids-towels", image: "/img/menu/kids-towels.jpg" },
      { label: "Муселинови одеяла", to: "/category/kids-blankets", image: "/img/menu/blankets.jpg" },
    ],
  },
  {
    title: "Аксесоари и подаръци",
    items: [
      { label: "Ключодържатели", to: "/category/keychains", image: "/img/menu/keychains.jpg" },
      { label: "Плюшени играчки", to: "/category/personalizirani-plusheni-igrachki", image: "/img/menu/plush-toys.jpg" },
      { label: "Гергефи", to: "/category/personalizirani-gergefi", image: "/img/menu/gergefi.jpg" },
    ],
  },
];
