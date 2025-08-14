export type FileType = 'dbc' | 'blf' | 'excel' | 'image' | 'other';

export type VehicleType = 'A_VEHICLE' | 'B_VEHICLE' | 'C_VEHICLE';

export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: FileType;
  extension: string;
  description: string;
  uploadedBy: string;
  createdAt: Date;
  vehicle: VehicleType;
  // 추가 메타데이터 컬럼들 (예시)
  customField1?: string;
  customField2?: string;
}

export interface FilterState {
  vehicle: VehicleType | 'ALL';
  searchColumn: string;
  searchValue: string;
}

export interface SortState {
  column: keyof FileMetadata;
  direction: 'asc' | 'desc';
}