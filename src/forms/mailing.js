import React, { useState } from "react";
import {
  FormLayout,
  Button,
  Group,
  FormItem,
  Textarea,
  Placeholder,
} from "@vkontakte/vkui";
import { Icon56MailOutline } from "@vkontakte/icons";
/*eslint no-useless-escape: "off"*/

import fetch2 from "../components/Fetch";

export default function Mailing(props) {
  const [text, setText] = useState("");
  const [disabled, setDisabled] = useState(false);

  return (
    <Group style={{ marginTop: -35 }}>
      <Placeholder
        icon={<Icon56MailOutline />}
        header="Создание рассылки"
        style={{ marginBottom: -30 }}
      >
        Начните рассылку среди всех своих подписчиков, если нужно что-то
        сообщить. Уведомление придёт не только в личные сообщения, но также и в
        «Колокольчик». Использование нецензурной брани, кстати, запрещено.
      </Placeholder>
      <FormLayout
        onSubmit={(e) => {
          e.preventDefault();
          setDisabled(true);
          if (!disabled) {
            fetch2("startMailing", "&text=" + encodeURI(text)).then((data) => {
              setDisabled(false);
              if (data.response) {
                props.openAction(
                  "Уведомление",
                  "Мы поместили Вашу рассылку в очередь. Через 30-60 секунд подписчики получат уведомление. Если в сообщении менее 254 символов, то рассылка придёт еще и в «Колокольчик»."
                );
                props.setActiveModal(null);
              }
            });
          }
        }}
      >
        <FormItem className="mb10">
          <Textarea
            placeholder="Введите текст рассылки. Минимум - 50 символов, максимум - 4000."
            maxLength="4000"
            value={text}
            required
            onChange={(e) => {
              // eslint-disable-next-line
              setText(e.target.value);
            }}
          />
        </FormItem>
        <FormItem>
          <Button
            size="l"
            stretched
            type="submit"
            disabled={text === "" || text.length < 50 || disabled}
          >
            {disabled ? "Начинаем..." : "Начать рассылку"}
          </Button>
        </FormItem>
      </FormLayout>
    </Group>
  );
}
