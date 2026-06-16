export type LinkStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED';

export type LinkListFilters = {
  search?: string;
  status?: LinkStatus | 'ALL';
  page?: number;
  limit?: number;
};

export interface ShortLink {
  id: number;
  shortCode: string;
  shortUrl?: string;
  originalUrl: string;
  customAlias?: string | null;
  title?: string | null;
  status: LinkStatus;
  isPasswordProtected: boolean;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  clickCount: number;
  uniqueVisitors?: number;
  lastClickedAt?: string | null;
}

export type CreateLinkInput = {
  originalUrl: string;
  customAlias?: string;
  expiresAt?: string;
  password?: string;
};

export type UpdateLinkInput = Partial<CreateLinkInput> & {
  status?: Exclude<LinkStatus, 'EXPIRED'>;
};

export type LinkListResponse = {
  links: ShortLink[];
  total: number;
};
