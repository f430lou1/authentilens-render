import React from "react";
import { Composition } from "remotion";
import { AuthentilensTopicalV1 } from "./compositions/AuthentilensTopicalV1";
import { AuthentilensStaticImageV1 } from "./compositions/AuthentilensStaticImageV1";
import {
  AuthentilensTopicalV1Props,
  AuthentilensStaticImageV1Props,
} from "./types/remotion";
import topicalFixture from "./data/test-fixture-tomhanks.json";
import staticFixture from "./data/test-fixture-static-verdict.json";

const topicalProps = topicalFixture as unknown as AuthentilensTopicalV1Props;
const staticProps = staticFixture as unknown as AuthentilensStaticImageV1Props;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Lane 1: topical explainer (9:16 video) */}
      <Composition
        id="AuthentilensTopicalV1"
        component={AuthentilensTopicalV1}
        durationInFrames={topicalProps.durationInFrames}
        fps={topicalProps.fps}
        width={topicalProps.width}
        height={topicalProps.height}
        defaultProps={topicalProps}
      />

      {/* Lane 2: static image card (1080x1080 single-frame) */}
      <Composition
        id="AuthentilensStaticImageV1"
        component={AuthentilensStaticImageV1}
        durationInFrames={1}
        fps={staticProps.fps}
        width={staticProps.width}
        height={staticProps.height}
        defaultProps={staticProps}
      />
    </>
  );
};
