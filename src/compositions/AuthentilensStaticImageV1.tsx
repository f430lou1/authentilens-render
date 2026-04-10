import React from "react";
import { AbsoluteFill } from "remotion";
import { AuthentilensStaticImageV1Props } from "../types/remotion";

/**
 * authentilens_static_image_v1
 * 1080x1080 single-frame text-led card lane.
 * Suitable for quote / stat / verdict / text posts.
 * Rendered via `npx remotion still` → PNG.
 */
export const AuthentilensStaticImageV1: React.FC<AuthentilensStaticImageV1Props> = (props) => {
  const { brand, card, complianceFooter } = props;
  const colors = brand.colors;

  const accentKey = card.accent ?? "teal";
  const accentColor =
    accentKey === "navy" ? colors.navy : accentKey === "red" ? colors.red : colors.teal;

  const headlineFont = brand.fonts.display || "Inter";
  const bodyFont = brand.fonts.body || "Inter";

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.bg,
        fontFamily: bodyFont,
        padding: 88,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}
      >
        <div
          style={{
            width: 64,
            height: 10,
            backgroundColor: accentColor,
            borderRadius: 6,
          }}
        />
        {card.eyebrow ? (
          <div
            style={{
              fontFamily: bodyFont,
              fontSize: 28,
              fontWeight: 700,
              color: accentColor,
              textTransform: "uppercase",
              letterSpacing: 3,
            }}
          >
            {card.eyebrow}
          </div>
        ) : null}
      </div>

      {/* Body */}
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        <div
          style={{
            fontFamily: headlineFont,
            fontSize: card.headline.length > 80 ? 76 : 96,
            lineHeight: 1.08,
            fontWeight: 800,
            color: colors.navy,
            letterSpacing: -1,
          }}
        >
          {card.headline}
        </div>
        {card.subline ? (
          <div
            style={{
              fontFamily: bodyFont,
              fontSize: 40,
              lineHeight: 1.3,
              color: colors.navy,
              opacity: 0.82,
            }}
          >
            {card.subline}
          </div>
        ) : null}
        {card.attribution ? (
          <div
            style={{
              fontFamily: bodyFont,
              fontSize: 30,
              color: colors.navy,
              opacity: 0.6,
            }}
          >
            — {card.attribution}
          </div>
        ) : null}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 24,
          color: colors.navy,
          opacity: 0.7,
        }}
      >
        <div style={{ fontWeight: 700 }}>AuthentiLens</div>
        {complianceFooter ? <div>{complianceFooter}</div> : null}
      </div>
    </AbsoluteFill>
  );
};
