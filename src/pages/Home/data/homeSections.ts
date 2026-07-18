export const homeSections = [
{
    type: "hero",
    data: {
      variant: "collection", // This triggers the switch in HeroRenderer
      categoryLabel: "hero.categoryLabel", // Translation key
      categorySlug: "new-arrivals",
      title: "hero.title",
      description: "hero.description",
      primaryActionLabel: "hero.button",
      primaryActionLink: "/shop",
      imageSrc: "/images/hero-bg.jpg",
      imageAlt: "hero.imageAlt"
    }
  },

  {
    type: "categories",
    data: {
      title: "categories.title",

      categories: [
        {
          id: "1",
          name: "categories.items.men",
          image: "https://picsum.photos/400/400",
          link: "/category/men"
        },
        {
          id: "2",
          name: "categories.items.women",
          image: "https://picsum.photos/400/401",
          link: "/category/women"
        },
        {
          id: "3",
          name: "categories.items.shoes",
          image: "https://picsum.photos/400/402",
          link: "/category/shoes"
        }
      ]
    }
  },

  {
    type: "featuredProducts",
    data: {
      title: "featuredProducts.title",

      products: [
        {
          id: "1",
          name: "products.watch",
          image: "https://picsum.photos/500/500",
          price: 120,
          oldPrice: 150,
          link: "/product/watch"
        },
        {
          id: "2",
          name: "products.shoes",
          image: "https://picsum.photos/501/500",
          price: 80
        }
      ]
    }
  },

  {
    type: "promoBanner",
    data: {
      title: "promoBanner.title",
      description: "promoBanner.description",
      button: "promoBanner.button",
      buttonLink: "/sale",

      image: "https://picsum.photos/1400/500",
      imageAlt: "promoBanner.imageAlt"
    }
  },

  {
    type: "bestSellers",
    data: {
      title: "bestSellers.title",

      products: [
        {
          id: "1",
          name: "products.watch",
          image: "https://picsum.photos/500/500",
          price: 120,
          oldPrice: 150,
          link: "/product/watch"
        },
        {
          id: "2",
          name: "products.bag",
          image: "https://picsum.photos/501/500",
          price: 90
        }
      ]
    }
  },

  {
    type: "newArrivals",
    data: {
      title: "newArrivals.title",

      products: [
        {
          id: "1",
          name: "products.newItem",
          image: "https://picsum.photos/500/500",
          price: 75,
          link: "/product/new-item"
        },
        {
          id: "2",
          name: "products.newBag",
          image: "https://picsum.photos/501/500",
          price: 120
        }
      ]
    }
  },

  {
    type: "whyChooseUs",
    data: {
      title: "whyChooseUs.title",

      features: [
        {
          id: "1",
          icon: "/icons/shipping.svg",
          title: "whyChooseUs.fastShipping",
          description: "whyChooseUs.fastShippingDesc"
        },
        {
          id: "2",
          icon: "/icons/payment.svg",
          title: "whyChooseUs.securePayment",
          description: "whyChooseUs.securePaymentDesc"
        },
        {
          id: "3",
          icon: "/icons/quality.svg",
          title: "whyChooseUs.qualityProducts",
          description: "whyChooseUs.qualityProductsDesc"
        },
        {
          id: "4",
          icon: "/icons/support.svg",
          title: "whyChooseUs.support",
          description: "whyChooseUs.supportDesc"
        }
      ]
    }
  },

  {
    type: "testimonials",
    data: {
      title: "testimonials.title",

      testimonials: [
        {
          id: "1",
          name: "testimonials.users.ahmed.name",
          role: "testimonials.users.ahmed.role",
          comment: "testimonials.users.ahmed.comment",
          avatar: "https://i.pravatar.cc/150?img=12",
          rating: 5
        },
        {
          id: "2",
          name: "testimonials.users.sara.name",
          role: "testimonials.users.sara.role",
          comment: "testimonials.users.sara.comment",
          avatar: "https://i.pravatar.cc/150?img=32",
          rating: 5
        }
      ]
    }
  },

  {
    type: "newsletter",
    data: {
      title: "newsletter.title",
      description: "newsletter.description",
      placeholder: "newsletter.placeholder",
      button: "newsletter.button"
    }
  },

  {
    type: "brandLogos",
    data: {
      title: "brandLogos.title",

      brands: [
        {
          id: "1",
          name: "brands.nike",
          logo: "/brands/nike.svg",
          link: "#"
        },
        {
          id: "2",
          name: "brands.adidas",
          logo: "/brands/adidas.svg",
          link: "#"
        },
        {
          id: "3",
          name: "brands.apple",
          logo: "/brands/apple.svg"
        }
      ]
    }
  }
];