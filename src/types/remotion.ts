export type BrandTokens = {
  colors: { navy: string; teal: string; bg: string; red: string };
  fonts: { display: string; body: string };
  logo: string;
  musicBed: string;
};

export type HookBlock = {
  text: string;
  durationFrames: number;
  style: "kinetic_caption" | "static";
};

export type BodyBeat = { text: string; frames: number };

export type VerdictOverlay = {
  label: string;
  score: string;
  color: string;
  appearAtFrame: number;
};

export type CtaBlock = {
  text: string;
  frames: number;
  style: "endcard" | "lower_third";
};

export type Voiceover = {
  required: boolean;
  engine: "elevenlabs" | "human" | "none";
  voiceId?: string;
  script: string;
  src?: string;
};

export type BackgroundClip = {
  src: string;
  treatment: "blurred_loop_with_overlay" | "fullscreen" | "none";
  note?: string;
};

export type RenderOutput = {
  filename: string;
  codec: "h264" | "h265";
  crf: number;
};

export type AuthentilensTopicalV1Props = {
  template: "authentilens_topical_v1";
  version: string;
  recordId: string;
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
  brand: BrandTokens;
  hook: HookBlock;
  body: BodyBeat[];
  verdictOverlay: VerdictOverlay;
  cta: CtaBlock;
  voiceover: Voiceover;
  backgroundClip: BackgroundClip;
  complianceFooter: string;
  output: RenderOutput;
};

// ------------------------------------------------------------------
// authentilens_static_image_v1 — single-frame 1080x1080 image lane
// ------------------------------------------------------------------

export type StaticImageCardKind = "quote" | "stat" | "verdict" | "text";
export type StaticImageAccent = "navy" | "teal" | "red";

export type StaticImageCard = {
  kind: StaticImageCardKind;
  eyebrow?: string;
  headline: string;
  subline?: string;
  attribution?: string;
  accent?: StaticImageAccent;
};

export type StaticImageOutput = {
  filename: string;
  format: "png" | "jpeg";
};

export type AuthentilensStaticImageV1Props = {
  template: "authentilens_static_image_v1";
  version: string;
  recordId: string;
  width: number;
  height: number;
  fps: number;
  brand: BrandTokens;
  card: StaticImageCard;
  complianceFooter?: string;
  output: StaticImageOutput;
};
export type BrandTokens = {
  colors: { navy: string; teal: string; bg: string; red: string };
  fonts: { display: string; body: string };
  logo: string;
  musicBed: string;
};

export type HookBlock = {
  text: string;
  durationFrames: number;
  style: "kinetic_caption" | "static";
};

export type BodyBeat = { text: string; frames: number };

export type VerdictOverlay = {
  label: string;
  score: string;
  color: string;
  appearAtFrame: number;
};

export type CtaBlock = {
  text: string;
  frames: number;
  style: "endcard" | "lower_third";
};

export type Voiceover = {
  required: boolean;
  engine: "elevenlabs" | "human" | "none";
  voiceId?: string;
  script: string;
  src?: string;
};

export type BackgroundClip = {
  src: string;
  treatment: "blurred_loop_with_overlay" | "fullscreen" | "none";
  note?: string;
};

export type RenderOutput = {
  filename: string;
  codec: "h264" | "h265";
  crf: number;
};

export type AuthentilensTopicalV1Props = {
  template: "authentilens_topical_v1";
  version: string;
  recordId: string;
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
  brand: BrandTokens;
  hook: HookBlock;
  body: BodyBeat[];
  verdictOverlay: VerdictOverlay;
  cta: CtaBlock;
  voiceover: Voiceover;
  backgroundClip: BackgroundClip;
  complianceFooter: string;
  output: RenderOutput;
};
