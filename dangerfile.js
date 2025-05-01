import { danger, warn, fail, message } from 'danger';

// PR 제목 형식 검사
const prTitleRegex = /^\[(feat|fix|docs|style|refactor|test|chore)\]:.+/;
if (!prTitleRegex.test(danger.github.pr.title)) {
  fail('PR 제목이 형식에 맞지 않습니다. "[type]: 제목" 형식을 사용해주세요.');
}

// 파일 크기 검사
const bigDiffThreshold = 500;
danger.git.created_files.forEach(file => {
  const changes = danger.git.diffForFile(file);
  if (changes && changes.additions > bigDiffThreshold) {
    warn(`${file}의 변경사항이 너무 큽니다 (${changes.additions} 줄). 더 작은 단위로 나누는 것을 고려해주세요.`);
  }
});

// 테스트 파일 포함 여부 검사
const hasSourceChanges = danger.git.modified_files.some(file => 
  file.includes('src/') && !file.includes('test')
);
const hasTestChanges = danger.git.modified_files.some(file => 
  file.includes('test')
);

if (hasSourceChanges && !hasTestChanges) {
  warn('소스 코드가 변경되었지만, 테스트 파일이 수정되지 않았습니다.');
}

// 패키지 의존성 변경 검사
const packageChanged = danger.git.modified_files.includes('package.json');
const lockfileChanged = danger.git.modified_files.includes('package-lock.json');

if (packageChanged && !lockfileChanged) {
  fail('package.json이 수정되었지만 package-lock.json이 업데이트되지 않았습니다.');
}

// TypeScript 타입 체크
const hasTypeChanges = danger.git.modified_files.some(file => 
  file.includes('types/') || file.endsWith('.d.ts')
);
const hasImplementationChanges = danger.git.modified_files.some(file => 
  file.endsWith('.ts') || file.endsWith('.tsx')
);

if (hasImplementationChanges && !hasTypeChanges) {
  message('타입 정의 파일의 업데이트가 필요한지 확인해주세요.');
}

// 기획서 관련 파일 변경 시 체크리스트
const hasUIChanges = danger.git.modified_files.some(file => 
  file.includes('components/') || file.includes('pages/')
);

if (hasUIChanges) {
  message('UI 변경사항이 있습니다. 다음 사항을 확인해주세요:\n' +
    '- [ ] 기획서의 UI/UX 가이드라인을 준수하였는가?\n' +
    '- [ ] 반응형 디자인이 적용되었는가?\n' +
    '- [ ] 접근성 가이드라인을 준수하였는가?');
}

// 권한 관련 변경사항 체크
const hasAuthChanges = danger.git.modified_files.some(file => 
  file.includes('auth/') || file.includes('services/') || file.includes('store/')
);

if (hasAuthChanges) {
  warn('권한 또는 인증 관련 변경사항이 있습니다. 보안 검토가 필요합니다.');
}

// 캘린더 연동 관련 변경사항 체크
const hasCalendarChanges = danger.git.modified_files.some(file => 
  file.includes('calendar/') || file.includes('sync/')
);

if (hasCalendarChanges) {
  message('캘린더 연동 관련 변경사항이 있습니다. 다음 사항을 확인해주세요:\n' +
    '- [ ] Google Calendar 연동이 정상 작동하는가?\n' +
    '- [ ] Apple Calendar 연동이 정상 작동하는가?\n' +
    '- [ ] 동기화 충돌 처리가 구현되었는가?');
} 