import React, { Fragment } from "react";
import { Group, PanelHeaderBack, PanelHeader } from "@vkontakte/vkui";

export default function FAQ(props) {
  return (
    <Fragment>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => props.goBack("profile")} />}
        separator={props.isDesktop ? true : false}
      >
        {props.isDesktop ? "Часто задаваемые вопросы" : "FAQ"}
      </PanelHeader>
      <Group>123</Group>
    </Fragment>
  );
}
