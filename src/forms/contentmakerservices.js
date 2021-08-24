import React, { useState, useEffect } from "react";
import {
  Group,
  RichCell,
  Avatar,
  Placeholder,
  Snackbar,
} from "@vkontakte/vkui";
import { Icon56LikeOutline, Icon16Done } from "@vkontakte/icons";
import fetch2 from "../components/Fetch";
/*eslint no-useless-escape: "off"*/

export default function ContentMakerServices(props) {
  const [loaded, setLoaded] = useState(false);
  const [list, setList] = useState([]);
  const [ids, setIds] = useState([]);
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line
  function render(data) {
    if (!loading) {
      setLoading(true);
      let arr = [];
      data.forEach((el) => {
        if (ids.indexOf(el.id) === -1) {
          arr.push(
            <RichCell
              key={el.id}
              before={<Avatar size={48} mode="app" src={el.img} />}
              caption={el.title !== undefined ? el.title : ""}
              onClick={() => {
                fetch2(
                  "connectService",
                  "id=" + el.id + "&channel=" + el.channel + "&useTag=true"
                ).then((dataFetch) => {
                  localStorage.setItem("updateSubscribtions", true);
                  if (dataFetch.response) {
                    localStorage.removeItem("subscriptions");
                    let array = ids;
                    array.push(el.id);
                    setIds(array);
                    render(data);
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
                        Сервис добавлен в Ваши подписки
                      </Snackbar>
                    );
                  } else if (dataFetch.message === "already_enabled") {
                    props.openAction(
                      "Уведомление",
                      "Вы уже получаете уведомления от этого пользователя."
                    );
                  }
                });
              }}
            >
              {el.name}
            </RichCell>
          );
        }
        if (ids.length === data.length) {
          props.setActiveModal(null);
        }
        setTimeout(() => {
          setList(arr);
          setLoading(false);
        }, 300);
      });
    }
  }

  useEffect(() => {
    if (!loaded && props.data.length !== 0) {
      render(props.data);
      setLoaded(true);
    }
  }, [props, loaded, render, setLoaded]);

  return (
    <Group style={{ marginTop: -35 }}>
      <Placeholder
        icon={<Icon56LikeOutline />}
        header="Быстрая подписка"
        style={{ marginBottom: -30 }}
      >
        Предлагаем Вам подписаться на нижеперечисленные каналы и тем самым
        поддержать любимого контент-мейкера. Не забудьте потом включить
        уведомления в настройках!
      </Placeholder>
      {list}
    </Group>
  );
}
