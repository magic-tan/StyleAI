export type Gender = '男士' | '女士';

export enum BodyType {
  Slim = '修身/偏瘦',
  Average = '标准匀称',
  Athletic = '健硕/运动',
  PlusSize = '大码/丰满',
}

export enum FashionStyle {
  Casual = '休闲日常 (Casual)',
  Formal = '商务正装 (Formal)',
  Streetwear = '潮流街头 (Streetwear)',
  Vintage = '复古文艺 (Vintage)',
  Minimalist = '极简主义 (Minimalist)',
  BusinessCasual = '商务休闲 (Smart Casual)',
  OldMoney = '老钱风 (Old Money)',
  Cyberpunk = '赛博朋克 (Cyberpunk)',
  Y2K = '千禧辣妹/Y2K',
  Gorpcore = '山系户外 (Gorpcore)',
  FrenchChic = '法式慵懒 (French Chic)',
  IvyLeague = '常春藤学院 (Ivy League)',
  Workwear = '日系工装 (Workwear)',
  Darkwear = '暗黑先锋 (Darkwear)'
}

export interface UserPreferences {
  gender: Gender | null;
  bodyType: BodyType | null;
  style: FashionStyle | null;
}

export interface OutfitItem {
  name: string;
  description: string;
  color: string;
}

export interface OutfitRecommendation {
  title: string;
  explanation: string;
  items: {
    top: OutfitItem;
    bottom: OutfitItem;
    shoes: OutfitItem;
  };
  visualPrompt: string;
}

export interface GeneratedImage {
  imageUrl: string;
  prompt: string;
}