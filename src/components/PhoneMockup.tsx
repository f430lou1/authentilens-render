import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";

/**
 * PhoneMockup — the visual spine of authentilens_topical_v1.
 *
 * Artifact-first: this component renders a believable mobile DM thread on a
 * dark-mode phone shell. It is presentational only — no scene logic, no
 * audio, no business state. Pass a `data` blob + optional layout overrides.
 *
 * Stays scene-agnostic so it can be reused as the spine across:
 *   - Scene 1 Cold Open (push-in on the suspicious DM)
 *   - Scene 2 Hook stamp (overlay sits ON the mockup)
 *   - Scene 3+ Evidence reveals (the same mockup, with annotations layered on)
 */

export type DMMessage = {
  from: "them" | "you";
  text: string;
  /** Display-only timestamp, e.g. "3:11 AM" */
  timestamp?: string;
  /** When true, draws a red flagged border + glow around the bubble. */
  flagged?: boolean;
};

export type PhoneMockupAppBadge =
  | "instagram"
  | "messenger"
  | "imessage"
  | "x"
  | "whatsapp";

export type PhoneMockupProps = {
  handle: string;
  displayName: string;
  /** Optional avatar asset path resolvable by Remotion staticFile(). */
  avatarUrl?: string;
  /** Renders a fake "verified" tick — used to expose social-engineering. */
  verifiedClaim?: boolean;
  appBadge?: PhoneMockupAppBadge;
  messages: DMMessage[];
  /** Status-bar clock value (kept short, e.g. "3:11"). */
  pinnedTimestamp?: string;
};

const COLORS = {
  shell: "#1c1c1e",
  screen: "#000000",
  bubbleThem: "#2c2c2e",
  bubbleYou: "#3478f6",
  text: "#ffffff",
  subtext: "#8e8e93",
  flagBorder: "#ef4444",
  verifiedBlue: "#1d9bf0",
};

function safeAsset(path?: string): string | null {
  if (!path) return null;
  try {
    return staticFile(path);
  } catch {
    return null;
  }
}

export const PhoneMockup: React.FC<{
  data: PhoneMockupProps;
  /** Default 760x1500 fits comfortably inside a 1080x1920 frame with margins. */
  width?: number;
  height?: number;
  /**
   * Optional Ken-Burns push-in. Interpolates `transform: scale(...)` from
   * `from` to `to` over `durationFrames` starting at frame 0.
   */
  pushIn?: { from: number; to: number; durationFrames: number };
}> = ({ data, width = 760, height = 1500, pushIn }) => {
  const frame = useCurrentFrame();
  const scale = pushIn
    ? interpolate(
        frame,
        [0, Math.max(1, pushIn.durationFrames)],
        [pushIn.from, pushIn.to],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 1;

  const avatar = safeAsset(data.avatarUrl);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          width,
          height,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          borderRadius: 64,
          background: COLORS.shell,
          padding: 14,
          boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
        }}
      >
        {/* Inner screen */}
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 52,
            background: COLORS.screen,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {/* Notch */}
          <div
            style={{
              position: "absolute",
              top: 18,
              left: "50%",
              transform: "translateX(-50%)",
              width: 220,
              height: 36,
              background: "#000",
              borderRadius: 24,
              zIndex: 5,
            }}
          />

          {/* Status bar */}
          <div
            style={{
              height: 70,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 36px",
              color: COLORS.text,
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            <span>{data.pinnedTimestamp ?? "3:11"}</span>
            <span style={{ opacity: 0.85, letterSpacing: 4 }}>•••• 5G</span>
          </div>

          {/* Conversation header */}
          <div
            style={{
              height: 130,
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "0 28px",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "#3a3a3c",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              {avatar ? (
                <Img
                  src={avatar}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient(135deg,#5a5a5e 0%,#2c2c2e 100%)",
                  }}
                />
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: COLORS.text,
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: 28,
                  fontWeight: 700,
                }}
              >
                <span>{data.displayName}</span>
                {data.verifiedClaim ? (
                  <span
                    style={{
                      display: "inline-flex",
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: COLORS.verifiedBlue,
                      color: "#fff",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 18,
                      fontWeight: 900,
                    }}
                  >
                    ✓
                  </span>
                ) : null}
              </div>
              <div
                style={{
                  color: COLORS.subtext,
                  fontSize: 22,
                  marginTop: 2,
                  fontFamily: "Inter, system-ui, sans-serif",
                }}
              >
                {data.handle}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "28px 24px 32px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              overflow: "hidden",
            }}
          >
            {data.messages.map((m, i) => {
              const them = m.from === "them";
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: them ? "flex-start" : "flex-end",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "78%",
                      background: them ? COLORS.bubbleThem : COLORS.bubbleYou,
                      color: COLORS.text,
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontSize: 28,
                      lineHeight: 1.32,
                      padding: "14px 20px",
                      borderRadius: 26,
                      borderTopLeftRadius: them ? 8 : 26,
                      borderTopRightRadius: them ? 26 : 8,
                      border: m.flagged
                        ? `2px solid ${COLORS.flagBorder}`
                        : "2px solid transparent",
                      boxShadow: m.flagged
                        ? "0 0 0 6px rgba(239,68,68,0.18)"
                        : "none",
                      wordBreak: "break-word",
                    }}
                  >
                    <div>{m.text}</div>
                    {m.timestamp ? (
                      <div
                        style={{
                          marginTop: 6,
                          fontSize: 18,
                          color: them
                            ? COLORS.subtext
                            : "rgba(255,255,255,0.78)",
                          textAlign: them ? "left" : "right",
                        }}
                      >
                        {m.timestamp}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Composer (visual only) */}
          <div
            style={{
              height: 92,
              borderTop: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              padding: "0 22px",
              gap: 14,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 52,
                borderRadius: 28,
                background: "rgba(255,255,255,0.08)",
              }}
            />
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: COLORS.bubbleYou,
              }}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default PhoneMockup;
