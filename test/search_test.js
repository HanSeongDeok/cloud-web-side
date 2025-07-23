import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 100,
    duration: '10s',
};

export default function () {
    const keyword = "";
    const url = `http://localhost:8080/api/data-table/search?keyword=${encodeURIComponent(keyword)}`;

    const res = http.get(url);

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response is not empty': (r) => r.body && r.body.length > 2,
    });
}

// function searchTest() {
//     const vuId = __VU; // 현재 VU의 ID (1부터 시작)
//     const keywords = [
//         '자동차', '엔진', '브레이크', '타이어', '배터리', '오일', '필터', '펌프', '센서', '모터',
//         '전자제어', '시스템', '부품', '정비', '점검', '교체', '수리', '유지보수', '진단', '테스트',
//         '성능', '효율', '안전', '품질', '검사', '측정', '분석', '데이터', '정보', '기술',
//         '개발', '연구', '설계', '제조', '생산', '공정', '관리', '운영', '서비스', '지원',
//         '고객', '사용자', '관리자', '엔지니어', '기술자', '전문가', '컨설턴트', '교육', '훈련', '인증'
//     ];

//     // VU ID를 기반으로 키워드 선택 (순환 방식)
//     const keyword = keywords[(vuId - 1) % keywords.length];
//     const url = `http://localhost:8080/api/data-table/search?keyword=${encodeURIComponent(keyword)}`;

//     const res = http.get(url);

//     check(res, {
//         'status is 200': (r) => r.status === 200,
//         'response is not empty': (r) => r.body && r.body.length > 2,
//     });
// }