import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { PhoneMockup } from "../components/PhoneMockup";
import type {
  AuthentilensTopicalV1Props,
  EvidenceItem,
} from "./AuthentilensTopicalV1";

/**
 * AuthentilensTopicalV1ColdOpenPlusBeat2Preview — Scene 1 + Beat 1 + Beat 2.
 *
 * 240 frames @ 30fps = 8.0s total.
 *   - Frames   0..59   (2.0s): Scene 1 Cold Open (push-in 1.00 → 1.04).
 *   - Frames  60..149  (3.0s): Scene 2 / Beat 1. Avatar spotlight +
 *     Tier-2 evidence callout (evidence[0], profile-photo reverse-image).
 *   - Frames 150..239  (3.0s): Scene 3 / Beat 2. Dual-target spotlight on
 *     BOTH the status-bar clock and the first message timestamp (the
 *     timestamp-mismatch visual treatment). A connector bracket links the
 *     two highlights so viewers read them as a pair. Tier-2 evidence
 *     callout (evidence[1], metadata / timestamp mismatch).
 *
 * Scope: Scene 1 + Beat 1 + Beat 2 only. Scenes 4–6 intentionally NOT
 * implemented here. Additive — does not modify `AuthentilensTopicalV1`,
 * `AuthentilensTopicalV1ColdOpenPreview`, or
 * `AuthentilensTopicalV1ColdOpenPlusBeat1Preview`, nor any shared types.
 */

const PHONE_WIDTH = 760;
const PHONE_HEIGHT = 1500;
const FRAME_WIDTH = 1080;
const FRAME_HEIGHT = 1920;

// Shared layout anchors (derived from PhoneMockup.tsx measurements).
const PHONE_LEFT = (FRAME_WIDTH - PHONE_WIDTH) / 2; // 160
const PHONE_TOP = (FRAME_HEIGHT - PHONE_HEIGHT) / 2; // 210
const INNER_LEFT = PHONE_LEFT + 14; // 174 — after shell padding
const INNER_TOP = PHONE_TOP + 14; // 224 — after shell padding
const STATUS_BAR_HEIGHT = 70;
const HEADER_HEIGHT = 130;

const Scene1ColdOpen: React.FC<{
  phone: NonNullable<AuthentilensTopicalV1Props["phoneMockup"]>;
}> = ({ phone }) => (
  <PhoneMockup
    data={phone}
    width={PHONE_WIDTH}
    height={PHONE_HEIGHT}
    pushIn={{ from: 1.0, to: 1.04, durationFrames: 60 }}
  />
);

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
    <rect
      width="100%"
      height="100%"
      fill="rgba(0,0,0,0.58)"
      mask="url(#spotlight-mask)"
    />
    <ellipse
      cx={cx}
      cy={cy}
      rx={rx + 6}
      ry={ry + 6}
      fill="none"
      stroke={teal}
      strokeWidth={4}
      strokeDasharray="6 8"
    />
  </svg>
);

type SpotRect = { cx: number; cy: number; rx: number; ry: number };

const DualSpotlight: React.FC<{
  a: SpotRect;
  b: SpotRect;
  teal: string;
}> = ({ a, b, teal }) => (
  <svg
    width={FRAME_WIDTH}
    height={FRAME_HEIGHT}
    viewBox={`0 0 ${FRAME_WIDTH} ${FRAME_HEIGHT}`}
    style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
  >
    <defs>
      <mask id="dual-spotlight-mask">
        <rect width="100%" height="100%" fill="white" />
        <ellipse cx={a.cx} cy={a.cy} rx={a.rx} ry={a.ry} fill="black" />
        <ellipse cx={b.cx} cy={b.cy} rx={b.rx} ry={b.ry} fill="black" />
      </mask>
    </defs>
    <rect
      width="100%"
      height="100%"
      fill="rgba(0,0,0,0.62)"
      mask="url(#dual-spotlight-mask)"
    />
    <ellipse
      cx={a.cx}
      cy={a.cy}
      rx={a.rx + 6}
      ry={a.ry + 6}
      fill="none"
      stroke={teal}
      strokeWidth={4}
      strokeDasharray="6 8"
    />
    <ellipse
      cx={b.cx}
      cy={b.cy}
      rx={b.rx + 6}
      ry={b.ry + 6}
      fill="none"
      stroke={teal}
      strokeWidth={4}
      strokeDasharray="6 8"
    />
    {/* Connector bracket: links the two highlighted regions so the eye
         reads them as one mismatched pair (status-bar clock ↔ message ts). */}
    <path
      d={`M ${a.cx + a.rx + 6} ${a.cy}
          C ${a.cx + a.rx + 80} ${a.cy},
            ${b.cx + b.rx + 80} ${b.cy},
            ${b.cx + b.rx + 6} ${b.cy}`}
      fill="none"
      stroke={teal}
      strokeWidth={3}
      strokeDasharray="4 6"
      opacity={0.85}
    />
  </svg>
);

