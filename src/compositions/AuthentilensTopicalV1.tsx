import React from "react";
import {
  AbsoluteFill,
  Sequence,
  Audio,
  Video,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { AuthentilensTopicalV1Props as _TV1BaseProps } from "../types/remotion";
import { PhoneMockup } from "../components/PhoneMockup";
import type { PhoneMockupProps } from "../components/PhoneMockup";

// Scene-spine types (additive). Optional on Props so legacy fixtures keep working.
export type EvidenceKind = "message" | "metadata" | "link" | "image_match";

export type EvidenceItem = {
  id: string;
  kind: EvidenceKind;
  label: string;
  detail?: string;
  flagged?: boolean;
};

export type AuthentilensTopicalV1Props = _TV1BaseProps & {
  phoneMockup?: PhoneMockupProps;
  evidence?: EvidenceItem[];
};

import { buildBodySegments } from "../utils/timing";

const safeStaticFile = (p?: string) => {
  if (!p) return undefined;
  try {
    return staticFile(p);
  } catch {
    return undefined;
  }
};

const Hook: React.FC<{ text: string; brand: AuthentilensTopicalV1Props["brand"] }> = ({
  text,
  brand,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 12 } });
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: brand.colors.navy,
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <div
        style={{
          color: brand.colors.bg,
          fontFamily: brand.fonts.display,
          fontSize: 96,
          fontWeight: 800,
          lineHeight: 1.1,
          textAlign: "center",
          transform: `scale(${scale})`,
          opacity,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

/* -- Beat phone + spotlight + callout spine -- */
const PHONE_WIDTH = 760;
const PHONE_HEIGHT = 1500;
const FRAME_WIDTH = 1080;
const FRAME_HEIGHT = 1920;

const Spotlight: React.FC<{
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  teal: string;
}> = ({ cx, cy, rx, ry, teal }) => (
  <svg
    width={FRAME_WIDTH}
    height={FRAME_HEIGHT}
    viewBox={`0 0 ${FRAME_WIDTH} ${FRAME_HEIGHT}`}
    style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
  >
    <defs>
      <mask id="spotlight-mask">
        <rect width="100%" height="100%" fill="white" />
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="black" />
      </mask>
    </defs>
    <rect width="100%" height="100%" fill="rgba(0,0,0,0.58)" mask="url(#spotlight-mask)" />
    <ellipse cx={cx} cy={cy} rx={rx + 6} ry={ry + 6} fill="none" stroke={teal} strokeWidth={4} strokeDasharray="6 8" />
  </svg>
);

const EvidenceCallout: React.FC<{
  item: EvidenceItem;
  brand: AuthentilensTopicalV1Props["brand"];
  anchor: { x: number; y: number };
  box: { x: number; y: number; width: number };
  opacity: number;
  index: number;
  total: number;
}> = ({ item, brand, anchor, box, opacity, index, total }) => {
  const pillCenterY = box.y + 62;
  return (
    <>
      <svg
        width={FRAME_WIDTH}
        height={FRAME_HEIGHT}
        viewBox={`0 0 ${FRAME_WIDTH} ${FRAME_HEIGHT}`}
        style={{ position: "absolute", inset: 0, opacity }}
      >
        <line
          x1={anchor.x}
          y1={anchor.y}
          x2={box.x + 10}
          y2={pillCenterY}
          stroke={brand.colors.teal}
          strokeWidth={3}
        />
        <circle cx={anchor.x} cy={anchor.y} r={8} fill={brand.colors.teal} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: box.x,
          top: box.y,
          width: box.width,
          padding: "18px 24px",
          background: brand.colors.navy,
          color: brand.colors.bg,
          borderRadius: 22,
          border: `2px solid ${brand.colors.teal}`,
          boxShadow: "0 18px 44px rgba(0,0,0,0.4)",
          fontFamily: brand.fonts.body,
          opacity,
        }}
      >
        <div style={{ color: brand.colors.teal, fontFamily: brand.fonts.display, fontWeight: 800, fontSize: 20, letterSpacing: 2, marginBottom: 6, textTransform: "uppercase" }}>
          Evidence {index} / {total}
        </div>
        <div style={{ fontWeight: 700, fontSize: 28, lineHeight: 1.15 }}>{item.label}</div>
        {item.detail ? <div style={{ marginTop: 6, fontSize: 20, opacity: 0.85, lineHeight: 1.3 }}>{item.detail}</div> : null}
      </div>
    </>
  );
};

type SpotAnchor = { cx: number; cy: number; rx: number; ry: number };
type CalloutBox = { x: number; y: number; width: number };

