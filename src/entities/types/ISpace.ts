export interface ISpace {
  id: number;
  name: string;
  address: string;
  location: string;
  size: number;
  maxCapacity: number;
  baseRentalCost: number;
  imageUrl: string;
  slots: any[];
}
