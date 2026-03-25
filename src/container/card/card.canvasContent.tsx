import React, { memo } from "react";
import FullCanvas from "../canvas/canvas";
import { CardCanvasContentProps } from "./card.type";

export const CardCanvasContent = memo((props: CardCanvasContentProps) => {
  return (
    <FullCanvas
      perfMonitor={props.perfMonitor}
      showImage={props.showImage}
      showShaderBack={props.showShaderBack}
      showHologram={props.showHologram}
      showGloss={props.showGloss}
      showBackground={props.showBackground}
      showOutline={props.showOutline}
      showOutlineMask={props.showOutlineMask}
      showOutlineHolo={props.showOutlineHolo}
      showRGBSplit={props.showRGBSplit}
      showHoloMask={props.showHoloMask}
      showHoloBackground={props.showHoloBackground}
      width={props.width}
      height={props.height}
      maxAngle={props.maxAngle}
      motion={props.motion}
      hologramMaskSource={props.hologramMaskSource}
      shader={props.shader}
      holoColors={props.holoColors}
      source={props.source}
      background={props.background}
      image={props.image}
      holoCover={props.holoCover}
      hologramMask={props.hologramMask}
      shaderEffectRef={props.shaderEffectRef}
    />
  );
});
