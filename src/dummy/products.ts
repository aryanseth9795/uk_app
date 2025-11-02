// src/data/products.ts
import type { CategoryId } from './category';

// Use category values except "all"
export type Product = {
  id: string;
  title: string;
  price: string;    // e.g. "Rs 245"
  image: string;
  category: Exclude<CategoryId, 'all'>;
};

export const MOCK: Product[] = [
  // --- Skincare (1-9) ---
  { id: '1',  title: 'Rose Glow Serum',            price: 'Rs 245', image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=600', category: 'skincare' },
  { id: '2',  title: 'Hydra Burst Moisturizer',    price: 'Rs 399', image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?q=80&w=600',   category: 'skincare' },
  { id: '3',  title: 'Vitamin C Day Cream',        price: 'Rs 349', image: 'https://images.unsplash.com/photo-1604908554027-912f4d4f3b25?q=80&w=600', category: 'skincare' },
  { id: '4',  title: 'Aloe Calm Face Wash',        price: 'Rs 199', image: 'https://images.unsplash.com/photo-1582092728066-5a1f56d0d917?q=80&w=600', category: 'skincare' },
  { id: '5',  title: 'Retinol Night Repair',       price: 'Rs 549', image: 'https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?q=80&w=600', category: 'skincare' },
  { id: '6',  title: 'SPF50 Sun Shield',           price: 'Rs 299', image: 'https://images.unsplash.com/photo-1585237006463-3e46b2a7d7da?q=80&w=600', category: 'skincare' },
  { id: '7',  title: 'Green Tea Toner',            price: 'Rs 229', image: 'https://images.unsplash.com/photo-1615220192779-8b68b0f2a5f1?q=80&w=600', category: 'skincare' },
  { id: '8',  title: 'Avocado Face Mask',          price: 'Rs 275', image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?q=80&w=600', category: 'skincare' },
  { id: '9',  title: 'Hyaluronic Boost Drops',     price: 'Rs 499', image: 'https://images.unsplash.com/photo-1616394584738-fc6e6121df43?q=80&w=600', category: 'skincare' },

  // --- Makeup (10-18) ---
  { id: '10', title: 'Effortless Eyeshadow Palette', price: 'Rs 385', image: 'https://images.unsplash.com/photo-1585386959984-a41552231658?q=80&w=600', category: 'makeup' },
  { id: '11', title: 'Matte Velvet Lipstick',        price: 'Rs 249', image: 'https://images.unsplash.com/photo-1585238342020-96629b06d2f8?q=80&w=600', category: 'makeup' },
  { id: '12', title: 'Silky Smooth Foundation',      price: 'Rs 499', image: 'https://images.unsplash.com/photo-1586495985093-87d1309f07f1?q=80&w=600', category: 'makeup' },
  { id: '13', title: 'Feather Lash Mascara',         price: 'Rs 299', image: 'https://images.unsplash.com/photo-1611930021780-8a1b9a5a0b4c?q=80&w=600', category: 'makeup' },
  { id: '14', title: 'Perfect Brow Kit',             price: 'Rs 225', image: 'https://images.unsplash.com/photo-1596464716121-8b7b1a5f338e?q=80&w=600', category: 'makeup' },
  { id: '15', title: 'Cream Blush Duo',              price: 'Rs 275', image: 'https://images.unsplash.com/photo-1601924582971-b10d928cbb56?q=80&w=600', category: 'makeup' },
  { id: '16', title: 'Longwear Kajal',               price: 'Rs 149', image: 'https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?q=80&w=600', category: 'makeup' },
  { id: '17', title: 'Dewy Setting Spray',           price: 'Rs 199', image: 'https://images.unsplash.com/photo-1547887538-047f8143c819?q=80&w=600',   category: 'makeup' },
  { id: '18', title: 'Nude Shine Lip Gloss',         price: 'Rs 199', image: 'https://images.unsplash.com/photo-1585386959988-c67890c0a6e4?q=80&w=600', category: 'makeup' },

  // --- Perfume (19-27) ---
  { id: '19', title: 'Whisper Bloom Perfume',      price: 'Rs 555', image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600', category: 'perfume' },
  { id: '20', title: 'Noir Oud Eau de Parfum',     price: 'Rs 799', image: 'https://images.unsplash.com/photo-1585386958642-3b8def9f0ca2?q=80&w=600', category: 'perfume' },
  { id: '21', title: 'Citrus Mist Cologne',        price: 'Rs 425', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600', category: 'perfume' },
  { id: '22', title: 'Vanilla Sky EDT',            price: 'Rs 499', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600', category: 'perfume' },
  { id: '23', title: 'Marine Breeze EDP',          price: 'Rs 699', image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=600', category: 'perfume' },
  { id: '24', title: 'Amber Night Extrait',        price: 'Rs 899', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600', category: 'perfume' },
  { id: '25', title: 'Blush Petals Body Mist',     price: 'Rs 299', image: 'https://images.unsplash.com/photo-1556228453-efd0a5d8c9a0?q=80&w=600', category: 'perfume' },
  { id: '26', title: 'Cedar & Musk Splash',        price: 'Rs 375', image: 'https://images.unsplash.com/photo-1585386958408-6a52f66abe7e?q=80&w=600', category: 'perfume' },
  { id: '27', title: 'Spiced Orchard EDT',         price: 'Rs 455', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600', category: 'perfume' },

  // --- Gifts (28-36) ---
  { id: '28', title: 'Deluxe Spa Gift Set',        price: 'Rs 425', image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=600', category: 'gifts' },
  { id: '29', title: 'Mini Skincare Combo',        price: 'Rs 499', image: 'https://images.unsplash.com/photo-1592945403244-b3baf8f6f66b?q=80&w=600', category: 'gifts' },
  { id: '30', title: 'Festive Fragrance Duo',      price: 'Rs 699', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600', category: 'gifts' },
  { id: '31', title: 'Self-Care Sunday Kit',       price: 'Rs 599', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600', category: 'gifts' },
  { id: '32', title: 'Makeup Starter Hamper',      price: 'Rs 649', image: 'https://images.unsplash.com/photo-1512203492609-8f6f0de8b2ff?q=80&w=600', category: 'gifts' },
  { id: '33', title: 'Glow Essentials Pouch',      price: 'Rs 349', image: 'https://images.unsplash.com/photo-1596465537568-a59e8f2dc21b?q=80&w=600', category: 'gifts' },
  { id: '34', title: 'Aromatherapy Candle Set',    price: 'Rs 399', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600', category: 'gifts' },
  { id: '35', title: 'Winter Care Gift Box',       price: 'Rs 799', image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?q=80&w=600', category: 'gifts' },
  { id: '36', title: 'Lavender Relax Pack',        price: 'Rs 559', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=600', category: 'gifts' },
];
