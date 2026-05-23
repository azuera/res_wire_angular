export interface Product {
  id: number;
  title: string;
  quantity: number;
  releaseDate: string;
  region: string;
  price: number;
  description: string | null;
  rating: number | null;
  tags: string[];
  requiredConfiguration: string | null;
  plateform: any[];
  images: any[];
}
