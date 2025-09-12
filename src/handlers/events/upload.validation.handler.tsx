
import { getRequiredFields } from "@/models/requiredValueModel";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface FileWithMetadata {
  file: File;
  metadata: any;
  index: number;
}

export const validateFileMetadata = (
  files: File[],
  fileMetadata: Record<number, any>
): ValidationResult => {
  const errors: string[] = [];

  // 필수값 누락 파일명 저장 배열
  const missingRequiredFields: string[] = [];

  Object.entries(fileMetadata).forEach(([index, metadata]) => {
    const fileName = files[Number(index)]?.name || `파일(${index})`;
    const deliverableType = metadata?.deliverableType;
    const testClassification = metadata?.testClassification;

    // 필수 필드 목록
    const requiredFields = getRequiredFields(deliverableType, testClassification);
    if (!requiredFields.length) {
      missingRequiredFields.push(`${fileName}의 필수 속성이 입력되지 않았습니다.`);
      return;
    }

    const hasMissing = requiredFields.some(
      (field) =>
        field.required &&
        (
          !metadata ||
          metadata[field.field] === undefined ||
          metadata[field.field] === null ||
          metadata[field.field] === ""
        )
    );

    if (hasMissing) {
      missingRequiredFields.push(`${fileName}의 필수 속성이 입력되지 않았습니다.`);
    }
  });

  // files와 fileMetadata 매칭 안되는 경우 체크
  const filesWithoutMetadata = files
    .map((file, idx) => ({ file, idx }))
    .filter(({ idx }) => !(idx in fileMetadata))
    .map(({ file }) => file.name);

  // 에러 메시지 추가
  if (missingRequiredFields.length > 0) {
    errors.push(...missingRequiredFields);
  }

  if (filesWithoutMetadata.length > 0) {
    errors.push(`다음 파일의 메타데이터가 존재하지 않습니다: ${filesWithoutMetadata.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

