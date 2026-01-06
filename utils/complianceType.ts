export interface Results {
  config: Config;
  suites: Suite[];
  errors: any[];
  stats: Stats;
}

export interface Config {
  configFile: string;
  rootDir: TDir;
  forbidOnly: boolean;
  fullyParallel: boolean;
  globalSetup: null;
  globalTeardown: null;
  globalTimeout: number;
  grep: Grep;
  grepInvert: null;
  maxFailures: number;
  metadata: Metadata;
  preserveOutput: string;
  reporter: Array<Array<ReporterClass | null | string>>;
  reportSlowTests: ReportSlowTests;
  quiet: boolean;
  projects: Project[];
  shard: null;
  updateSnapshots: string;
  version: string;
  workers: number;
  webServer: null;
}

export interface Grep {}

export interface Metadata {
  actualWorkers: number;
}

export interface Project {
  outputDir: OutputDir;
  repeatEach: number;
  retries: number;
  metadata: Grep;
  id: string;
  name: string;
  testDir: TDir;
  testIgnore: any[];
  testMatch: string[];
  timeout: number;
}

export enum OutputDir {
  UsersSmileBestybaySmilePwTemplateTestResults = "/Users/smile.bestybay/smile/pw-template/test-results",
}

export enum TDir {
  UsersSmileBestybaySmilePwTemplateTests = "/Users/smile.bestybay/smile/pw-template/tests",
}

export interface ReportSlowTests {
  max: number;
  threshold: number;
}

export interface ReporterClass {
  outputFile?: string;
  open?: string;
}

export interface Stats {
  startTime: Date;
  duration: number;
  expected: number;
  skipped: number;
  unexpected: number;
  flaky: number;
}

export interface Suite {
  title: string;
  file: File;
  column: number;
  line: number;
  specs: Spec[];
  suites?: Suite[];
}

export enum File {
  ComplianceSpecTs = "compliance.spec.ts",
}

export interface Spec {
  title: SpecTitle;
  ok: boolean;
  tags: any[];
  tests: Test[];
  id: string;
  file: File;
  line: number;
  column: number;
}

export interface Test {
  timeout: number;
  annotations: any[];
  expectedStatus: ExpectedStatusEnum;
  projectId: ProjectIDEnum;
  projectName: ProjectIDEnum;
  results: Result[];
  status: PurpleStatus;
}

export enum ExpectedStatusEnum {
  Failed = "failed",
  Passed = "passed",
  Skipped = "skipped",
  TimedOut = "timedOut",
}

export enum ProjectIDEnum {
  Compliance = "compliance",
}

export interface Result {
  workerIndex: number;
  status: ExpectedStatusEnum;
  duration: number;
  errors: ErrorElement[];
  stdout: any[];
  stderr: any[];
  retry: number;
  startTime: Date;
  attachments: Attachment[];
  steps?: Step[];
  error?: PurpleError;
  errorLocation?: Location;
}

export interface Attachment {
  name: AttachmentName;
  contentType: ContentType;
  path: string;
}

export enum ContentType {
  ApplicationZip = "application/zip",
}

export enum AttachmentName {
  Trace = "trace",
}

export interface PurpleError {
  message: string;
  stack: string;
  matcherResult?: PurpleMatcherResult;
  location: Location;
  snippet: string;
}

export interface Location {
  file: string;
  column: number;
  line: number;
}

export interface PurpleMatcherResult {
  message: string;
  pass: boolean;
  actual?: number | string;
  name?: MatcherResultName;
  expected?: ExpectedClass | ExpectedEnum | number;
  log?: string[];
  timeout?: number;
}

export interface ExpectedClass {
  sample?: Sample;
  inverse?: boolean;
}

export enum Sample {
  Gtm5Wzfj3C9 = "GTM-5WZFJ3C9",
}

export enum ExpectedEnum {
  DoNotSellOrShareMyPersonalInformation = "Do Not Sell or Share My Personal Information",
  Visible = "visible",
}

export enum MatcherResultName {
  ToBeVisible = "toBeVisible",
  ToContainText = "toContainText",
  ToEqual = "toEqual",
  ToHaveAttribute = "toHaveAttribute",
  ToHaveCount = "toHaveCount",
  ToHaveText = "toHaveText",
}

export interface ErrorElement {
  location: Location;
  message: string;
}

export interface Step {
  title: StepTitle;
  duration: number;
  error?: StepError;
}

export interface StepError {
  message: string;
  stack: string;
  matcherResult: FluffyMatcherResult;
  location: Location;
  snippet: string;
}

export interface FluffyMatcherResult {
  message: string;
  pass: boolean;
  name?: MatcherResultName;
  expected?: Grep | ExpectedEnum;
  actual?: string;
  log?: string[];
  timeout?: number;
}

export enum StepTitle {
  DoNotSellOrShareMyPersonalInformationLinks = "Do Not Sell or Share My Personal Information links",
  PrivacyPolicyLinks = "Privacy Policy links",
}

export enum PurpleStatus {
  Expected = "expected",
  Skipped = "skipped",
  Unexpected = "unexpected",
}

export enum SpecTitle {
  CheckCookieConsent = "check cookie consent",
  CheckGTM = "Check GTM",
  CheckLegalLinks = "check legal links",
}
