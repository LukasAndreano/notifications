import React, { useState } from "react";
import {
  FormLayout,
  Button,
  Group,
  FormItem,
  Input,
  Textarea,
  Placeholder,
} from "@vkontakte/vkui";
import { Icon56NotePenOutline } from "@vkontakte/icons";
/*eslint no-useless-escape: "off"*/

import fetch2 from "../components/Fetch";

export default function Request(props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [disabled, setDisabled] = useState(false);

  return (
    <Group style={{ marginTop: -35 }}>
      <Placeholder
        icon={<Icon56NotePenOutline />}
        header="Заявка на получение прав контент-мейкера"
        style={{ marginBottom: -30 }}
      >
        После получение прав контент-мейкера Вы сможете создавать ссылки,
        перейдя по которым пользователи автоматически подпишутся на Вас, а также
        делать ручную рассылку среди всех своих подписчиков.
      </Placeholder>
      <FormLayout
        onSubmit={(e) => {
          e.preventDefault();
          setDisabled(true);
          if (!disabled) {
            fetch2(
              "sendRequest",
              "name=" +
                encodeURI(name) +
                "&description=" +
                encodeURI(description)
            ).then((data) => {
              setDisabled(false);
              if (data.response) {
                localStorage.setItem("request", true);
                props.openAction(
                  "Заявка принята!",
                  "Администрация сервиса свяжется с Вами в случае одобрения/появления вопросов. Если Вы ещё не начали диалог с нашим сообществом, пожалуйста, исправьте это."
                );
                props.setActiveModal(null);
              }
            });
          }
        }}
      >
        <FormItem className="mb10">
          <Input
            placeholder="Как Вас зовут?"
            maxLength="30"
            value={name}
            required
            onChange={(e) => {
              // eslint-disable-next-line
              setName(
                e.target.value
                  .replace(/[0-9A-Za-z^!@#$%^&*()_|\/№:?;"'.,<>=-~]/gi, "")
                  .trim()
              );
            }}
          />
        </FormItem>
        <FormItem className="mb10">
          <Textarea
            placeholder="Перечислите площадки, на которых Вы создаёте контент (ссылки необходимы). Минимум 100 символов."
            maxLength="3000"
            value={description}
            required
            onChange={(e) => {
              // eslint-disable-next-line
              setDescription(e.target.value);
            }}
          />
        </FormItem>
        <FormItem>
          <Button
            size="l"
            stretched
            type="submit"
            disabled={
              name === "" ||
              name.length < 2 ||
              description === "" ||
              description.length < 100 ||
              disabled
            }
          >
            {disabled ? "Отправляем..." : "Отправить"}
          </Button>
        </FormItem>
      </FormLayout>
    </Group>
  );
}