const EvidenceCallout: React.FC<{
  item: EvidenceItem;
  brand: AuthentilensTopicalV1Props["brand"];
  anchor: { x: number; y: number };
  box: { x: number; y: number; width: number };
  opacity: number;
  indexLabel: string;
}> = ({ item, brand, anchor, box, opacity, indexLabel }) => {
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
        <circle
          cx={anchor.x}
          cy={anchor.y}
          r={8}
          fill={brand.colors.teal}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: box.x,
          top: box.y,
          width: box.width,
          padding: "20px 26px",
          background: brand.colors.navy,
          color: brand.colors.bg,
          borderRadius: 22,
          border: `2px solid ${brand.colors.teal}`,
          boxShadow: "0 18px 44px rgba(0,0,0,0.4)",
          fontFamily: brand.fonts.body,
          opacity,
        }}
      >
        <div
          style={{
            color: brand.colors.teal,
            fontFamily: brand.fonts.display,
            fontWeight: 800,
            fontSize: 20,
            letterSpacing: 2,
            marginBottom: 6,
            textTransform: "uppercase",
          }}
        >
          {indexLabel}
        </div>
        <div style={{ fontWeight: 700, fontSize: 30, lineHeight: 1.15 }}>
          {item.label}
        </div>
        {item.detail ? (
          <div style={{ marginTop: 8, fontSize: 22, opacity: 0.85 }}>
            {item.detail}
          </div>
        ) : null}
      </div>
    </>
  );
};

const Scene2Beat1: React.FC<{
  phone: NonNullable<AuthentilensTopicalV1Props["phoneMockup"]>;
  evidence: EvidenceItem;
  brand: AuthentilensTopicalV1Props["brand"];
}> = ({ phone, evidence, brand }) => {
  const frame = useCurrentFrame();
  const scrimOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });
  const calloutOpacity = interpolate(frame, [10, 24], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Profile avatar in conversation header (Beat 1, unchanged from prior preview).
  const avatarCx = INNER_LEFT + 28 + 36; // 238
  const avatarCy = INNER_TOP + STATUS_BAR_HEIGHT + 65; // 359
  const rx = 82;
  const ry = 82;

  const box = {
    x: PHONE_LEFT + PHONE_WIDTH - 60,
    y: avatarCy - 70,
    width: 440,
  };
  const anchor = { x: avatarCx + rx + 6, y: avatarCy };

  return (
    <AbsoluteFill>
      <PhoneMockup data={phone} width={PHONE_WIDTH} height={PHONE_HEIGHT} />
      <AbsoluteFill style={{ opacity: scrimOpacity }}>
        <Spotlight
          cx={avatarCx}
          cy={avatarCy}
          rx={rx}
          ry={ry}
          teal={brand.colors.teal}
        />
      </AbsoluteFill>
      <EvidenceCallout
        item={evidence}
        brand={brand}
        anchor={anchor}
        box={box}
        opacity={calloutOpacity}
        indexLabel="Evidence 1 / 4"
      />
    </AbsoluteFill>
  );
};

