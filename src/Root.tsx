import React from "react";
import { Composition } from "remotion";
import { AuthentilensTopicalV1 } from "./compositions/AuthentilensTopicalV1";
import { AuthentilensTopicalV1Props } from "./types/remotion";
import fixture from "./data/test-fixture-tomhanks.json";

const tomHanksProps = fixture as unknown as AuthentilensTopicalV1Props;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AuthentilensTopicalV1"
        component={AuthentilensTopicalV1}
        durationInFrames={tomHanksProps.durationInFrames}
        fps={tomHanksProps.fps}
        width={tomHanksProps.width}
        height={tomHanksProps.height}
        defaultProps={tomHanksProps}
      />
    </>
  );
};
