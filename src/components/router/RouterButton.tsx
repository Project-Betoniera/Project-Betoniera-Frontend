import { Button, ButtonProps } from "@fluentui/react-components";
import { FunctionComponent } from "react";
import { useNavigate } from "react-router";

export const RouterButton: FunctionComponent<ButtonProps & { as: "a" }> = (props) => {
  const navigate = useNavigate();

  return (
    <Button
      {...props}
      as="a"
      onClick={(event) => {
        if (props.onClick) props.onClick(event);
        if (props.target) return;

        const url = new URL(props.href || "", window.location.href);

        if (url.origin === window.location.origin) {
          event.preventDefault();
          navigate(url.href.substring(url.origin.length));
        }
      }}
    />
  );
};
