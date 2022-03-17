import store from "@/store";

export const SocketHandlerEvents = (eventName, event) => {
  if (!eventName.startsWith("SOCKET_")) {
    return;
  }

  let target = eventName.toUpperCase();
  let message = event;

  if (event.data) message = JSON.parse(event.data);
  const type =
    typeof message.data === "object"
      ? Array.isArray(message.data)
        ? "array"
        : "object"
      : "string";

  switch (type) {
    case "array":
      return store.commit("setListItens", message.data);
    case "object":
      return console.log(message.data);
    default:
      return store.commit(target, message);
  }
};
