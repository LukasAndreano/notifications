import React, { useState } from "react";
import bridge from "@vkontakte/vk-bridge";
import {
  FormLayout,
  Button,
  Group,
  FormItem,
  Input,
  Snackbar,
  Placeholder,
  Footer,
  Avatar,
} from "@vkontakte/vkui";
import { Icon16Done } from "@vkontakte/icons";
/*eslint no-useless-escape: "off"*/

import fetch2 from "../components/Fetch";

export default function TikTok(props) {
  const [channel, setChannel] = useState(
    props.channel !== null && props.channel !== undefined ? props.channel : ""
  );
  const [disabled, setDisabled] = useState(false);

  return (
    <Group>
      <Placeholder
        className="serviceCard"
        style={{ marginTop: -30, marginBottom: -30 }}
        icon={<Avatar mode="app" src={props.img} size={72} />}
        header="Подключение TikTok"
      >
        Для подключения уведомлений введите тег пользователя, которого Вы хотите
        отслеживать.
      </Placeholder>
      <FormLayout
        onSubmit={(e) => {
          e.preventDefault();
          setDisabled(true);
          if (!disabled) {
            fetch2("connectService", "id=3&channel=" + encodeURI(channel)).then(
              (data) => {
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
                            "Я получаю уведомления от «" +
                            channel.toLowerCase() +
                            "», получай и ты!\n\nvk.com/app7915893",
                        })
                      }
                      className={!props.isDesktop ? "snackBar-fix" : ""}
                      onClose={() => props.setSnackbar(null)}
                      before={
                        <Avatar
                          size={24}
                          style={{ background: "var(--accent)" }}
                        >
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
                } else if (data.message === "limit") {
                  props.openAction(
                    "Ошибка!",
                    "Пользователи без подписки могут подключить максимум три сервиса."
                  );
                } else if (data.message === "not_found") {
                  props.openAction(
                    "Ошибка!",
                    "Такого пользователя нет в TikTok или его аккаунт пуст."
                  );
                }
              }
            );
          }
        }}
      >
        <FormItem className="mb10">
          <Input
            placeholder="klavacoca"
            maxLength="200"
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
            disabled={channel === "" || channel.length < 2 || disabled}
          >
            {disabled ? "Подключаем..." : "Подключить"}
          </Button>
        </FormItem>
      </FormLayout>
      <Footer style={{ paddingLeft: 10, paddingRight: 10, marginTop: 0 }}>
        Подсказка: регистр не имеет значения.
        <br />
        Например, Вы можете ввести пользователя klavacoca в ином регистре:
        kLAvAcOCA.
      </Footer>
    </Group>
  );
}
