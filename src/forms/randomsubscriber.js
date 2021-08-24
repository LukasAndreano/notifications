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
import { Icon56UserSquareOutline } from "@vkontakte/icons";
/*eslint no-useless-escape: "off"*/

import fetch2 from "../components/Fetch";

let colors = [
  "#e67a7a",
  "#e6c07a",
  "#bbe67a",
  "#7adde6",
  "#7a8ae6",
  "#e67ae2",
  "#e67ab0",
];

export default function RandomSubscriber(props) {
  const [disabled, setDisabled] = useState(false);
  const [color, setColor] = useState("");

  return (
    <Group>
      <Placeholder
        icon={<Icon56UserSquareOutline fill={color} />}
        header={
          disabled
            ? "Выбираем случайного подписчика..."
            : "Выбор случайного подписчика"
        }
        style={{ marginBottom: -10, marginTop: -30 }}
      >
        {disabled
          ? "Прямо сейчас происходит выбор случайного подписчика. Дайте нам немного времени..."
          : "Функция выбирает случайного подписчика из Вашей рассылки. Бывает полезно, например, при розыгрышах."}
      </Placeholder>
      <Button
        size="l"
        stretched
        onClick={() => {
          setDisabled(true);
          let interval = setInterval(() => {
            setColor(colors[Math.floor(Math.random() * colors.length)]);
          }, 300);
          setTimeout(() => {
            setDisabled(false);
            setColor("");
            clearInterval(interval);
          }, 5000);
        }}
        disabled={disabled}
      >
        {disabled ? "Колдуем..." : "Запустить функцию"}
      </Button>
    </Group>
  );
}
