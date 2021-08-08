import React, { useState, useEffect, Fragment } from "react";
import {
  Group,
  Placeholder,
  Spinner,
  RichCell,
  Avatar,
  Footer,
} from "@vkontakte/vkui";
import fetch2 from "../components/Fetch";
import isset from "../components/Isset";

export default function Services(props) {
  const [loaded, setLoaded] = useState(false);
  const [services, setServices] = useState([]);
  const [loader, setLoader] = useState(
    localStorage.getItem("services") !== null ? false : true
  );
  const [updated, setUpdated] = useState(false);

  // eslint-disable-next-line
  function render(data) {
    let arr = [];
    data.forEach((el) => {
      arr.push(
        <RichCell
          key={el.id}
          before={<Avatar size={48} mode="app" src={el.img} />}
          caption={el.description}
          onClick={() => props.setActiveModal(el.id, { img: el.img })}
        >
          {el.name}
        </RichCell>
      );
    });
    setServices(arr);
    setLoaded(true);
    setUpdated(false);
  }

  useEffect(() => {
    if (!loaded && updated === false) {
      setUpdated(true);
      const timeout = setTimeout(() => {
        if (!loaded) setLoader(true);
      }, 400);
      if (
        localStorage.getItem("services") !== undefined &&
        localStorage.getItem("services") !== null &&
        localStorage.getItem("services").length !== 0
      ) {
        render(JSON.parse(localStorage.getItem("services")));
        clearTimeout(timeout);
      } else {
        clearTimeout(timeout);
        fetch2("loadServices").then((data) => {
          if (isset(data.result)) {
            render(data.result);
            localStorage.setItem("services", JSON.stringify(data.result));
          }
        });
      }
    }
  }, [updated, loaded, render, setLoader]);

  return (
    <Group>
      <Placeholder
        header="Доступные сервисы"
        style={{ marginBottom: -20, marginTop: -20 }}
      >
        Здесь отображены все доступные для подключения сервисы. Нажмите на
        нужный сервис, введите дополнительные параметры, и всё - уведомления
        подключены!
      </Placeholder>
      {loaded ? (
        <Fragment>
          {services}
          <Footer>Всего доступно сервисов: {services.length}</Footer>
        </Fragment>
      ) : (
        loader && <Spinner size="medium" />
      )}
    </Group>
  );
}
