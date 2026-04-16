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

const StolenPhotoEvidenceCard: React.FC<{
  brand: AuthentilensTopicalV1Props["brand"];
  y: number;
  opacity: number;
}> = ({ brand, y, opacity }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 40,
        transform: `translateY(${y}px)`,
        opacity,
      }}
    >
      <div
        style={{
          position: "relative",
          width: 280,
          height: 280,
          borderRadius: "50%",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${brand.colors.teal} 0%, ${brand.colors.navy} 100%)`,
          boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
          border: `6px solid ${brand.colors.navy}`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "22%",
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.92)",
            transform: "translateX(-50%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "62%",
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.92)",
            transform: "translateX(-50%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "50%",
            transform: "translateY(-50%) rotate(-12deg)",
            backgroundColor: brand.colors.red,
            color: "#fff",
            fontFamily: brand.fonts.display,
            fontWeight: 800,
            fontSize: 40,
            letterSpacing: 4,
            textAlign: "center",
            padding: "12px 0",
            boxShadow: "0 6px 18px rgba(239,68,68,0.45)",
          }}
        >
          STOCK MATCH
        </div>
      </div>
      <div
        style={{
          marginTop: 20,
          color: brand.colors.navy,
          fontFamily: brand.fonts.body,
          fontWeight: 600,
          fontSize: 32,
          textAlign: "center",
          opacity: 0.85,
        }}
      >
        Reverse-image match: stock photo site.
      </div>
    </div>
  );
};


const DomainAgeEvidenceCard: React.FC<{
  brand: AuthentilensTopicalV1Props["brand"];
  y: number;
  opacity: number;
}> = ({ brand, y, opacity }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 40,
        transform: `translateY(${y}px)`,
        opacity,
      }}
    >
      <div
        style={{
          position: "relative",
          width: 640,
          padding: "28px 36px",
          borderRadius: 24,
          background: `linear-gradient(135deg, ${brand.colors.navy} 0%, #162d50 100%)`,
          boxShadow: "0 12px 32px rgba(0,0,0,0.22)",
          border: `3px solid ${brand.colors.teal}`,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              backgroundColor: brand.colors.red,
              flexShrink: 0,
            }}
          />
          <div
            style={{
              fontFamily: brand.fonts.body,
              fontSize: 28,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: 1,
            }}
          >
            WHOIS LOOKUP
          </div>
        </div>
        <div
          style={{
            fontFamily: brand.fonts.body,
            fontSize: 32,
            color: "rgba(255,255,255,0.7)",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            paddingBottom: 12,
          }}
        >
          scam-link-example.xyz
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: brand.fonts.body,
              fontSize: 26,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Registered
          </div>
          <div
            style={{
              fontFamily: brand.fonts.display,
              fontSize: 44,
              fontWeight: 800,
              color: brand.colors.red,
              letterSpacing: 2,
            }}
          >
            11 DAYS AGO
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: 20,
          color: brand.colors.navy,
          fontFamily: brand.fonts.body,
          fontWeight: 600,
          fontSize: 32,
          textAlign: "center",
          opacity: 0.85,
        }}
      >
        Domain registered just 11 days ago.
      </div>
    </div>
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
      {index === 0 ? <StolenPhotoEvidenceCard brand={brand} y={y} opacity={opacity} /> : null}
      {index === 2 ? <DomainAgeEvidenceCard brand={brand} y={y} opacity={opacity} /> : null}
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
        {overlay.label} ÃÂ· {overlay.score}
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
  // Guard before any property access on clip (was bug: clip.src crashed when clip was null).
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
