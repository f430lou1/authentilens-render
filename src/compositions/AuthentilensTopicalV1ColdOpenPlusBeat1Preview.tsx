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
 * AuthentilensTopicalV1ColdOpenPlusBeat1Preview — Scene 1 + Scene 2/Beat 1.
 *
 * 150 frames @ 30fps = 5.0s total.
 *   - Frames   0..59  (2.0s): Scene 1 Cold Open. Same visual spine as
 *     AuthentilensTopicalV1ColdOpenPreview, unchanged (PhoneMockup with a
 *     1.00 → 1.04 push-in, no hook, no audio).
 *   - Frames  60..149 (3.0s): Scene 2 / Beat 1. The phone mockup stays
 *     anchored at rest scale; a vignette scrim dims everything outside
 *     the evidence target; a dashed teal spotlight ring draws around the
 *     target; a Tier-2 evidence label pill is rendered next to it with a
 *     thin connector line. Beat 1 targets evidence[0] (profile photo
 *     reverse-image hit → avatar region in the conversation header).
 *
 * Scope: Scene 1 + Beat 1 only. Scenes 3–6 are intentionally NOT
 * implemented here. This composition is additive. It does not modify
 * `AuthentilensTopicalV1` or `AuthentilensTopicalV1ColdOpenPreview`,
 * nor any of their shared types.
 */

const PHONE_WIDTH = 760;
const PHONE_HEIGHT = 1500;
const FRAME_WIDTH = 1080;
const FRAME_HEIGHT = 1920;

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

const EvidenceCallout: React.FC<{
  item: EvidenceItem;
  brand: AuthentilensTopicalV1Props["brand"];
  anchor: { x: number; y: number };
  box: { x: number; y: number; width: number };
  opacity: number;
}> = ({ item, brand, anchor, box, opacity }) => {
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
          Evidence 1 / 4
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

  // Spotlight target: the profile avatar in the PhoneMockup conversation
  // header. PhoneMockup is centered; inside it: 14px shell padding, then
  // 70px status bar, then the header row begins. Avatar is 72px wide,
  // offset 28px from the left of the header.
  const phoneLeft = (FRAME_WIDTH - PHONE_WIDTH) / 2; // 160
  const phoneTop = (FRAME_HEIGHT - PHONE_HEIGHT) / 2; // 210
  const avatarCx = phoneLeft + 14 + 28 + 36;
  const avatarCy = phoneTop + 14 + 70 + 65;
  const rx = 82;
  const ry = 82;

  const box = {
    x: phoneLeft + PHONE_WIDTH - 60,
    y: avatarCy - 70,
    width: 440,
  };
  const anchor = { x: avatarCx + rx + 6, y: avatarCy };

  return (
    <AbsoluteFill>
      <PhoneMockup
        data={phone}
        width={PHONE_WIDTH}
        height={PHONE_HEIGHT}
      />
      <AbsoluteFill style={{ opacity: scrimOpacity }}>
        <Spotlight cx={avatarCx} cy={avatarCy} rx={rx} ry={ry} teal={brand.colors.teal} />
      </AbsoluteFill>
      <EvidenceCallout
        item={evidence}
        brand={brand}
        anchor={anchor}
        box={box}
        opacity={calloutOpacity}
      />
    </AbsoluteFill>
  );
};

export const AuthentilensTopicalV1ColdOpenPlusBeat1Preview: React.FC<
  AuthentilensTopicalV1Props
> = (props) => {
  const phone = props.phoneMockup;
  const evidence = props.evidence?.[0];
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
        {phone && evidence ? (
          <Scene2Beat1 phone={phone} evidence={evidence} brand={props.brand} />
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
    </AbsoluteFill>
  );
};

export default AuthentilensTopicalV1ColdOpenPlusBeat1Preview;
