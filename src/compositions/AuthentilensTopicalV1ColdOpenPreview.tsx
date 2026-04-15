import React from "react";
import { AbsoluteFill } from "remotion";
import { PhoneMockup } from "../components/PhoneMockup";
import type { AuthentilensTopicalV1Props } from "./AuthentilensTopicalV1";

/**
 * AuthentilensTopicalV1ColdOpenPreview — Scene 1 only.
 *
 * 60 frames @ 30fps = 2.0s. Renders the suspicious DM artifact full-bleed
 * from frame 1, with a subtle 1.00 → 1.04 push-in. No hook, no audio, no
 * scenes 2–6. This composition exists ONLY to prove the visual spine.
 *
 * Backward compatibility: this composition is additive. It does not modify
 * the existing `AuthentilensTopicalV1` composition. The v1 props type now
 * carries optional `phoneMockup` and `evidence` fields; existing fixtures
 * that omit them continue to render the original 22s template unchanged.
 */
export const AuthentilensTopicalV1ColdOpenPreview: React.FC<
  AuthentilensTopicalV1Props
> = (props) => {
  const phone = props.phoneMockup;
  const navy = props.brand?.colors?.navy ?? "#0B1F3A";

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 38%, #16223a 0%, ${navy} 72%)`,
      }}
    >
      {phone ? (
        <PhoneMockup
          data={phone}
          width={760}
          height={1500}
          pushIn={{ from: 1.0, to: 1.04, durationFrames: 60 }}
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
          phoneMockup missing — add `phoneMockup` to the fixture to preview
          Scene 1.
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default AuthentilensTopicalV1ColdOpenPreview;