const Scene3Beat2: React.FC<{
  phone: NonNullable<AuthentilensTopicalV1Props["phoneMockup"]>;
  evidence: EvidenceItem;
  brand: AuthentilensTopicalV1Props["brand"];
}> = ({ phone, evidence, brand }) => {
  const frame = useCurrentFrame();
  const scrimOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });
  const calloutOpacity = interpolate(frame, [10, 24], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Spot A: status-bar clock ("3:11" on the left of the 70px status bar,
  // fontSize 22, padding-left 36 on the inner screen).
  const clockSpot: SpotRect = {
    cx: INNER_LEFT + 36 + 28,
    cy: INNER_TOP + STATUS_BAR_HEIGHT / 2,
    rx: 80,
    ry: 30,
  };

  // Spot B: first (them) message timestamp ("3:11 AM"). Messages area
  // starts at INNER_TOP + status-bar(70) + header(130) and has padding
  // "28px 24px 32px 24px". The first bubble sits at the top, with inner
  // padding 14 + a single ~37px line of body text + marginTop 6 before
  // the timestamp row (fontSize 18).
  const messagesTop = INNER_TOP + STATUS_BAR_HEIGHT + HEADER_HEIGHT; // 424
  const bubbleTop = messagesTop + 28; // 452
  const timestampCy = bubbleTop + 14 + 37 + 6 + 14; // ≈ 523
  const timestampSpot: SpotRect = {
    cx: INNER_LEFT + 24 + 20 + 42,
    cy: timestampCy,
    rx: 96,
    ry: 26,
  };

  // Callout placement: nestled between the two highlighted regions on
  // the right so the connector bracket reads cleanly.
  const midCy = (clockSpot.cy + timestampSpot.cy) / 2;
  const box = {
    x: PHONE_LEFT + PHONE_WIDTH - 40,
    y: midCy - 80,
    width: 440,
  };
  const anchor = {
    x: timestampSpot.cx + timestampSpot.rx + 6,
    y: timestampSpot.cy,
  };

  return (
    <AbsoluteFill>
      <PhoneMockup data={phone} width={PHONE_WIDTH} height={PHONE_HEIGHT} />
      <AbsoluteFill style={{ opacity: scrimOpacity }}>
        <DualSpotlight
          a={clockSpot}
          b={timestampSpot}
          teal={brand.colors.teal}
        />
      </AbsoluteFill>
      <EvidenceCallout
        item={evidence}
        brand={brand}
        anchor={anchor}
        box={box}
        opacity={calloutOpacity}
        indexLabel="Evidence 2 / 4"
      />
    </AbsoluteFill>
  );
};

export const AuthentilensTopicalV1ColdOpenPlusBeat2Preview: React.FC<
  AuthentilensTopicalV1Props
> = (props) => {
  const phone = props.phoneMockup;
  const evidence1 = props.evidence?.[0];
  const evidence2 = props.evidence?.[1];
  const navy = props.brand?.colors?.navy ?? "#0B1F3A";

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 38%, #16223a 0%, ${navy} 72%)`,
      }}
    >
      <Sequence from={0} durationInFrames={60}>
        {phone ? (
          <Scene1ColdOpen phone={phone} />
        ) : (
          <AbsoluteFill
            style={{
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 36,
            }}
          >
            phoneMockup missing — add `phoneMockup` to the fixture.
          </AbsoluteFill>
        )}
      </Sequence>
      <Sequence from={60} durationInFrames={90}>
        {phone && evidence1 ? (
          <Scene2Beat1
            phone={phone}
            evidence={evidence1}
            brand={props.brand}
          />
        ) : (
          <AbsoluteFill
            style={{
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 36,
            }}
          >
            phoneMockup or evidence[0] missing — Beat 1 needs both.
          </AbsoluteFill>
        )}
      </Sequence>
      <Sequence from={150} durationInFrames={90}>
        {phone && evidence2 ? (
          <Scene3Beat2
            phone={phone}
            evidence={evidence2}
            brand={props.brand}
          />
        ) : (
          <AbsoluteFill
            style={{
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 36,
            }}
          >
            phoneMockup or evidence[1] missing — Beat 2 needs both.
          </AbsoluteFill>
        )}
      </Sequence>
    </AbsoluteFill>
  );
};

export default AuthentilensTopicalV1ColdOpenPlusBeat2Preview;
