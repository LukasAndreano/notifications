import React, { useState } from "react";
import bridge from "@vkontakte/vk-bridge";
import {
  FormLayout,
  Button,
  Group,
  FormItem,
  Input,
  Snackbar,
  Avatar,
} from "@vkontakte/vkui";
import { Icon16Done } from "@vkontakte/icons";
/*eslint no-useless-escape: "off"*/

import fetch2 from "../components/Fetch";

export default function Twitch(props) {
  const [channel, setChannel] = useState("");
  const [disabled, setDisabled] = useState(false);

  return (
    <Group style={{ marginTop: -35 }}>
      <FormLayout
        onSubmit={(e) => {
          e.preventDefault();
          setDisabled(true);
          if (!disabled) {
            fetch2("connectService", "id=1&channel=" + channel).then((data) => {
              setDisabled(false);
              if (data.response) {
                props.setSnackbar(
                  <Snackbar
                    layout="vertical"
                    duration={4000}
                    action="Поделиться"
                    onActionClick={() =>
                      bridge.send("VKWebAppShowWallPostBox", {
                        message:
                          "Я получаю уведомления от канала «" +
                          channel.toLowerCase() +
                          "», получай и ты!\n\nvk.com/app7915893",
                      })
                    }
                    className={!props.isDesktop ? "snackBar-fix" : ""}
                    onClose={() => props.setSnackbar(null)}
                    before={
                      <Avatar size={24} style={{ background: "var(--accent)" }}>
                        <Icon16Done fill="#fff" width={14} height={14} />
                      </Avatar>
                    }
                  >
                    Уведомления от {channel.toLowerCase()} включены!
                  </Snackbar>
                );
                localStorage.removeItem("subscriptions");
                props.setActiveModal(null);
              } else if (data.message === "already_enabled") {
                props.openAction(
                  "Остановитесь!",
                  "Вы уже получаете уведомления от этого пользователя."
                );
              } else if (data.message === "not_found") {
                props.openAction(
                  "Ошибка!",
                  "Такого пользователя нет на платформе Twitch."
                );
              }
            });
          }
        }}
      >
        <FormItem className="mb10">
          <Input
            placeholder="Логин стримера (например, Sfory)"
            maxLength="50"
            value={channel}
            required
            onChange={(e) => {
              // eslint-disable-next-line
              setChannel(e.target.value.trim());
            }}
          />
        </FormItem>
        <FormItem>
          <Button
            size="l"
            stretched
            type="submit"
            disabled={channel === "" || channel.length < 3 || disabled}
          >
            {disabled ? "Подключаем..." : "Подключить"}
          </Button>
        </FormItem>
      </FormLayout>
    </Group>
  );
}
