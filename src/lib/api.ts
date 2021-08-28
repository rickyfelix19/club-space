import axios from "axios";

/**
 * Create a short-lived room for demo purposes.
 *
 * It uses the redirect proxy as specified in netlify.toml`
 * This will work locally if you following the Netlify specific instructions
 * in README.md
 *
 * See https://docs.daily.co/reference#create-room for more information on how
 * to use the Daily REST API to create rooms and what options are available.
 */
async function createRoom() {
  const exp = Math.round(Date.now() / 1000) + 60 * 30;

  const config = {
    headers: {
      Authorization: `Bearer 87815edbead07e2774a99394775adbc160602ef4a79ba003808ab828161be3d2`,
    },
  };

  const bodyParameters = {
    properties: {
      exp: exp,
    },
  };

  const res = await axios.post(
    "https://api.daily.co/v1/rooms",
    bodyParameters,
    config
  );
  console.log(res);

  const room = await res.data;
  return room;

  // Comment out the above and uncomment the below, using your own URL
  // return { url: "https://your-domain.daily.co/hello" };
}

export default { createRoom };
