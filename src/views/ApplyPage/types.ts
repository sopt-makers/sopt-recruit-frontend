export interface ApplyRequest {
  picture: File | null;
  part: string;
  address: string;
  birthday: string;
  college: string;
  gender: string;
  knownPath: string;
  leaveAbsence: boolean;
  major: string;
  mostRecentSeasonStr: string;
  univYear: number;
  nearestStation: string;
  answers: Answer[];
  willAppjam: boolean;
}

export interface QuestionsRequest {
  season: number;
  group: string;
}

export interface Questions {
  charLimit: number;
  createdAt: string;
  group: string;
  id: number;
  ignoreCharLimit: boolean;
  isDeleted: boolean;
  isForTest: boolean;
  order: number;
  question: string;
  recruitingQuestionType: string;
  recruitingQuestionTypeId: number;
  recruitingQuestionTypeKr: string;
  recruitingQuestionTypeLegacy: null;
  season: number;
  updatedAt: string;
}

export interface QuestionsResponse {
  err: boolean;
  commonQuestions: {
    part: string;
    recruitingQuestionTypeId: number;
    questions: Questions[];
  };
  partQuestions: {
    part: string;
    recruitingQuestionTypeId: number;
    questions: Questions[];
  }[];
  questionTypes: {
    id: number;
    type: string;
    typeKr: string;
    typeLegacy: null;
  }[];
}

export interface ApplyError {
  err: boolean;
  userMessage: string;
}

interface Answer {
  recruitingQuestionId: number;
  answer: string;
}

export interface Applicant {
  id: number;
  group: string;
  season: number;
  mostRecentSeason: number;
  part: string;
  phone: string;
  email: string;
  name: string;
  address: string;
  gender: string;
  birthday: string;
  college: string;
  major: string;
  univYear: number;
  leaveAbsence: boolean;
  willAppjam: boolean;
  knownPath: string;
  pic: string;
  nearestStation: string;
  applicationPass: boolean;
  finalPass: boolean;
  isDeleted: boolean;
  isForTest: boolean;
  createdAt: string;
  updatedAt: string;
  submit: boolean;
}

interface Answers {
  id: number;
  group: string;
  season: number;
  recruitingQuestionTypeId: number;
  order: number;
  question: string;
  charLimit: number;
  ignoreCharLimit: boolean;
  isDeleted: boolean;
  isForTest: boolean;
  createdAt: string;
  updatedAt: string;
  answer: {
    id: number;
    recruitingApplicantId: number;
    recruitingQuestionId: number;
    answer: string;
    isDeleted: boolean;
    isForTest: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface ApplyResponse {
  err: boolean;
  applicant: Applicant;
  commonQuestions: Answers[];
  partQuestions: Answers[];
}
