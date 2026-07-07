// app/classroom/strings.ts —— /classroom 頁面自己的 UI 介面字串（雙語）。
// mock 課程內容一律中文，來自 data/classroom.json；本檔只放介面文案。
// 值為 {zh, en}，交給 i18n 的 t() 取用。

export const CR = {
  // 頁面標頭
  pageKicker: { zh: '教室體驗', en: 'Classroom experience' },
  pageLead: {
    zh: '走一遍上課前後的完整體驗：進教室、AI 課後摘要、練習題批改、課堂問答。',
    en: 'Walk through the full before-and-after: joining class, AI recap, graded exercises, and Q&A.',
  },
  sessionTag: { zh: '示範課程', en: 'Demo session' },

  // 區塊一：上課資訊
  meetHeading: { zh: '上課資訊', en: 'Class info' },
  joinStepsTitle: { zh: '怎麼進教室', en: 'How to join' },
  joinButton: { zh: '開啟 Google Meet', en: 'Open Google Meet' },
  joinButtonHint: { zh: '在新分頁開啟', en: 'Opens in a new tab' },
  recordingLabel: { zh: '錄影告知', en: 'Recording notice' },

  // 區塊二：AI 課程摘要
  summaryHeading: { zh: 'AI 課程摘要', en: 'AI class recap' },
  timelineTitle: { zh: '章節時間軸', en: 'Chapter timeline' },
  timelineHint: { zh: '點任一段看提示', en: 'Tap a chapter for a note' },
  timelineTooltip: { zh: 'Demo：錄影檔未附', en: 'Demo: recording not included' },
  keyPointsTitle: { zh: '重點整理', en: 'Key points' },
  termsTitle: { zh: '專有名詞卡', en: 'Glossary cards' },
  termsHint: { zh: '滑鼠移上去翻面看白話解釋', en: 'Hover to flip for a plain explanation' },
  termFlipHintTouch: { zh: '（觸控裝置點一下翻面）', en: '(tap to flip on touch devices)' },

  // 區塊三：練習題
  exercisesHeading: { zh: '本課練習題', en: 'Practice questions' },
  typeChoice: { zh: '選擇題', en: 'Multiple choice' },
  typeShort: { zh: '簡答題', en: 'Short answer' },
  showFeedback: { zh: '看 AI 批改示範', en: 'Show AI grading demo' },
  hideFeedback: { zh: '收合', en: 'Hide' },
  correctAnswer: { zh: '正解', en: 'Correct answer' },
  studentAnswerLabel: { zh: '學生作答（示意）', en: "Student's answer (sample)" },
  aiFeedbackLabel: { zh: 'AI 批改與建議', en: 'AI grading & feedback' },
  explanationLabel: { zh: '解析', en: 'Explanation' },

  // 區塊四：知識庫問答
  qaHeading: { zh: '課堂知識庫問答', en: 'Class knowledge Q&A' },
  qaPickPrompt: { zh: '點一個問題，看以本堂內容為依據的回答。', en: 'Pick a question to see an answer grounded in this class.' },
  qaAnswerLabel: { zh: 'AI 回答', en: 'AI answer' },
  qaCannedNote: {
    zh: 'Demo 版採預設問答，正式版會即時以本堂摘要為 context 回答你的提問。',
    en: 'This demo uses preset Q&A; the full version answers your own questions live using the class recap as context.',
  },
} as const;
