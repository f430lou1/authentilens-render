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
import { AuthentilensTopicalV1ColdOpenPreview } from "./compositions/AuthentilensTopicalV1ColdOpenPreview";
import { AuthentilensTopicalV1ColdOpenPlusBeat1Preview } from "./compositions/AuthentilensTopicalV1ColdOpenPlusBeat1Preview";
import { AuthentilensTopicalV1ColdOpenPlusBeat2Preview } from "./compositions/AuthentilensTopicalV1ColdOpenPlusBeat2Preview";
import dmscanFixture from "./data/test-fixture-dmscan-video.json";

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

      {/* Lane 1b: Scene 1 Cold Open preview (2s visual-spine proof) */}
      <Composition
        id="AuthentilensTopicalV1ColdOpenPreview"
        component={AuthentilensTopicalV1ColdOpenPreview}
        durationInFrames={60}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={dmscanFixture as never}
      />

      {/* Lane 1c: cold open + Beat 1 evidence annotation preview (5s) */}
      <Composition
        id="AuthentilensTopicalV1ColdOpenPlusBeat1Preview"
        component={AuthentilensTopicalV1ColdOpenPlusBeat1Preview}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={dmscanFixture as never}
      />

      {/* Lane 1d: cold open + Beat 1 + Beat 2 evidence annotation preview (8s). */}
      <Composition
        id="AuthentilensTopicalV1ColdOpenPlusBeat2Preview"
        component={AuthentilensTopicalV1ColdOpenPlusBeat2Preview}
        durationInFrames={240}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={dmscanFixture as never}
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
