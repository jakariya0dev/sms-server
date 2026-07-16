export interface CreateClass {
  schoolId: string;
  name: string;
  displayOrder: number;
  isActive?: boolean;
}

export interface UpdateClass {
  name?: string;
  displayOrder?: number;
  isActive?: boolean;
}
