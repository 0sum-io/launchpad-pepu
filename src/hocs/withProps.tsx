import React, { ComponentType } from "react";

export function withProps<P, D extends Partial<P>>(
  Component: ComponentType<P>,
  baseProps: Partial<P>
) {
  // eslint-disable-next-line react/display-name
  return React.forwardRef((props: Omit<P, keyof D> & Partial<P>, ref) => (
    <Component {...baseProps} {...(props as any)} ref={ref} />
  ));
}
