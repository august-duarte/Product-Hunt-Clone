export type Comment = {
  id: number;
  user_id: number;
  product_id: number;
  body: string;
  created_at: Date | string;
};
