export interface CreateSection {
  schoolId: string;
  classId: string;
  name: string;
  displayOrder: number;
  isActive?: boolean;
}

export interface UpdateSection {
  name?: string;
  displayOrder?: number;
  isActive?: boolean;
}
