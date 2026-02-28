export type Member = {
  loginEmail?: string;
  loginEmailVerified?: boolean;
  status?: 'UNKNOWN' | 'PENDING' | 'APPROVED' | 'BLOCKED' | 'OFFLINE' | string;
  contact?: {
    firstName?: string;
    lastName?: string;
    phones?: string[];
  };
  profile?: {
    nickname?: string;
    photo?: {
      url?: string;
      height?: number;
      width?: number;
      offsetX?: number;
      offsetY?: number;
    };
    title?: string;
  };
  _createdDate?: string | Date;
  _updatedDate?: string | Date;
  lastLoginDate?: string | Date;
};
