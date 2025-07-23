

export const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        saveFileToDatabase(file);
    }
};

const saveFileToDatabase = async (file: File) => {
    try {
        const base64 = await fileToBase64(file);

        const fileData = {
            id: generateId(),
            fileName: file.name,
            fileContent: base64,
            filePath: `uploads/${file.name}`,
            fileSize: `${(file.size / 1024).toFixed(2)} KB`,
            fileType: file.type,
        };

        const response = await fetch('http://localhost:8080/api/files', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(fileData)
        });

        if (response.ok) {
            alert(`파일 "${file.name}"이 성공적으로 업로드되었습니다!`);
        } else {
            alert('파일 저장에 실패했습니다. 다시 시도해주세요.');
        }
    } catch (error) {
        alert('파일 저장 중 오류가 발생했습니다.');
    }
};

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64 = reader.result as string;
            const base64Data = base64.split(',')[1];
            resolve(base64Data);
        };
        reader.onerror = error => reject(error);
    });
};

const generateId = (): string => {
    return Math.random().toString(36);
};