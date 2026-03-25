import React, { memo, PropsWithChildren } from "react";

type NoopWrapperProps = PropsWithChildren<{
  id?: string;
  monitor?: boolean;
}>;

export const NoopWrapper = memo((props: NoopWrapperProps) => {
  return <>{props.children}</>;
});

export const NoopOverlay = memo(() => {
  return null;
});
