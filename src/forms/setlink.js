import React, { useState } from "react";
import bridge from "@vkontakte/vk-bridge";
import {
  FormLayout,
  Button,
  Group,
  FormItem,
  Input,
  Placeholder,
} from "@vkontakte/vkui";
import { Icon56NotePenOutline } from "@vkontakte/icons";
/*eslint no-useless-escape: "off"*/

import fetch2 from "../components/Fetch";

export default function SetLink(props) {
  const [tag, setTag] = useState("");
  const [disabled, setDisabled] = useState(false);

  return (
    <Group>
      <Placeholder
        icon={<Icon56NotePenOutline />}
        header="Создание ссылки"
        style={{ marginBottom: -30, marginTop: -30 }}
      >
        Контент-мейкеры могут создавать собственные ссылки, перейдя по которым
        пользователю будет предложено подписаться на один или несколько
        сервисов, которые Вы указали в заявке.
      </Placeholder>
      <FormLayout
        onSubmit={(e) => {
          e.preventDefault();
          setDisabled(true);
          if (!disabled) {
            fetch2("setLink", "tag=" + encodeURI(tag)).then((data) => {
              setDisabled(false);
              if (data.response) {
                bridge.send("VKWebAppCopyText", {
                  text: "https://vk.com/app7915893#" + tag,
                });
                props.openAction(
                  "Ссылка изменена!",
                  "Вы успешно изменили ссылку. Мы её скопировали в Ваш будет обмена."
                );
                localStorage.setItem("link", tag);
                props.setActiveModal(null);
              } else if (data.message === "already_setted") {
                props.openAction(
                  "Уведомление",
                  "Такая ссылка уже существует. Придумайте что-нибудь другое."
                );
              }
            });
          }
        }}
      >
        <FormItem className="mb10">
          <Input
            placeholder="irman"
            maxLength="50"
            value={tag}
            required
            onChange={(e) => {
              // eslint-disable-next-line
              setTag(
                e.target.value
                  .replace(/[@+#+*+?+&+%++]/gi, "")
                  .replace(/\n/, "")
                  .trim()
              );
            }}
          />
        </FormItem>
        <FormItem>
          <Button
            size="l"
            stretched
            type="submit"
            disabled={tag === "" || tag.length < 2 || disabled}
          >
            {disabled ? "Сохраняем..." : "Сохранить"}
          </Button>
        </FormItem>
      </FormLayout>
    </Group>
  );
}