const PhoneEvidenceScene: React.FC<{
  phone: PhoneMockupProps;
  evidence: EvidenceItem;
  brand: AuthentilensTopicalV1Props["brand"];
  spot: SpotAnchor;
  box: CalloutBox;
  evidenceIndex: number;
  evidenceTotal: number;
}> = ({ phone, evidence, brand, spot, box, evidenceIndex, evidenceTotal }) => {
  const frame = useCurrentFrame();
  const scrimOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const calloutOpacity = interpolate(frame, [10, 24], [0, 1], { extrapolateRight: "clamp" });
  const anchorPt = { x: spot.cx + spot.rx + 6, y: spot.cy };
  return (
    <AbsoluteFill>
      <PhoneMockup data={phone} width={PHONE_WIDTH} height={PHONE_HEIGHT} />
      <AbsoluteFill style={{ opacity: scrimOpacity }}>
        <Spotlight cx={spot.cx} cy={spot.cy} rx={spot.rx} ry={spot.ry} teal={brand.colors.teal} />
      </AbsoluteFill>
      <EvidenceCallout
        item={evidence}
        brand={brand}
        anchor={anchorPt}
        box={box}
        opacity={calloutOpacity}
        index={evidenceIndex}
        total={evidenceTotal}
      />
    </AbsoluteFill>
  );
};

// Per-beat spotlight + callout layouts.
// All four production beats route through PhoneEvidenceScene with the shared
// below-phone callout band. The legacy hardcoded StolenPhotoEvidenceCard and
// DomainAgeEvidenceCard have been retired â their sample text drifted from
// the fixture (e.g., the WHOIS card's domain did not match the DM link).
// BodyBeatCard is now only a safety fallback when phoneMockup / evidence is
// absent, and intentionally renders plain text only.
const PHONE_LEFT = (FRAME_WIDTH - PHONE_WIDTH) / 2;
const PHONE_TOP = (FRAME_HEIGHT - PHONE_HEIGHT) / 2;
const BELOW_PHONE_BOX: CalloutBox = { x: 80, y: 1710, width: 920 };

const EVIDENCE_LAYOUTS: Record<number, { spot: SpotAnchor; box: CalloutBox }> = {
  // Beat 1 (index 0): spotlight on the avatar â stolen-photo proof.
  // Callout moved into the shared below-phone band so it no longer runs
  // off-frame on the right (prior box extended past 1080 by ~220px).
  0: {
    spot: { cx: PHONE_LEFT + 14 + 28 + 36, cy: PHONE_TOP + 14 + 70 + 65, rx: 82, ry: 82 },
    box:  BELOW_PHONE_BOX,
  },
  // Beat 2 (index 1): spotlight on the first "them" message timestamp (3:11 AM)
  // â timestamp-anomaly proof.
  1: {
    spot: { cx: 240, cy: 582, rx: 100, ry: 32 },
    box:  BELOW_PHONE_BOX,
  },
  // Beat 3 (index 2): spotlight on the "bit.ly/ez-wealth-now" link bubble
  // â domain-age proof. Replaces the retired hardcoded WHOIS card whose
  // sample domain did not match the fixture's actual DM link.
  2: {
    spot: { cx: 460, cy: 920, rx: 260, ry: 50 },
    box:  BELOW_PHONE_BOX,
  },
  // Beat 4 (index 3): spotlight on the long flagged "sign up through my link"
  // bubble â scam-script-match proof.
  3: {
    spot: { cx: 465, cy: 789, rx: 300, ry: 75 },
    box:  BELOW_PHONE_BOX,
  },
};

const BodyBeatCard: React.FC<{
  text: string;
  brand: AuthentilensTopicalV1Props["brand"];
  index: number;
}> = ({ text, brand, index }) => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [0, 12], [40, 0], { extrapolateRight: "clamp" });
  const opacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: brand.colors.bg,
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <div
        style={{
          color: brand.colors.teal,
          fontFamily: brand.fonts.display,
          fontSize: 48,
          fontWeight: 700,
          marginBottom: 24,
        }}
      >
        TELL #{index + 1}
      </div>
      <div
        style={{
          color: brand.colors.navy,
          fontFamily: brand.fonts.body,
          fontSize: 84,
          fontWeight: 700,
          lineHeight: 1.15,
          textAlign: "center",
          transform: `translateY(${y}px)`,
          opacity,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

const VerdictOverlay: React.FC<{
  overlay: AuthentilensTopicalV1Props["verdictOverlay"];
  brand: AuthentilensTopicalV1Props["brand"];
}> = ({ overlay, brand }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 240,
      }}
    >
      <div
        style={{
          backgroundColor: overlay.color,
          color: brand.colors.bg,
          padding: "32px 56px",
          borderRadius: 24,
          fontFamily: brand.fonts.display,
          fontWeight: 900,
          fontSize: 72,
          opacity,
          boxShadow: "0 12px 48px rgba(0,0,0,0.35)",
        }}
      >
        {overlay.label} Â· {overlay.score}
      </div>
    </AbsoluteFill>
  );
};

