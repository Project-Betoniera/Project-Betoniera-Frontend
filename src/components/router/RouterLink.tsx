import { Link as FluentLink, LinkProps } from "@fluentui/react-components";
import { ComponentPropsWithRef, forwardRef, MouseEvent } from "react";
import { useNavigate } from "react-router";

type RouterLinkProps = Omit<LinkProps, "as" | "href"> &
  ComponentPropsWithRef<"a"> & {
    href?: string;
  };

export const RouterLink = forwardRef<HTMLAnchorElement, RouterLinkProps>((props, ref) => {
  const navigate = useNavigate();

  return (
    <FluentLink
      {...props}
      as="a"
      ref={ref}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        if (props.target) return;

        const url = new URL(props.href || "", window.location.href);
        if (url.origin === window.location.origin) {
          e.preventDefault();
          navigate(url.href.substring(url.origin.length));
        }
      }}
    />
  );
});
