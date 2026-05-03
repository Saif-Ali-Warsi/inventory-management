export interface Product {
    id: string;
    name: string;
    price: number;
    categoryId: string;
    isActive: boolean;
    tags: string[];
}