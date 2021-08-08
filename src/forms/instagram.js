import React, { useState } from "react";
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

export default function Instagram(props) {
  const [account, setAccount] = useState("");
  const [disabled, setDisabled] = useState(false);

  return (
    <Group style={{ marginTop: -35 }}>
      <FormLayout
        onSubmit={(e) => {
          e.preventDefault();
          setDisabled(true);
          if (!disabled) {
            fetch2("connectService", "id=4&account=" + encodeURI(account)).then(
              (data) => {
                setDisabled(false);
                if (data.result === "ok") {
                  props.setSnackbar(
                    <Snackbar
                      layout="vertical"
                      duration={2000}
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
                      Уведомления от {account.toLowerCase()} включены!
                    </Snackbar>
                  );
                  localStorage.removeItem("subscriptions");
                  props.setActiveModal(null);
                } else if (data.result === "already_enabled") {
                  props.openAction(
                    "Остановитесь!",
                    "Вы уже получаете уведомления от этого пользователя."
                  );
                } else if (data.result === "not_found") {
                  props.openAction(
                    "Ошибка!",
                    "Такого пользователя нет в Instagram."
                  );
                } else if (data.result === "private") {
                  props.openAction(
                    "Ошибка!",
                    "Аккаунт этого пользователя закрыт."
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
            value={account}
            required
            onChange={(e) => {
              // eslint-disable-next-line
              setAccount(e.target.value.trim());
            }}
          />
        </FormItem>
        <FormItem>
          <Button
            size="l"
            stretched
            type="submit"
            disabled={account === "" || account.length < 4 || disabled}
          >
            {disabled ? "Подключаем..." : "Подключить"}
          </Button>
        </FormItem>
      </FormLayout>
    </Group>
  );
}
