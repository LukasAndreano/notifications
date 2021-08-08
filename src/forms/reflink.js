import React, { useState } from "react";
import bridge from "@vkontakte/vk-bridge";
import {
  FormLayout,
  Button,
  Group,
  FormItem,
  IconButton,
  Input,
  Placeholder,
} from "@vkontakte/vkui";
import { Icon56ChainOutline, Icon20CopyOutline } from "@vkontakte/icons";
/*eslint no-useless-escape: "off"*/

export default function RefLink(props) {
  const [text, setText] = useState("https://vk.com/app7915893#" + props.link);

  return (
    <Group style={{ marginTop: -35 }}>
      <Placeholder
        icon={<Icon56ChainOutline />}
        header="Это Ваша ссылка"
        style={{ marginBottom: -30 }}
      >
        Перейдя по ней пользователю будет предложено подписаться на один или
        несколько сервисов, которые Вы указали в заявке на получение прав
        контент-мейкера.
      </Placeholder>
      <FormLayout>
        <FormItem className="mb10" top="Это Ваша ссылка">
          <Input
            readOnly
            maxLength="50"
            value={text}
            after={
              <IconButton
                hoverMode="opacity"
                aria-label="Скопировать ссылку"
                onClick={() => {
                  bridge.send("VKWebAppCopyText", {
                    text: "https://vk.com/app7915893#" + props.link,
                  });
                  setText("Ссылка успешно скопирована!");
                  setTimeout(
                    () => setText("https://vk.com/app7915893#" + props.link),
                    1000
                  );
                }}
              >
                <Icon20CopyOutline />
              </IconButton>
            }
          />
        </FormItem>
        <FormItem>
          <Button
            size="l"
            stretched
            onClick={() => props.setActiveModal("setLink")}
          >
            Пересоздать ссылку
          </Button>
        </FormItem>
      </FormLayout>
    </Group>
  );
}