const CtaEndcard: React.FC<{
  cta: AuthentilensTopicalV1Props["cta"];
  brand: AuthentilensTopicalV1Props["brand"];
  complianceFooter: string;
}> = ({ cta, brand, complianceFooter }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const logo = safeStaticFile(brand.logo);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: brand.colors.navy,
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
        opacity,
      }}
    >
      {logo ? (
        <Img src={logo} style={{ width: 240, marginBottom: 48 }} />
      ) : (
        <div
          style={{
            color: brand.colors.teal,
            fontFamily: brand.fonts.display,
            fontSize: 64,
            fontWeight: 900,
            marginBottom: 48,
          }}
        >
          AUTHENTILENS
        </div>
      )}
      <div
        style={{
          color: brand.colors.bg,
          fontFamily: brand.fonts.display,
          fontSize: 84,
          fontWeight: 800,
          lineHeight: 1.15,
          textAlign: "center",
        }}
      >
        {cta.text}
      </div>
      <div
        style={{
          marginTop: 64,
          color: brand.colors.bg,
          opacity: 0.6,
          fontFamily: brand.fonts.body,
          fontSize: 28,
          textAlign: "center",
        }}
      >
        {complianceFooter}
      </div>
    </AbsoluteFill>
  );
};

const Background: React.FC<{ clip: AuthentilensTopicalV1Props["backgroundClip"] }> = ({
  clip,
}) => {
  // Null-safe Background: backgroundClip may be null/undefined per fixture.
  if (!clip || clip.treatment === "none") return null;
  const src = safeStaticFile(clip.src);
  if (!src) return null;
  return (
    <AbsoluteFill style={{ filter: "blur(32px) brightness(0.4)" }}>
      <Video src={src} muted loop />
    </AbsoluteFill>
  );
};

export const AuthentilensTopicalV1: React.FC<AuthentilensTopicalV1Props> = (props) => {
  const { hook, body, verdictOverlay, cta, brand, voiceover, backgroundClip, complianceFooter, phoneMockup, evidence } =
    props;
  const { durationInFrames: totalFrames } = useVideoConfig();

  const hookFrames = hook.durationFrames;
  const bodySegments = buildBodySegments(hookFrames, body);
  const lastBeatEnd =
    bodySegments.length > 0
      ? bodySegments[bodySegments.length - 1].from + bodySegments[bodySegments.length - 1].durationInFrames
      : hookFrames;
  const ctaStart = lastBeatEnd;

  // Verdict must land BEFORE the CTA starts so the "LIKELY SCAM" pill does
  // not stack on the endcard. Respect the fixture's appearAtFrame, but clamp
  // it earlier if the fixture asks the verdict to appear at or after ctaStart,
  // so the viewer always sees at least VERDICT_MIN_FRAMES of clean verdict
  // pre-CTA.
  const VERDICT_MIN_FRAMES = 60;
  const verdictAppear = Math.min(
    verdictOverlay.appearAtFrame,
    Math.max(0, ctaStart - VERDICT_MIN_FRAMES)
  );
  const verdictDur = Math.max(VERDICT_MIN_FRAMES, ctaStart - verdictAppear);

  // CTA fills from ctaStart through the end of the composition so the viewer
  // does not see dead background color after the CTA's nominal cta.frames.
  const ctaDur = Math.max(cta.frames, totalFrames - ctaStart);

  const voSrc = safeStaticFile(voiceover.src);
  const musicSrc = safeStaticFile(brand.musicBed);

  return (
    <AbsoluteFill style={{ backgroundColor: brand.colors.bg }}>
      <Background clip={backgroundClip} />

      <Sequence from={0} durationInFrames={hookFrames}>
        <Hook text={hook.text} brand={brand} />
      </Sequence>

      {bodySegments.map((seg, i) => (
        <Sequence key={i} from={seg.from} durationInFrames={seg.durationInFrames}>
          {phoneMockup && evidence?.[i] && EVIDENCE_LAYOUTS[i] ? (
            <PhoneEvidenceScene
              phone={phoneMockup}
              evidence={evidence[i]}
              brand={brand}
              spot={EVIDENCE_LAYOUTS[i].spot}
              box={EVIDENCE_LAYOUTS[i].box}
              evidenceIndex={i + 1}
              evidenceTotal={evidence.length}
            />
          ) : (
            <BodyBeatCard text={body[i].text} brand={brand} index={i} />
          )}
        </Sequence>
      ))}

      <Sequence from={verdictAppear} durationInFrames={verdictDur}>
        <VerdictOverlay overlay={verdictOverlay} brand={brand} />
      </Sequence>

      <Sequence from={ctaStart} durationInFrames={ctaDur}>
        <CtaEndcard cta={cta} brand={brand} complianceFooter={complianceFooter} />
      </Sequence>

      {voSrc && voiceover.required ? <Audio src={voSrc} /> : null}
      {musicSrc ? <Audio src={musicSrc} volume={0.15} /> : null}
    </AbsoluteFill>
  );
};
