"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
// Definisikan tipe untuk produk
interface Project {
  product_id: number;
  product_name: string;
  description: string;
  price: number;
  original_price: number;
  promo: string;
  ratings: number[];
  image: string;
}

const productData: Project[] = [
  {
    product_id: 1,
    product_name: "Project A",
    description: "This is a description of Project A.",
    price: 150000,
    original_price: 120000,
    promo: "10000",
    ratings: [5, 4, 4, 3],
    image: "https://picsum.photos/seed/product1/200/300", // Random image
  },
  {
    product_id: 2,
    product_name: "Project B",
    description: "This is a description of Project B.",
    price: 200000,
    original_price: 180000,
    promo: "20000",
    ratings: [4, 4, 4],
    image: "https://picsum.photos/seed/product2/200/300", // Random image
  },
  {
    product_id: 3,
    product_name: "Project C",
    description: "This is a description of Project C.",
    price: 300000,
    original_price: 270000,
    promo: "30000",
    ratings: [5, 5, 5, 4],
    image: "https://picsum.photos/seed/product3/200/300", // Random image
  },
  {
    product_id: 4,
    product_name: "Project C",
    description: "This is a description of Project C.",
    price: 300000,
    original_price: 270000,
    promo: "30000",
    ratings: [5, 5, 5, 4],
    image: "https://picsum.photos/seed/product3/200/300", // Random image
  },
  {
    product_id: 5,
    product_name: "Project C",
    description: "This is a description of Project C.",
    price: 300000,
    original_price: 270000,
    promo: "30000",
    ratings: [5, 5, 5, 4],
    image: "https://picsum.photos/seed/product3/200/300", // Random image
  },
  {
    product_id: 6,
    product_name: "Project C",
    description: "This is a description of Project C.",
    price: 300000,
    original_price: 270000,
    promo: "30000",
    ratings: [5, 5, 5, 4],
    image: "https://picsum.photos/seed/product3/200/300", // Random image
  },
  {
    product_id: 7,
    product_name: "Project D",
    description: "This is a description of Project D.",
    price: 400000,
    original_price: 350000,
    promo: "0",
    ratings: [3, 3, 4],
    image: "https://picsum.photos/seed/product4/200/300", // Random image
  },
  {
    product_id: 8,
    product_name: "Project E",
    description: "This is a description of Project E.",
    price: 500000,
    original_price: 450000,
    promo: "50000",
    ratings: [5, 4],
    image: "https://picsum.photos/seed/product5/200/300", // Random image
  },
  {
    product_id: 9,
    product_name: "Project E",
    description: "This is a description of Project E.",
    price: 500000,
    original_price: 450000,
    promo: "50000",
    ratings: [5, 4],
    image: "https://picsum.photos/seed/product5/200/300", // Random image
  },
  {
    product_id: 10,
    product_name: "Project E",
    description: "This is a description of Project E.",
    price: 500000,
    original_price: 450000,
    promo: "50000",
    ratings: [5, 4],
    image: "https://picsum.photos/seed/product5/200/300", // Random image
  },
  {
    product_id: 11,
    product_name: "Project E",
    description: "This is a description of Project E.",
    price: 500000,
    original_price: 450000,
    promo: "50000",
    ratings: [5, 4],
    image: "https://picsum.photos/seed/product5/200/300", // Random image
  },
  {
    product_id: 12,
    product_name: "Project E",
    description: "This is a description of Project E.",
    price: 500000,
    original_price: 450000,
    promo: "50000",
    ratings: [5, 4],
    image: "https://picsum.photos/seed/product5/200/300", // Random image
  },
  {
    product_id: 13,
    product_name: "Project E",
    description: "This is a description of Project E.",
    price: 500000,
    original_price: 450000,
    promo: "50000",
    ratings: [5, 4],
    image: "https://picsum.photos/seed/product5/200/300", // Random image
  },
  {
    product_id: 14,
    product_name: "Project E",
    description: "This is a description of Project E.",
    price: 500000,
    original_price: 450000,
    promo: "50000",
    ratings: [5, 4],
    image: "https://picsum.photos/seed/product5/200/300", // Random image
  },
  {
    product_id: 15,
    product_name: "Project E",
    description: "This is a description of Project E.",
    price: 500000,
    original_price: 450000,
    promo: "50000",
    ratings: [5, 4],
    image: "https://picsum.photos/seed/product5/200/300", // Random image
  },
];

const Works: React.FC = () => {
  const router = useRouter();
  const [visibleProducts, setVisibleProducts] = useState(10);
  const [loading, setLoading] = useState(false);

  const showMoreProducts = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleProducts((prev) => prev + 5);
      setLoading(false);
    }, 1000);
  };

  const handleDetailProduct = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  const truncateText = (text: string): string => {
    const maxLength = 55;
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <div className="py-10 p-2 md:p-4">
      <div className="py-10">
        <div className="flex flex-col gap-4 justify-center items-center">
          <h1 className="text-center text-4xl text-brand-500 underline">Work</h1>
          <p className="text-white">I had the pleasure of working with these awesome projects</p>
        </div>
        <div className="absolute text-brand-500 -top-4 md:-top-10 right-5 md:right-24 text-[3rem] md:text-[5rem]">{`</>`}</div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 xl:mx-auto">
        {productData.slice(0, visibleProducts).map((product) => (
          <div key={product.product_id}>
            <div className="relative flex justify-center min-w-[160px] xl:min-w-[200px] max-w-[250px] flex-col overflow-hidden rounded-md border border-gray-100 bg-white shadow-md transform transition duration-500 hover:scale-105">
              <span className="relative flex h-32 xl:h-40 overflow-hidden">
                <img className="w-full h-[150px] object-cover rounded-t-md" src={product.image} alt={product.product_name} />
              </span>
              <div className="mt-2 md:mt-2 px-2 md:px-2 pb-2 md:pb-2">
                <div onClick={() => handleDetailProduct(product.product_id)}>
                  <div className="flex flex-col text-left">
                    <h5 className="text-base xl:text-lg text-black">{product.product_name}</h5>
                    <div className="text-xs xl:text-sm text-gray-900" dangerouslySetInnerHTML={{ __html: truncateText(product.description) }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {visibleProducts < productData.length && (
        <div className="flex justify-center my-6 xl:my-10">
          <Button onClick={showMoreProducts} className="bg-white text-black hover:bg-gray-200">
            {loading ? "Loading..." : "Show More"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Works;
