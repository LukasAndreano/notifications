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

// eslint-disable-next-line
Array.prototype.remove = function () {
  var what,
    a = arguments,
    L = a.length,
    ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};

export default function ContentMakerServices(props) {
  const [loaded, setLoaded] = useState(false);
  const [list, setList] = useState([]);
  const [ids, setIds] = useState([]);

  // eslint-disable-next-line
  function render(data) {
    let arr = [];
    data.forEach((el) => {
      if (!ids.indexOf(el.id) > -1) {
        arr.push(
          <RichCell
            key={el.id}
            before={<Avatar size={48} mode="app" src={el.img} />}
            caption={el.title !== undefined ? el.title : ""}
            onClick={() => {
              if (!ids.indexOf(el.id) > -1) {
                fetch2(
                  "connectService",
                  "id=" + el.id + "&channel=" + el.channel + "&useTag=true"
                ).then((data) => {
                  if (data.result === "ok") {
                    localStorage.removeItem("subscriptions");
                    let ids_array = ids.push(el.id);
                    setIds(ids_array);
                    render(props.data);
                    if (ids.length === props.data.length) {
                      props.setActiveModal(null);
                    }
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
                  } else if (data.result === "already_enabled") {
                    props.openAction(
                      "Уведомление",
                      "Вы уже получаете уведомления от этого пользователя."
                    );
                  }
                });
              }
            }}
          >
            {el.name}
          </RichCell>
        );
      }
      setList(arr);
      setLoaded(true);
    });
  }

  useEffect(() => {
    if (!loaded) {
      render(props.data);
    }
  }, [props, loaded, render]);

  return (
    <Group style={{ marginTop: -35 }}>
      <Placeholder
        icon={<Icon56LikeOutline />}
        header="Быстрая подписка"
        style={{ marginBottom: -30 }}
      >
        Предлагаем Вам подписаться на нижеперечисленные каналы и тем самым
        поддержать любимого любимого контент-мейкера.
      </Placeholder>
      {list}
    </Group>
  );
}
