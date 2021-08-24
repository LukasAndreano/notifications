import React, { useState } from "react";
import bridge from "@vkontakte/vk-bridge";
import {
  FormLayout,
  Button,
  Group,
  FormItem,
  Placeholder,
  Input,
  Footer,
  Snackbar,
  Avatar,
} from "@vkontakte/vkui";
import { Icon16Done } from "@vkontakte/icons";
/*eslint no-useless-escape: "off"*/

import fetch2 from "../components/Fetch";

export default function YouTube(props) {
  const [channel, setChannel] = useState(
    props.channel_id !== null && props.channel_id !== undefined
      ? props.channel_id
      : ""
  );
  const [disabled, setDisabled] = useState(false);

  return (
    <Group>
      <Placeholder
        style={{ marginTop: -30, marginBottom: -30 }}
        className="serviceCard"
        icon={<Avatar mode="app" src={props.img} size={72} />}
        header="Подключение YouTube"
      >
        Для подключения уведомлений введите ссылку на канал пользователя,
        которого Вы хотите отслеживать.
      </Placeholder>
      <FormLayout
        onSubmit={(e) => {
          e.preventDefault();
          setDisabled(true);
          if (!disabled) {
            fetch2("connectService", "id=2&channel=" + encodeURI(channel)).then(
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
                            "Я получаю уведомления от канала «" +
                            data.channel +
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
                      Уведомления от канала «{data.channel}» включены!
                    </Snackbar>
                  );
                  localStorage.removeItem("subscriptions");
                  props.setActiveModal(null);
                } else if (data.message === "limit") {
                  props.openAction(
                    "Ошибка!",
                    "Пользователи без подписки могут подключить максимум три сервиса."
                  );
                } else if (data.message === "already_enabled") {
                  props.openAction(
                    "Остановитесь!",
                    "Вы уже получаете уведомления от этого канала."
                  );
                } else if (data.message === "not_found") {
                  props.openAction(
                    "Ошибка!",
                    "Такого канала нет на платформе YouTube."
                  );
                }
              }
            );
          }
        }}
      >
        <FormItem className="mb10">
          <Input
            placeholder="https://www.youtube.com/user/IrmanTheFirst"
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
            disabled={channel === "" || channel.length < 20 || disabled}
          >
            {disabled ? "Подключаем..." : "Подключить"}
          </Button>
        </FormItem>
      </FormLayout>
      <Footer style={{ paddingLeft: 10, paddingRight: 10, marginTop: 0 }}>
        Подсказка: в адресе не должно быть лишних путей. Например, если вы
        введетё .../UC1XLQIzXJd_KaLOuEVFESVw/featured, а не
        .../UC1XLQIzXJd_KaLOuEVFESVw, то Вы получите ошибку.
      </Footer>
    </Group>
  );
}
