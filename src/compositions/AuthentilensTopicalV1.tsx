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
import { AuthentilensTopicalV1Props } from "../types/remotion";
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
        {overlay.label} · {overlay.score}
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
  if (!clip) return null;
  const src = safeStaticFile(clip.src);
  if (!src || clip.treatment === "none") return null;
  return (
    <AbsoluteFill style={{ filter: "blur(32px) brightness(0.4)" }}>
      <Video src={src} muted loop />
    </AbsoluteFill>
  );
};

export const AuthentilensTopicalV1: React.FC<AuthentilensTopicalV1Props> = (props) => {
  const { hook, body, verdictOverlay, cta, brand, voiceover, backgroundClip, complianceFooter } =
    props;

  const hookFrames = hook.durationFrames;
  const bodySegments = buildBodySegments(hookFrames, body);
  const lastBeatEnd =
    bodySegments.length > 0
      ? bodySegments[bodySegments.length - 1].from + bodySegments[bodySegments.length - 1].durationInFrames
      : hookFrames;
  const ctaStart = lastBeatEnd;

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
          <BodyBeatCard text={body[i].text} brand={brand} index={i} />
        </Sequence>
      ))}

      <Sequence from={verdictOverlay.appearAtFrame} durationInFrames={Math.max(1, ctaStart + cta.frames - verdictOverlay.appearAtFrame)}>
        <VerdictOverlay overlay={verdictOverlay} brand={brand} />
      </Sequence>

      <Sequence from={ctaStart} durationInFrames={cta.frames}>
        <CtaEndcard cta={cta} brand={brand} complianceFooter={complianceFooter} />
      </Sequence>

      {voSrc && voiceover.required ? <Audio src={voSrc} /> : null}
      {musicSrc ? <Audio src={musicSrc} volume={0.15} /> : null}
    </AbsoluteFill>
  );
};
