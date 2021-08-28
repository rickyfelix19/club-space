export function clubCodeFromPageUrl() {
  const match = window.location.search.match(/club=([^&]+)/i);

  return match && match[1] ? decodeURIComponent(match[1]) : null;
}

export function roomUrlFromPageUrl() {
  const match = window.location.search.match(/club=([^&]+)/i);

  return match && match[1]
    ? "https://club-space.daily.co/" + decodeURIComponent(match[1])
    : null;
}

export function pageUrlFromRoomUrl(roomUrl: any) {
  const gameRoomIdSplit = roomUrl ? roomUrl.split("/") : "";
  return (
    window.location.href.split("?")[0] +
    (roomUrl
      ? `?club=${
          gameRoomIdSplit.length > 0
            ? gameRoomIdSplit[gameRoomIdSplit.length - 1]
            : encodeURIComponent(roomUrl)
        }`
      : "")
  );
}
